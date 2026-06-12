"use client";

import Link from "next/link";

const TILES = [
  { value: "CURRENCY", label: "Currency", icon: "💰", desc: "Gold, coins & gems", color: "from-amber-500/20 to-amber-600/5" },
  { value: "ITEM", label: "Items", icon: "🎁", desc: "Skins, gear & loot", color: "from-emerald-500/20 to-emerald-600/5" },
  { value: "ACCOUNT", label: "Accounts", icon: "👤", desc: "Ready-to-play chars", color: "from-violet-500/20 to-violet-600/5" },
  { value: "BOOSTING", label: "Boosting", icon: "🚀", desc: "Rank up faster", color: "from-pink-500/20 to-pink-600/5" },
];

export function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TILES.map((t) => (
        <Link
          key={t.value}
          href={`/browse?category=${t.value}`}
          className={`group relative overflow-hidden rounded-2xl border border-border-dim bg-gradient-to-br p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg ${t.color}`}
        >
          <span className="text-3xl transition group-hover:scale-110">{t.icon}</span>
          <h3 className="mt-3 font-bold">{t.label}</h3>
          <p className="mt-0.5 text-xs text-muted">{t.desc}</p>
        </Link>
      ))}
    </div>
  );
}
