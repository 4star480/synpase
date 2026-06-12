"use client";



import Link from "next/link";

import { formatPrice } from "@/lib/format";



export function BuyButton({

  listingId,

  loggedIn,

  price,

  compact = false,

}: {

  listingId: string;

  loggedIn: boolean;

  price: number;

  compact?: boolean;

}) {

  const href = loggedIn

    ? `/checkout/${listingId}`

    : `/login?redirect=${encodeURIComponent(`/checkout/${listingId}`)}`;



  return (

    <div>

      <Link

        href={href}

        className={`group flex w-full touch-manipulation items-center justify-center rounded-xl bg-buy font-bold uppercase tracking-wide text-black shadow-lg shadow-buy/30 transition hover:brightness-110 active:scale-[0.98] ${
          compact ? "min-h-[44px] py-3 text-sm" : "min-h-[48px] py-3.5 text-base"
        }`}

      >

        {compact ? <>Buy — {formatPrice(price)}</> : <>Buy now — {formatPrice(price)}</>}

      </Link>

      {!compact && (

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted">

          <span>🛡️</span> Crypto and gift cards accepted

        </p>

      )}

    </div>

  );

}


