"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { giftCardCodePattern } from "@/lib/payments/config";
import { generateGiftCardCode } from "@/lib/payments/gift-card";

export type GiftCardFormState = { error?: string; success?: string };

export async function createGiftCard(_prev: GiftCardFormState, formData: FormData): Promise<GiftCardFormState> {
  await requireAdmin();

  const amount = Number(formData.get("amount"));
  const label = String(formData.get("label") ?? "").trim();
  const codeInput = String(formData.get("code") ?? "").trim().toUpperCase();
  const expiresDays = Number(formData.get("expiresDays") ?? 0);

  if (!Number.isFinite(amount) || amount <= 0 || amount > 10000) {
    return { error: "Enter a valid amount between $0.01 and $10,000." };
  }

  const cents = Math.round(amount * 100);
  let code = codeInput || generateGiftCardCode();

  if (!giftCardCodePattern().test(code)) {
    return { error: "Invalid code format. Leave blank to auto-generate." };
  }

  const existing = await prisma.giftCard.findUnique({ where: { code } });
  if (existing) return { error: "Code already exists." };

  await prisma.giftCard.create({
    data: {
      code,
      balanceCents: cents,
      initialBalanceCents: cents,
      label: label || `Gift card $${amount.toFixed(2)}`,
      expiresAt:
        expiresDays > 0 ? new Date(Date.now() + expiresDays * 86400000) : null,
    },
  });

  revalidatePath("/admin/gift-cards");
  return { success: `Created ${code} with $${amount.toFixed(2)} balance.` };
}

export async function toggleGiftCard(cardId: string, active: boolean) {
  await requireAdmin();
  await prisma.giftCard.update({ where: { id: cardId }, data: { active } });
  revalidatePath("/admin/gift-cards");
}
