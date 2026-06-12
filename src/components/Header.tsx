import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { logout } from "@/lib/actions/auth";
import { Avatar } from "./Avatar";
import { HeaderSearch } from "./HeaderSearch";
import { MobileSearch } from "./MobileSearch";
import { Logo } from "./Logo";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-border-dim/60 bg-background/95 safe-top">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:h-[68px] sm:gap-5 sm:px-6">
        <Logo />

        <HeaderSearch />

        <nav className="hidden items-center gap-5 text-xs font-semibold uppercase tracking-wide text-muted lg:flex">
          <Link href="/browse" className="transition hover:text-foreground">
            Marketplace
          </Link>
          <Link href="/games" className="transition hover:text-foreground">
            All games
          </Link>
          <Link href="/sell" className="transition hover:text-foreground">
            Sell
          </Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            href="/wishlist"
            className="hidden text-muted transition hover:text-accent md:block"
            title="Wishlist"
          >
            ♥
          </Link>
          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link href="/orders" className="text-xs font-semibold uppercase tracking-wide text-muted transition hover:text-foreground">
                Orders
              </Link>
              <Link href={`/seller/${user.username}`}>
                <Avatar username={user.username} hue={user.avatarHue} size={34} />
              </Link>
              <form action={logout}>
                <button className="text-xs font-semibold uppercase tracking-wide text-muted transition hover:text-foreground" type="submit">
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden items-center gap-4 sm:flex">
              <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-foreground transition hover:text-accent">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-accent/70 px-5 py-2 text-xs font-bold uppercase tracking-widest text-foreground transition hover:bg-accent hover:border-accent hover:text-black"
              >
                Sign up
              </Link>
            </div>
          )}
          <div className="mobile-menu-spacer" aria-hidden />
        </div>
      </div>
      <MobileSearch />
    </header>
  );
}
