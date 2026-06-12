import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { join } from "path";
import { GAMES, generateCatalogListings } from "./catalog-data";
import { downloadAllImages } from "./download-images";
import { gameCoverPublicPath } from "../src/lib/svg-art";
import { resolveListingImage } from "../src/lib/listing-images";

const prisma = new PrismaClient();
const ROOT = join(__dirname, "..");
const BATCH = 200;
const TARGET_LISTINGS = 3200;

function resolveGameCover(slug: string): string {
  return gameCoverPublicPath(join(ROOT, "public"), slug) || `/images/games/${slug}.svg`;
}

async function main() {
  const skipImages =
    process.env.SKIP_IMAGE_DOWNLOAD === "1" || process.env.NODE_ENV === "production";

  if (skipImages) {
    console.log("Skipping image download (production / SKIP_IMAGE_DOWNLOAD=1).");
  } else {
    console.log("Downloading game & category images...");
    await downloadAllImages(ROOT);
  }

  console.log("Clearing marketplace data...");
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.giftCard.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding", GAMES.length, "games...");
  const gameMap: Record<string, { id: string }> = {};
  for (const g of GAMES) {
    const coverImage = resolveGameCover(g.slug);
    const game = await prisma.game.upsert({
      where: { slug: g.slug },
      update: { tagline: g.tagline, bannerFrom: g.bannerFrom, bannerTo: g.bannerTo, emoji: g.emoji, coverImage },
      create: { ...g, coverImage },
    });
    gameMap[g.slug] = { id: game.id };
  }

  const adminPassword = process.env.ADMIN_PASSWORD?.trim() || "admin123456";
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.create({
    data: {
      username: "GameTradeAdmin",
      email: "admin@gametrade.com",
      passwordHash: adminHash,
      role: "ADMIN",
      bio: "Platform administrator",
      avatarHue: 30,
      verified: true,
    },
  });
  console.log(`Admin account: admin@gametrade.com (password from ADMIN_PASSWORD or default)`);

  console.log("Seeding gift cards...");
  const giftCards = [
    { code: "AMAZON-100-K7M2", balanceCents: 10000, label: "Amazon $100" },
    { code: "AMAZON-50-R4T9", balanceCents: 5000, label: "Amazon $50" },
    { code: "STEAM-50-G8P3", balanceCents: 5000, label: "Steam $50" },
    { code: "STEAM-20-N2W6", balanceCents: 2000, label: "Steam $20" },
    { code: "PLAYSTATION-50-B5H1", balanceCents: 5000, label: "PlayStation $50" },
    { code: "XBOX-25-D3J8", balanceCents: 2500, label: "Xbox $25" },
    { code: "NINTENDO-35-Q9L4", balanceCents: 3500, label: "Nintendo $35" },
    { code: "GOOGLE-25-F6V2", balanceCents: 2500, label: "Google Play $25" },
    { code: "APPLE-50-C8X7", balanceCents: 5000, label: "Apple $50" },
    { code: "ROBLOX-25-H2M9", balanceCents: 2500, label: "Roblox $25" },
  ];
  for (const g of giftCards) {
    await prisma.giftCard.create({
      data: {
        code: g.code,
        balanceCents: g.balanceCents,
        initialBalanceCents: g.balanceCents,
        label: g.label,
        expiresAt: new Date(Date.now() + 365 * 86400000),
      },
    });
  }

  console.log("Generating", TARGET_LISTINGS, "listings...");
  const catalog = generateCatalogListings(TARGET_LISTINGS);
  const rows: Prisma.ListingCreateManyInput[] = [];

  for (let i = 0; i < catalog.length; i++) {
    const c = catalog[i];
    const game = gameMap[c.gameSlug];
    const imagePath = resolveListingImage(c.gameSlug, c.category);

    rows.push({
      id: randomUUID(),
      title: c.title,
      description: c.description,
      category: c.category,
      gameId: game.id,
      sellerId: admin.id,
      priceCents: Math.round(c.price * 100),
      stock: c.stock,
      deliveryMins: c.deliveryMins,
      featured: c.featured,
      views: c.views,
      imagePath,
      createdAt: new Date(Date.now() - i * 1800000),
    });

    if ((i + 1) % 500 === 0) console.log(`  prepared ${i + 1}/${catalog.length}...`);
  }

  console.log("Inserting listings...");
  for (let i = 0; i < rows.length; i += BATCH) {
    await prisma.listing.createMany({ data: rows.slice(i, i + BATCH) });
  }

  console.log("Done —", rows.length, "listings, 1 admin account.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
