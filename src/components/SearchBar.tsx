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
  const [q, setQ] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SuggestResult[]>([]);
  const [loading, setLoading] = useState(false);
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
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search-suggest?q=${encodeURIComponent(q.trim())}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
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

  const showDropdown = focused && (q.trim().length >= 2 ? results.length > 0 || loading : true);

  const input = (
    <form onSubmit={submit} className="relative flex-1">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        placeholder="Find your games..."
        autoComplete="off"
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
    <div className="relative w-full">
      {glow || large ? (
        <div className="search-glow">
          <div className="search-glow-inner">{input}</div>
        </div>
      ) : (
        <div className="rounded-full border border-border-dim bg-surface">{input}</div>
      )}

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(20rem,50vh)] overflow-y-auto overscroll-contain rounded-2xl border border-border-dim bg-surface shadow-2xl animate-fade-in sm:max-h-80">
          {q.trim().length < 2 ? (
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
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-surface-2"
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
          ) : loading && results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">No matches — press Enter to search all</p>
          ) : (
            <div className="p-1">
              {results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    router.push(`/listing/${r.id}`);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-surface-2"
                >
                  <span className="min-w-0 truncate">
                    <span className="mr-1">{r.gameEmoji}</span>
                    <span className="font-medium">{r.title}</span>
                    <span className="ml-1 text-xs text-muted">· {r.gameName}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-accent">{formatPrice(r.priceCents)}</span>
                </button>
              ))}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  go(q);
                }}
                className="mt-1 w-full rounded-lg border-t border-border-dim px-3 py-2 text-center text-xs font-semibold text-accent hover:bg-surface-2"
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
