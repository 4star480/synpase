"use client";

import { useRef } from "react";
import { RatingStars } from "./RatingStars";
import { MediaLogos } from "./MediaLogos";

export type ReviewCard = {
  id: string;
  rating: number;
  comment: string;
  author: string;
  gameName: string;
  gameEmoji: string;
  listingTitle: string;
  createdAt: string;
};

const GRADIENTS = [
  "from-emerald-500/15 via-transparent to-violet-500/10",
  "from-amber-500/15 via-transparent to-rose-500/10",
  "from-sky-500/15 via-transparent to-emerald-500/10",
];

export function ReviewsCarousel({
  reviews,
  avgRating,
  reviewCount,
}: {
  reviews: ReviewCard[];
  avgRating?: number;
  reviewCount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  if (reviews.length === 0) return null;

  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <section className="mt-12 rounded-2xl border border-border-dim/50 bg-surface/50 py-8 sm:mt-20 sm:py-14">
      <div className="text-center">
        <p className="text-sm font-semibold text-accent">Trusted by thousands of buyers</p>
        <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Join a global community</h2>
      </div>

      <div className="mt-8 px-4">
        <MediaLogos />
      </div>

      <div className="relative mt-10">
        <div
          ref={ref}
          className="scroll-touch scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 scroll-smooth px-4 pb-3 sm:mx-0 sm:gap-4 sm:px-2"
        >
          {reviews.map((r, i) => (
            <article
              key={r.id}
              className={`w-[min(85vw,18rem)] shrink-0 snap-start rounded-xl border border-border-dim/60 bg-surface p-5 sm:w-80 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold">{r.author}</span>
                <RatingStars rating={r.rating} />
              </div>
              <p className="mt-1 text-xs text-muted">
                {r.gameEmoji} {r.gameName}
              </p>
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
              <p className="mt-3 truncate text-[11px] text-muted">{r.listingTitle}</p>
            </article>
          ))}
        </div>
      </div>

      {avgRating && reviewCount && (
        <p className="mt-8 text-center text-sm text-muted">
          Rated <strong className="text-warning">{avgRating}/5</strong> from{" "}
          <strong className="text-foreground">{reviewCount.toLocaleString()}</strong> verified reviews
        </p>
      )}
    </section>
  );
}
