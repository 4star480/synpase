"use client";

import Link from "next/link";
import { useRef } from "react";
import { CoverImage } from "./CoverImage";

export type GameCard = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  tagline: string;
  bannerFrom: string;
  bannerTo: string;
  listingCount: number;
  sellerCount?: number;
  coverImage?: string;
  avgRating?: number | null;
};

export function GameCarousel({ games }: { games: GameCard[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="absolute -left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border-dim bg-surface/90 text-lg backdrop-blur transition hover:border-accent sm:grid"
        aria-label="Scroll left"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        className="absolute -right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border-dim bg-surface/90 text-lg backdrop-blur transition hover:border-accent sm:grid"
        aria-label="Scroll right"
      >
        ›
      </button>
      <div
        ref={ref}
        className="scroll-touch scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 scroll-smooth px-4 pb-3 sm:mx-0 sm:gap-4 sm:px-0"
      >
        {games.map((game) => {
          const rating = game.avgRating ?? 4.9;
          return (
            <Link
              key={game.id}
              href={`/browse?game=${game.slug}`}
              className="game-hub-card group w-[152px] shrink-0 snap-start overflow-hidden touch-manipulation sm:w-[180px]"
            >
              <div className="relative h-24 w-full overflow-hidden">
                <CoverImage
                  src={game.coverImage ?? `/images/games/${game.slug}.jpg`}
                  slug={game.slug}
                  alt={game.name}
                  name={game.name}
                  bannerFrom={game.bannerFrom}
                  bannerTo={game.bannerTo}
                  className="h-full w-full"
                  showName
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12182a]/80 via-transparent to-transparent" />
                <span className="absolute right-2 top-2 rounded-md bg-rating/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  {rating}★
                </span>
              </div>
              <div className="p-3 pt-2">
                <h3 className="truncate text-sm font-bold leading-tight group-hover:text-accent">
                  {game.name}
                </h3>
                <p className="mt-0.5 truncate text-[11px] text-muted">{game.tagline}</p>
                <p className="mt-2 text-[10px] text-muted">
                  <strong className="text-foreground">{game.listingCount}</strong> offers
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
