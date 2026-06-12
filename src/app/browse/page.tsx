import { Suspense } from "react";
import Link from "next/link";
import { searchListings, allGames, browseFilterGames, type BrowseFilters } from "@/lib/queries";
import { ListingCard } from "@/components/ListingCard";
import { SearchBar } from "@/components/SearchBar";
import { BrowseFilterBar } from "@/components/BrowseFilters";
import { SortSelect } from "@/components/SortSelect";
import { Pagination } from "@/components/Pagination";

export const metadata = { title: "Browse offers" };

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; game?: string; category?: string; sort?: string; page?: string }>;
}) {
  const params = await searchParams;
  const filters: BrowseFilters = {
    q: params.q?.trim() || undefined,
    game: params.game || undefined,
    category: params.category || undefined,
    sort: params.sort || undefined,
    page: params.page ? parseInt(params.page, 10) : 1,
  };

  const [{ listings, total, page, totalPages }, games, filterGames] = await Promise.all([
    searchListings(filters),
    allGames(),
    browseFilterGames(20),
  ]);

  const activeGame = games.find((g) => g.slug === filters.game);

  return (
    <div>
      {/* Browse hero */}
      <div className="border-b border-border-dim/60 bg-surface/50 py-5 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="text-sm text-muted">
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Marketplace</span>
            {activeGame && (
              <>
                <span className="mx-2">/</span>
                <span className="text-foreground">{activeGame.name}</span>
              </>
            )}
          </nav>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            {activeGame ? `${activeGame.name} offers` : "Browse marketplace"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {`${total.toLocaleString()} offer${total === 1 ? "" : "s"}`} available
            {filters.q ? ` for "${filters.q}"` : ""}
          </p>
          <div className="mt-5 max-w-xl lg:hidden">
            <SearchBar defaultValue={filters.q} glow />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Suspense fallback={null}>
          <BrowseFilterBar games={filterGames} totalGames={games.length} />
        </Suspense>

        <Suspense fallback={null}>
          <SortSelect defaultValue={filters.sort} />
        </Suspense>

        {listings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border-dim bg-surface p-12 text-center">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-lg font-semibold">No offers found</p>
            <p className="mt-1 text-sm text-muted">Try a different search or remove some filters.</p>
            <Link href="/games" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
              Browse all games →
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
            <Suspense fallback={null}>
              <Pagination page={page} totalPages={totalPages} total={total} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
