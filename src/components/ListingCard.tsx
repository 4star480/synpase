"use client";

import Link from "next/link";
import { formatPrice, formatDelivery } from "@/lib/format";
import { CategoryBadge } from "./CategoryBadge";
import { Avatar } from "./Avatar";
import { RatingStars } from "./RatingStars";
import { ListingThumbnail } from "./ListingThumbnail";
import { WishlistButton } from "./WishlistButton";

export type ListingCardData = {
  id: string;
  title: string;
  category: string;
  priceCents: number;
  deliveryMins: number;
  stock: number;
  featured?: boolean;
  views?: number;
  imagePath?: string;
  categoryImage?: string;
  game: {
    name: string;
    emoji: string;
    slug?: string;
    bannerFrom: string;
    bannerTo: string;
    coverImage?: string;
  };
  seller: { username: string; avatarHue: number; verified?: boolean };
  sellerRating: number | null;
};

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const fastDelivery = listing.deliveryMins <= 60;

  return (
    <article className="game-hub-card group relative flex flex-col">
      <Link
        href={`/listing/${listing.id}`}
        className="absolute inset-0 z-0 rounded-[12px]"
        aria-label={`View ${listing.title}`}
      />
      <div className="pointer-events-none relative z-[1] flex flex-1 flex-col">
        <div className="relative p-3 pb-0">
          <ListingThumbnail
            category={listing.category}
            title={listing.title}
            gameName={listing.game.name}
            gameSlug={listing.game.slug}
            imagePath={listing.imagePath}
            bannerFrom={listing.game.bannerFrom}
            bannerTo={listing.game.bannerTo}
          />
          {listing.featured && (
            <span className="absolute left-5 top-5 rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
              Hot
            </span>
          )}
          {fastDelivery && (
            <span className="absolute bottom-5 left-5 rounded-md bg-buy/90 px-2 py-0.5 text-[10px] font-bold text-black">
              ⚡ Instant
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs text-muted">{listing.game.name}</span>
            <CategoryBadge category={listing.category} />
          </div>

          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 transition group-hover:text-accent">
            {listing.title}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar username={listing.seller.username} hue={listing.seller.avatarHue} size={28} />
              <div className="min-w-0">
                <span className="flex items-center gap-1 text-xs font-medium">
                  <span className="truncate">{listing.seller.username}</span>
                  {listing.seller.verified && (
                    <span className="shrink-0 text-[10px] text-accent" title="Verified seller">
                      ✓
                    </span>
                  )}
                </span>
                <RatingStars rating={listing.sellerRating} />
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-extrabold text-foreground">{formatPrice(listing.priceCents)}</p>
              <p className="text-[10px] text-muted">~{formatDelivery(listing.deliveryMins)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-auto absolute right-5 top-5 z-[2]">
        <WishlistButton listingId={listing.id} />
      </div>
    </article>
  );
}
