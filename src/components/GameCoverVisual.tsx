/** CSS game cover — emoji + gradient render reliably in all browsers */

export function GameCoverVisual({
  emoji,
  name,
  bannerFrom,
  bannerTo,
  className = "",
  showName = false,
}: {
  emoji: string;
  name?: string;
  bannerFrom: string;
  bannerTo: string;
  className?: string;
  showName?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${bannerFrom}, ${bannerTo})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
      <span className="absolute inset-0 flex items-center justify-center text-4xl drop-shadow-md sm:text-5xl">
        {emoji}
      </span>
      {showName && name && (
        <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1">
          <p className="truncate text-center text-[10px] font-bold text-white">{name}</p>
        </div>
      )}
    </div>
  );
}
