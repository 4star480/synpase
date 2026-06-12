import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { adminLogout } from "@/lib/actions/auth";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-background lg:pl-64">
      <AdminSidebar username={admin.username} />
      <div className="lg:hidden border-b border-border-dim bg-surface px-4 py-3 flex justify-between items-center">
        <span className="text-sm font-medium">{admin.username}</span>
        <form action={adminLogout}>
          <button type="submit" className="text-sm text-muted">Log out</button>
        </form>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
