"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { BuyerOrderJson } from "@/lib/order-queries";
import { formatPrice, paymentMethodLabel, paymentStatusLabel } from "@/lib/format";
import { CategoryBadge } from "./CategoryBadge";
import { ListingImage } from "./ListingImage";

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

export function OrdersList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<BuyerOrderJson[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/orders", { cache: "no-store", credentials: "same-origin" });
      if (res.status === 401) {
        router.replace("/login?redirect=/orders");
        return;
      }
      if (!res.ok) throw new Error("Could not load orders");
      const data = (await res.json()) as { orders: BuyerOrderJson[] };
      setOrders(data.orders);
    } catch {
      setError("Could not load your orders. Please refresh the page.");
      setOrders([]);
    }
  }, [router]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders, searchParams]);

  if (orders === null) {
    return (
      <div className="mt-8 rounded-xl border border-border-dim bg-surface p-10 text-center text-sm text-muted">
        Loading your orders…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-xl border border-rose-500/30 bg-rose-500/10 p-8 text-center">
        <p className="text-sm text-rose-400">{error}</p>
        <button
          type="button"
          onClick={() => {
            setOrders(null);
            void loadOrders();
          }}
          className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black"
        >
          Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
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
    );
  }

  return (
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
            <Link href={`/listing/${order.listing.id}`} className="line-clamp-2 font-semibold hover:text-accent">
              {order.listing.title}
            </Link>
            <p className="mt-1 text-xs text-muted">
              {order.listing.game.name} · Sold by{" "}
              <Link href={`/seller/${order.listing.seller.username}`} className="text-accent hover:underline">
                {order.listing.seller.username}
              </Link>{" "}
              ·{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
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
  );
}
