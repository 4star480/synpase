/**
 * Idempotent production patch: create trader personas, set sales/member dates,
 * and reassign admin-owned listings to traders. Safe to run on every deploy.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SELLERS } from "./catalog-data";
import { memberSinceForUsername, salesCountForUsername } from "../src/lib/trader-stats";

const prisma = new PrismaClient();

async function main() {
  const placeholderHash = await bcrypt.hash("trader-placeholder-not-for-login", 10);
  const traderIds: string[] = [];

  for (const s of SELLERS) {
    const user = await prisma.user.upsert({
      where: { username: s.username },
      update: {
        memberSince: memberSinceForUsername(s.username),
        salesCount: salesCountForUsername(s.username),
        verified: true,
      },
      create: {
        username: s.username,
        email: s.email,
        passwordHash: placeholderHash,
        bio: `Trusted ${s.username} — fast delivery & secure trades.`,
        avatarHue: Math.abs(s.username.charCodeAt(0) * 17) % 360,
        verified: true,
        memberSince: memberSinceForUsername(s.username),
        salesCount: salesCountForUsername(s.username),
      },
      select: { id: true },
    });
    traderIds.push(user.id);
  }

  if (traderIds.length === 0) {
    console.log("No traders configured.");
    return;
  }

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  if (!admin) {
    console.log("No admin user — skipped listing reassignment.");
    return;
  }

  const adminListings = await prisma.listing.findMany({
    where: { sellerId: admin.id },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (adminListings.length === 0) {
    console.log(`Traders ready (${traderIds.length}). No admin listings to reassign.`);
    return;
  }

  const BATCH = 100;
  for (let i = 0; i < adminListings.length; i += BATCH) {
    const slice = adminListings.slice(i, i + BATCH);
    await prisma.$transaction(
      slice.map((listing, j) =>
        prisma.listing.update({
          where: { id: listing.id },
          data: { sellerId: traderIds[(i + j) % traderIds.length] },
        }),
      ),
    );
  }

  console.log(
    `Patched ${traderIds.length} traders; reassigned ${adminListings.length} listings off admin.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
