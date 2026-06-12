import Image from "next/image";
import Link from "next/link";

const GUIDES = [
  { slug: "fortnite-accounts", game: "Fortnite", title: "Best Fortnite Accounts to Buy in 2026", date: "Jun 10, 2026", author: "Elijah" },
  { slug: "destiny-boosting", game: "Destiny 2", title: "How to Safely Buy Destiny 2 Boosting Services", date: "Jun 8, 2026", author: "Maya" },
  { slug: "tarkov-rubles", game: "Tarkov", title: "Escape From Tarkov Rubles: Price Guide", date: "Jun 5, 2026", author: "Kai" },
  { slug: "osrs-gold", game: "OSRS", title: "OSRS Gold Buying Guide for New Players", date: "Jun 3, 2026", author: "Sam" },
  { slug: "wow-gold", game: "WoW", title: "WoW Classic Gold: What to Know Before You Buy", date: "Jun 1, 2026", author: "Alex" },
];

export function GuidesSection() {
  return (
    <section className="relative mt-20 overflow-hidden py-4">
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-48 rounded-full bg-amber-500/10 blur-3xl" />

      <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Read our latest guides</h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {GUIDES.map((g) => (
          <article key={g.title} className="group overflow-hidden rounded-xl border border-border-dim/60 bg-surface transition hover:border-accent/30">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
              <Image
                src={`/images/guides/${g.slug}.svg`}
                alt={g.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 20vw"
                unoptimized
              />
            </div>
            <div className="p-3">
              <p className="text-[11px] text-muted">
                {g.date} by {g.author}
              </p>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug group-hover:text-accent">{g.title}</h3>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/browse"
          className="rounded-full border border-accent/50 px-8 py-3 text-sm font-semibold text-accent transition hover:bg-accent hover:text-black"
        >
          Browse all marketplace offers
        </Link>
      </div>
    </section>
  );
}
