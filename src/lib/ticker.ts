import { prisma } from "./prisma";
import { CATEGORY_ART } from "./game-art";

export const TICKER_INTERVAL_MS = 10 * 60 * 1000;

export type TickerEvent = {
  user: string;
  icon: string;
  item: string;
  detail: string;
  price: string;
};

const DETAIL_BY_CATEGORY: Record<string, string[]> = {
  ACCOUNT: ["— Full Access", "— Premium", "— Verified"],
  CURRENCY: ["— Fast Trade", "— Instant", "— Bulk Deal"],
  ITEM: ["— Epic", "— Rare", "— Limited"],
  BOOSTING: ["— 48h Service", "— Rank Boost", "— Pro Carry"],
};

function tickerBucket(): number {
  return Math.floor(Date.now() / TICKER_INTERVAL_MS);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickDetail(category: string, listingId: string, bucket: number): string {
  const options = DETAIL_BY_CATEGORY[category] ?? DETAIL_BY_CATEGORY.ITEM;
  let h = bucket;
  for (let i = 0; i < listingId.length; i++) h = (h * 31 + listingId.charCodeAt(i)) >>> 0;
  return options[h % options.length];
}

function formatTitle(title: string): string {
  return title.length > 38 ? `${title.slice(0, 36)}…` : title;
}

export async function getTickerEvents(limit = 14): Promise<TickerEvent[]> {
  const bucket = tickerBucket();
  const poolSize = Math.max(limit * 4, 56);
  const total = await prisma.order.count({ where: { status: "COMPLETED" } });
  const skip = total > poolSize ? (bucket * 7) % Math.max(1, total - poolSize) : 0;

  const orders = await prisma.order.findMany({
    where: { status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    skip,
    take: poolSize,
    include: {
      buyer: { select: { username: true } },
      listing: {
        select: {
          id: true,
          title: true,
          category: true,
          priceCents: true,
        },
      },
    },
  });

  const picked = seededShuffle(orders, bucket).slice(0, limit);

  return picked.map((o) => {
    const art = CATEGORY_ART[o.listing.category] ?? CATEGORY_ART.ITEM;
    return {
      user: o.buyer.username,
      icon: art.icon,
      item: formatTitle(o.listing.title),
      detail: pickDetail(o.listing.category, o.listing.id, bucket),
      price: `$${(o.listing.priceCents / 100).toFixed(2)}`,
    };
  });
}

export function tickerCacheKey(): string {
  return String(tickerBucket());
}
