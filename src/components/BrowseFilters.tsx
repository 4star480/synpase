"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/format";

export function BrowseFilterBar({
  games,
  totalGames,
}: {
  games: { slug: string; name: string; emoji: string }[];
  totalGames?: number;
}) {
  const params = useSearchParams();
  const activeCategory = params.get("category") ?? "";
  const activeGame = params.get("game") ?? "";

  function href(overrides: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(overrides)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    const qs = next.toString();
    return `/browse${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="sticky top-14 z-30 -mx-4 space-y-3 border-b border-border-dim/40 bg-background/95 px-4 py-3 backdrop-blur-xl sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none lg:top-[68px]">
      <div className="flex flex-wrap gap-2">
        <Link
          href={href({ category: null })}
          className={`touch-target rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
            !activeCategory ? "bg-accent text-black" : "border border-border-dim text-muted hover:text-foreground"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={href({ category: c.value })}
            className={`touch-target rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
              activeCategory === c.value ? "bg-accent text-black" : "border border-border-dim text-muted hover:text-foreground"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="scroll-touch scrollbar-hide -mx-1 flex items-center gap-2 px-1 pb-0.5">
        <Link
          href={href({ game: null })}
          className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition active:scale-95 ${
            !activeGame ? "bg-surface-2 text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          All games
        </Link>
        {games.map((g) => (
          <Link
            key={g.slug}
            href={href({ game: g.slug })}
            className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium transition active:scale-95 ${
              activeGame === g.slug ? "bg-accent/15 text-accent ring-1 ring-accent/40" : "text-muted hover:text-foreground"
            }`}
          >
            {g.emoji} {g.name}
          </Link>
        ))}
        <Link href="/games" className="shrink-0 rounded-full border border-border-dim px-3 py-1.5 text-xs font-medium text-accent hover:bg-surface-2">
          All {totalGames ? `${totalGames}+ ` : ""}games →
        </Link>
      </div>
    </div>
  );
}
