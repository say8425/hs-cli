import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Card } from "../types/index.ts";
import { DEFAULT_LOCALE, type Locale } from "./locale.ts";

const CACHE_DIR = join(homedir(), ".hs-cli");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const cacheFileFor = (locale: Locale): string => join(CACHE_DIR, `cards-${locale}.json`);
const cacheMetaFor = (locale: Locale): string => join(CACHE_DIR, `cards-${locale}.meta.json`);
const cdnUrlFor = (locale: Locale): string =>
  `https://api.hearthstonejson.com/v1/latest/${locale}/cards.json`;

interface CacheMeta {
  readonly fetchedAt: number;
}

const isCacheValid = async (locale: Locale): Promise<boolean> => {
  const file = cacheFileFor(locale);
  const meta = cacheMetaFor(locale);
  if (!existsSync(file) || !existsSync(meta)) return false;
  const raw = await readFile(meta, "utf-8");
  const parsed: CacheMeta = JSON.parse(raw);
  return Date.now() - parsed.fetchedAt < CACHE_TTL_MS;
};

const fetchAndCache = async (locale: Locale): Promise<readonly Card[]> => {
  const res = await fetch(cdnUrlFor(locale));
  if (!res.ok) throw new Error(`HearthstoneJSON fetch failed: ${res.status}`);
  const cards = (await res.json()) as readonly Card[];
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(cacheFileFor(locale), JSON.stringify(cards));
  const meta: CacheMeta = { fetchedAt: Date.now() };
  await writeFile(cacheMetaFor(locale), JSON.stringify(meta));
  return cards;
};

const cardCacheByLocale = new Map<Locale, readonly Card[]>();

export const loadCards = async (locale: Locale = DEFAULT_LOCALE): Promise<readonly Card[]> => {
  const cached = cardCacheByLocale.get(locale);
  if (cached) return cached;
  if (await isCacheValid(locale)) {
    const raw = await readFile(cacheFileFor(locale), "utf-8");
    const cards = JSON.parse(raw) as readonly Card[];
    cardCacheByLocale.set(locale, cards);
    return cards;
  }
  process.stderr.write(`Fetching card data from HearthstoneJSON (${locale})...\n`);
  const cards = await fetchAndCache(locale);
  cardCacheByLocale.set(locale, cards);
  return cards;
};

export const findCardByDbfId = async (
  dbfId: number,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Card | undefined> => {
  const cards = await loadCards(locale);
  return cards.find((c) => c.dbfId === dbfId);
};

export const findCardById = async (
  id: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Card | undefined> => {
  const cards = await loadCards(locale);
  return cards.find((c) => c.id === id);
};

export const searchCards = async (
  query: string,
  locale: Locale = DEFAULT_LOCALE,
  includeAll = false,
): Promise<readonly Card[]> => {
  const cards = await loadCards(locale);
  const lower = query.toLowerCase();
  return cards.filter(
    (c) =>
      (includeAll || c.collectible) &&
      (c.name.toLowerCase().includes(lower) || c.id.toLowerCase().includes(lower)),
  );
};

export const getMetadata = async (
  type: "sets" | "classes" | "types" | "rarities",
  locale: Locale = DEFAULT_LOCALE,
): Promise<readonly string[]> => {
  const cards = await loadCards(locale);
  const key = {
    sets: "set",
    classes: "cardClass",
    types: "type",
    rarities: "rarity",
  }[type] as keyof Card;
  const values = new Set<string>();
  for (const card of cards) {
    const v = card[key];
    if (typeof v === "string") values.add(v);
  }
  return [...values].toSorted();
};
