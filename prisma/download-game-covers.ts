import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { GAMES } from "./catalog-data";
import {
  EXTERNAL_COVER_URLS,
  NO_STEAM_SEARCH,
  STEAM_APP_IDS,
  STEAM_SEARCH_TERMS,
  WIKIPEDIA_TITLES,
  steamHeader,
} from "./game-cover-urls";

const MIN_BYTES = 2500;
const DELAY_MS = 120;
const UA = "SynapseGameShop/1.0 (cover downloader; contact: local)";

/** Reject known wrong Steam headers for specific slugs */
const STEAM_APP_REJECT: Record<string, number[]> = {
  fortnite: [236390], // War Thunder
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("image") && !ct.includes("octet-stream")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < MIN_BYTES) return null;
    return buf;
  } catch {
    return null;
  }
}

async function saveImage(dest: string, buf: Buffer) {
  writeFileSync(dest, buf);
}

async function steamSearchAppId(term: string): Promise<number | null> {
  try {
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&cc=US&l=en`;
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { items?: { id: number; type?: string }[] };
    const items = data.items ?? [];
    const game = items.find((i) => i.type === "app" || !i.type) ?? items[0];
    return game?.id ?? null;
  } catch {
    return null;
  }
}

function upscaleWikiUrl(url: string): string {
  return url.replace(/\/(\d+)px-/, "/800px-");
}

async function wikipediaImage(slug: string): Promise<string | null> {
  const title = WIKIPEDIA_TITLES[slug];
  if (!title) return null;
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      originalimage?: { source?: string };
      thumbnail?: { source?: string };
    };
    const raw = data.originalimage?.source ?? data.thumbnail?.source ?? null;
    return raw ? upscaleWikiUrl(raw) : null;
  } catch {
    return null;
  }
}

/** Text-only fallback cover (no emoji) */
function writeFallbackCover(dest: string, name: string, from: string, to: string) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const safe = name.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="215" viewBox="0 0 460 215">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
  </linearGradient></defs>
  <rect width="460" height="215" fill="url(#g)"/>
  <text x="230" y="100" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="42" font-weight="700" opacity="0.9">${initials}</text>
  <text x="230" y="175" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="14" font-weight="600" opacity="0.75">${safe}</text>
</svg>`;
  writeFileSync(dest.replace(/\.jpg$/, ".svg"), svg);
}

async function coverCandidates(
  slug: string,
  name: string
): Promise<{ url: string; source: string }[]> {
  const out: { url: string; source: string }[] = [];

  if (EXTERNAL_COVER_URLS[slug]) {
    out.push({ url: EXTERNAL_COVER_URLS[slug], source: "rawg" });
  }
  if (STEAM_APP_IDS[slug]) {
    const appId = STEAM_APP_IDS[slug];
    if (!STEAM_APP_REJECT[slug]?.includes(appId)) {
      out.push({ url: steamHeader(appId), source: "steam-id" });
    }
  }

  const wiki = await wikipediaImage(slug);
  if (wiki) out.push({ url: wiki, source: "wikipedia" });

  if (!NO_STEAM_SEARCH.has(slug)) {
    const term = STEAM_SEARCH_TERMS[slug] ?? name;
    await sleep(DELAY_MS);
    const appId = await steamSearchAppId(term);
    if (appId && !STEAM_APP_REJECT[slug]?.includes(appId)) {
      out.push({ url: steamHeader(appId), source: `steam-search:${appId}` });
    }
  }

  return out;
}

export async function downloadAllGameCovers(root: string) {
  const gamesDir = join(root, "public", "images", "games");
  mkdirSync(gamesDir, { recursive: true });

  let jpg = 0;
  let fallback = 0;
  const failed: string[] = [];

  for (const game of GAMES) {
    const dest = join(gamesDir, `${game.slug}.jpg`);
    const candidates = await coverCandidates(game.slug, game.name);
    let saved = false;

    for (const candidate of candidates) {
      const buf = await fetchBuffer(candidate.url);
      if (buf) {
        await saveImage(dest, buf);
        jpg++;
        console.log(`✓ ${game.slug} (${candidate.source})`);
        saved = true;
        break;
      }
      failed.push(`${game.slug}: ${candidate.source}`);
    }

    if (saved) continue;

    writeFallbackCover(dest, game.name, game.bannerFrom, game.bannerTo);
    fallback++;
    if (candidates.length === 0) console.log(`~ ${game.slug} → initials fallback`);
    else console.log(`~ ${game.slug} → initials fallback (tried ${candidates.length} sources)`);
  }

  console.log(`\nDone: ${jpg} JPG covers, ${fallback} SVG fallbacks`);
  if (failed.length) {
    console.log(`\n${failed.length} download failures:`);
    failed.slice(0, 15).forEach((f) => console.log(`  ${f}`));
  }
}

if (require.main === module) {
  const root = join(__dirname, "..");
  downloadAllGameCovers(root).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
