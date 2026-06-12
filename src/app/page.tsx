import Link from "next/link";
import { SITE_NAME } from "@/lib/brand";
import { featuredListings, featuredGames, marketplaceStats, recentPurchaseTicker, recentReviews } from "@/lib/queries";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { ListingCard } from "@/components/ListingCard";
import { LiveTicker } from "@/components/LiveTicker";
import { SearchBar } from "@/components/SearchBar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { GameCarousel } from "@/components/GameCarousel";
import { TrustSection } from "@/components/TrustSection";
import { GuidesSection } from "@/components/GuidesSection";

export default async function HomePage() {
  const [listings, games, stats, ticker, reviews] = await Promise.all([
    featuredListings(8),
    featuredGames(20),
    marketplaceStats(),
    recentPurchaseTicker(14),
    recentReviews(12),
  ]);

  return (
    <>
      <LiveTicker events={ticker} />

      {/* Space hero */}
      <section className="relative overflow-hidden pb-8 pt-6 sm:pb-14 sm:pt-12">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: "url(/images/hero/space.svg)" }}
        />
        <div className="pointer-events-none absolute inset-0 space-hero opacity-80" />
        <div className="pointer-events-none absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 rounded-full hero-swirl" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-lg font-extrabold uppercase leading-snug tracking-wide sm:text-3xl sm:leading-tight lg:text-[2.75rem] lg:leading-[1.15]">
            Stop grinding.{" "}
            <span className="bg-gradient-to-r from-amber-300 via-accent to-sky-400 bg-clip-text text-transparent">
              Start trading.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted sm:text-base">
            Rare loot, ranked accounts, and instant boosts across {`${stats.gameCount}+`} games — protected
            player-to-player deals with real sellers worldwide.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar large glow />
          </div>
        </div>

        {/* Find what you need */}
        <div className="relative z-10 mx-auto mt-12 max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-xl font-bold sm:text-2xl">Find what you need</h2>
          <div className="mt-6">
            <CategoryTabs active="popular" />
          </div>
          <div className="mt-8">
            <GameCarousel games={games} />
          </div>
          <p className="mt-4 text-center">
            <Link href="/games" className="text-sm font-semibold text-accent hover:underline">
              View all games →
            </Link>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hot listings */}
        <section className="mt-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🔥 Hot offers</h2>
              <p className="text-sm text-muted">
                {stats.activeListings.toLocaleString()} live offers · {`${stats.activeSellers}+`} sellers · {stats.avgRating}★ avg
              </p>
            </div>
            <Link href="/browse?sort=popular" className="text-sm font-semibold text-accent hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>

        <ReviewsCarousel reviews={reviews} avgRating={stats.avgRating} reviewCount={stats.reviewCount} />

        <TrustSection gameCount={stats.gameCount} />

        <GuidesSection />

        {/* CTA */}
        <section className="my-16 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/10 via-surface to-accent-2/10 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-extrabold uppercase tracking-wide">Ready to start selling?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            List your first offer in under 2 minutes. Join {`${stats.activeSellers}+`} sellers already trading on {SITE_NAME}.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/sell"
              className="rounded-full bg-accent px-8 py-3.5 text-center font-bold text-black transition hover:bg-accent-hover"
            >
              Start selling free
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-border-dim px-8 py-3.5 text-center font-semibold transition hover:border-accent hover:text-accent"
            >
              Create account
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
