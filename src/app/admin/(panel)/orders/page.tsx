import Link from "next/link";
import { adminOrders } from "@/lib/admin-queries";
import { formatPrice, paymentMethodLabel, paymentStatusLabel } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata = { title: "Admin — Orders" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const { rows, total, totalPages } = await adminOrders(page);

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>
      <p className="mt-1 text-sm text-muted">{total.toLocaleString()} orders total</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border-dim">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border-dim bg-surface-2 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-border-dim/50">
                <td className="max-w-[180px] truncate px-4 py-3">
                  <Link href={`/listing/${o.listing.id}`} className="hover:text-accent">
                    {o.listing.game.emoji} {o.listing.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{o.buyer.username}</p>
                  <p className="text-xs text-muted">{o.buyer.email}</p>
                </td>
                <td className="px-4 py-3 text-muted">{o.listing.seller.username}</td>
                <td className="px-4 py-3 font-semibold">{formatPrice(o.priceCents)}</td>
                <td className="px-4 py-3 text-xs">
                  <p>{paymentMethodLabel(o.paymentMethod ?? o.payment?.method)}</p>
                  <p className="text-muted">{paymentStatusLabel(o.paymentStatus)}</p>
                  {o.payment?.giftCardCode && (
                    <p className="mt-1 font-mono text-[10px] text-foreground">{o.payment.giftCardCode}</p>
                  )}
                  {o.payment?.cryptoCurrency && (
                    <p className="mt-1 text-muted">{o.payment.cryptoCurrency}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">
                  {o.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">
            No orders yet. Purchases appear here as soon as a buyer checks out.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {page > 1 && (
            <Link href={`/admin/orders?page=${page - 1}`} className="rounded-lg border border-border-dim px-3 py-1.5 text-sm">
              ← Prev
            </Link>
          )}
          <span className="px-3 py-1.5 text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/orders?page=${page + 1}`} className="rounded-lg border border-border-dim px-3 py-1.5 text-sm">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
