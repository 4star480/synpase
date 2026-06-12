"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { logout } from "@/lib/actions/auth";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";
import { Avatar } from "./Avatar";

const MENU_ID = "synpase-mobile-menu";

const NAV_LINKS = [
  { href: "/browse", label: "Marketplace" },
  { href: "/games", label: "All games" },
  { href: "/browse?category=ACCOUNT", label: "Accounts" },
  { href: "/browse?category=CURRENCY", label: "Currency" },
  { href: "/browse?category=ITEM", label: "Items" },
  { href: "/browse?category=BOOSTING", label: "Boosting" },
  { href: "/wishlist", label: "Wishlist" },
];

type MenuUser = { username: string; avatarHue: number };

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function closeMenu() {
  const input = document.getElementById(MENU_ID) as HTMLInputElement | null;
  if (!input?.checked) return;
  input.checked = false;
  unlockBodyScroll();
}

export function MobileMenu({ user }: { user: MenuUser | null }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const input = document.getElementById(MENU_ID) as HTMLInputElement | null;
    if (input?.checked) input.checked = false;
    unlockBodyScroll();
  }, [pathname]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || root.parentElement === document.body) return;
    document.body.appendChild(root);
  }, []);

  useEffect(() => {
    const input = document.getElementById(MENU_ID) as HTMLInputElement | null;
    if (!input) return;

    const syncScroll = () => {
      if (input.checked) lockBodyScroll();
      else unlockBodyScroll();
    };

    syncScroll();
    input.addEventListener("change", syncScroll);
    return () => {
      input.removeEventListener("change", syncScroll);
      unlockBodyScroll();
    };
  }, []);

  return (
    <div ref={rootRef} className="mobile-menu-root">
      <input
        type="checkbox"
        id={MENU_ID}
        className="mobile-menu-check"
        aria-hidden
        tabIndex={-1}
      />

      <label htmlFor={MENU_ID} className="mobile-menu-trigger" aria-label="Open menu">
        <span className="mobile-menu-icon mobile-menu-icon--open" aria-hidden>
          <MenuIcon open={false} />
        </span>
        <span className="mobile-menu-icon mobile-menu-icon--close" aria-hidden>
          <MenuIcon open />
        </span>
      </label>

      <div className="mobile-menu-overlay">
        <label htmlFor={MENU_ID} className="mobile-menu-backdrop" aria-label="Close menu" />

        <nav className="mobile-menu-panel" aria-label="Mobile navigation">
          <div className="flex items-center justify-between border-b border-border-dim px-4 py-4">
            <span className="font-bold">Menu</span>
            <label
              htmlFor={MENU_ID}
              className="touch-target grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-muted transition active:bg-surface-2"
              aria-label="Close menu"
            >
              <MenuIcon open />
            </label>
          </div>

          {user && (
            <Link
              href={`/seller/${user.username}`}
              onClick={closeMenu}
              className="flex items-center gap-3 border-b border-border-dim px-4 py-4 active:bg-surface-2"
            >
              <Avatar username={user.username} hue={user.avatarHue} size={40} />
              <span className="font-semibold">{user.username}</span>
            </Link>
          )}

          <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block rounded-xl px-3 py-3.5 text-base font-medium transition active:bg-surface-2"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/orders"
                onClick={closeMenu}
                className="block rounded-xl px-3 py-3.5 text-base font-medium transition active:bg-surface-2"
              >
                My orders
              </Link>
            )}
          </div>

          <div className="space-y-2 border-t border-border-dim p-4">
            <Link
              href={user ? "/sell" : "/login?redirect=/sell"}
              onClick={closeMenu}
              className="block rounded-xl bg-accent py-3.5 text-center font-semibold text-black transition active:scale-[0.98]"
            >
              Start selling
            </Link>
            {user ? (
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full rounded-xl border border-border-dim py-3.5 text-center font-semibold text-muted transition active:bg-surface-2"
                >
                  Log out
                </button>
              </form>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block rounded-xl border border-border-dim py-3.5 text-center font-semibold transition active:bg-surface-2"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="block rounded-xl border border-accent/40 py-3.5 text-center font-semibold text-accent transition active:bg-accent/10"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
