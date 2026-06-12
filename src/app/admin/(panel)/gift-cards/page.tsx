import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { GiftCardForm } from "@/components/admin/GiftCardForm";
import { ToggleGiftCardButton } from "@/components/admin/ToggleGiftCardButton";

export const metadata = { title: "Admin — Gift cards" };

export default async function AdminGiftCardsPage() {
  const cards = await prisma.giftCard.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { _count: { select: { payments: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Gift cards</h1>
      <p className="mt-1 text-sm text-muted">
        Issue and manage gift cards redeemed by buyers at checkout.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <GiftCardForm />

        <div className="overflow-x-auto rounded-xl border border-border-dim">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-border-dim bg-surface-2 text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Uses</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id} className="border-b border-border-dim/50">
                  <td className="px-4 py-3 font-mono text-xs">{c.code}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">{formatPrice(c.balanceCents)}</span>
                    <span className="text-xs text-muted"> / {formatPrice(c.initialBalanceCents)}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{c._count.payments}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                        c.active ? "bg-success/15 text-success" : "bg-muted/20 text-muted"
                      }`}
                    >
                      {c.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ToggleGiftCardButton cardId={c.id} active={c.active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cards.length === 0 && (
            <p className="p-8 text-center text-sm text-muted">No gift cards yet. Issue one using the form.</p>
          )}
        </div>
      </div>
    </div>
  );
}
