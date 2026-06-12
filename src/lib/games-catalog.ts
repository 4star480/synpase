export type GameDef = {
  name: string;
  slug: string;
  emoji: string;
  tagline: string;
  bannerFrom: string;
  bannerTo: string;
};

/** PlayerAuctions-style game index — alphabetical catalog */
export const GAME_NAMES: string[] = [
  "2Moons",
  "7DS: Grand Cross",
  "8 Ball Pool",
  "9Dragons",
  "Aion",
  "Aion Classic",
  "Albion Online",
  "Alice Fiction",
  "Alliance of Valiant Arms",
  "Animal Crossing: New Horizons",
  "Anno 1800",
  "Apex Legends",
  "Arknights",
  "ArcheAge",
  "ArcheAge Unchained",
  "Ark: Survival Evolved",
  "Art of War: Legions",
  "Asphalt 9: Legends",
  "Assetto Corsa",
  "Astellia Online",
  "Aura Kingdom",
  "Avakin Life",
  "Azur Lane",
  "Black Desert Online",
  "Battlefield 2042",
  "Battlefield V",
  "Binary Gods",
  "Blade & Soul",
  "Bless Unleashed",
  "Bloodline: Last Royal Vampire",
  "Blue Archive",
  "Boom Beach",
  "Brawl Stars",
  "Cabal Online",
  "Call of Duty",
  "Call of Duty: Mobile",
  "Call of Duty: Modern Warfare II",
  "Call of Duty: Warzone 2.0",
  "Candy Crush Saga",
  "Clash of Clans",
  "Clash Royale",
  "Closers",
  "Conquer Online",
  "Cookie Run: Kingdom",
  "CS2",
  "Critical Ops",
  "Crossfire",
  "Dark Age of Camelot",
  "Darkest Dungeon",
  "DayZ",
  "Dead by Daylight",
  "Destiny 2",
  "Diablo II: Resurrected",
  "Diablo 4",
  "Diablo Immortal",
  "Diablo III",
  "Digimon Masters Online",
  "Dislyte",
  "Disney Mirrorverse",
  "DOFUS",
  "DOFUS Touch",
  "Dota 2",
  "Dragon Ball Legends",
  "Dragon Ball Z Dokkan Battle",
  "Dragon Nest",
  "Dragon Raja",
  "Dungeon Fighter Online",
  "Echoes of Mana",
  "Elsword",
  "Elder Scrolls Online",
  "Empire: Four Kingdoms",
  "Enlisted",
  "Epic Seven",
  "Escape From Tarkov",
  "Eternal Return",
  "EVE Online",
  "EverQuest",
  "EverQuest II",
  "Fallout 76",
  "Family Island",
  "Fantasy Westward Journey",
  "FIFA 23",
  "FIFA Mobile",
  "Final Fantasy XI",
  "Final Fantasy XIV",
  "Fire Emblem Heroes",
  "Flyff Universe",
  "For Honor",
  "Fortnite",
  "Forza Horizon 5",
  "Free Fire",
  "Game of Thrones: Winter is Coming",
  "Genshin Impact",
  "Ghost Recon Breakpoint",
  "Gods Unchained",
  "Grand Chase",
  "Grand Theft Auto V",
  "Growtopia",
  "Guild Wars 2",
  "Gwent: The Witcher Card Game",
  "Halo Infinite",
  "Harry Potter: Magic Awakened",
  "Hay Day",
  "Hearthstone",
  "Heroes of the Storm",
  "Honkai: Star Rail",
  "Honkai Impact 3rd",
  "Hunt: Showdown",
  "Identity V",
  "Illuvium",
  "IMVU",
  "Iron Sight",
  "Jackal Squad",
  "Knight Online",
  "Knights of the Old Republic",
  "Last Day on Earth: Survival",
  "Last Shelter: Survival",
  "League of Legends",
  "League of Legends: Wild Rift",
  "Legend of Online",
  "Lineage 2",
  "Lineage 2M",
  "Lineage M",
  "Lineage W",
  "Lords Mobile",
  "Lost Ark",
  "Madden NFL 23",
  "Magic: The Gathering Arena",
  "MapleStory",
  "MapleStory M",
  "Marvel Contest of Champions",
  "Marvel Future Fight",
  "Marvel Snap",
  "Metin2",
  "Minecraft",
  "Mobile Legends: Adventure",
  "Mobile Legends: Bang Bang",
  "Monster Hunter: World",
  "Mortal Kombat Mobile",
  "MU Online",
  "My Singing Monsters",
  "NBA 2K23",
  "New World",
  "Ni no Kuni: Cross Worlds",
  "NieR Re[in]carnation",
  "Night Crows",
  "Nostale",
  "Old School RuneScape",
  "Overwatch 2",
  "Paladins",
  "Path of Exile",
  "Path of Exile 2",
  "Perfect World Mobile",
  "Phantasy Star Online 2: New Genesis",
  "Pixel Gun 3D",
  "Pokemon Go",
  "Pokemon Masters EX",
  "Pokemon UNITE",
  "Project Sekai Colorful Stage!",
  "PUBG: BATTLEGROUNDS",
  "PUBG Mobile",
  "Punishing: Gray Raven",
  "Ragnarok M: Eternal Love",
  "Ragnarok Online",
  "Ragnarok Origin",
  "Raid: Shadow Legends",
  "Rainbow Six Siege",
  "Rappelz",
  "Red Dead Redemption 2",
  "Rise of Kingdoms",
  "Roblox",
  "Rocket League",
  "Rogue Company",
  "RuneScape 3",
  "Rust",
  "Sea of Thieves",
  "Seven Deadly Sins: Grand Cross",
  "Shadowverse",
  "Shaiya",
  "Sky: Children of the Light",
  "Smite",
  "Solo Leveling: Arise",
  "SoulWorker",
  "Splatoon 3",
  "Star Citizen",
  "Star Trek Fleet Command",
  "Star Wars: Galaxy of Heroes",
  "State of Survival",
  "Street Fighter Duel",
  "Summoners War: Sky Arena",
  "Teamfight Tactics",
  "Tera",
  "Terraria",
  "The Division 2",
  "The Sims 4",
  "Throne and Liberty",
  "Tibia",
  "Tower of Fantasy",
  "Trove",
  "Undecember",
  "Valorant",
  "War Thunder",
  "Warframe",
  "Wizard101",
  "World of Tanks",
  "World of Warships",
  "World of Warcraft",
  "World of Warcraft Classic",
  "Yu-Gi-Oh! Master Duel",
  "Zenless Zone Zero",
];

const SLUG_OVERRIDES: Record<string, string> = {
  "Grand Theft Auto V": "gta-v",
  "Old School RuneScape": "old-school-runescape",
  "World of Warcraft": "world-of-warcraft",
  "World of Warcraft Classic": "wow-classic",
  "League of Legends": "league-of-legends",
  "Path of Exile": "path-of-exile",
  "Path of Exile 2": "path-of-exile-2",
  "Final Fantasy XIV": "final-fantasy-xiv",
  "Escape From Tarkov": "escape-from-tarkov",
  "Rainbow Six Siege": "rainbow-six-siege",
  "Call of Duty": "call-of-duty",
  "Clash of Clans": "clash-of-clans",
  "Clash Royale": "clash-royale",
  "Genshin Impact": "genshin-impact",
  "EVE Online": "eve-online",
  "Apex Legends": "apex-legends",
  "Albion Online": "albion-online",
  "Black Desert Online": "black-desert-online",
  "Pokemon Go": "pokemon-go",
  "Diablo 4": "diablo-4",
};

const EMOJI_POOL = ["🎮", "⚔️", "🏆", "💎", "🔥", "⭐", "🎯", "🛡️", "💰", "🚀", "🌟", "⚡", "🗡️", "👑", "🎲", "🪂", "💣", "🐉", "🌌", "⛏️"];

const PALETTE: [string, string][] = [
  ["#1e3a5f", "#0c1929"],
  ["#3d2914", "#1a1208"],
  ["#4c1d95", "#1e1b4b"],
  ["#991b1b", "#450a0a"],
  ["#0e7490", "#083344"],
  ["#6d28d9", "#2e1065"],
  ["#b91c1c", "#450a0a"],
  ["#166534", "#052e16"],
  ["#374151", "#111827"],
  ["#ca8a04", "#713f12"],
  ["#1e40af", "#172554"],
  ["#0369a1", "#0c4a6e"],
  ["#b45309", "#451a03"],
  ["#7f1d1d", "#1c1917"],
  ["#4f46e5", "#1e1b4b"],
  ["#3f3f46", "#18181b"],
  ["#1d4ed8", "#0f172a"],
  ["#dc2626", "#1e1b4b"],
  ["#1e293b", "#020617"],
  ["#0d9488", "#134e4a"],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function slugifyGame(name: string): string {
  if (SLUG_OVERRIDES[name]) return SLUG_OVERRIDES[name];
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const TAGLINES = [
  "Currency, accounts & items",
  "Gold, accounts & boosting",
  "In-game assets & services",
  "Accounts, currency & gear",
  "Items, currency & ranks",
];

/** Brand styling for the biggest live-service games (carousel + search) */
export const FAMOUS_GAME_OVERRIDES: Partial<
  Record<string, Pick<GameDef, "emoji" | "tagline" | "bannerFrom" | "bannerTo">>
> = {
  roblox: { emoji: "🧱", tagline: "Robux, accounts & rare items", bannerFrom: "#e2231a", bannerTo: "#1a1028" },
  minecraft: { emoji: "⛏️", tagline: "Accounts, realms & Minecoins", bannerFrom: "#5d8c3e", bannerTo: "#2d4a1e" },
  fortnite: { emoji: "💎", tagline: "V-Bucks, skins & accounts", bannerFrom: "#7c3aed", bannerTo: "#1e1040" },
  "league-of-legends": { emoji: "⚔️", tagline: "RP, accounts & boosting", bannerFrom: "#c89b3c", bannerTo: "#1a2744" },
  valorant: { emoji: "🎯", tagline: "VP, skins & rank boost", bannerFrom: "#ff4655", bannerTo: "#0f1923" },
  cs2: { emoji: "💣", tagline: "Skins, accounts & boosting", bannerFrom: "#de9b35", bannerTo: "#1b2838" },
  "genshin-impact": { emoji: "✨", tagline: "Primogems, accounts & resin", bannerFrom: "#4fc3f7", bannerTo: "#1a237e" },
  "gta-v": { emoji: "🚗", tagline: "Money, accounts & boosting", bannerFrom: "#2ecc71", bannerTo: "#1a3a2a" },
  "call-of-duty": { emoji: "🎖️", tagline: "CP, accounts & camos", bannerFrom: "#b8860b", bannerTo: "#1a1a1a" },
  "apex-legends": { emoji: "🪂", tagline: "Coins, accounts & rank boost", bannerFrom: "#da2929", bannerTo: "#1a1020" },
  "old-school-runescape": { emoji: "🪙", tagline: "Gold, accounts & power leveling", bannerFrom: "#c9a227", bannerTo: "#3d2b0a" },
  "world-of-warcraft": { emoji: "🛡️", tagline: "Gold, mounts & boosting", bannerFrom: "#1e4a8c", bannerTo: "#0a1628" },
  "honkai-star-rail": { emoji: "🌠", tagline: "Stellar Jade & accounts", bannerFrom: "#6366f1", bannerTo: "#1e1b4b" },
  "zenless-zone-zero": { emoji: "⚡", tagline: "Monochrome & Polychrome", bannerFrom: "#f59e0b", bannerTo: "#1c1917" },
  "pubg-battlegrounds": { emoji: "🎯", tagline: "G-Coin, skins & accounts", bannerFrom: "#f5a623", bannerTo: "#2a1810" },
  "dota-2": { emoji: "🗡️", tagline: "Items, MMR boost & coaching", bannerFrom: "#b8242a", bannerTo: "#1a1020" },
  "overwatch-2": { emoji: "🔫", tagline: "Coins, skins & rank boost", bannerFrom: "#f99e1a", bannerTo: "#2a2040" },
  "path-of-exile-2": { emoji: "💀", tagline: "Currency, items & builds", bannerFrom: "#8b2500", bannerTo: "#1a0a04" },
  "clash-of-clans": { emoji: "🏰", tagline: "Gems, accounts & boosting", bannerFrom: "#4ade80", bannerTo: "#14532d" },
  "brawl-stars": { emoji: "⭐", tagline: "Gems, accounts & Brawlpass", bannerFrom: "#facc15", bannerTo: "#7c2d12" },
  "escape-from-tarkov": { emoji: "💰", tagline: "Rubles, keys & carries", bannerFrom: "#78716c", bannerTo: "#1c1917" },
  "diablo-4": { emoji: "🔥", tagline: "Gold, items & power leveling", bannerFrom: "#991b1b", bannerTo: "#1a0505" },
  "final-fantasy-xiv": { emoji: "🌙", tagline: "Gil, accounts & boosting", bannerFrom: "#3b82f6", bannerTo: "#1e3a5f" },
  "black-desert-online": { emoji: "⚔️", tagline: "Silver, pearls & lifeskills", bannerFrom: "#1e40af", bannerTo: "#0f172a" },
  warframe: { emoji: "🚀", tagline: "Platinum & prime sets", bannerFrom: "#0ea5e9", bannerTo: "#0c4a6e" },
  "mobile-legends-bang-bang": { emoji: "📱", tagline: "Diamonds & rank boost", bannerFrom: "#3b82f6", bannerTo: "#1e3a8a" },
  "pubg-mobile": { emoji: "🔫", tagline: "UC, skins & accounts", bannerFrom: "#fbbf24", bannerTo: "#78350f" },
};

function buildGameDef(name: string): GameDef {
  const slug = slugifyGame(name);
  const h = hash(slug);
  const [bannerFrom, bannerTo] = PALETTE[h % PALETTE.length];
  const base: GameDef = {
    name,
    slug,
    emoji: EMOJI_POOL[h % EMOJI_POOL.length],
    tagline: TAGLINES[h % TAGLINES.length],
    bannerFrom,
    bannerTo,
  };
  const famous = FAMOUS_GAME_OVERRIDES[slug];
  return famous ? { ...base, ...famous } : base;
}

function dedupeGames(names: string[]): GameDef[] {
  const seen = new Set<string>();
  const games: GameDef[] = [];
  for (const name of names) {
    const slug = slugifyGame(name);
    if (seen.has(slug)) continue;
    seen.add(slug);
    games.push(buildGameDef(name));
  }
  return games.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
}

export const GAMES: GameDef[] = dedupeGames(GAME_NAMES);

/** Featured on homepage carousel & browse quick-filter — current top live-service titles */
export const POPULAR_GAME_SLUGS = [
  "roblox",
  "minecraft",
  "fortnite",
  "league-of-legends",
  "valorant",
  "cs2",
  "genshin-impact",
  "gta-v",
  "call-of-duty",
  "apex-legends",
  "old-school-runescape",
  "world-of-warcraft",
  "honkai-star-rail",
  "zenless-zone-zero",
  "pubg-battlegrounds",
  "dota-2",
  "overwatch-2",
  "path-of-exile-2",
  "clash-of-clans",
  "brawl-stars",
] as const;

export function popularGames(all = GAMES): GameDef[] {
  const bySlug = new Map(all.map((g) => [g.slug, g]));
  const picked = POPULAR_GAME_SLUGS.map((s) => bySlug.get(s)).filter(Boolean) as GameDef[];
  const popular = new Set<string>(POPULAR_GAME_SLUGS);
  const rest = all.filter((g) => !popular.has(g.slug));
  return [...picked, ...rest];
}

/** Lowercase name → slug for search */
export function gameSlugLookup(): Map<string, string> {
  const map = new Map<string, string>();
  for (const g of GAMES) {
    map.set(g.name.toLowerCase(), g.slug);
    map.set(g.slug, g.slug);
  }
  map.set("bdo", "black-desert-online");
  map.set("black desert", "black-desert-online");
  map.set("wow", "world-of-warcraft");
  map.set("wow classic", "wow-classic");
  map.set("osrs", "old-school-runescape");
  map.set("rs3", "runescape-3");
  map.set("runescape", "old-school-runescape");
  map.set("lol", "league-of-legends");
  map.set("wild rift", "league-of-legends-wild-rift");
  map.set("poe", "path-of-exile");
  map.set("poe2", "path-of-exile-2");
  map.set("d4", "diablo-4");
  map.set("ffxiv", "final-fantasy-xiv");
  map.set("ff14", "final-fantasy-xiv");
  map.set("cod", "call-of-duty");
  map.set("gta", "gta-v");
  map.set("gta5", "gta-v");
  map.set("val", "valorant");
  map.set("fn", "fortnite");
  map.set("genshin", "genshin-impact");
  map.set("mc", "minecraft");
  map.set("csgo", "cs2");
  map.set("cs", "cs2");
  map.set("dota", "dota-2");
  map.set("apex", "apex-legends");
  map.set("tarkov", "escape-from-tarkov");
  map.set("eft", "escape-from-tarkov");
  map.set("r6", "rainbow-six-siege");
  map.set("siege", "rainbow-six-siege");
  map.set("eve", "eve-online");
  map.set("coc", "clash-of-clans");
  map.set("cr", "clash-royale");
  map.set("lost ark", "lost-ark");
  map.set("destiny", "destiny-2");
  map.set("pubg", "pubg-battlegrounds");
  map.set("eso", "elder-scrolls-online");
  map.set("ffxi", "final-fantasy-xi");
  map.set("gw2", "guild-wars-2");
  map.set("hsr", "honkai-star-rail");
  map.set("zzz", "zenless-zone-zero");
  return map;
}
