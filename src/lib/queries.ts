import { prisma } from "./prisma";
import { parseSearchQuery, resolveGameSlug } from "./search";
import type { ListingCardData } from "@/components/ListingCard";
import type { GameCard } from "@/components/GameCarousel";
import { resolveListingVisual, gameCoverSrc } from "./images";
import { POPULAR_GAME_SLUGS } from "./games-catalog";

const cardInclude = {
  game: {
    select: {
      name: true,
      emoji: true,
      slug: true,
      bannerFrom: true,
      bannerTo: true,
      coverImage: true,
    },
  },
  seller: {
    select: {
      username: true,
      avatarHue: true,
      verified: true,
      reviews: { select: { rating: true } },
    },
  },
} as const;

type RawListing = {
  id: string;
  title: string;
  category: string;
  priceCents: number;
  deliveryMins: number;
  stock: number;
  featured: boolean;
  views: number;
  imagePath: string;
  game: {
    name: string;
    emoji: string;
    slug: string;
    bannerFrom: string;
    bannerTo: string;
    coverImage: string;
  };
  seller: { username: string; avatarHue: number; verified: boolean; reviews: { rating: number }[] };
};

export function avgRating(reviews: { rating: number }[]): number | null {
  if (reviews.length === 0) return null;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function listingImage(listing: RawListing): string {
  return resolveListingVisual({
    imagePath: listing.imagePath,
    gameSlug: listing.game.slug,
    gameCover: listing.game.coverImage,
    category: listing.category,
  });
}

function toCard(l: RawListing): ListingCardData {
  return {
    id: l.id,
    title: l.title,
    category: l.category,
    priceCents: l.priceCents,
    deliveryMins: l.deliveryMins,
    stock: l.stock,
    featured: l.featured,
    views: l.views,
    imagePath: listingImage(l),
    categoryImage: `/images/categories/${l.category.toLowerCase()}.svg`,
    game: {
      name: l.game.name,
      emoji: l.game.emoji,
      slug: l.game.slug,
      bannerFrom: l.game.bannerFrom,
      bannerTo: l.game.bannerTo,
      coverImage: l.game.coverImage,
    },
    seller: {
      username: l.seller.username,
      avatarHue: l.seller.avatarHue,
      verified: l.seller.verified,
    },
    sellerRating: avgRating(l.seller.reviews),
  };
}

export type BrowseFilters = {
  q?: string;
  game?: string;
  category?: string;
  sort?: string;
  page?: number;
  perPage?: number;
};

async function searchListingIds(
  filters: BrowseFilters,
): Promise<{ ids: string[]; total: number } | null> {
  const q = filters.q?.trim();
  if (!q) return null;

  const parsed = parseSearchQuery(q);
  const category = filters.category ?? parsed.categoryHint;
  const gameSlug = filters.game ?? (parsed.gameHint ? resolveGameSlug(parsed.gameHint) : undefined);

  const termClauses: string[] = [];
  const params: (string | number)[] = [];

  let sql = `
    SELECT l.id FROM "Listing" l
    INNER JOIN "Game" g ON l."gameId" = g.id
    WHERE l.status = 'ACTIVE'
  `;

  if (category) {
    sql += ` AND l.category = ?`;
    params.push(category);
  }
  if (gameSlug) {
    sql += ` AND g.slug = ?`;
    params.push(gameSlug);
  }

  const searchTerms =
    parsed.terms.length > 0 ? parsed.terms : [q.toLowerCase()];

  for (const term of searchTerms) {
    const pattern = `%${term}%`;
    termClauses.push(
      `(LOWER(l.title) LIKE ? OR LOWER(l.description) LIKE ? OR LOWER(g.name) LIKE ? OR LOWER(g.slug) LIKE ? OR LOWER(l.category) LIKE ?)`,
    );
    params.push(pattern, pattern, pattern, pattern, pattern);
  }

  if (termClauses.length > 0) {
    sql += ` AND (${termClauses.join(" AND ")})`;
  }

  const countSql = `SELECT COUNT(*) as cnt FROM (${sql})`;
  const countRow = await prisma.$queryRawUnsafe<{ cnt: bigint }[]>(countSql, ...params);
  const total = Number(countRow[0]?.cnt ?? 0);

  const page = Math.max(1, filters.page ?? 1);
  const perPage = filters.perPage ?? 48;
  const sort =
    filters.sort === "price-asc"
      ? 'l."priceCents" ASC'
      : filters.sort === "price-desc"
        ? 'l."priceCents" DESC'
        : filters.sort === "popular"
          ? "l.views DESC"
          : 'l."createdAt" DESC';

  const pageSql = `${sql} ORDER BY ${sort} LIMIT ? OFFSET ?`;
  const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
    pageSql,
    ...params,
    perPage,
    (page - 1) * perPage,
  );

  return { ids: rows.map((r) => r.id), total };
}

const orderFromSort = (sort?: string) =>
  sort === "price-asc"
    ? { priceCents: "asc" as const }
    : sort === "price-desc"
      ? { priceCents: "desc" as const }
      : sort === "popular"
        ? { views: "desc" as const }
        : { createdAt: "desc" as const };

export async function searchListings(filters: BrowseFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = filters.perPage ?? 48;

  const textSearch = await searchListingIds({ ...filters, page, perPage });

  if (textSearch) {
    if (textSearch.ids.length === 0) {
      return { listings: [], total: textSearch.total, page, perPage, totalPages: 0 };
    }
    const listings = await prisma.listing.findMany({
      where: { id: { in: textSearch.ids } },
      include: cardInclude,
    });
    const byId = new Map(listings.map((l) => [l.id, l]));
    const ordered = textSearch.ids.map((id) => byId.get(id)).filter(Boolean) as typeof listings;
    return {
      listings: ordered.map(toCard),
      total: textSearch.total,
      page,
      perPage,
      totalPages: Math.ceil(textSearch.total / perPage),
    };
  }

  const where = {
    status: "ACTIVE" as const,
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.game ? { game: { slug: filters.game } } : {}),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: cardInclude,
      orderBy: orderFromSort(filters.sort),
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings: listings.map(toCard),
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function searchSuggestions(q: string, limit = 8) {
  const trimmed = q.trim();
  if (trimmed.length < 2) return [];

  const parsed = parseSearchQuery(trimmed);
  const terms = parsed.terms.length > 0 ? parsed.terms : [trimmed.toLowerCase()];

  let sql = `
    SELECT l.id, l.title, l.category, l."priceCents", g.name as "gameName", g.emoji as "gameEmoji", g.slug as "gameSlug"
    FROM "Listing" l INNER JOIN "Game" g ON l."gameId" = g.id
    WHERE l.status = 'ACTIVE'
  `;
  const params: string[] = [];

  if (parsed.categoryHint) {
    sql += ` AND l.category = ?`;
    params.push(parsed.categoryHint);
  }

  if (parsed.gameHint) {
    const slug = resolveGameSlug(parsed.gameHint);
    if (slug) {
      sql += ` AND g.slug = ?`;
      params.push(slug);
    }
  }

  for (const term of terms.slice(0, 3)) {
    const p = `%${term}%`;
    sql += ` AND (LOWER(l.title) LIKE ? OR LOWER(g.name) LIKE ?)`;
    params.push(p, p);
  }

  sql += ` ORDER BY l.views DESC LIMIT ?`;
  params.push(String(limit));

  return prisma.$queryRawUnsafe<
    {
      id: string;
      title: string;
      category: string;
      priceCents: number;
      gameName: string;
      gameEmoji: string;
      gameSlug: string;
    }[]
  >(sql, ...params);
}

export async function featuredListings(take = 8): Promise<ListingCardData[]> {
  const featured = await prisma.listing.findMany({
    where: { status: "ACTIVE", featured: true },
    include: cardInclude,
    orderBy: { views: "desc" },
    take,
  });
  if (featured.length >= take) return featured.map(toCard);

  const rest = await prisma.listing.findMany({
    where: { status: "ACTIVE", featured: false },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take: take - featured.length,
  });
  return [...featured, ...rest].map(toCard);
}

export async function listingsBySeller(sellerId: string): Promise<ListingCardData[]> {
  const listings = await prisma.listing.findMany({
    where: { sellerId, status: "ACTIVE" },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take: 48,
  });
  return listings.map(toCard);
}

export async function allGames(): Promise<GameCard[]> {
  const [games, ratingRows] = await Promise.all([
    prisma.game.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { listings: { where: { status: "ACTIVE" } } } },
        listings: {
          where: { status: "ACTIVE" },
          select: { sellerId: true },
          distinct: ["sellerId"],
        },
      },
    }),
    prisma.$queryRaw<{ gameId: string; avg: number }[]>`
      SELECT l."gameId", AVG(r.rating) as avg
      FROM "Review" r
      INNER JOIN "Order" o ON r."orderId" = o.id
      INNER JOIN "Listing" l ON o."listingId" = l.id
      GROUP BY l."gameId"
    `,
  ]);

  const ratingMap = new Map(ratingRows.map((r) => [r.gameId, r.avg]));

  return games.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    emoji: g.emoji,
    tagline: g.tagline,
    bannerFrom: g.bannerFrom,
    bannerTo: g.bannerTo,
    coverImage: gameCoverSrc(g.slug, g.coverImage),
    listingCount: g._count.listings,
    sellerCount: g.listings.length,
    avgRating: ratingMap.has(g.id)
      ? Math.round((ratingMap.get(g.id)! / 1) * 10) / 10
      : null,
  }));
}

export async function featuredGames(limit = 20): Promise<GameCard[]> {
  const all = await allGames();
  const order = new Map<string, number>(POPULAR_GAME_SLUGS.map((s, i) => [s, i]));
  return all
    .filter((g) => order.has(g.slug))
    .sort((a, b) => order.get(a.slug)! - order.get(b.slug)!)
    .slice(0, limit);
}

export async function browseFilterGames(limit = 20) {
  const all = await allGames();
  const order = new Map<string, number>(POPULAR_GAME_SLUGS.map((s, i) => [s, i]));
  return all
    .filter((g) => order.has(g.slug))
    .sort((a, b) => order.get(a.slug)! - order.get(b.slug)!)
    .slice(0, limit)
    .map((g) => ({ slug: g.slug, name: g.name, emoji: g.emoji }));
}

export async function marketplaceStats() {
  const [listings, sellers, reviewAgg, gameCount] = await Promise.all([
    prisma.listing.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { listings: { some: { status: "ACTIVE" } } } }),
    prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
    prisma.game.count(),
  ]);
  return {
    activeListings: listings,
    activeSellers: sellers,
    avgRating: Math.round((reviewAgg._avg.rating ?? 4.9) * 10) / 10,
    reviewCount: reviewAgg._count,
    gameCount,
  };
}

export async function recentReviews(limit = 12) {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      author: { select: { username: true } },
      order: {
        include: {
          listing: {
            select: {
              title: true,
              game: { select: { name: true, emoji: true, slug: true, coverImage: true } },
              imagePath: true,
            },
          },
        },
      },
    },
  });

  return reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    author: r.author.username,
    gameName: r.order.listing.game.name,
    gameEmoji: r.order.listing.game.emoji,
    gameSlug: r.order.listing.game.slug,
    gameCover: r.order.listing.game.coverImage || gameCoverSrc(r.order.listing.game.slug),
    listingImage: resolveListingVisual({
      imagePath: r.order.listing.imagePath,
      gameSlug: r.order.listing.game.slug,
      gameCover: r.order.listing.game.coverImage,
    }),
    listingTitle: r.order.listing.title,
    createdAt: r.createdAt.toISOString(),
  }));
}

export { getTickerEvents as recentPurchaseTicker } from "./ticker";

export async function listingsByIds(ids: string[]): Promise<ListingCardData[]> {
  if (ids.length === 0) return [];
  const listings = await prisma.listing.findMany({
    where: { id: { in: ids }, status: "ACTIVE" },
    include: cardInclude,
  });
  const byId = new Map(listings.map((l) => [l.id, l]));
  return ids.map((id) => byId.get(id)).filter(Boolean).map((l) => toCard(l!));
}
