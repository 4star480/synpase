import { categoryLabel } from "@/lib/format";

const STYLES: Record<string, string> = {
  ACCOUNT: "bg-accent/15 text-accent",
  CURRENCY: "bg-warning/15 text-warning",
  ITEM: "bg-success/15 text-success",
  BOOSTING: "bg-rose-400/15 text-rose-400",
};

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STYLES[category] ?? "bg-surface-2 text-muted"}`}
    >
      {categoryLabel(category)}
    </span>
  );
}
