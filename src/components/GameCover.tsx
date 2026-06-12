import { gameCoverSrc } from "@/lib/images";
import { CoverImage } from "./CoverImage";

export function GameCover({
  name,
  slug,
  bannerFrom,
  bannerTo,
  coverImage,
  size = "md",
  className = "",
}: {
  emoji?: string;
  name: string;
  slug?: string;
  bannerFrom?: string;
  bannerTo?: string;
  coverImage?: string;
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
}) {
  const heights = { sm: "h-20", md: "h-28", lg: "h-36", hero: "h-48" };
  const src = slug ? gameCoverSrc(slug, coverImage) : "/images/categories/item.svg";

  return (
    <CoverImage
      src={src}
      slug={slug}
      alt={name}
      name={name}
      bannerFrom={bannerFrom ?? "#1a2236"}
      bannerTo={bannerTo ?? "#12182a"}
      className={`rounded-xl ${heights[size]} ${className}`}
      showName
    />
  );
}
