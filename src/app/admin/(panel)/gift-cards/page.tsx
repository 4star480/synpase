import Link from "next/link";
import { adminGiftCardPayments } from "@/lib/admin-queries";
import { formatPrice, paymentRecordStatusLabel } from "@/lib/format";

export const metadata = { title: "Admin — Gift card codes" };

export default async function AdminGiftCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const { rows, total, totalPages } = await adminGiftCardPayments(page);

  return (
    <div>
      <h1 className="text-2xl font-bold">Gift card codes</h1>
      <p className="mt-1 text-sm text-muted">
        Codes entered by buyers at checkout ({total.toLocaleString()} total)
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border-dim">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border-dim bg-surface-2 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-border-dim/50">
                <td className="px-4 py-3 text-muted">
                  {p.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <p className="text-[10px]">
                    {p.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{p.giftCardCode ?? "—"}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{p.order.buyer.username}</p>
                  <p className="text-xs text-muted">{p.order.buyer.email}</p>
                </td>
                <td className="max-w-[180px] truncate px-4 py-3">
                  <Link href={`/listing/${p.order.listing.id}`} className="hover:text-accent">
                    {p.order.listing.game.emoji} {p.order.listing.title}
                  </Link>
                </td>
                <td className="px-4 py-3 font-semibold">{formatPrice(p.amountCents)}</td>
                <td className="px-4 py-3 text-xs">{paymentRecordStatusLabel(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">
            No gift card payments yet. Codes appear here when buyers pay with a gift card at checkout.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/gift-cards?page=${page - 1}`}
              className="rounded-lg border border-border-dim px-3 py-1.5 text-sm"
            >
              ← Prev
            </Link>
          )}
          <span className="px-3 py-1.5 text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/gift-cards?page=${page + 1}`}
              className="rounded-lg border border-border-dim px-3 py-1.5 text-sm"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
