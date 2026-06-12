"use client";

import { CATEGORY_ART } from "@/lib/game-art";
import { categoryLabel } from "@/lib/format";
import { CoverImage } from "./CoverImage";

export function ListingThumbnail({
  category,
  title,
  bannerFrom,
  bannerTo,
  gameName,
  gameSlug,
  imagePath,
}: {
  emoji?: string;
  category: string;
  bannerFrom?: string;
  bannerTo?: string;
  gameName?: string;
  title: string;
  gameSlug?: string;
  imagePath?: string;
  categoryImage?: string;
  gameCoverImage?: string;
}) {
  const art = CATEGORY_ART[category] ?? CATEGORY_ART.ITEM;
  const from = bannerFrom ?? "#1a2236";
  const to = bannerTo ?? "#12182a";
  const src =
    imagePath ??
    (gameSlug ? `/images/games/${gameSlug}.jpg` : "/images/categories/item.svg");

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-surface-2">
      <CoverImage
        src={src}
        slug={gameSlug}
        alt={gameName ?? title}
        name={gameName}
        bannerFrom={from}
        bannerTo={to}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div
        className="absolute right-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase backdrop-blur-sm"
        style={{ backgroundColor: `${art.accent}44`, color: art.accent, border: `1px solid ${art.accent}` }}
      >
        {art.icon} {categoryLabel(category)}
      </div>
      <p className="absolute bottom-3 left-3 right-3 line-clamp-2 text-[11px] font-semibold leading-tight text-white">
        {title}
      </p>
    </div>
  );
}
