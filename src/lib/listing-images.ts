/** Listing thumbnails always use the parent game's labelled cover */

export function resolveListingImage(gameSlug: string, _category?: string): string {
  return `/images/games/${gameSlug}.jpg`;
}
