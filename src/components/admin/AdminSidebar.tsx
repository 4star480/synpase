"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME_SHORT } from "@/lib/brand";
import { SynpaseLogoMark } from "@/components/SynpaseLogoMark";
import { adminLogout } from "@/lib/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/listings", label: "Products", icon: "📦" },
  { href: "/admin/listings/new", label: "Add product", icon: "➕" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/gift-cards", label: "Gift cards", icon: "🎁" },
  { href: "/admin/users", label: "Users", icon: "👥" },
];

export function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-border-dim bg-surface lg:fixed lg:inset-y-0 lg:z-40 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-5 py-4 lg:py-6">
        <div className="flex items-center gap-2">
          <SynpaseLogoMark size={28} />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Admin</p>
            <p className="font-bold">{SITE_NAME_SHORT}</p>
          </div>
        </div>
        <Link href="/" className="text-xs text-muted hover:text-accent" title="View storefront">
          Store →
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-4 lg:pb-0">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition lg:py-3 ${
                active ? "bg-accent text-white shadow-md shadow-accent/20" : "text-muted hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-border-dim p-4 lg:mt-auto lg:block">
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
