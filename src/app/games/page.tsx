import Link from "next/link";
import { SITE_NAME } from "@/lib/brand";
import { gameCoverSrc } from "@/lib/images";
import { allGames } from "@/lib/queries";
import { CoverImage } from "@/components/CoverImage";

export const metadata = { title: "Game Index" };

export default async function GamesIndexPage() {
  const games = await allGames();

  const byLetter = new Map<string, typeof games>();
  for (const g of games) {
    const letter = g.name[0]?.toUpperCase() ?? "#";
    const key = /[A-Z]/.test(letter) ? letter : "#";
    if (!byLetter.has(key)) byLetter.set(key, []);
    byLetter.get(key)!.push(g);
  }

  const letters = [...byLetter.keys()].sort((a, b) => {
    if (a === "#") return -1;
    if (b === "#") return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Game index</span>
      </nav>

      <h1 className="mt-4 text-3xl font-extrabold">Game index</h1>
      <p className="mt-2 text-muted">
        Browse {games.length} supported games — accounts, currency, items, and boosting services.
      </p>

      <div className="mt-6 border-b border-border-dim/40 pb-3 sm:mt-8 lg:sticky lg:top-[68px] lg:z-20 lg:bg-background/95 lg:py-3 lg:backdrop-blur-xl">
        <div className="flex flex-wrap gap-2 lg:scroll-touch lg:scrollbar-hide lg:flex-nowrap lg:overflow-x-auto lg:pb-1">
          {letters.map((l) => (
            <a
              key={l}
              href={`#letter-${l}`}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border-dim text-sm font-semibold text-muted transition active:scale-95 active:border-accent active:text-accent sm:h-9 sm:w-9 sm:rounded-lg"
            >
              {l}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-12">
        {letters.map((letter) => (
          <section key={letter} id={`letter-${letter}`}>
            <h2 className="mb-4 text-2xl font-extrabold text-accent">{letter}</h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {byLetter.get(letter)!.map((g) => (
                  <Link
                    key={g.id}
                    href={`/browse?game=${g.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-border-dim/60 bg-surface p-2.5 transition active:scale-[0.99] active:border-accent/40 sm:p-2 sm:hover:border-accent/40"
                  >
                    <CoverImage
                      src={gameCoverSrc(g.slug, g.coverImage)}
                      slug={g.slug}
                      alt={g.name}
                      bannerFrom={g.bannerFrom}
                      bannerTo={g.bannerTo}
                      className="h-12 w-16 shrink-0 rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold group-hover:text-accent">
                        {g.name}
                      </p>
                      <p className="text-xs text-muted">{g.listingCount} offers</p>
                    </div>
                  </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-2xl bg-gradient-to-r from-accent to-amber-500 p-10 text-center">
        <h2 className="text-2xl font-extrabold text-black">Start trading today</h2>
        <p className="mt-2 text-black/70">Join thousands of gamers buying and selling safely on {SITE_NAME}.</p>
        <Link
          href="/register"
          className="mt-6 inline-block rounded-full bg-black px-8 py-3 font-bold text-white transition hover:bg-black/80"
        >
          Register now
        </Link>
      </div>
    </div>
  );
}
