"use server";

import { redirect } from "next/navigation";
import { getCurrentUser, getSessionUserId } from "@/lib/session";
import { revalidateOrderViews } from "@/lib/revalidate-orders";
import { startCheckout } from "@/lib/payments/checkout";
import { validateGiftCardCodeInput } from "@/lib/payments/gift-card";
import type { CryptoCurrencyId, PaymentMethod } from "@/lib/payments/types";

export type CheckoutFormState = {
  error?: string;
  giftPreview?: string;
  giftPreviewOk?: boolean;
};

export async function processCheckout(
  _prev: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please log in to checkout." };
  const buyerId = user.id;

  const listingId = String(formData.get("listingId") ?? "");
  const method = String(formData.get("method") ?? "") as PaymentMethod;
  const cryptoCurrency = String(formData.get("cryptoCurrency") ?? "BTC") as CryptoCurrencyId;
  const giftCardCode = String(formData.get("giftCardCode") ?? "").trim();
  const intent = String(formData.get("intent") ?? "pay");

  if (!listingId) return { error: "Missing listing." };

  if (intent === "preview") {
    if (method !== "GIFT_CARD") {
      return { error: "Select gift card payment to check a code." };
    }
    if (giftCardCode.length < 8) {
      return { error: "Enter a gift card code first.", giftPreviewOk: false };
    }
    const listing = await prismaListingPrice(listingId);
    if (!listing) return { error: "Listing not found." };
    const validation = validateGiftCardCodeInput(giftCardCode);
    if (validation.valid) {
      return {
        giftPreview: "Code accepted — submit to complete payment",
        giftPreviewOk: true,
      };
    }
    return {
      giftPreview: validation.error ?? "Invalid gift card",
      giftPreviewOk: false,
    };
  }

  const result = await startCheckout({
    listingId,
    buyerId,
    method,
    cryptoCurrency: method === "CRYPTO" ? cryptoCurrency : undefined,
    giftCardCode: method === "GIFT_CARD" ? giftCardCode : undefined,
  });

  if (!result.ok) return { error: result.error };

  revalidateOrderViews();
  redirect(result.redirect);
}

export async function previewGiftCard(listingId: string, code: string) {
  const buyerId = await getSessionUserId();
  if (!buyerId) return { valid: false, error: "Log in required." };

  const listing = await prismaListingPrice(listingId);
  if (!listing) return { valid: false, error: "Listing not found." };

  return validateGiftCardCodeInput(code);
}

async function prismaListingPrice(listingId: string) {
  const { prisma } = await import("@/lib/prisma");
  return prisma.listing.findUnique({
    where: { id: listingId },
    select: { priceCents: true },
  });
}
