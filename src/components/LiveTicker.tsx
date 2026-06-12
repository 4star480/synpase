"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import type { TickerEvent } from "@/lib/ticker";
import { TICKER_INTERVAL_MS } from "@/lib/ticker";

export type { TickerEvent };

export function LiveTicker({ events: initial }: { events: TickerEvent[] }) {
  const [events, setEvents] = useState(initial);
  const [bucket, setBucket] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/ticker", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { events: TickerEvent[]; bucket: string };
      setEvents(data.events);
      setBucket(data.bucket);
    } catch {
      /* keep current feed on network error */
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, TICKER_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  if (events.length === 0) return null;

  const doubled = [...events, ...events];

  return (
    <div
      className="overflow-hidden border-b border-border-dim/40 bg-[#0a0d14]/90 py-2"
      aria-live="polite"
      aria-label="Recent purchases"
      data-ticker-bucket={bucket ?? undefined}
    >
      <div className="flex animate-marquee items-center gap-6 whitespace-nowrap will-change-transform">
        {doubled.map((e, i) => (
          <Fragment key={`${e.user}-${e.item}-${i}`}>
            {i > 0 && (
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2/80" aria-hidden />
            )}
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span className="font-semibold text-accent">{e.user}</span>
              <span className="text-muted">bought</span>
              <span className="text-sm leading-none" aria-hidden>
                {e.icon}
              </span>
              <span className="font-medium text-foreground">{e.item}</span>
              <span className="text-foreground/80">{e.detail}</span>
              <span className="font-semibold text-buy">{e.price}</span>
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
