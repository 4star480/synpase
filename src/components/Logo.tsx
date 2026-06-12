import Link from "next/link";
import { SITE_NAME, SITE_NAME_SHORT } from "@/lib/brand";
import { SynpaseLogoMark } from "./SynpaseLogoMark";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={SITE_NAME}>
      <SynpaseLogoMark
        size={compact ? 32 : 36}
        className="shrink-0 transition group-hover:drop-shadow-[0_0_10px_rgba(245,166,35,0.45)]"
      />
      {!compact && (
        <span className="flex flex-col leading-none max-[380px]:hidden sm:flex">
          <span className="text-[15px] font-extrabold tracking-tight text-foreground transition group-hover:text-accent">
            {SITE_NAME_SHORT}
          </span>
          <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            GameShop
          </span>
        </span>
      )}
    </Link>
  );
}
