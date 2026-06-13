import Link from "next/link";
import { adminDashboardStats } from "@/lib/admin-queries";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Admin dashboard" };

export default async function AdminDashboardPage() {
  const stats = await adminDashboardStats();

  const cards = [
    { label: "Products", value: stats.listings.toLocaleString(), href: "/admin/listings", hint: `${stats.activeListings.toLocaleString()} active` },
    { label: "Orders", value: stats.orders.toLocaleString(), href: "/admin/orders", hint: "All customer orders" },
    { label: "Payments", value: stats.payments.toLocaleString(), href: "/admin/payments", hint: formatPrice(stats.revenueCents) + " paid" },
    { label: "Users", value: stats.users.toLocaleString(), href: "/admin/users", hint: `${stats.sellers.toLocaleString()} sellers` },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Marketplace overview</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          Add product
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-border-dim bg-surface p-5 transition hover:border-accent/40"
          >
            <p className="text-2xl font-extrabold text-accent">{c.value}</p>
            <p className="mt-1 font-medium">{c.label}</p>
            <p className="mt-0.5 text-xs text-muted">{c.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border-dim bg-surface p-5">
        <h2 className="text-sm font-semibold">Shortcuts</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/listings" className="rounded-lg border border-border-dim px-3 py-1.5 text-sm hover:border-accent">
            Manage products
          </Link>
          <Link href="/admin/orders" className="rounded-lg border border-border-dim px-3 py-1.5 text-sm hover:border-accent">
            Fulfill orders
          </Link>
          <Link href="/" className="rounded-lg border border-border-dim px-3 py-1.5 text-sm hover:border-accent">
            View storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
