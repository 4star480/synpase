export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatDelivery(mins: number): string {
  if (mins < 60) return `${mins} min`;
  if (mins < 1440) return `${Math.round(mins / 60)} hr`;
  return `${Math.round(mins / 1440)} day${mins >= 2880 ? "s" : ""}`;
}

export const CATEGORIES = [
  { value: "ACCOUNT", label: "Accounts" },
  { value: "CURRENCY", label: "Currency" },
  { value: "ITEM", label: "Items" },
  { value: "BOOSTING", label: "Boosting" },
] as const;

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CRYPTO: "Crypto",
  GIFT_CARD: "Gift card",
  CARD: "Card",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: "Unpaid",
  AWAITING: "Awaiting payment",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export function paymentMethodLabel(method: string | null | undefined): string {
  if (!method) return "Standard";
  return PAYMENT_METHOD_LABELS[method] ?? method;
}

export function paymentStatusLabel(status: string): string {
  return PAYMENT_STATUS_LABELS[status] ?? status;
}
