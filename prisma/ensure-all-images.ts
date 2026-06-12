/** Ensure game & category cover SVGs exist (no per-listing generation). */
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { GAMES } from "./catalog-data";
import { downloadAllImages } from "./download-images";
import { gameCoverPublicPath } from "../src/lib/svg-art";

const prisma = new PrismaClient();
const ROOT = join(__dirname, "..");

async function main() {
  console.log("Ensuring game & category images...");
  await downloadAllImages(ROOT);

  for (const g of GAMES) {
    const coverImage = gameCoverPublicPath(join(ROOT, "public"), g.slug) || `/images/games/${g.slug}.svg`;
    await prisma.game.updateMany({ where: { slug: g.slug }, data: { coverImage } });
  }

  console.log("Done — game covers only, no per-listing files.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
