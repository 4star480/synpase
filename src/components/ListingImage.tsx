import { gameCoverSrc } from "@/lib/images";
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
  const src = imagePath?.startsWith("/uploads/")
    ? imagePath
    : gameCoverSrc(gameSlug ?? "", gameCover);

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
