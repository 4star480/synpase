import { GAMES, gameSlugLookup } from "./games-catalog";

const SLUG_MAP = gameSlugLookup();

const GAME_ALIASES: Record<string, string> = {};
for (const [alias, slug] of SLUG_MAP) {
  if (alias.length <= 6 || alias.includes(" ")) {
    const game = GAMES.find((g) => g.slug === slug);
    if (game) GAME_ALIASES[alias] = game.name.toLowerCase();
  }
}

const CATEGORY_KEYWORDS: Record<string, string> = {
  gold: "CURRENCY",
  gp: "CURRENCY",
  gil: "CURRENCY",
  coins: "CURRENCY",
  currency: "CURRENCY",
  robux: "CURRENCY",
  isk: "CURRENCY",
  silver: "CURRENCY",
  platinum: "CURRENCY",
  roubles: "CURRENCY",
  account: "ACCOUNT",
  accounts: "ACCOUNT",
  acc: "ACCOUNT",
  smurf: "ACCOUNT",
  main: "ACCOUNT",
  boost: "BOOSTING",
  boosting: "BOOSTING",
  carry: "BOOSTING",
  rank: "BOOSTING",
  leveling: "BOOSTING",
  item: "ITEM",
  items: "ITEM",
  skin: "ITEM",
  skins: "ITEM",
  gear: "ITEM",
  loot: "ITEM",
};

export type ParsedSearch = {
  terms: string[];
  categoryHint?: string;
  gameHint?: string;
};

export function parseSearchQuery(raw: string): ParsedSearch {
  const lower = raw.toLowerCase().trim();
  const tokens = lower.split(/\s+/).filter(Boolean);
  const terms: string[] = [];
  let categoryHint: string | undefined;
  let gameHint: string | undefined;

  for (const token of tokens) {
    if (CATEGORY_KEYWORDS[token]) {
      categoryHint = CATEGORY_KEYWORDS[token];
      continue;
    }
    if (GAME_ALIASES[token]) {
      gameHint = GAME_ALIASES[token];
      terms.push(GAME_ALIASES[token]);
      continue;
    }
    terms.push(token);
  }

  if (!gameHint) {
    for (const game of GAMES) {
      const gl = game.name.toLowerCase();
      if (lower.includes(gl) || gl.includes(lower)) {
        gameHint = gl;
        if (!terms.includes(gl)) terms.push(gl);
        break;
      }
    }
  }

  if (!gameHint) {
    for (const [alias, full] of Object.entries(GAME_ALIASES)) {
      if (lower.includes(alias)) {
        gameHint = full;
        if (!terms.includes(full)) terms.push(full);
        break;
      }
    }
  }

  if (terms.length === 0 && (categoryHint || gameHint)) {
    if (gameHint) terms.push(gameHint);
  }

  return { terms, categoryHint, gameHint };
}

export function resolveGameSlug(hint: string): string | undefined {
  const lower = hint.toLowerCase().trim();
  if (SLUG_MAP.has(lower)) return SLUG_MAP.get(lower);

  for (const game of GAMES) {
    const gl = game.name.toLowerCase();
    if (gl === lower || gl.includes(lower) || lower.includes(gl)) return game.slug;
    if (game.slug === lower || game.slug.includes(lower)) return game.slug;
  }

  return lower.replace(/\s+/g, "-");
}
