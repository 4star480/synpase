export const PAYMENT_METHODS = ["CRYPTO", "GIFT_CARD"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ["PENDING", "AWAITING", "COMPLETED", "FAILED", "EXPIRED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ORDER_PAYMENT_STATUSES = ["UNPAID", "AWAITING", "PAID", "FAILED", "REFUNDED"] as const;
export type OrderPaymentStatus = (typeof ORDER_PAYMENT_STATUSES)[number];

export const CRYPTO_CURRENCIES = [
  { id: "BTC", label: "Bitcoin", symbol: "₿", coingeckoId: "bitcoin", decimals: 8 },
  { id: "ETH", label: "Ethereum", symbol: "Ξ", coingeckoId: "ethereum", decimals: 6 },
  { id: "USDT", label: "Tether (USDT ERC20)", symbol: "₮", coingeckoId: "tether", decimals: 2 },
  { id: "LTC", label: "Litecoin", symbol: "Ł", coingeckoId: "litecoin", decimals: 6 },
] as const;

export type CryptoCurrencyId = (typeof CRYPTO_CURRENCIES)[number]["id"];

export type CryptoCheckoutDetails = {
  currency: CryptoCurrencyId;
  amount: string;
  address: string;
  invoiceId: string;
  expiresAt: string;
  usdAmount: number;
  rateUsd: number;
  simulated: boolean;
};

export type GiftCardValidation = {
  valid: boolean;
  balanceCents?: number;
  maskedCode?: string;
  error?: string;
};
