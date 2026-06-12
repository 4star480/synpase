/** Reset listing images to shared game/category covers (drops per-listing /products/ bloat). */
import { PrismaClient } from "@prisma/client";
import { resolveListingImage } from "../src/lib/listing-images";

const prisma = new PrismaClient();

async function main() {
  const listings = await prisma.listing.findMany({
    select: { id: true, category: true, imagePath: true, game: { select: { slug: true } } },
  });

  let updated = 0;
  for (const l of listings) {
    const imagePath = resolveListingImage(l.game.slug, l.category);
    if (l.imagePath !== imagePath) {
      await prisma.listing.update({ where: { id: l.id }, data: { imagePath } });
      updated++;
    }
  }

  console.log(`Updated ${updated} / ${listings.length} listings to shared cover images.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
