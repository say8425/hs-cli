import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const TRANSLATIONS_URL =
  "https://raw.githubusercontent.com/Zero-to-Heroes/firestone-translations/master/firestone/enUS.json";
const CACHE_DIR = join(homedir(), ".hs-cli");
const CACHE_FILE = join(CACHE_DIR, "firestone-archetypes-enUS.json");
const TTL_MS = 24 * 60 * 60 * 1000;

export const displayName = (slug: string, map: Record<string, string>): string => {
  const key = slug.startsWith("std-") ? slug.slice(4) : slug;
  return map[key] ?? slug;
};

const isFresh = async (): Promise<boolean> => {
  try {
    const s = await stat(CACHE_FILE);
    return Date.now() - s.mtimeMs < TTL_MS;
  } catch {
    return false;
  }
};

// Returns the archetype slug->display-name map, cached 24h. On any network error
// with no cache, returns an empty map (callers fall back to raw slugs).
export const loadArchetypeNames = async (): Promise<Record<string, string>> => {
  try {
    if (await isFresh()) {
      const raw = await readFile(CACHE_FILE, "utf8");
      return (JSON.parse(raw) as { archetype?: Record<string, string> }).archetype ?? {};
    }
  } catch {
    // fall through to fetch
  }
  try {
    const res = await fetch(TRANSLATIONS_URL, {
      headers: { "User-Agent": "hs-cli (+https://github.com/say8425/hs-cli)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(CACHE_FILE, text);
    return (JSON.parse(text) as { archetype?: Record<string, string> }).archetype ?? {};
  } catch {
    try {
      const raw = await readFile(CACHE_FILE, "utf8");
      return (JSON.parse(raw) as { archetype?: Record<string, string> }).archetype ?? {};
    } catch {
      return {};
    }
  }
};
