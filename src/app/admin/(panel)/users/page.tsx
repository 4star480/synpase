import Link from "next/link";
import { adminUsers } from "@/lib/admin-queries";

export const metadata = { title: "Admin — Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const { rows, total, totalPages } = await adminUsers(page);

  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="mt-1 text-sm text-muted">{total.toLocaleString()} registered accounts</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border-dim">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border-dim bg-surface-2 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Listings</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-border-dim/50">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/seller/${u.username}`} className="hover:text-accent">
                    {u.username}
                  </Link>
                  {u.verified && <span className="ml-1 text-accent">✓</span>}
                </td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                      u.role === "ADMIN" ? "bg-accent/15 text-accent" : "bg-muted/15 text-muted"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">{u._count.listings}</td>
                <td className="px-4 py-3">{u._count.orders}</td>
                <td className="px-4 py-3 text-muted">
                  {u.memberSince.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {page > 1 && (
            <Link href={`/admin/users?page=${page - 1}`} className="rounded-lg border border-border-dim px-3 py-1.5 text-sm">
              ← Prev
            </Link>
          )}
          <span className="px-3 py-1.5 text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/users?page=${page + 1}`} className="rounded-lg border border-border-dim px-3 py-1.5 text-sm">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
