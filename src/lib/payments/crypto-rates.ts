import { CRYPTO_CURRENCIES, type CryptoCurrencyId } from "./types";

type RateMap = Partial<Record<CryptoCurrencyId, number>>;

let cache: { rates: RateMap; at: number } | null = null;
const CACHE_MS = 60_000;

export async function getCryptoUsdRates(): Promise<RateMap> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.rates;

  const ids = CRYPTO_CURRENCIES.map((c) => c.coingeckoId).join(",");
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("rate fetch failed");
    const data = (await res.json()) as Record<string, { usd?: number }>;
    const rates: RateMap = {};
    for (const c of CRYPTO_CURRENCIES) {
      const usd = data[c.coingeckoId]?.usd;
      if (usd && usd > 0) rates[c.id] = usd;
    }
    if (Object.keys(rates).length > 0) {
      cache = { rates, at: Date.now() };
      return rates;
    }
  } catch {
    /* fallback below */
  }

  return {
    BTC: 97_000,
    ETH: 3_400,
    USDT: 1,
    LTC: 95,
  };
}

export function usdCentsToCryptoAmount(usdCents: number, rateUsd: number, decimals: number): string {
  const usd = usdCents / 100;
  const crypto = usd / rateUsd;
  return crypto.toFixed(decimals);
}
