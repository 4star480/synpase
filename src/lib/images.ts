/** Game cover paths — prefer downloaded JPG artwork */

import { EXTERNAL_COVER_URLS } from "../../prisma/game-cover-urls";

/** Bump when local cover files change so phones drop stale cached JPGs */
export const COVER_CACHE_VERSION = 5;

function withCacheBust(path: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${COVER_CACHE_VERSION}`;
}

/** Verified remote artwork (non-Steam titles, etc.) */
function remoteCoverUrl(slug: string): string | undefined {
  return EXTERNAL_COVER_URLS[slug];
}

export function gameCoverSrc(slug: string, coverImage?: string | null): string {
  const remote = remoteCoverUrl(slug);
  if (remote) return remote;
  if (coverImage?.startsWith("/uploads/")) return coverImage;
  if (coverImage?.startsWith("http")) return coverImage;
  // Prefer JPG (built on Netlify or local); CoverImage falls back to SVG on 404
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
  if (opts.gameSlug) {
    const remote = remoteCoverUrl(opts.gameSlug);
    if (remote) return remote;
  }
  if (opts.gameCover) return gameCoverSrc(opts.gameSlug ?? "", opts.gameCover);
  if (opts.gameSlug) return gameCoverSrc(opts.gameSlug);
  if (opts.category) return categorySrc(opts.category);
  return categorySrc("ITEM");
}
