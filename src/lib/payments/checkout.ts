import { prisma } from "@/lib/prisma";
import { createCryptoInvoice } from "./crypto-invoice";
import { normalizeGiftCardCode } from "./config";
import { maskGiftCardCode, validateGiftCard } from "./gift-card";
import type { CryptoCurrencyId, PaymentMethod } from "./types";

export type CheckoutResult =
  | { ok: true; orderId: string; redirect: string }
  | { ok: false; error: string };

async function assertListingAvailable(listingId: string, buyerId: string) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.status !== "ACTIVE" || listing.stock < 1) {
    throw new Error("This listing is no longer available.");
  }
  if (listing.sellerId === buyerId) {
    throw new Error("You can't buy your own listing.");
  }
  return listing;
}

export async function startCheckout(opts: {
  listingId: string;
  buyerId: string;
  method: PaymentMethod;
  cryptoCurrency?: CryptoCurrencyId;
  giftCardCode?: string;
}): Promise<CheckoutResult> {
  const listing = await assertListingAvailable(opts.listingId, opts.buyerId);

  if (opts.method === "GIFT_CARD") {
    const code = normalizeGiftCardCode(opts.giftCardCode ?? "");
    const validation = await validateGiftCard(code, listing.priceCents);
    if (!validation.valid) {
      return { ok: false, error: validation.error ?? "Invalid gift card." };
    }

    try {
      const order = await prisma.$transaction(async (tx) => {
        const card = await tx.giftCard.findUnique({ where: { code } });
        if (!card || !card.active || card.balanceCents < listing.priceCents) {
          throw new Error("Gift card balance changed. Please try again.");
        }
        if (card.expiresAt && card.expiresAt < new Date()) {
          throw new Error("Gift card expired.");
        }

        const o = await tx.order.create({
          data: {
            listingId: listing.id,
            buyerId: opts.buyerId,
            priceCents: listing.priceCents,
            paymentMethod: "GIFT_CARD",
            paymentStatus: "PAID",
            status: "PENDING",
          },
        });

        await tx.payment.create({
          data: {
            orderId: o.id,
            method: "GIFT_CARD",
            status: "COMPLETED",
            amountCents: listing.priceCents,
            giftCardId: card.id,
            giftCardCode: maskGiftCardCode(code),
            completedAt: new Date(),
          },
        });

        await tx.giftCard.update({
          where: { id: card.id },
          data: { balanceCents: { decrement: listing.priceCents } },
        });

        await tx.listing.update({
          where: { id: listing.id },
          data: {
            stock: { decrement: 1 },
            ...(listing.stock === 1 ? { status: "SOLD_OUT" } : {}),
          },
        });

        return o;
      });
      return { ok: true, orderId: order.id, redirect: "/orders" };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Gift card payment failed." };
    }
  }

  if (opts.method === "CRYPTO") {
    const currency = opts.cryptoCurrency ?? "BTC";
    const order = await prisma.order.create({
      data: {
        listingId: listing.id,
        buyerId: opts.buyerId,
        priceCents: listing.priceCents,
        paymentMethod: "CRYPTO",
        paymentStatus: "AWAITING",
        status: "PENDING",
      },
    });

    const invoice = await createCryptoInvoice({
      orderId: order.id,
      title: listing.title,
      amountCents: listing.priceCents,
      currency,
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: "CRYPTO",
        status: "AWAITING",
        amountCents: listing.priceCents,
        cryptoCurrency: invoice.currency,
        cryptoAmount: invoice.amount,
        cryptoAddress: invoice.address,
        cryptoInvoiceId: invoice.invoiceId,
        expiresAt: new Date(invoice.expiresAt),
        processorRef: invoice.simulated ? "simulated" : "nowpayments",
      },
    });

    return {
      ok: true,
      orderId: order.id,
      redirect: `/checkout/order/${order.id}/crypto`,
    };
  }

  return { ok: false, error: "Unknown payment method." };
}

export async function completeCryptoPayment(orderId: string, txHash?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true, listing: true },
  });
  if (!order || !order.payment || order.payment.method !== "CRYPTO") {
    return { ok: false as const, error: "Order not found." };
  }
  if (order.paymentStatus === "PAID") {
    return { ok: true as const, already: true };
  }
  if (order.payment.status === "EXPIRED") {
    return { ok: false as const, error: "Invoice expired." };
  }
  if (order.payment.expiresAt && order.payment.expiresAt < new Date()) {
    await prisma.payment.update({
      where: { orderId },
      data: { status: "EXPIRED" },
    });
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "FAILED" },
    });
    return { ok: false as const, error: "Invoice expired." };
  }

  const listing = await prisma.listing.findUnique({ where: { id: order.listingId } });
  if (!listing || listing.status !== "ACTIVE" || listing.stock < 1) {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "FAILED", status: "CANCELLED" },
    });
    await prisma.payment.update({
      where: { orderId },
      data: { status: "FAILED", failureReason: "Listing unavailable" },
    });
    return { ok: false as const, error: "Listing no longer available." };
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "PAID" },
    }),
    prisma.payment.update({
      where: { orderId },
      data: {
        status: "COMPLETED",
        cryptoTxHash: txHash ?? `confirmed_${Date.now()}`,
        completedAt: new Date(),
      },
    }),
    prisma.listing.update({
      where: { id: order.listingId },
      data: {
        stock: { decrement: 1 },
        ...(listing.stock === 1 ? { status: "SOLD_OUT" } : {}),
      },
    }),
  ]);

  return { ok: true as const };
}

export async function getCryptoPaymentStatus(orderId: string, buyerId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      payment: true,
      listing: { select: { title: true, priceCents: true } },
    },
  });
  if (!order || order.buyerId !== buyerId) return null;

  const expired =
    order.payment?.expiresAt != null &&
    order.payment.expiresAt < new Date() &&
    order.paymentStatus !== "PAID";

  if (expired && order.payment) {
    await prisma.payment.update({
      where: { orderId },
      data: { status: "EXPIRED" },
    });
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "FAILED" },
    });
  }

  return {
    orderId: order.id,
    paymentStatus: expired ? "FAILED" : order.paymentStatus,
    payment: order.payment,
    listingTitle: order.listing.title,
    amountCents: order.priceCents,
  };
}
