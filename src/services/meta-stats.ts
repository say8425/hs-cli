import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { displayName } from "./archetype-names.ts";
import { marginOfError, tierBand, wilsonLower } from "./stats-math.ts";
import type {
  ArchetypeStat,
  DeckStat,
  GameFormat,
  MetaKind,
  MetaResult,
  RankBracket,
  RankedRow,
  TimePeriod,
} from "../types/index.ts";

const BASE = "https://static.zerotoheroes.com/api/constructed/stats";
const CACHE_DIR = join(homedir(), ".hs-cli");
const TTL_MS = 60 * 60 * 1000;

export const buildMetaUrl = (
  kind: MetaKind,
  format: GameFormat,
  rank: RankBracket,
  period: TimePeriod,
): string => `${BASE}/${kind}/${format}/${rank}/${period}/overview-from-hourly.gz.json`;

export interface RankOptions {
  readonly sort: "wilson" | "winrate" | "games";
  readonly minGames: number;
  readonly limit?: number;
}

const safeWinrate = (winrate: number, wins: number, games: number): number => {
  if (Number.isFinite(winrate)) return winrate;
  return games > 0 ? wins / games : 0;
};

const sortKey = (row: RankedRow, sort: RankOptions["sort"]): number => {
  if (sort === "winrate") return row.winrate;
  if (sort === "games") return row.totalGames;
  return row.wilsonLower;
};

const finalize = (rows: readonly RankedRow[], opts: RankOptions): RankedRow[] => {
  const filtered = rows.filter((r) => r.totalGames >= opts.minGames);
  const sorted = filtered.toSorted((a, b) => sortKey(b, opts.sort) - sortKey(a, opts.sort));
  return opts.limit === undefined ? sorted : sorted.slice(0, opts.limit);
};

export const rankArchetypes = (
  stats: readonly ArchetypeStat[],
  names: Record<string, string>,
  opts: RankOptions,
): RankedRow[] => {
  const rows = stats.map((s): RankedRow => {
    const wl = wilsonLower(s.totalWins, s.totalGames);
    return {
      displayName: displayName(s.name, names),
      playerClass: s.heroCardClass,
      winrate: safeWinrate(s.winrate, s.totalWins, s.totalGames),
      wilsonLower: wl,
      moe: marginOfError(s.totalGames),
      tier: tierBand(wl * 100),
      totalGames: s.totalGames,
    };
  });
  return finalize(rows, opts);
};

export const rankDecks = (
  stats: readonly DeckStat[],
  names: Record<string, string>,
  opts: RankOptions,
): RankedRow[] => {
  const rows = stats.map((s): RankedRow => {
    const wl = wilsonLower(s.totalWins, s.totalGames);
    return {
      displayName: displayName(s.archetypeName, names),
      playerClass: s.playerClass,
      winrate: safeWinrate(s.winrate, s.totalWins, s.totalGames),
      wilsonLower: wl,
      moe: marginOfError(s.totalGames),
      tier: tierBand(wl * 100),
      totalGames: s.totalGames,
      deckcode: s.decklist,
    };
  });
  return finalize(rows, opts);
};

const isFresh = async (file: string): Promise<boolean> => {
  try {
    return Date.now() - (await stat(file)).mtimeMs < TTL_MS;
  } catch {
    return false;
  }
};

export const fetchMeta = async <T>(
  kind: MetaKind,
  format: GameFormat,
  rank: RankBracket,
  period: TimePeriod,
): Promise<MetaResult<T>> => {
  const cacheFile = join(CACHE_DIR, `meta-${kind}-${format}-${rank}-${period}.json`);
  const parse = (text: string): MetaResult<T> => {
    const root = JSON.parse(text) as Record<string, unknown>;
    const rows = (root[kind === "archetypes" ? "archetypeStats" : "deckStats"] ?? []) as T[];
    if (!Array.isArray(rows)) throw new Error("unexpected Firestone response shape");
    return {
      lastUpdated: String(root.lastUpdated ?? ""),
      dataPoints: Number(root.dataPoints ?? 0),
      gameFormat: format,
      rank,
      period,
      rows,
    };
  };
  if (await isFresh(cacheFile)) {
    return parse(await readFile(cacheFile, "utf8"));
  }
  try {
    const res = await fetch(buildMetaUrl(kind, format, rank, period), {
      headers: { "User-Agent": "hs-cli (+https://github.com/say8425/hs-cli)" },
    });
    if (!res.ok) throw new Error(`Firestone returned HTTP ${res.status}`);
    const text = await res.text();
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(cacheFile, text);
    return parse(text);
  } catch (err) {
    try {
      return parse(await readFile(cacheFile, "utf8"));
    } catch {
      throw err instanceof Error ? err : new Error(String(err));
    }
  }
};
