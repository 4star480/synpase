/** Major retail / gaming gift cards and their common face-value tiers (USD). */

export type GiftCardBrand = {
  id: string;
  name: string;
  icon: string;
  /** Typical denominations sold at retail (USD). */
  denominations: number[];
};

export const GIFT_CARD_BRANDS: GiftCardBrand[] = [
  { id: "amazon", name: "Amazon", icon: "📦", denominations: [10, 25, 50, 100, 200] },
  {
    id: "apple",
    name: "Apple Gift Card",
    icon: "🍎",
    // US retail: $10–$500; Apple.com custom digital $10–$2,000
    denominations: [10, 15, 25, 50, 100, 200],
  },
  {
    id: "xbox",
    name: "Xbox",
    icon: "🟢",
    // Microsoft / major retailers: $5–$100
    denominations: [5, 10, 15, 20, 25, 50, 100],
  },
  { id: "playstation", name: "PlayStation", icon: "🎯", denominations: [10, 25, 50, 75, 100] },
  { id: "steam", name: "Steam", icon: "🎮", denominations: [5, 10, 20, 50, 100] },
  {
    id: "paysafe",
    name: "Paysafecard",
    icon: "🔒",
    // US retail PINs: $10, $25, $50, $100 (online PIN shop: $5–$150)
    denominations: [10, 25, 50, 100],
  },
  {
    id: "razer-gold",
    name: "Razer Gold",
    icon: "🐍",
    // Official eGift range: $10–$500
    denominations: [10, 25, 50, 100, 250, 500],
  },
  { id: "nintendo", name: "Nintendo eShop", icon: "🔴", denominations: [10, 20, 35, 50] },
  { id: "google", name: "Google Play", icon: "▶️", denominations: [10, 15, 25, 50, 100] },
  { id: "roblox", name: "Roblox", icon: "🧱", denominations: [10, 25, 50, 100] },
  { id: "riot", name: "Riot Points", icon: "⚔️", denominations: [10, 25, 50] },
  { id: "battlenet", name: "Battle.net", icon: "❄️", denominations: [20, 50] },
];
