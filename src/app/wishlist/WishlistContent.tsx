"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ListingCard, type ListingCardData } from "@/components/ListingCard";

const KEY = "gametrade_wishlist";

function readIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function WishlistContent() {
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = readIds();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((r) => r.json())
      .then((data) => setListings(data.listings ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="mt-8 text-center text-muted">Loading saved offers…</p>;
  }

  if (listings.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-border-dim bg-surface p-12 text-center">
        <span className="text-5xl">♥</span>
        <p className="mt-4 text-lg font-semibold">Your wishlist is empty</p>
        <p className="mt-1 text-sm text-muted">Tap the heart on any listing to save it here.</p>
        <Link
          href="/browse"
          className="mt-6 inline-block rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          Browse offers
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
