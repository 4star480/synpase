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
  { id: "steam", name: "Steam", icon: "🎮", denominations: [5, 10, 20, 50, 100] },
  { id: "playstation", name: "PlayStation", icon: "🎯", denominations: [10, 25, 50, 75, 100] },
  { id: "xbox", name: "Xbox", icon: "🟢", denominations: [10, 15, 25, 50, 100] },
  { id: "nintendo", name: "Nintendo eShop", icon: "🔴", denominations: [10, 20, 35, 50] },
  { id: "google", name: "Google Play", icon: "▶️", denominations: [10, 15, 25, 50, 100] },
  { id: "apple", name: "Apple App Store", icon: "🍎", denominations: [10, 15, 25, 50, 100] },
  { id: "roblox", name: "Roblox", icon: "🧱", denominations: [10, 25, 50, 100] },
  { id: "riot", name: "Riot Points", icon: "⚔️", denominations: [10, 25, 50] },
  { id: "battlenet", name: "Battle.net", icon: "❄️", denominations: [20, 50] },
];

/** Gift card inventory used when seeding the database. */
export const SEED_GIFT_CARDS: { code: string; label: string }[] = [
  { code: "AMAZON-100-K7M2", label: "Amazon $100" },
  { code: "AMAZON-50-R4T9", label: "Amazon $50" },
  { code: "STEAM-50-G8P3", label: "Steam $50" },
  { code: "STEAM-20-N2W6", label: "Steam $20" },
  { code: "PLAYSTATION-50-B5H1", label: "PlayStation $50" },
  { code: "XBOX-25-D3J8", label: "Xbox $25" },
  { code: "NINTENDO-35-Q9L4", label: "Nintendo $35" },
  { code: "GOOGLE-25-F6V2", label: "Google Play $25" },
  { code: "APPLE-50-C8X7", label: "Apple $50" },
  { code: "ROBLOX-25-H2M9", label: "Roblox $25" },
];
