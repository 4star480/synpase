/** Synpase brand mark */
export function SynpaseLogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="syn-ring" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5a623" />
          <stop offset="1" stopColor="#3b9eff" />
        </linearGradient>
        <linearGradient id="syn-pulse" x1="20" y1="16" x2="44" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5a623" />
          <stop offset="1" stopColor="#3b9eff" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#0f1420" stroke="url(#syn-ring)" strokeWidth="2" />
      <path
        d="M18 22c6-8 22-8 28 0"
        stroke="url(#syn-pulse)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M18 22c4 10 4 18 14 22"
        stroke="#3b9eff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M46 22c-4 10-4 18-14 22"
        stroke="#f5a623"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="18" cy="22" r="4" fill="#f5a623" />
      <circle cx="46" cy="22" r="4" fill="#3b9eff" />
      <circle cx="32" cy="44" r="5" fill="url(#syn-pulse)" />
      <path
        d="M27 30c2 4 8 4 10 0"
        stroke="#f4f6fb"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}
