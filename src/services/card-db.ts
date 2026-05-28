import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Card } from "../types/index.js";

const CACHE_DIR = join(homedir(), ".hs-cli");
const CACHE_FILE = join(CACHE_DIR, "cards-all.json");
const CACHE_META = join(CACHE_DIR, "cards.meta.json");
const CDN_URL = "https://api.hearthstonejson.com/v1/latest/koKR/cards.json";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CacheMeta {
  readonly fetchedAt: number;
}

const isCacheValid = async (): Promise<boolean> => {
  if (!existsSync(CACHE_FILE) || !existsSync(CACHE_META)) return false;
  const raw = await readFile(CACHE_META, "utf-8");
  const meta: CacheMeta = JSON.parse(raw);
  return Date.now() - meta.fetchedAt < CACHE_TTL_MS;
};

const fetchAndCache = async (): Promise<readonly Card[]> => {
  const res = await fetch(CDN_URL);
  if (!res.ok) throw new Error(`HearthstoneJSON fetch failed: ${res.status}`);
  const cards = (await res.json()) as readonly Card[];
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(CACHE_FILE, JSON.stringify(cards));
  const meta: CacheMeta = { fetchedAt: Date.now() };
  await writeFile(CACHE_META, JSON.stringify(meta));
  return cards;
};

let cardCache: readonly Card[] | null = null;

export const loadCards = async (): Promise<readonly Card[]> => {
  if (cardCache) return cardCache;
  if (await isCacheValid()) {
    const raw = await readFile(CACHE_FILE, "utf-8");
    cardCache = JSON.parse(raw) as readonly Card[];
    return cardCache;
  }
  process.stderr.write("Fetching card data from HearthstoneJSON...\n");
  cardCache = await fetchAndCache();
  return cardCache;
};

export const findCardByDbfId = async (dbfId: number): Promise<Card | undefined> => {
  const cards = await loadCards();
  return cards.find((c) => c.dbfId === dbfId);
};

export const findCardById = async (id: string): Promise<Card | undefined> => {
  const cards = await loadCards();
  return cards.find((c) => c.id === id);
};

export const searchCards = async (query: string, includeAll = false): Promise<readonly Card[]> => {
  const cards = await loadCards();
  const lower = query.toLowerCase();
  return cards.filter(
    (c) =>
      (includeAll || c.collectible) &&
      (c.name.toLowerCase().includes(lower) || c.id.toLowerCase().includes(lower)),
  );
};

export const getMetadata = async (
  type: "sets" | "classes" | "types" | "rarities",
): Promise<readonly string[]> => {
  const cards = await loadCards();
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
