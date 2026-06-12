import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_EMAIL = "admin@gametrade.com";

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!admin) {
    throw new Error(`Admin account not found (${ADMIN_EMAIL}). Run db:seed first.`);
  }

  console.log("Removing orders, payments, and reviews...");
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();

  console.log("Reassigning listings to admin...");
  await prisma.listing.updateMany({
    data: { sellerId: admin.id },
  });

  const removed = await prisma.user.deleteMany({
    where: { id: { not: admin.id } },
  });

  console.log(`Deleted ${removed.count} user account(s). Only admin remains.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
