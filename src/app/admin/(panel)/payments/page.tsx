import Link from "next/link";
import { adminPayments } from "@/lib/admin-queries";
import {
  formatPrice,
  maskCode,
  paymentMethodLabel,
  paymentRecordStatusLabel,
  paymentStatusLabel,
} from "@/lib/format";

export const metadata = { title: "Admin — Payments" };

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-success/15 text-success",
    AWAITING: "bg-amber-500/15 text-amber-400",
    PENDING: "bg-muted/20 text-muted",
    FAILED: "bg-rose-500/15 text-rose-400",
    EXPIRED: "bg-muted/20 text-muted",
  };
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${styles[status] ?? "bg-muted/20 text-muted"}`}
    >
      {paymentRecordStatusLabel(status)}
    </span>
  );
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const { rows, total, totalPages, completedCount, completedCents } = await adminPayments(page);

  return (
    <div>
      <h1 className="text-2xl font-bold">Payments</h1>
      <p className="mt-1 text-sm text-muted">
        {total.toLocaleString()} payment records · {completedCount.toLocaleString()} completed ·{" "}
        {formatPrice(completedCents)} collected
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border-dim">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border-dim bg-surface-2 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Details</th>
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
                <td className="max-w-[160px] truncate px-4 py-3">
                  <Link href={`/listing/${p.order.listing.id}`} className="hover:text-accent">
                    {p.order.listing.game.emoji} {p.order.listing.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{p.order.buyer.username}</p>
                  <p className="text-xs text-muted">{p.order.buyer.email}</p>
                </td>
                <td className="px-4 py-3">{paymentMethodLabel(p.method)}</td>
                <td className="px-4 py-3 font-semibold">{formatPrice(p.amountCents)}</td>
                <td className="px-4 py-3">{statusBadge(p.status)}</td>
                <td className="px-4 py-3 text-xs">
                  <p className="font-medium capitalize">{p.order.status.toLowerCase()}</p>
                  <p className="text-muted">{paymentStatusLabel(p.order.paymentStatus)}</p>
                </td>
                <td className="max-w-[200px] px-4 py-3 text-xs text-muted">
                  {p.method === "CRYPTO" && (
                    <>
                      {p.cryptoCurrency && <p>{p.cryptoCurrency}</p>}
                      {p.cryptoAmount && <p>{p.cryptoAmount}</p>}
                      {p.cryptoTxHash && (
                        <p className="truncate font-mono" title={p.cryptoTxHash}>
                          {p.cryptoTxHash.slice(0, 12)}…
                        </p>
                      )}
                      {p.expiresAt && p.status === "AWAITING" && (
                        <p>Expires {p.expiresAt.toLocaleString()}</p>
                      )}
                    </>
                  )}
                  {p.method === "GIFT_CARD" && (
                    <p>
                      {p.giftCard?.label || "Gift card"} · {maskCode(p.giftCardCode ?? p.giftCard?.code)}
                    </p>
                  )}
                  {p.failureReason && <p className="text-rose-400">{p.failureReason}</p>}
                  {!p.cryptoCurrency && !p.giftCardCode && !p.failureReason && "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">No payments yet.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/payments?page=${page - 1}`}
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
              href={`/admin/payments?page=${page + 1}`}
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
