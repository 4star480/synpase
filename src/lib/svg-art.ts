import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
export function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function writeSvg(filePath: string, svg: string, force = false) {
  if (!force && existsSync(filePath)) return;
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, svg, "utf8");
}

export type GameArtInput = {
  name: string;
  slug: string;
  emoji: string;
  tagline: string;
  bannerFrom: string;
  bannerTo: string;
};

const CATEGORY_META: Record<string, { accent: string; label: string; icon: string }> = {
  currency: { accent: "#fbbf24", label: "In-Game Currency", icon: "💰" },
  account: { accent: "#a78bfa", label: "Game Accounts", icon: "🛡️" },
  item: { accent: "#34d399", label: "Items & Gear", icon: "📦" },
  boosting: { accent: "#f472b6", label: "Boosting Services", icon: "💪" },
};

function coverTitle(name: string): string {
  const t = name.length > 26 ? `${name.slice(0, 24)}…` : name;
  return escapeXml(t);
}

/** Game cover — branded gradient + emoji + readable game title */
export function gameCoverSvg(g: GameArtInput): string {
  const title = coverTitle(g.name);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${g.bannerFrom}"/>
      <stop offset="100%" stop-color="${g.bannerTo}"/>
    </linearGradient>
    <radialGradient id="glow" cx="75%" cy="25%" r="55%">
      <stop offset="0%" stop-color="white" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <rect width="640" height="360" fill="url(#glow)"/>
  <circle cx="560" cy="70" r="90" fill="#f5a623" opacity="0.12" filter="url(#blur)"/>
  <circle cx="80" cy="300" r="70" fill="white" opacity="0.06" filter="url(#blur)"/>
  <text x="320" y="155" text-anchor="middle" font-size="80">${g.emoji}</text>
  <rect x="32" y="248" width="576" height="72" rx="12" fill="black" fill-opacity="0.42"/>
  <text x="320" y="294" text-anchor="middle" font-size="24" fill="white" font-family="system-ui,sans-serif" font-weight="800">${title}</text>
</svg>`;
}

export function categoryCoverSvg(category: string): string {
  const key = category.toLowerCase();
  const meta = CATEGORY_META[key] ?? CATEGORY_META.item;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f1420"/>
      <stop offset="100%" stop-color="#1a2236"/>
    </linearGradient>
  </defs>
  <rect width="640" height="400" fill="url(#bg)"/>
  <circle cx="500" cy="100" r="120" fill="${meta.accent}" opacity="0.15"/>
  <circle cx="120" cy="320" r="80" fill="${meta.accent}" opacity="0.1"/>
  <text x="320" y="170" text-anchor="middle" font-size="80">${meta.icon}</text>
  <text x="320" y="240" text-anchor="middle" font-size="32" fill="white" font-family="system-ui,sans-serif" font-weight="800">${escapeXml(meta.label)}</text>
  <text x="320" y="280" text-anchor="middle" font-size="14" fill="white" font-family="system-ui,sans-serif" opacity="0.5">Synpase GameShop</text>
</svg>`;
}

export function guideCoverSvg(game: string, title: string, accentFrom: string, accentTo: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentFrom}"/>
      <stop offset="100%" stop-color="${accentTo}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  <rect x="0" y="200" width="400" height="100" fill="black" fill-opacity="0.45"/>
  <rect x="16" y="16" width="72" height="22" rx="6" fill="#ff5c5c"/>
  <text x="52" y="31" text-anchor="middle" font-size="11" fill="white" font-family="system-ui,sans-serif" font-weight="700">${escapeXml(game)}</text>
  <text x="20" y="255" font-size="14" fill="white" font-family="system-ui,sans-serif" font-weight="700">${escapeXml(title.length > 48 ? title.slice(0, 46) + "…" : title)}</text>
</svg>`;
}

export function heroSpaceSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="900" viewBox="0 0 1920 900" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="earth" cx="50%" cy="100%" r="65%">
      <stop offset="0%" stop-color="#1e6bb8"/>
      <stop offset="35%" stop-color="#0d3d6e"/>
      <stop offset="70%" stop-color="#06080f" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nebula" cx="50%" cy="15%" r="50%">
      <stop offset="0%" stop-color="#4c1d95" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#06080f" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="900" fill="#06080f"/>
  <rect width="1920" height="900" fill="url(#nebula)"/>
  <ellipse cx="960" cy="1050" rx="1100" ry="520" fill="url(#earth)"/>
  <circle cx="200" cy="120" r="1.5" fill="white" opacity="0.8"/>
  <circle cx="450" cy="80" r="1" fill="white" opacity="0.6"/>
  <circle cx="800" cy="150" r="1.2" fill="white" opacity="0.7"/>
  <circle cx="1200" cy="90" r="1" fill="white" opacity="0.5"/>
  <circle cx="1500" cy="130" r="1.5" fill="white" opacity="0.8"/>
  <circle cx="1700" cy="60" r="1" fill="white" opacity="0.6"/>
  <circle cx="300" cy="250" r="1" fill="white" opacity="0.4"/>
  <circle cx="1600" cy="220" r="1.2" fill="white" opacity="0.5"/>
</svg>`;
}

export function videoThumbSvg(title: string, variant: "buy" | "sell" | "brand"): string {
  const grad =
    variant === "brand"
      ? `<rect width="400" height="240" fill="#0f1420"/>`
      : `<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient></defs><rect width="400" height="240" fill="url(#g)"/>`;
  const label =
    variant === "brand"
      ? `<text x="200" y="130" text-anchor="middle" font-size="36" fill="#f5a623" font-family="system-ui,sans-serif" font-weight="900">GT</text>`
      : `<text x="200" y="110" text-anchor="middle" font-size="16" fill="white" font-family="system-ui,sans-serif" font-weight="800">${escapeXml(title)}</text>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
  ${grad}
  ${label}
  <circle cx="200" cy="175" r="28" fill="#ff0000" opacity="0.9"/>
  <polygon points="192,162 192,188 214,175" fill="white"/>
</svg>`;
}

export function writeGameCoverSvg(g: GameArtInput, filePath: string, force = false) {
  writeSvg(filePath, gameCoverSvg(g), force);
}

export function writeCategorySvg(category: string, filePath: string, force = false) {
  writeSvg(filePath, categoryCoverSvg(category), force);
}

export function writeGuideSvg(
  slug: string,
  game: string,
  title: string,
  from: string,
  to: string,
  publicRoot: string,
  force = false,
) {
  const file = join(publicRoot, "images", "guides", `${slug}.svg`);
  writeSvg(file, guideCoverSvg(game, title, from, to), force);
}

export function writeHeroSvg(publicRoot: string, force = false) {
  writeSvg(join(publicRoot, "images", "hero", "space.svg"), heroSpaceSvg(), force);
}

export function writeVideoThumbs(publicRoot: string, force = false) {
  const dir = join(publicRoot, "images", "site");
  writeSvg(join(dir, "video-buy.svg"), videoThumbSvg("HOW TO BUY IN 5 STEPS", "buy"), force);
  writeSvg(join(dir, "video-sell.svg"), videoThumbSvg("HOW TO SELL IN 5 STEPS", "sell"), force);
  writeSvg(join(dir, "video-brand.svg"), videoThumbSvg("", "brand"), force);
}

function brandLogoSvg(label: string, accent: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48">
  <rect width="160" height="48" rx="8" fill="#0f1420" stroke="${accent}" stroke-opacity="0.4"/>
  <text x="80" y="30" text-anchor="middle" font-size="11" font-family="system-ui,sans-serif" font-weight="700" fill="white" opacity="0.85">${escapeXml(label)}</text>
</svg>`;
}

function trustIconSvg(title: string, emoji: string, accent: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
  <rect width="80" height="80" rx="16" fill="#161d2e" stroke="${accent}" stroke-opacity="0.35"/>
  <text x="40" y="48" text-anchor="middle" font-size="32">${emoji}</text>
  <title>${escapeXml(title)}</title>
</svg>`;
}

function emptyStateSvg(title: string, subtitle: string, accent: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
  <rect width="320" height="240" rx="16" fill="#0f1420"/>
  <circle cx="160" cy="90" r="50" fill="${accent}" opacity="0.15"/>
  <circle cx="160" cy="90" r="30" fill="${accent}" opacity="0.25"/>
  <text x="160" y="155" text-anchor="middle" font-size="16" fill="white" font-family="system-ui,sans-serif" font-weight="700">${escapeXml(title)}</text>
  <text x="160" y="178" text-anchor="middle" font-size="12" fill="white" font-family="system-ui,sans-serif" opacity="0.55">${escapeXml(subtitle)}</text>
</svg>`;
}

function siteLogoSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="swirl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b9eff"/>
      <stop offset="33%" stop-color="#2ecc71"/>
      <stop offset="66%" stop-color="#f5c542"/>
      <stop offset="100%" stop-color="#ff5c5c"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="56" fill="url(#swirl)"/>
  <circle cx="60" cy="60" r="42" fill="#06080f"/>
  <circle cx="60" cy="60" r="22" fill="url(#swirl)"/>
</svg>`;
}

export function generateSiteAssets(publicRoot: string, force = false) {
  const site = join(publicRoot, "images", "site");
  const media = join(publicRoot, "images", "media");
  mkdirSync(site, { recursive: true });
  mkdirSync(media, { recursive: true });

  writeSvg(join(site, "logo.svg"), siteLogoSvg(), force);
  writeSvg(join(site, "empty-wishlist.svg"), emptyStateSvg("Wishlist empty", "Save offers with the heart button", "#f472b6"), force);
  writeSvg(join(site, "empty-orders.svg"), emptyStateSvg("No orders yet", "Browse the marketplace to get started", "#3b9eff"), force);
  writeSvg(join(site, "empty-search.svg"), emptyStateSvg("No results", "Try different keywords or filters", "#f5a623"), force);
  writeSvg(join(site, "not-found.svg"), emptyStateSvg("Page not found", "This offer may have sold out", "#ff5c5c"), force);

  writeSvg(join(site, "trust-tradeguard.svg"), trustIconSvg("TradeGuard", "🛡️", "#f5a623"), force);
  writeSvg(join(site, "trust-verified.svg"), trustIconSvg("Verified", "✅", "#2ecc71"), force);
  writeSvg(join(site, "trust-support.svg"), trustIconSvg("Support", "💬", "#3b9eff"), force);
  writeSvg(join(site, "trust-global.svg"), trustIconSvg("Global", "🌍", "#a78bfa"), force);

  const outlets: [string, string, string][] = [
    ["nyt", "NY TIMES", "#fff"],
    ["axios", "AXIOS", "#fff"],
    ["cnn", "CNN", "#cc0000"],
    ["cnbc", "CNBC", "#005594"],
    ["ign", "IGN", "#bf1313"],
    ["reviews-io", "REVIEWS.IO", "#00b67a"],
    ["google-reviews", "GOOGLE ★★★★★", "#fbbc04"],
  ];
  for (const [file, label, accent] of outlets) {
    writeSvg(join(media, `${file}.svg`), brandLogoSvg(label, accent), force);
  }
}

export function generateAllLocalImages(publicRoot: string, games: GameArtInput[], force = false) {
  const gamesDir = join(publicRoot, "images", "games");
  const categoriesDir = join(publicRoot, "images", "categories");
  mkdirSync(gamesDir, { recursive: true });
  mkdirSync(categoriesDir, { recursive: true });
  for (const g of games) {
    writeGameCoverSvg(g, join(gamesDir, `${g.slug}.svg`), force);
  }

  for (const cat of ["currency", "account", "item", "boosting"]) {
    writeCategorySvg(cat, join(categoriesDir, `${cat}.svg`), force);
  }

  writeHeroSvg(publicRoot, force);
  writeVideoThumbs(publicRoot, force);
  generateSiteAssets(publicRoot, force);

  writeSvg(join(publicRoot, "images", "site", "tab-popular.svg"), `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
  <rect width="640" height="400" fill="#1a2236"/>
  <text x="320" y="200" text-anchor="middle" font-size="80">🔥</text>
  <text x="320" y="280" text-anchor="middle" font-size="28" fill="white" font-family="system-ui,sans-serif" font-weight="800">Popular</text>
</svg>`, force);

  const guides: { slug: string; game: string; title: string; from: string; to: string }[] = [
    { slug: "fortnite-accounts", game: "Fortnite", title: "Best Fortnite Accounts to Buy", from: "#6d28d9", to: "#1e1b4b" },
    { slug: "destiny-boosting", game: "Destiny 2", title: "Destiny 2 Boosting Guide", from: "#1e40af", to: "#0f172a" },
    { slug: "tarkov-rubles", game: "Tarkov", title: "Tarkov Rubles Price Guide", from: "#b45309", to: "#451a03" },
    { slug: "osrs-gold", game: "OSRS", title: "OSRS Gold Buying Guide", from: "#15803d", to: "#14532d" },
    { slug: "wow-gold", game: "WoW", title: "WoW Classic Gold Guide", from: "#1e3a8a", to: "#0c1929" },
  ];
  for (const g of guides) writeGuideSvg(g.slug, g.game, g.title, g.from, g.to, publicRoot, force);
}

export function gameCoverPublicPath(publicRoot: string, slug: string): string {
  if (existsSync(join(publicRoot, "images", "games", `${slug}.jpg`))) {
    return `/images/games/${slug}.jpg`;
  }
  if (existsSync(join(publicRoot, "images", "games", `${slug}.svg`))) {
    return `/images/games/${slug}.svg`;
  }
  return `/images/games/${slug}.svg`;
}
