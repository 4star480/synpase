"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function Pagination({
  page,
  totalPages,
  total,
}: {
  page: number;
  totalPages: number;
  total: number;
}) {
  const params = useSearchParams();

  function href(p: number) {
    const next = new URLSearchParams(params.toString());
    if (p > 1) next.set("page", String(p));
    else next.delete("page");
    const qs = next.toString();
    return `/browse${qs ? `?${qs}` : ""}`;
  }

  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-sm text-muted">
        Showing page {page} of {totalPages.toLocaleString()} ({total.toLocaleString()} offers)
      </p>
      <nav className="flex flex-wrap items-center justify-center gap-1">
        {page > 1 && (
          <Link
            href={href(page - 1)}
            className="rounded-lg border border-border-dim px-3 py-1.5 text-sm transition hover:border-accent"
          >
            ← Prev
          </Link>
        )}
        {start > 1 && (
          <>
            <Link href={href(1)} className="rounded-lg px-3 py-1.5 text-sm text-muted hover:text-accent">
              1
            </Link>
            {start > 2 && <span className="px-1 text-muted">…</span>}
          </>
        )}
        {pages.map((p) => (
          <Link
            key={p}
            href={href(p)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              p === page
                ? "bg-accent text-white shadow-md shadow-accent/25"
                : "text-muted hover:bg-surface-2 hover:text-foreground"
            }`}
          >
            {p}
          </Link>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-muted">…</span>}
            <Link
              href={href(totalPages)}
              className="rounded-lg px-3 py-1.5 text-sm text-muted hover:text-accent"
            >
              {totalPages}
            </Link>
          </>
        )}
        {page < totalPages && (
          <Link
            href={href(page + 1)}
            className="rounded-lg border border-border-dim px-3 py-1.5 text-sm transition hover:border-accent"
          >
            Next →
          </Link>
        )}
      </nav>
    </div>
  );
}
