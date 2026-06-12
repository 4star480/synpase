export const CATEGORY_ART: Record<string, { icon: string; label: string; accent: string }> = {
  ACCOUNT: { icon: "👤", label: "Account", accent: "#a78bfa" },
  CURRENCY: { icon: "💰", label: "Currency", accent: "#fbbf24" },
  ITEM: { icon: "🎁", label: "Item", accent: "#34d399" },
  BOOSTING: { icon: "🚀", label: "Boosting", accent: "#f472b6" },
};

export function gameBannerStyle(from: string, to: string) {
  return {
    background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
  };
}
