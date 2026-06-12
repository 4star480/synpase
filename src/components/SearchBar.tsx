"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";

const TRENDING = [
  "WoW gold",
  "OSRS account",
  "Fortnite skins",
  "Valorant boost",
  "Genshin account",
  "PoE currency",
];

type SuggestResult = {
  id: string;
  title: string;
  category: string;
  priceCents: number;
  gameName: string;
  gameEmoji: string;
};

type GameSuggest = {
  name: string;
  slug: string;
  emoji: string;
};

export function SearchBar({
  defaultValue = "",
  large = false,
  glow = false,
}: {
  defaultValue?: string;
  large?: boolean;
  glow?: boolean;
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SuggestResult[]>([]);
  const [games, setGames] = useState<GameSuggest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setQ(defaultValue);
  }, [defaultValue]);

  const go = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      const params = new URLSearchParams();
      if (trimmed) params.set("q", trimmed);
      router.push(`/browse${params.toString() ? `?${params}` : ""}`);
      setFocused(false);
    },
    [router],
  );

  useEffect(() => {
    if (!focused || q.trim().length < 2) {
      setResults([]);
      setGames([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setSearched(false);
      try {
        const res = await fetch(`/api/search-suggest?q=${encodeURIComponent(q.trim())}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as { results?: SuggestResult[]; games?: GameSuggest[] };
        setResults(data.results ?? []);
        setGames(data.games ?? []);
      } catch {
        setResults([]);
        setGames([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q, focused]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    go(q);
  }

  function closeSoon() {
    window.setTimeout(() => {
      if (!rootRef.current?.contains(document.activeElement)) {
        setFocused(false);
      }
    }, 280);
  }

  const hasQuery = q.trim().length >= 2;
  const showDropdown = focused;
  const hasMatches = results.length > 0 || games.length > 0;

  const input = (
    <form onSubmit={submit} className="relative flex-1">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={closeSoon}
        placeholder="Find your games..."
        autoComplete="off"
        enterKeyHint="search"
        className={`w-full rounded-full border-0 bg-transparent pl-5 pr-12 text-base text-foreground outline-none placeholder:text-muted ${
          large ? "py-3.5 sm:py-4" : "py-3 sm:py-2.5"
        }`}
      />
      <button
        type="submit"
        className={`absolute right-1 top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-surface-2 text-muted transition active:scale-95 active:text-accent ${
          large ? "h-11 w-11 sm:h-10 sm:w-10" : "h-10 w-10 sm:h-8 sm:w-8"
        }`}
        aria-label="Search"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
      </button>
    </form>
  );

  return (
    <div ref={rootRef} className="relative z-30 w-full">
      {glow || large ? (
        <div className="search-glow">
          <div className="search-glow-inner">{input}</div>
        </div>
      ) : (
        <div className="rounded-full border border-border-dim bg-surface">{input}</div>
      )}

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain rounded-2xl border border-border-dim bg-surface shadow-2xl animate-fade-in sm:max-h-80">
          {!hasQuery ? (
            <div className="p-3">
              <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">Trending</p>
              {TRENDING.map((s) => (
                <button
                  key={s}
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    go(s);
                  }}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-surface-2 active:bg-surface-2"
                >
                  🔥 {s}
                </button>
              ))}
              <Link
                href="/games"
                className="mt-2 block rounded-lg px-3 py-2 text-center text-xs font-semibold text-accent hover:bg-surface-2"
                onPointerDown={(e) => e.preventDefault()}
              >
                View all games →
              </Link>
            </div>
          ) : loading && !searched ? (
            <p className="px-4 py-3 text-sm text-muted">Searching…</p>
          ) : !hasMatches ? (
            <div className="p-3">
              <p className="px-2 py-1 text-sm text-muted">No quick matches found.</p>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  go(q);
                }}
                className="mt-2 w-full rounded-lg bg-accent/15 px-3 py-2.5 text-sm font-semibold text-accent active:scale-[0.99]"
              >
                Search all listings for &ldquo;{q.trim()}&rdquo;
              </button>
            </div>
          ) : (
            <div className="p-1">
              {games.length > 0 && (
                <div className="mb-1 border-b border-border-dim/60 pb-1">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">Games</p>
                  {games.map((g) => (
                    <button
                      key={g.slug}
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        router.push(`/browse?game=${g.slug}`);
                        setFocused(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-surface-2 active:bg-surface-2"
                    >
                      <span>{g.emoji}</span>
                      <span className="font-medium">{g.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.length > 0 && (
                <>
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">Listings</p>
                  {results.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        router.push(`/listing/${r.id}`);
                        setFocused(false);
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-surface-2 active:bg-surface-2"
                    >
                      <span className="min-w-0 truncate">
                        <span className="mr-1">{r.gameEmoji}</span>
                        <span className="font-medium">{r.title}</span>
                        <span className="ml-1 text-xs text-muted">· {r.gameName}</span>
                      </span>
                      <span className="shrink-0 font-semibold text-accent">{formatPrice(r.priceCents)}</span>
                    </button>
                  ))}
                </>
              )}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  go(q);
                }}
                className="mt-1 w-full rounded-lg border-t border-border-dim px-3 py-2 text-center text-xs font-semibold text-accent hover:bg-surface-2 active:bg-surface-2"
              >
                View all results for &ldquo;{q.trim()}&rdquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
