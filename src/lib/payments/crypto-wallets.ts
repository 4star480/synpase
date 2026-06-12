import type { CryptoCurrencyId } from "./types";

/** Merchant receive addresses shown at crypto checkout. */
export const MERCHANT_CRYPTO_WALLETS: Record<CryptoCurrencyId, string> = {
  BTC: "bc1qkqky6yan8lgaledk3muyg9xh57h3lnqn3kh9zs",
  ETH: "0x3A802085E27E587d6f8a230aF8F99F3e1E53a24D",
  USDT: "0x3A802085E27E587d6f8a230aF8F99F3e1E53a24D",
  LTC: "LcyLckKXp9Hs1S8e5qGiJz7XGe3oXbXw8R",
};

export function getMerchantCryptoWallet(currency: CryptoCurrencyId): string {
  return MERCHANT_CRYPTO_WALLETS[currency];
}
