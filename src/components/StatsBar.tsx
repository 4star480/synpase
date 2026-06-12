export function StatsBar({
  listings,
  sellers,
  reviewCount,
  avgRating,
}: {
  listings?: number;
  sellers?: number;
  reviewCount?: number;
  avgRating?: number;
}) {
  const STATS = [
    { value: listings ? listings.toLocaleString() : "3,200+", label: "Active offers" },
    { value: sellers ? sellers.toLocaleString() : "80+", label: "Active sellers" },
    { value: `${avgRating ?? 4.9}★`, label: reviewCount ? `${reviewCount.toLocaleString()} reviews` : "Average rating" },
    { value: "24/7", label: "Buyer protection" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-border-dim bg-surface px-4 py-4 text-center transition hover:border-accent/40 hover:bg-surface-2"
        >
          <p className="text-2xl font-extrabold text-accent">{s.value}</p>
          <p className="mt-0.5 text-xs text-muted">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
