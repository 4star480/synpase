import { createHash } from "crypto";
import { paymentConfig } from "./config";
import { getCryptoUsdRates, usdCentsToCryptoAmount } from "./crypto-rates";
import { CRYPTO_CURRENCIES, type CryptoCheckoutDetails, type CryptoCurrencyId } from "./types";

function simulatedAddress(currency: CryptoCurrencyId, seed: string): string {
  const hash = createHash("sha256").update(`${currency}:${seed}`).digest("hex");
  switch (currency) {
    case "BTC":
      return `bc1q${hash.slice(0, 38)}`;
    case "ETH":
      return `0x${hash.slice(0, 40)}`;
    case "USDT":
      return `T${hash.slice(0, 33).toUpperCase()}`;
    case "LTC":
      return `ltc1q${hash.slice(0, 38)}`;
    default:
      return hash.slice(0, 42);
  }
}

async function createNowPaymentsInvoice(opts: {
  orderId: string;
  title: string;
  amountCents: number;
  currency: CryptoCurrencyId;
}): Promise<CryptoCheckoutDetails | null> {
  const cfg = paymentConfig();
  if (!cfg.nowPaymentsKey) return null;

  const payCurrency = opts.currency === "USDT" ? "usdttrc20" : opts.currency.toLowerCase();
  const res = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: {
      "x-api-key": cfg.nowPaymentsKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: opts.amountCents / 100,
      price_currency: "usd",
      pay_currency: payCurrency,
      order_id: opts.orderId,
      order_description: opts.title.slice(0, 120),
      ipn_callback_url: `${cfg.siteUrl}/api/payments/crypto/webhook`,
      success_url: `${cfg.siteUrl}/checkout/order/${opts.orderId}/crypto?status=success`,
      cancel_url: `${cfg.siteUrl}/checkout/order/${opts.orderId}/crypto?status=cancelled`,
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    id?: string;
    invoice_id?: string;
    pay_address?: string;
    pay_amount?: number;
    expiration_estimate_date?: string;
    payment_url?: string;
  };

  const invoiceId = String(data.invoice_id ?? data.id ?? "");
  const address = data.pay_address ?? "";
  if (!invoiceId || !address) return null;

  const meta = CRYPTO_CURRENCIES.find((c) => c.id === opts.currency)!;
  const rates = await getCryptoUsdRates();
  const rateUsd = rates[opts.currency] ?? 1;

  return {
    currency: opts.currency,
    amount: String(data.pay_amount ?? usdCentsToCryptoAmount(opts.amountCents, rateUsd, meta.decimals)),
    address,
    invoiceId,
    expiresAt:
      data.expiration_estimate_date ??
      new Date(Date.now() + cfg.cryptoInvoiceTtlMinutes * 60_000).toISOString(),
    qrData: `${opts.currency.toLowerCase()}:${address}?amount=${data.pay_amount ?? ""}`,
    usdAmount: opts.amountCents / 100,
    rateUsd,
    simulated: false,
  };
}

export async function createCryptoInvoice(opts: {
  orderId: string;
  title: string;
  amountCents: number;
  currency: CryptoCurrencyId;
}): Promise<CryptoCheckoutDetails> {
  const live = await createNowPaymentsInvoice(opts);
  if (live) return live;

  const cfg = paymentConfig();
  const meta = CRYPTO_CURRENCIES.find((c) => c.id === opts.currency)!;
  const rates = await getCryptoUsdRates();
  const rateUsd = rates[opts.currency] ?? 1;
  const amount = usdCentsToCryptoAmount(opts.amountCents, rateUsd, meta.decimals);
  const address = simulatedAddress(opts.currency, opts.orderId);
  const expiresAt = new Date(Date.now() + cfg.cryptoInvoiceTtlMinutes * 60_000).toISOString();
  const invoiceId = `sim_${opts.orderId.slice(0, 12)}`;

  return {
    currency: opts.currency,
    amount,
    address,
    invoiceId,
    expiresAt,
    qrData: `${opts.currency.toLowerCase()}:${address}?amount=${amount}`,
    usdAmount: opts.amountCents / 100,
    rateUsd,
    simulated: true,
  };
}

export function cryptoQrUrl(data: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(data)}`;
}
