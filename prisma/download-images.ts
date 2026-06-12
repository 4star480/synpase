import { mkdirSync } from "fs";
import { join } from "path";
import { downloadAllGameCovers } from "./download-game-covers";

/** Download real game cover art (Steam / RAWG / Wikipedia) */
export async function downloadAllImages(root: string) {
  const gamesDir = join(root, "public", "images", "games");
  const categoriesDir = join(root, "public", "images", "categories");
  mkdirSync(gamesDir, { recursive: true });
  mkdirSync(categoriesDir, { recursive: true });

  await downloadAllGameCovers(root);
}

export function resolveListingImage(gameSlug: string): string {
  return `/images/games/${gameSlug}.jpg`;
}
