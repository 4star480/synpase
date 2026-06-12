/** Image URLs — verified Steam headers only; featured games use branded SVG covers */
export const GAME_IMAGE_URLS: Record<string, string> = {
  "gta-v": "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
  "call-of-duty": "https://cdn.akamai.steamstatic.com/steam/apps/1938090/header.jpg",
  "path-of-exile": "https://cdn.akamai.steamstatic.com/steam/apps/238960/header.jpg",
  "path-of-exile-2": "https://cdn.akamai.steamstatic.com/steam/apps/2694490/header.jpg",
  "diablo-4": "https://cdn.akamai.steamstatic.com/steam/apps/2344520/header.jpg",
  "final-fantasy-xiv": "https://cdn.akamai.steamstatic.com/steam/apps/39210/header.jpg",
  "escape-from-tarkov": "https://cdn.akamai.steamstatic.com/steam/apps/3932890/header.jpg",
  "rainbow-six-siege": "https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg",
  "apex-legends": "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg",
  "destiny-2": "https://cdn.akamai.steamstatic.com/steam/apps/1085660/header.jpg",
  "lost-ark": "https://cdn.akamai.steamstatic.com/steam/apps/1599340/header.jpg",
  warframe: "https://cdn.akamai.steamstatic.com/steam/apps/230410/header.jpg",
  "dota-2": "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg",
  cs2: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
  "albion-online": "https://cdn.akamai.steamstatic.com/steam/apps/761890/header.jpg",
  "new-world": "https://cdn.akamai.steamstatic.com/steam/apps/1063730/header.jpg",
  "rocket-league": "https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg",
  "eve-online": "https://cdn.akamai.steamstatic.com/steam/apps/8500/header.jpg",
  "black-desert-online": "https://cdn.akamai.steamstatic.com/steam/apps/582660/header.jpg",
  "pubg-battlegrounds": "https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg",
  "overwatch-2": "https://cdn.akamai.steamstatic.com/steam/apps/2357570/header.jpg",
};

export const CATEGORY_IMAGE_URLS: Record<string, string> = {
  CURRENCY:
    "https://images.unsplash.com/photo-1610375461246-83c859cb187f?w=640&h=400&fit=crop&q=80",
  ACCOUNT:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=400&fit=crop&q=80",
  ITEM:
    "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=640&h=400&fit=crop&q=80",
  BOOSTING:
    "https://images.unsplash.com/photo-1552820728-8b831bb8b973?w=640&h=400&fit=crop&q=80",
};

export function listingImagePath(gameSlug: string, category: string): string {
  return `/images/listings/${gameSlug}-${category.toLowerCase()}.jpg`;
}

export function gameCoverPath(slug: string): string {
  return `/images/games/${slug}.jpg`;
}
