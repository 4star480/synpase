/** Regenerate branded SVG covers + sync DB for featured games */
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { GAMES, POPULAR_GAME_SLUGS } from "../src/lib/games-catalog";
import { writeGameCoverSvg } from "../src/lib/svg-art";

const prisma = new PrismaClient();
const ROOT = join(__dirname, "..");
const gamesDir = join(ROOT, "public", "images", "games");

async function main() {
  const popular = new Set<string>(POPULAR_GAME_SLUGS);
  const famous = GAMES.filter((g) => popular.has(g.slug));

  console.log(`Regenerating ${famous.length} branded game covers...`);
  for (const g of famous) {
    writeGameCoverSvg(g, join(gamesDir, `${g.slug}.svg`), true);
    await prisma.game.updateMany({
      where: { slug: g.slug },
      data: { coverImage: `/images/games/${g.slug}.svg`, emoji: g.emoji, tagline: g.tagline, bannerFrom: g.bannerFrom, bannerTo: g.bannerTo },
    });
    console.log(`  ✓ ${g.name}`);
  }

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
