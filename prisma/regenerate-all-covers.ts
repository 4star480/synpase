/** Download game cover art + sync database paths */
import { existsSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { GAMES } from "../src/lib/games-catalog";
import { downloadAllGameCovers } from "./download-game-covers";

const prisma = new PrismaClient();
const ROOT = join(__dirname, "..");
const gamesDir = join(ROOT, "public", "images", "games");

function coverPath(slug: string): string {
  const jpg = join(gamesDir, `${slug}.jpg`);
  if (existsSync(jpg)) return `/images/games/${slug}.jpg`;
  const svg = join(gamesDir, `${slug}.svg`);
  if (existsSync(svg)) return `/images/games/${slug}.svg`;
  return `/images/games/${slug}.jpg`;
}

async function main() {
  console.log(`Downloading covers for ${GAMES.length} games...`);
  await downloadAllGameCovers(ROOT);

  for (const g of GAMES) {
    const cover = coverPath(g.slug);
    await prisma.game.updateMany({
      where: { slug: g.slug },
      data: {
        coverImage: cover,
        emoji: g.emoji,
        tagline: g.tagline,
        bannerFrom: g.bannerFrom,
        bannerTo: g.bannerTo,
      },
    });
  }

  const listings = await prisma.listing.findMany({
    select: { id: true, game: { select: { slug: true } } },
  });
  for (const l of listings) {
    await prisma.listing.update({
      where: { id: l.id },
      data: { imagePath: coverPath(l.game.slug) },
    });
  }

  console.log(`Updated ${GAMES.length} games and ${listings.length} listings.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
