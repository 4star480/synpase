import Link from "next/link";
import { adminListings } from "@/lib/admin-queries";
import { formatPrice } from "@/lib/format";
import { ListingImage } from "@/components/ListingImage";

export const metadata = { title: "Admin — Products" };

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const q = params.q ?? "";
  const { rows, total, totalPages } = await adminListings(page, q);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-muted">{total.toLocaleString()} listings in database</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          + Add product
        </Link>
      </div>

      <form className="mt-6" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by title, game, or seller..."
          className="w-full max-w-md rounded-lg border border-border-dim bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border-dim">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border-dim bg-surface-2 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Game</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id} className="border-b border-border-dim/50 hover:bg-surface-2/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ListingImage
                      imagePath={l.imagePath}
                      gameSlug={l.game.slug}
                      bannerFrom={l.game.bannerFrom}
                      bannerTo={l.game.bannerTo}
                      title={l.title}
                      className="h-10 w-14"
                    />
                    <span className="max-w-[160px] truncate font-medium">{l.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {l.game.emoji} {l.game.name}
                </td>
                <td className="px-4 py-3 text-muted">{l.seller.username}</td>
                <td className="px-4 py-3 font-semibold text-accent">{formatPrice(l.priceCents)}</td>
                <td className="px-4 py-3">{l.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                      l.status === "ACTIVE"
                        ? "bg-success/15 text-success"
                        : l.status === "PAUSED"
                          ? "bg-warning/15 text-warning"
                          : "bg-muted/15 text-muted"
                    }`}
                  >
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/listings/${l.id}/edit`} className="font-semibold text-accent hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/listings?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
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
              href={`/admin/listings?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
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
