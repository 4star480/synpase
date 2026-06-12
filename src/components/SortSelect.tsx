"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("sort", value);
    else next.delete("sort");
    router.push(`/browse?${next}`);
  }

  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <label className="text-sm text-muted">Sort by</label>
      <select
        defaultValue={defaultValue ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border-dim bg-surface px-3 py-2.5 text-base outline-none focus:border-accent sm:w-auto sm:py-1.5 sm:text-sm"
      >
        <option value="">Newest</option>
        <option value="popular">Most popular</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
    </div>
  );
}
