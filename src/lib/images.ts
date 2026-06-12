/** Game cover paths — prefer downloaded JPG artwork */

/** Bump when local cover files change so phones drop stale cached JPGs */
export const COVER_CACHE_VERSION = 4;

/** Slugs that must load from a verified remote URL (not Steam / stale cache) */
const REMOTE_COVER_OVERRIDES: Record<string, string> = {
  fortnite:
    "https://cms-assets.unrealengine.com/cm6l5gfpm05kr07my04cqgy2x/cmfo4y74z03yw07ohsjgs0qj7",
};

function withCacheBust(path: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${COVER_CACHE_VERSION}`;
}

export function gameCoverSrc(slug: string, coverImage?: string | null): string {
  if (REMOTE_COVER_OVERRIDES[slug]) return REMOTE_COVER_OVERRIDES[slug];
  if (coverImage?.startsWith("/uploads/")) return coverImage;
  if (coverImage?.startsWith("/images/games/")) return withCacheBust(coverImage);
  if (coverImage) return coverImage;
  return withCacheBust(`/images/games/${slug}.jpg`);
}

export function gameCoverFallbackSrc(slug: string): string {
  return withCacheBust(`/images/games/${slug}.svg`);
}

export function categorySrc(category: string): string {
  return `/images/categories/${category.toLowerCase()}.svg`;
}

export function resolveListingVisual(opts: {
  imagePath?: string | null;
  gameSlug?: string;
  gameCover?: string | null;
  category?: string;
}): string {
  if (opts.imagePath?.startsWith("/uploads/")) return opts.imagePath;
  if (opts.gameSlug && REMOTE_COVER_OVERRIDES[opts.gameSlug]) {
    return REMOTE_COVER_OVERRIDES[opts.gameSlug];
  }
  if (opts.gameCover) return gameCoverSrc(opts.gameSlug ?? "", opts.gameCover);
  if (opts.gameSlug) return gameCoverSrc(opts.gameSlug);
  if (opts.category) return categorySrc(opts.category);
  return categorySrc("ITEM");
}
