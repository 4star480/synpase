"use client";

import Link from "next/link";

const TABS = [
  { id: "popular", label: "Popular", icon: "🔥", href: "/" },
  { id: "currency", label: "Currency", icon: "💰", href: "/browse?category=CURRENCY" },
  { id: "items", label: "Items", icon: "📦", href: "/browse?category=ITEM" },
  { id: "accounts", label: "Accounts", icon: "🛡️", href: "/browse?category=ACCOUNT" },
  { id: "boosting", label: "Boosting", icon: "💪", href: "/browse?category=BOOSTING" },
] as const;

export function CategoryTabs({ active = "popular" }: { active?: string }) {
  return (
    <nav className="scroll-touch scrollbar-hide -mx-4 flex items-center justify-center gap-0.5 px-4 sm:mx-0 sm:gap-2 sm:px-0">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`group flex shrink-0 flex-col items-center gap-1 px-3 py-2.5 transition active:scale-95 sm:gap-1.5 sm:px-6 ${
              isActive ? "text-accent" : "text-muted hover:text-foreground"
            }`}
          >
            <span className="text-xl sm:text-2xl transition group-hover:scale-110">{tab.icon}</span>
            <span
              className={`text-xs font-semibold uppercase tracking-wide sm:text-sm ${
                isActive ? "border-b-2 border-accent pb-0.5" : ""
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
