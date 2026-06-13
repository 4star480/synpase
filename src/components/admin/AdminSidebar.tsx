"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME_SHORT } from "@/lib/brand";
import { SynpaseLogoMark } from "@/components/SynpaseLogoMark";
import { adminLogout } from "@/lib/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/listings", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/users", label: "Users" },
];

export function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-border-dim bg-surface lg:fixed lg:inset-y-0 lg:z-40 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-5 py-4 lg:py-5">
        <div className="flex items-center gap-2.5">
          <SynpaseLogoMark size={26} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Admin</p>
            <p className="text-sm font-bold">{SITE_NAME_SHORT}</p>
          </div>
        </div>
        <Link href="/" className="text-xs text-muted transition hover:text-accent">
          Store
        </Link>
      </div>

      <nav className="grid gap-0.5 px-3 pb-4 lg:px-3">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : link.href === "/admin/listings"
                ? pathname === "/admin/listings" ||
                  (pathname.startsWith("/admin/listings/") && pathname !== "/admin/listings/new")
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-accent text-white"
                  : "text-muted hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-dim px-5 py-4">
        <p className="truncate text-sm font-medium">{username}</p>
        <form action={adminLogout} className="mt-2">
          <button type="submit" className="text-sm text-muted transition hover:text-rose-400">
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
