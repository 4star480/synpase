import { prisma } from "./prisma";

export async function adminDashboardStats() {
  const [listings, activeListings, orders, payments, users, sellers, reviews, revenue] =
    await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({ where: { status: "ACTIVE" } }),
      prisma.order.count(),
      prisma.payment.count(),
      prisma.user.count(),
      prisma.user.count({ where: { listings: { some: {} } } }),
      prisma.review.count(),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { priceCents: true },
      }),
    ]);

  return {
    listings,
    activeListings,
    orders,
    payments,
    users,
    sellers,
    reviews,
    revenueCents: revenue._sum.priceCents ?? 0,
  };
}

export async function adminListings(page = 1, q = "") {
  const perPage = 20;
  const where = q.trim()
    ? {
        OR: [
          { title: { contains: q } },
          { seller: { username: { contains: q } } },
          { game: { name: { contains: q } } },
        ],
      }
    : {};

  const [rows, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        game: { select: { name: true, emoji: true, slug: true, bannerFrom: true, bannerTo: true, coverImage: true } },
        seller: { select: { username: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.listing.count({ where }),
  ]);

  return { rows, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function adminGiftCardPayments(page = 1) {
  const perPage = 25;
  const [rows, total] = await Promise.all([
    prisma.payment.findMany({
      where: { method: "GIFT_CARD" },
      include: {
        order: {
          include: {
            buyer: { select: { username: true, email: true } },
            listing: {
              select: {
                id: true,
                title: true,
                game: { select: { emoji: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.payment.count({ where: { method: "GIFT_CARD" } }),
  ]);

  return { rows, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function adminPayments(page = 1) {
  const perPage = 25;
  const [rows, total, completedAgg] = await Promise.all([
    prisma.payment.findMany({
      include: {
        order: {
          include: {
            buyer: { select: { username: true, email: true } },
            listing: {
              select: {
                id: true,
                title: true,
                game: { select: { emoji: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.payment.count(),
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amountCents: true },
      _count: true,
    }),
  ]);

  return {
    rows,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
    completedCount: completedAgg._count,
    completedCents: completedAgg._sum.amountCents ?? 0,
  };
}

export async function adminOrders(page = 1) {
  const perPage = 25;
  const [rows, total] = await Promise.all([
    prisma.order.findMany({
      include: {
        buyer: { select: { username: true, email: true } },
        listing: {
          select: {
            title: true,
            game: { select: { emoji: true } },
            seller: { select: { username: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count(),
  ]);
  return { rows, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function adminUsers(page = 1) {
  const perPage = 25;
  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        verified: true,
        memberSince: true,
        _count: { select: { listings: true, orders: true } },
      },
      orderBy: { memberSince: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count(),
  ]);
  return { rows, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function adminListingOptions() {
  const [games, sellers] = await Promise.all([
    prisma.game.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, emoji: true } }),
    prisma.user.findMany({
      where: { role: { not: "ADMIN" } },
      orderBy: { username: "asc" },
      select: { id: true, username: true },
      take: 150,
    }),
  ]);
  return { games, sellers };
}
