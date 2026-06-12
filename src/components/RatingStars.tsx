export function RatingStars({ rating, count }: { rating: number | null; count?: number }) {
  if (rating === null) {
    return <span className="text-xs text-muted">No reviews yet</span>;
  }
  const rounded = Math.round(rating);
  return (
    <span className="flex items-center gap-1 text-xs">
      <span className="text-warning" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
        {"★".repeat(rounded)}
        <span className="opacity-30">{"★".repeat(5 - rounded)}</span>
      </span>
      <span className="font-medium">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-muted">({count})</span>}
    </span>
  );
}
