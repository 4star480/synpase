import { prisma } from "@/lib/prisma";
import { giftCardCodePattern, normalizeGiftCardCode } from "./config";
import type { GiftCardValidation } from "./types";

export function maskGiftCardCode(code: string): string {
  const parts = code.split("-");
  if (parts.length >= 3) return `${parts[0]}-****-****`;
  return "****";
}

export async function validateGiftCard(codeRaw: string, amountCents: number): Promise<GiftCardValidation> {
  const code = normalizeGiftCardCode(codeRaw);
  if (!giftCardCodePattern().test(code)) {
    return { valid: false, error: "Invalid code format. Example: AMAZON-100-K7M2" };
  }

  const card = await prisma.giftCard.findUnique({ where: { code } });
  if (!card || !card.active) {
    return { valid: false, error: "Gift card not found or inactive." };
  }
  if (card.expiresAt && card.expiresAt < new Date()) {
    return { valid: false, error: "This gift card has expired." };
  }
  if (card.balanceCents < amountCents) {
    return {
      valid: false,
      error: `Insufficient balance. Card has $${(card.balanceCents / 100).toFixed(2)} available.`,
      balanceCents: card.balanceCents,
    };
  }

  return {
    valid: true,
    balanceCents: card.balanceCents,
    maskedCode: maskGiftCardCode(code),
  };
}

export function generateGiftCardCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const block = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `GIFT-${block()}-${block()}`;
}
