"use client";

import { useEffect, useState } from "react";

const KEY = "gametrade_wishlist";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function WishlistButton({ listingId, className = "" }: { listingId: string; className?: string }) {
  const [saved, setSaved] = useState(false);
  const [pop, setPop] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(read().includes(listingId));
    setReady(true);
  }, [listingId]);

  function toggle(e: React.MouseEvent | React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    const list = read();
    const next = list.includes(listingId) ? list.filter((id) => id !== listingId) : [...list, listingId];
    localStorage.setItem(KEY, JSON.stringify(next));
    setSaved(!saved);
    setPop(true);
    setTimeout(() => setPop(false), 300);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={ready ? saved : undefined}
      className={`grid h-10 w-10 place-items-center rounded-full bg-black/40 text-base backdrop-blur-sm transition active:scale-95 active:bg-black/60 sm:h-9 sm:w-9 ${pop ? "animate-pop" : ""} ${className}`}
    >
      {ready && saved ? "❤️" : "🤍"}
    </button>
  );
}
