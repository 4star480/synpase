/** Payment processor configuration — set keys in .env for live crypto */

export function paymentConfig() {
  const nowPaymentsKey = process.env.NOWPAYMENTS_API_KEY?.trim();
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET?.trim();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  return {
    siteUrl,
    cryptoMode: nowPaymentsKey ? ("nowpayments" as const) : ("simulated" as const),
    nowPaymentsKey,
    ipnSecret,
    cryptoInvoiceTtlMinutes: Number(process.env.CRYPTO_INVOICE_TTL_MINUTES ?? "30"),
    allowSimulateConfirm:
      !nowPaymentsKey || process.env.NODE_ENV !== "production" || process.env.ALLOW_CRYPTO_SIMULATE === "1",
  };
}

export function giftCardCodePattern() {
  // BRAND-AMOUNT-XXXX (e.g. AMAZON-100-K7M2) or GIFT-XXXX-XXXX (issued cards)
  return /^(?:GIFT-[A-Z0-9]{4}-[A-Z0-9]{4}|[A-Z][A-Z0-9]{1,11}-\d{2,3}-[A-Z0-9]{4})$/i;
}

export function normalizeGiftCardCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}
