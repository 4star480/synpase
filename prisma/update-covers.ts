import { PrismaClient } from "@prisma/client";
import { existsSync } from "fs";
import { join } from "path";
import { GAMES } from "./catalog-data";

const prisma = new PrismaClient();
const base = join(__dirname, "..", "public", "images", "games");

function coverPath(slug: string): string {
  if (existsSync(join(base, `${slug}.jpg`))) return `/images/games/${slug}.jpg`;
  if (existsSync(join(base, `${slug}.svg`))) return `/images/games/${slug}.svg`;
  return `/images/games/${slug}.jpg`;
}

async function main() {
  for (const g of GAMES) {
    await prisma.game.update({
      where: { slug: g.slug },
      data: { coverImage: coverPath(g.slug) },
    });
  }
  console.log("Updated game cover paths.");
}

main().finally(() => prisma.$disconnect());
