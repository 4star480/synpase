import { normalizeGiftCardCode } from "./config";
import type { GiftCardValidation } from "./types";

export function maskGiftCardCode(code: string): string {
  if (code.length <= 4) return "****";
  return `••••${code.slice(-4)}`;
}

/** Validate a buyer-entered gift card code (format only — no balance lookup). */
export function validateGiftCardCodeInput(codeRaw: string): GiftCardValidation {
  const code = normalizeGiftCardCode(codeRaw);
  if (code.length < 8) {
    return { valid: false, error: "Enter a gift card code (at least 8 characters)." };
  }
  if (code.length > 64) {
    return { valid: false, error: "Gift card code is too long." };
  }
  if (!/^[A-Z0-9-]+$/.test(code)) {
    return { valid: false, error: "Code can only contain letters, numbers, and dashes." };
  }

  return { valid: true, maskedCode: maskGiftCardCode(code) };
}

export function generateGiftCardCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const block = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `GIFT-${block()}-${block()}`;
}
