import type { GameDef } from "./catalog-data";

export type ListingDraft = {
  title: string;
  description: string;
  price: number;
  stock: number;
  deliveryMins: number;
};

/** Realistic USD prices informed by PlayerAuctions & market trackers (Jun 2026). */
const GAME_CURRENCY: Record<string, ListingDraft[]> = {
  "old-school-runescape": [
    { title: "10M OSRS GP — Instant GE Trade", description: "Meet at Grand Exchange. Face-to-face trade, discreet method. Online now for fast delivery.", price: 2.89, stock: 300, deliveryMins: 15 },
    { title: "50M OSRS GP — Best Rate", description: "Bulk GP in stock. Grand Exchange delivery. Trusted seller with 1,200+ completed gold trades.", price: 12.49, stock: 150, deliveryMins: 15 },
    { title: "100M OSRS GP — EU & US Worlds", description: "100 million GP hand-farmed. Any F2P or members world. Message your RSN after checkout.", price: 24.99, stock: 80, deliveryMins: 30 },
    { title: "200M OSRS GP — Bulk Discount", description: "Best per-M rate for bulk buyers. GE trade, same-day delivery during EU/NA hours.", price: 47.50, stock: 40, deliveryMins: 60 },
    { title: "500M OSRS GP — Wholesale", description: "Wholesale GP for high-volume buyers. Split trades available for safety. Discord coordination.", price: 115.0, stock: 10, deliveryMins: 120 },
  ],
  "world-of-warcraft": [
    { title: "100,000 WoW Gold — Any NA Realm", description: "Midnight expansion gold. Mail or face-to-face trade. Tell us realm and faction after purchase.", price: 6.99, stock: 200, deliveryMins: 60 },
    { title: "500,000 WoW Gold — EU Realms", description: "Hand-farmed gold, no botted stock. Auction house or direct trade delivery.", price: 28.99, stock: 100, deliveryMins: 90 },
    { title: "1,000,000 WoW Gold — Fast Delivery", description: "1M gold package for gearing and consumables. Safe trade method, online 16h/day.", price: 52.0, stock: 50, deliveryMins: 120 },
  ],
  "path-of-exile": [
    { title: "50 Divine Orbs — Current League SC", description: "Softcore current league. Hideout trade. Stock refreshed hourly.", price: 18.75, stock: 80, deliveryMins: 20 },
    { title: "100 Chaos Orbs — Starter Pack", description: "Budget currency pack for mapping. Instant hideout invite after payment.", price: 4.99, stock: 200, deliveryMins: 15 },
    { title: "Mirror of Kalandra — Standard", description: "Verified mirror in stock. Standard league hideout trade. Escrow-safe delivery.", price: 89.0, stock: 2, deliveryMins: 60 },
  ],
  "path-of-exile-2": [
    { title: "20 Exalted Orbs — Early Access League", description: "Current PoE 2 league currency. Hideout trade within 30 minutes.", price: 14.99, stock: 60, deliveryMins: 30 },
    { title: "100 Exalted Orbs — Bulk Rate", description: "Bulk exalted pack for crafting. Trusted PoE 2 specialist.", price: 62.0, stock: 25, deliveryMins: 45 },
  ],
  fortnite: [
    { title: "5,000 V-Bucks — Gift Method", description: "V-Bucks via gift system. Add as friend 48h before delivery per Epic rules.", price: 32.99, stock: 40, deliveryMins: 2880 },
    { title: "13,500 V-Bucks — Battle Pass Ready", description: "Full battle pass amount. Safe gift method with step-by-step guide.", price: 79.99, stock: 20, deliveryMins: 2880 },
  ],
  valorant: [
    { title: "5,000 VP — Riot Direct Gift", description: "Valorant Points via gift. Region must match. Fast processing.", price: 44.99, stock: 30, deliveryMins: 240 },
  ],
  "genshin-impact": [
    { title: "3,280 Genesis Crystals — Welkin Bundle", description: "Crystals for wishes. Login method or gift card code — specify server.", price: 48.99, stock: 25, deliveryMins: 120 },
    { title: "6,480 Genesis Crystals — Large Pack", description: "Double pack value. Asia/EU/NA servers supported.", price: 89.99, stock: 15, deliveryMins: 180 },
  ],
  roblox: [
    { title: "4,500 Robux — Game Pass Method", description: "Robux via game pass purchase. No 14-day wait. Instructions sent immediately.", price: 49.99, stock: 20, deliveryMins: 60 },
    { title: "10,000 Robux — Premium Delivery", description: "Larger Robux package. Game pass or group payout — seller will advise safest method.", price: 99.0, stock: 8, deliveryMins: 1440 },
  ],
  "gta-v": [
    { title: "$50M GTA Online Cash — PC", description: "Safe cash drop in lobby. PC only. Clean stats option available.", price: 9.99, stock: 100, deliveryMins: 30 },
    { title: "$500M GTA Online Cash — PC Recovery", description: "Large cash package via trusted recovery method. 30-minute delivery window.", price: 39.99, stock: 50, deliveryMins: 45 },
  ],
  "league-of-legends": [
    { title: "10,000 RP — Gift Card Code", description: "Riot Points code for your region. Email delivery within 1 hour.", price: 69.99, stock: 30, deliveryMins: 60 },
  ],
  "final-fantasy-xiv": [
    { title: "10M FFXIV Gil — Any Data Center", description: "Hand-farmed gil. Face-to-face trade or market board. Specify world after checkout.", price: 8.99, stock: 120, deliveryMins: 60 },
    { title: "50M FFXIV Gil — Bulk Pack", description: "Bulk gil for crafting and housing. Safe trade on your home world.", price: 38.5, stock: 40, deliveryMins: 90 },
  ],
  "eve-online": [
    { title: "1B ISK — Jita 4-4 Contract", description: "ISK via secure contract. 30-minute delivery during peak hours.", price: 11.99, stock: 60, deliveryMins: 30 },
    { title: "5B ISK — Bulk Contract", description: "Bulk ISK for null-sec logistics. Verified stock.", price: 54.0, stock: 20, deliveryMins: 60 },
  ],
  "escape-from-tarkov": [
    { title: "5M Roubles — Flea Market Ready", description: "Roubles via raid trade or flea method. Specify edition and region.", price: 7.99, stock: 80, deliveryMins: 45 },
    { title: "25M Roubles — Bulk Pack", description: "Large roubles pack for hideout upgrades. Experienced Tarkov trader.", price: 34.99, stock: 30, deliveryMins: 60 },
  ],
  warframe: [
    { title: "1,000 Platinum — Gift Method", description: "Plat via in-game gift. MR2+ required on your account. Fast response.", price: 42.0, stock: 25, deliveryMins: 120 },
  ],
  "lost-ark": [
    { title: "100,000 Gold — Any Server", description: "Lost Ark gold via mail trade. Hand-farmed, no RMT flags.", price: 12.99, stock: 90, deliveryMins: 60 },
  ],
};

const GAME_ACCOUNTS: Record<string, ListingDraft[]> = {
  "old-school-runescape": [
    { title: "OSRS Pure Account — 75 Range / 1 Def", description: "Ranged pure with quest cape progress. Original email, no bans. Full transfer guide.", price: 89.0, stock: 1, deliveryMins: 480 },
    { title: "OSRS Main — 2000+ Total / Barrows Gloves", description: "Mid-game main with MM2 ready. Bank value 50M+. Email access included.", price: 175.0, stock: 1, deliveryMins: 720 },
    { title: "Maxed OSRS Account — 2277 Total Level", description: "All 99s, quest cape, 1B+ bank. Hand-played account with full documentation.", price: 1899.0, stock: 1, deliveryMins: 1440 },
  ],
  fortnite: [
    { title: "Fortnite OG Account — Black Knight + 80 Skins", description: "Season 2 OG skins including Black Knight. Full email access. 30-day warranty.", price: 425.0, stock: 1, deliveryMins: 360 },
    { title: "Fortnite Stacked Account — 150+ Skins", description: "150+ skins with multiple battle pass exclusives. Email change on delivery.", price: 189.0, stock: 1, deliveryMins: 240 },
    { title: "Fortnite Crew Legacy Account — 14 Exclusive Skins", description: "Crew skins no longer obtainable. Save the World founder access included.", price: 159.0, stock: 1, deliveryMins: 240 },
  ],
  valorant: [
    { title: "Valorant Immortal 2 Account — NA", description: "Immortal 2 with clean MMR. Several premium skins. Email access included.", price: 189.0, stock: 1, deliveryMins: 360 },
    { title: "Valorant Diamond Account — 20+ Skins", description: "Diamond rank, positive win rate. Ranked-ready with battle pass skins.", price: 79.0, stock: 2, deliveryMins: 240 },
    { title: "Valorant Smurf — Level 20 Unranked", description: "Fresh smurf for ranked grind. Clean history, instant delivery.", price: 24.99, stock: 5, deliveryMins: 120 },
  ],
  "league-of-legends": [
    { title: "LoL Smurf — Level 30 / 40k BE", description: "Unranked level 30 EUW. Ready for placements. Hand-leveled.", price: 22.99, stock: 8, deliveryMins: 60 },
    { title: "LoL Account — Diamond IV / 80 Champions", description: "Diamond account with champion pool. Honor level 3+. Email included.", price: 129.0, stock: 1, deliveryMins: 480 },
  ],
  "genshin-impact": [
    { title: "Genshin AR55 — 8 Five-Star Characters", description: "Asia server. Limited characters + signature weapons. 20k primogems saved.", price: 189.0, stock: 1, deliveryMins: 720 },
    { title: "Genshin AR55+ — 12 Five-Stars / 30k Primogems", description: "End-game account with multiple limited 5★. Full login transfer.", price: 520.0, stock: 1, deliveryMins: 720 },
  ],
  "world-of-warcraft": [
    { title: "WoW Level 80 — Mythic Raid Geared", description: "Current expansion geared alt. Original owner, no bans. 3 level 70+ alts.", price: 349.0, stock: 1, deliveryMins: 720 },
    { title: "WoW Fresh 80 — Ready for Dungeons", description: "Level 80 with basic gear. Good for jumping into current content.", price: 89.0, stock: 2, deliveryMins: 480 },
  ],
};

const GAME_BOOSTING: Record<string, ListingDraft[]> = {
  "old-school-runescape": [
    { title: "OSRS Fire Cape Service — Hand Played", description: "Fire cape on your account. Hand-played only. Stream available on request.", price: 24.99, stock: 20, deliveryMins: 1440 },
    { title: "OSRS Quest Cape — Full Quest Completion", description: "All quests completed on your account. Progress screenshots daily.", price: 299.0, stock: 5, deliveryMins: 10080 },
  ],
  "world-of-warcraft": [
    { title: "Mythic+15 Weekly — 8 Timed Keys", description: "Full vault completion with loot trading. Self-play or piloted.", price: 32.0, stock: 50, deliveryMins: 360 },
    { title: "Heroic Raid Full Clear — Current Tier", description: "Full heroic raid with loot priority. Schedule around your availability.", price: 89.0, stock: 15, deliveryMins: 2880 },
  ],
  valorant: [
    { title: "Valorant Rank Boost — Per Division", description: "Boost by Radiant player. Duo or solo. VPN protection standard.", price: 18.99, stock: 99, deliveryMins: 1440 },
    { title: "Valorant Duo — Radiant Queue (Per Win)", description: "Queue with Radiant-ranked player. Price per win. Offline mode available.", price: 8.5, stock: 99, deliveryMins: 120 },
  ],
  "league-of-legends": [
    { title: "LoL Duo Boost — Per Division to Diamond", description: "Challenger booster duos with you. Price per division gained.", price: 19.99, stock: 99, deliveryMins: 2880 },
    { title: "LoL Placement Matches — 10 Games", description: "High win-rate placements by Diamond+ player. Specify role preference.", price: 34.99, stock: 30, deliveryMins: 1440 },
  ],
};

const GENERIC_CURRENCY = (g: GameDef, v: number): ListingDraft[] => [
  { title: `${["100k", "500k", "1M"][v % 3]} ${g.name.split(" ")[0]} Currency — Fast Trade`, description: `In-game currency for ${g.name}. Safe trade method. Message server details after checkout.`, price: [5.99, 18.99, 42.0][v % 3], stock: 50 + v * 10, deliveryMins: 60 },
  { title: `Starter Currency Pack — ${g.name}`, description: `Starter amount for new players. Quick delivery, friendly communication.`, price: 3.49 + (v % 4) * 2, stock: 99, deliveryMins: 45 },
  { title: `Bulk Currency — ${g.name} (Best Rate)`, description: `Bulk pack at discounted rate. Trusted seller with verified stock.`, price: 22.99 + (v % 5) * 8, stock: 20, deliveryMins: 90 },
];

const GENERIC_ACCOUNT = (g: GameDef, v: number): ListingDraft[] => [
  { title: `${g.name} Starter Account`, description: `Starter account with progress. Original owner, email included. No bans.`, price: 29.99 + (v % 4) * 15, stock: 1, deliveryMins: 360 },
  { title: `${g.name} Mid-Game Account`, description: `Solid mid-game account ready for ranked or end-game content. Full transfer support.`, price: 79.0 + (v % 5) * 25, stock: 1, deliveryMins: 480 },
  { title: `${g.name} Stacked / Premium Account`, description: `Premium account with rare unlocks. Hand-played, full email access.`, price: 149.0 + (v % 6) * 50, stock: 1, deliveryMins: 720 },
];

const GENERIC_ITEM = (g: GameDef, v: number): ListingDraft[] => [
  { title: `Rare ${g.name.split(" ")[0]} Item — ${["Epic", "Legendary", "Limited"][v % 3]}`, description: `In-game item trade for ${g.name}. Verified stock, fast delivery.`, price: 6.99 + (v % 5) * 12, stock: 10 + v, deliveryMins: 30 },
  { title: `Item Bundle — ${g.name}`, description: `Value bundle for ${g.name} players. Multiple items at discount.`, price: 14.99 + (v % 4) * 8, stock: 15, deliveryMins: 45 },
];

const GENERIC_BOOSTING = (g: GameDef, v: number): ListingDraft[] => [
  { title: `${g.name} Rank Boost — Per Tier`, description: `Professional boost by high-rank players. Self-play or piloted options.`, price: 14.99 + (v % 5) * 12, stock: 99, deliveryMins: 2880 },
  { title: `${g.name} Power Leveling — 48h Service`, description: `Fast leveling on your account. Hand-played, no exploits.`, price: 24.99 + (v % 4) * 15, stock: 50, deliveryMins: 2880 },
];

function jitter(price: number, seed: number): number {
  const factor = 0.97 + ((seed * 7) % 7) * 0.01;
  return Math.round(price * factor * 100) / 100;
}

export function draftListing(game: GameDef, category: string, variant: number): ListingDraft {
  let pool: ListingDraft[];
  const v = variant % 8;

  if (category === "CURRENCY") {
    pool = GAME_CURRENCY[game.slug] ?? GENERIC_CURRENCY(game, v);
  } else if (category === "ACCOUNT") {
    pool = GAME_ACCOUNTS[game.slug] ?? GENERIC_ACCOUNT(game, v);
  } else if (category === "BOOSTING") {
    pool = GAME_BOOSTING[game.slug] ?? GENERIC_BOOSTING(game, v);
  } else {
    pool = GENERIC_ITEM(game, v);
  }

  const base = pool[variant % pool.length];
  return {
    ...base,
    price: jitter(base.price, variant + game.slug.length),
  };
}
