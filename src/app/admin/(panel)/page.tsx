import Link from "next/link";
import { adminDashboardStats } from "@/lib/admin-queries";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Admin dashboard" };

export default async function AdminDashboardPage() {
  const stats = await adminDashboardStats();

  const cards = [
    { label: "Total products", value: stats.listings.toLocaleString(), href: "/admin/listings" },
    { label: "Active listings", value: stats.activeListings.toLocaleString(), href: "/admin/listings" },
    { label: "Orders", value: stats.orders.toLocaleString(), href: "/admin/orders" },
    { label: "Payments", value: stats.payments.toLocaleString(), href: "/admin/payments" },
    { label: "Users", value: stats.users.toLocaleString(), href: "/admin/users" },
    { label: "Sellers", value: stats.sellers.toLocaleString(), href: "/admin/users" },
    { label: "Reviews", value: stats.reviews.toLocaleString(), href: "/admin/listings" },
    { label: "Paid volume", value: formatPrice(stats.revenueCents), href: "/admin/payments" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Overview of your marketplace</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          + Add product
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-border-dim bg-surface p-5 transition hover:border-accent/40 hover:bg-surface-2"
          >
            <p className="text-2xl font-extrabold text-accent">{c.value}</p>
            <p className="mt-1 text-sm text-muted">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border-dim bg-surface p-6">
        <h2 className="font-semibold">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/listings/new" className="rounded-lg border border-border-dim px-4 py-2 text-sm transition hover:border-accent">
            Create new product
          </Link>
          <Link href="/admin/listings" className="rounded-lg border border-border-dim px-4 py-2 text-sm transition hover:border-accent">
            Edit prices & images
          </Link>
          <Link href="/admin/orders" className="rounded-lg border border-border-dim px-4 py-2 text-sm transition hover:border-accent">
            View orders
          </Link>
          <Link href="/admin/payments" className="rounded-lg border border-border-dim px-4 py-2 text-sm transition hover:border-accent">
            View payments
          </Link>
          <Link href="/" className="rounded-lg border border-border-dim px-4 py-2 text-sm transition hover:border-accent">
            View live store
          </Link>
        </div>
      </div>
    </div>
  );
}
