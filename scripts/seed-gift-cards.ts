import { PrismaClient } from "@prisma/client";
import { SEED_GIFT_CARDS } from "../src/lib/payments/gift-card-brands";

const prisma = new PrismaClient();

const giftCards = SEED_GIFT_CARDS.map((card) => {
  const amount = Number(card.code.match(/-(\d{2,3})-/)?.[1] ?? "0");
  return {
    code: card.code,
    balanceCents: amount * 100,
    label: card.label,
  };
});

async function main() {
  for (const g of giftCards) {
    await prisma.giftCard.upsert({
      where: { code: g.code },
      update: {
        balanceCents: g.balanceCents,
        initialBalanceCents: g.balanceCents,
        active: true,
        label: g.label,
      },
      create: {
        code: g.code,
        balanceCents: g.balanceCents,
        initialBalanceCents: g.balanceCents,
        label: g.label,
        expiresAt: new Date(Date.now() + 365 * 86400000),
      },
    });
  }
  console.log(`Seeded ${giftCards.length} gift cards`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
