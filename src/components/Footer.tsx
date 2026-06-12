import Link from "next/link";
import { SITE_NAME } from "@/lib/brand";
import { Logo } from "./Logo";

const POPULAR = [
  { label: "Buy OSRS Gold", href: "/browse?game=old-school-runescape&category=CURRENCY" },
  { label: "WoW Gold", href: "/browse?game=world-of-warcraft&category=CURRENCY" },
  { label: "WoW Classic Gold", href: "/browse?game=wow-classic&category=CURRENCY" },
  { label: "PoE 2 Currency", href: "/browse?game=path-of-exile-2&category=CURRENCY" },
  { label: "Fortnite Accounts", href: "/browse?game=fortnite&category=ACCOUNT" },
  { label: "Valorant Boosting", href: "/browse?game=valorant&category=BOOSTING" },
  { label: "Genshin Accounts", href: "/browse?game=genshin-impact&category=ACCOUNT" },
  { label: "BDO Silver", href: "/browse?game=black-desert-online&category=CURRENCY" },
];

const PAYMENTS = ["Bitcoin", "Ethereum", "USDT", "Litecoin", "Amazon", "Steam", "PlayStation", "Xbox", "Gift card"];

export function Footer() {
  return (
    <footer className="footer-glow mt-12 border-t border-border-dim/60 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] sm:mt-20 lg:pb-0 safe-bottom">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The player-to-player marketplace for game accounts, currency, items, and boosting.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground">Marketplace</p>
            <nav className="mt-4 flex flex-col gap-2.5 text-sm text-muted">
              <Link href="/browse" className="transition hover:text-accent">› Browse all</Link>
              <Link href="/games" className="transition hover:text-accent">› Game index</Link>
              <Link href="/browse?category=ACCOUNT" className="transition hover:text-accent">› Accounts</Link>
              <Link href="/browse?category=CURRENCY" className="transition hover:text-accent">› Currency</Link>
              <Link href="/browse?category=ITEM" className="transition hover:text-accent">› Items</Link>
              <Link href="/browse?category=BOOSTING" className="transition hover:text-accent">› Boosting</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground">Support</p>
            <nav className="mt-4 flex flex-col gap-2.5 text-sm text-muted">
              <Link href="/register" className="transition hover:text-accent">› Help center</Link>
              <Link href="/sell" className="transition hover:text-accent">› How to sell</Link>
              <Link href="/login" className="transition hover:text-accent">› How to buy</Link>
              <Link href="/wishlist" className="transition hover:text-accent">› Wishlist</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground">Get started</p>
            <nav className="mt-4 flex flex-col gap-2.5 text-sm text-muted">
              <Link href="/register" className="transition hover:text-accent">› Create account</Link>
              <Link href="/sell" className="transition hover:text-accent">› Start selling</Link>
              <Link href="/login" className="transition hover:text-accent">› Log in</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground">Payment methods</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PAYMENTS.map((p) => (
                <span key={p} className="rounded-md border border-border-dim bg-surface-2 px-2 py-1 text-[10px] font-semibold text-muted">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border-dim/60 pt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Popular markets</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {POPULAR.map((p) => (
              <Link key={p.label} href={p.href} className="text-sm text-muted transition hover:text-accent">
                {p.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border-dim/60 pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Independent marketplace — not affiliated with any game publisher.</p>
          <div className="flex gap-4">
            <span className="cursor-default hover:text-foreground">Privacy</span>
            <span className="cursor-default hover:text-foreground">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
