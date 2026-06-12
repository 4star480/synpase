import { prisma } from "./prisma";

const buyerOrderInclude = {
  payment: { select: { method: true, cryptoCurrency: true, status: true } },
  listing: {
    select: {
      id: true,
      title: true,
      category: true,
      imagePath: true,
      game: { select: { name: true, emoji: true, slug: true, bannerFrom: true, bannerTo: true } },
      seller: { select: { username: true } },
    },
  },
} as const;

export async function getBuyerOrders(buyerId: string) {
  return prisma.order.findMany({
    where: { buyerId },
    include: buyerOrderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export type BuyerOrder = Awaited<ReturnType<typeof getBuyerOrders>>[number];

export type BuyerOrderJson = {
  id: string;
  priceCents: number;
  status: string;
  paymentMethod: string | null;
  paymentStatus: string;
  createdAt: string;
  payment: {
    method: string;
    cryptoCurrency: string | null;
    status: string;
  } | null;
  listing: {
    id: string;
    title: string;
    category: string;
    imagePath: string;
    game: {
      name: string;
      emoji: string;
      slug: string;
      bannerFrom: string;
      bannerTo: string;
    };
    seller: { username: string };
  };
};

export function serializeBuyerOrder(order: BuyerOrder): BuyerOrderJson {
  return {
    id: order.id,
    priceCents: order.priceCents,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt.toISOString(),
    payment: order.payment,
    listing: order.listing,
  };
}
