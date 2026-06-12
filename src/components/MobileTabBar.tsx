"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", icon: "⌂", match: (p: string) => p === "/" },
  { href: "/browse", label: "Browse", icon: "◎", match: (p: string) => p === "/browse" || p.startsWith("/browse?") },
  { href: "/games", label: "Games", icon: "▦", match: (p: string) => p === "/games" },
  { href: "/sell", label: "Sell", icon: "+", match: (p: string) => p === "/sell" },
  { href: "/wishlist", label: "Saved", icon: "♥", match: (p: string) => p === "/wishlist" },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-dim/60 bg-background/90 backdrop-blur-xl lg:hidden safe-bottom"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold transition-colors duration-200 active:scale-95 ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-xl text-base transition-all duration-200 ${
                  active ? "bg-accent/15 text-accent" : ""
                }`}
              >
                {tab.icon}
              </span>
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
