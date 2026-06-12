"use client";

import { useState } from "react";
import { gameCoverFallbackSrc } from "@/lib/images";

/** Game/listing cover — real artwork with SVG/gradient fallback (no emoji) */
export function CoverImage({
  src,
  alt,
  slug,
  name,
  bannerFrom = "#1a2236",
  bannerTo = "#12182a",
  className = "",
  showName = false,
}: {
  src: string;
  alt: string;
  slug?: string;
  name?: string;
  bannerFrom?: string;
  bannerTo?: string;
  className?: string;
  showName?: boolean;
}) {
  const [stage, setStage] = useState<"primary" | "svg" | "gradient">("primary");

  if (stage !== "gradient") {
    const currentSrc =
      stage === "primary" ? src : slug ? gameCoverFallbackSrc(slug) : src;

    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentSrc}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => {
            if (stage === "primary" && slug) setStage("svg");
            else setStage("gradient");
          }}
        />
        {showName && name && (
          <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1">
            <p className="truncate text-center text-[10px] font-bold text-white">{name}</p>
          </div>
        )}
      </div>
    );
  }

  const initials = (name ?? alt)
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${bannerFrom}, ${bannerTo})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white/90 sm:text-3xl">
        {initials}
      </span>
      {showName && name && (
        <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1">
          <p className="truncate text-center text-[10px] font-bold text-white">{name}</p>
        </div>
      )}
    </div>
  );
}
