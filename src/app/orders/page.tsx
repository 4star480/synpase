import Link from "next/link";
import { redirect } from "next/navigation";
import { getBuyerOrders, serializeBuyerOrder } from "@/lib/order-queries";
import { formatPrice, orderStatusLabel, paymentMethodLabel, paymentStatusLabel } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ListingImage } from "@/components/ListingImage";

export const metadata = { title: "My orders" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-warning/15 text-warning",
  DELIVERED: "bg-accent/15 text-accent",
  COMPLETED: "bg-success/15 text-success",
  DISPUTED: "bg-rose-400/15 text-rose-400",
  CANCELLED: "bg-muted/20 text-muted",
};

const PAY_STATUS_STYLES: Record<string, string> = {
  UNPAID: "bg-muted/20 text-muted",
  AWAITING: "bg-warning/15 text-warning",
  PAID: "bg-success/15 text-success",
  FAILED: "bg-rose-400/15 text-rose-400",
  REFUNDED: "bg-accent/15 text-accent",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ purchased?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/orders");

  const orders = await getBuyerOrders(user.id);
  const params = await searchParams;
  const justPurchased = params.purchased === "1";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">My orders</h1>
      <p className="mt-1 text-sm text-muted">
        {orders.length === 0
          ? "Purchases you complete at checkout appear here."
          : `${orders.length} order${orders.length === 1 ? "" : "s"} in your history`}
      </p>

      {justPurchased && orders.length > 0 && (
        <p className="mt-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
          Payment received — your order is below. Delivery status updates as the seller fulfills it.
        </p>
      )}

      {orders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border-dim bg-surface p-10 text-center">
          <span className="text-5xl">📦</span>
          <p className="mt-4 text-muted">You haven&apos;t bought anything yet.</p>
          <Link
            href="/browse"
            className="mt-4 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Browse offers
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => {
            const json = serializeBuyerOrder(order);
            return (
              <li
                key={json.id}
                className="flex flex-col gap-3 rounded-xl border border-border-dim bg-surface p-4 sm:flex-row sm:items-center"
              >
                <ListingImage
                  imagePath={json.listing.imagePath}
                  gameSlug={json.listing.game.slug}
                  bannerFrom={json.listing.game.bannerFrom}
                  bannerTo={json.listing.game.bannerTo}
                  title={json.listing.title}
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/listing/${json.listing.id}`} className="line-clamp-2 font-semibold hover:text-accent">
                    {json.listing.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    {json.listing.game.name} · Sold by{" "}
                    <Link href={`/seller/${json.listing.seller.username}`} className="text-accent hover:underline">
                      {json.listing.seller.username}
                    </Link>{" "}
                    ·{" "}
                    {new Date(json.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <CategoryBadge category={json.listing.category} />
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${PAY_STATUS_STYLES[json.paymentStatus] ?? ""}`}
                  >
                    {paymentStatusLabel(json.paymentStatus)}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[json.status] ?? ""}`}
                  >
                    {orderStatusLabel(json.status)}
                  </span>
                  <span className="text-xs text-muted">
                    {paymentMethodLabel(json.paymentMethod ?? json.payment?.method)}
                    {json.payment?.cryptoCurrency ? ` (${json.payment.cryptoCurrency})` : ""}
                  </span>
                  {json.paymentStatus === "AWAITING" && json.paymentMethod === "CRYPTO" && (
                    <Link
                      href={`/checkout/order/${json.id}/crypto`}
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      Complete payment →
                    </Link>
                  )}
                  <span className="font-bold">{formatPrice(json.priceCents)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
