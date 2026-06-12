import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { formatPrice, paymentMethodLabel, paymentStatusLabel } from "@/lib/format";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ListingImage } from "@/components/ListingImage";

export const metadata = { title: "My orders" };
export const dynamic = "force-dynamic";

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

export default async function OrdersPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?redirect=/orders");

  const orders = await prisma.order.findMany({
    where: { buyerId: userId },
    include: {
      payment: { select: { method: true, cryptoCurrency: true, status: true } },
      listing: {
        select: {
          id: true,
          title: true,
          category: true,
          imagePath: true,
          game: { select: { name: true, emoji: true, slug: true, bannerFrom: true, bannerTo: true } },
          seller: { select: { username: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">My orders</h1>

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
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-col gap-3 rounded-xl border border-border-dim bg-surface p-4 sm:flex-row sm:items-center"
            >
              <ListingImage
                imagePath={order.listing.imagePath}
                gameSlug={order.listing.game.slug}
                bannerFrom={order.listing.game.bannerFrom}
                bannerTo={order.listing.game.bannerTo}
                title={order.listing.title}
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/listing/${order.listing.id}`}
                  className="line-clamp-2 font-semibold hover:text-accent"
                >
                  {order.listing.title}
                </Link>
                <p className="mt-1 text-xs text-muted">
                  {order.listing.game.name} · Sold by{" "}
                  <Link href={`/seller/${order.listing.seller.username}`} className="text-accent hover:underline">
                    {order.listing.seller.username}
                  </Link>{" "}
                  · {order.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <CategoryBadge category={order.listing.category} />
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${PAY_STATUS_STYLES[order.paymentStatus] ?? ""}`}
                >
                  {paymentStatusLabel(order.paymentStatus)}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[order.status] ?? ""}`}
                >
                  {order.status.toLowerCase()}
                </span>
                <span className="text-xs text-muted">
                  {paymentMethodLabel(order.paymentMethod ?? order.payment?.method)}
                  {order.payment?.cryptoCurrency ? ` (${order.payment.cryptoCurrency})` : ""}
                </span>
                {order.paymentStatus === "AWAITING" && order.paymentMethod === "CRYPTO" && (
                  <Link
                    href={`/checkout/order/${order.id}/crypto`}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Complete payment →
                  </Link>
                )}
                <span className="font-bold">{formatPrice(order.priceCents)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
