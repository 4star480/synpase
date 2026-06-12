import { CoverImage } from "./CoverImage";

export function ListingImage({
  imagePath,
  gameSlug,
  gameCover,
  bannerFrom,
  bannerTo,
  title,
  className = "h-14 w-20",
}: {
  imagePath?: string | null;
  gameSlug?: string;
  gameCover?: string | null;
  category?: string;
  emoji?: string;
  bannerFrom?: string;
  bannerTo?: string;
  title?: string;
  className?: string;
}) {
  const src =
    imagePath ??
    gameCover ??
    (gameSlug ? `/images/games/${gameSlug}.jpg` : "/images/categories/item.svg");

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-surface-2 ${className}`}>
      <CoverImage
        src={src}
        slug={gameSlug}
        alt={title ?? "Listing"}
        bannerFrom={bannerFrom ?? "#1a2236"}
        bannerTo={bannerTo ?? "#12182a"}
        className="absolute inset-0"
      />
    </div>
  );
}
