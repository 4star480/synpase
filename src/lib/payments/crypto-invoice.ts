import { paymentConfig } from "./config";
import { getMerchantCryptoWallet } from "./crypto-wallets";
import { getCryptoUsdRates, usdCentsToCryptoAmount } from "./crypto-rates";
import { CRYPTO_CURRENCIES, type CryptoCheckoutDetails, type CryptoCurrencyId } from "./types";

export async function createCryptoInvoice(opts: {
  orderId: string;
  title: string;
  amountCents: number;
  currency: CryptoCurrencyId;
}): Promise<CryptoCheckoutDetails> {
  const cfg = paymentConfig();
  const meta = CRYPTO_CURRENCIES.find((c) => c.id === opts.currency)!;
  const rates = await getCryptoUsdRates();
  const rateUsd = rates[opts.currency] ?? 1;
  const amount = usdCentsToCryptoAmount(opts.amountCents, rateUsd, meta.decimals);
  const address = getMerchantCryptoWallet(opts.currency);
  const expiresAt = new Date(Date.now() + cfg.cryptoInvoiceTtlMinutes * 60_000).toISOString();
  const invoiceId = `inv_${opts.orderId.slice(0, 12)}`;

  return {
    currency: opts.currency,
    amount,
    address,
    invoiceId,
    expiresAt,
    usdAmount: opts.amountCents / 100,
    rateUsd,
    simulated: cfg.cryptoMode === "simulated",
  };
}
