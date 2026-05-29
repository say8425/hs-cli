import { defineCommand } from "citty";
import { getMetadata } from "../services/card-db.ts";
import { resolveLocale } from "../services/locale.ts";
import { formatMeta, formatMetaStats } from "../services/formatter.ts";
import { loadArchetypeNames } from "../services/archetype-names.ts";
import { fetchMeta, rankArchetypes, rankDecks, type RankOptions } from "../services/meta-stats.ts";
import type {
  ArchetypeStat,
  DeckStat,
  GameFormat,
  OutputFormat,
  RankBracket,
  TimePeriod,
} from "../types/index.ts";

const STATIC_TYPES = ["sets", "classes", "types", "rarities"] as const;
const LIVE_TYPES = ["archetypes", "decks"] as const;
const VALID_TYPES = [...STATIC_TYPES, ...LIVE_TYPES] as const;

const GAME_FORMATS = ["standard", "wild", "twist"] as const;
const RANKS = [
  "legend",
  "top-2000-legend",
  "competitive",
  "legend-diamond",
  "diamond",
  "platinum",
  "bronze-gold",
  "all",
] as const;
const PERIODS = ["last-patch", "past-3", "past-7", "past-20", "current-season"] as const;
const SORTS = ["wilson", "winrate", "games"] as const;

const fail = (message: string): never => {
  process.stderr.write(`${message}\n`);
  process.exit(1);
};

const oneOf = <T extends string>(value: string, allowed: readonly T[], label: string): T => {
  if (!(allowed as readonly string[]).includes(value)) {
    fail(`Invalid ${label}: ${value}. Must be one of: ${allowed.join(", ")}`);
  }
  return value as T;
};

export const metaCommand = defineCommand({
  meta: {
    name: "meta",
    description:
      "Hearthstone metadata (sets/classes/types/rarities) and live meta (archetypes/decks)",
  },
  args: {
    type: {
      type: "positional",
      required: true,
      description: `One of: ${VALID_TYPES.join(", ")}`,
    },
    format: {
      type: "string",
      alias: "f",
      default: "table",
      description: "Output format: table or json",
    },
    locale: {
      type: "string",
      alias: "l",
      description: "HearthstoneJSON locale (static types only)",
    },
    "game-format": {
      type: "string",
      default: "standard",
      description: `HS format (archetypes/decks): ${GAME_FORMATS.join(", ")}`,
    },
    rank: {
      type: "string",
      default: "legend",
      description: `Rank bracket (archetypes/decks): ${RANKS.join(", ")}`,
    },
    period: {
      type: "string",
      default: "last-patch",
      description: `Time window (archetypes/decks): ${PERIODS.join(", ")}`,
    },
    "min-games": {
      type: "string",
      description: "Minimum games filter (default 400 decks / 2000 archetypes)",
    },
    sort: {
      type: "string",
      default: "wilson",
      description: `Sort (archetypes/decks): ${SORTS.join(", ")}`,
    },
    limit: {
      type: "string",
      default: "20",
      description: "Max rows in table output",
    },
  },
  run: async ({ args }) => {
    const format = args.format as OutputFormat;
    const type = args.type as string;

    if (!(VALID_TYPES as readonly string[]).includes(type)) {
      fail(`Invalid type: ${type}. Must be one of: ${VALID_TYPES.join(", ")}`);
    }

    if ((STATIC_TYPES as readonly string[]).includes(type)) {
      try {
        const locale = resolveLocale(args.locale);
        const values = await getMetadata(type as (typeof STATIC_TYPES)[number], locale);
        process.stdout.write(`${formatMeta(type, values, format)}\n`);
      } catch (err) {
        fail(`Error: ${err instanceof Error ? err.message : String(err)}`);
      }
      return;
    }

    const kind = type as "archetypes" | "decks";
    const gameFormat = oneOf<GameFormat>(
      args["game-format"] as string,
      GAME_FORMATS,
      "game-format",
    );
    const rank = oneOf<RankBracket>(args.rank as string, RANKS, "rank");
    const period = oneOf<TimePeriod>(args.period as string, PERIODS, "period");
    const sort = oneOf<RankOptions["sort"]>(args.sort as string, SORTS, "sort");
    const defaultMinGames = kind === "decks" ? 400 : 2000;
    const minGames = args["min-games"] === undefined ? defaultMinGames : Number(args["min-games"]);
    const limit = Number(args.limit);

    if (Number.isNaN(minGames) || minGames < 0) fail("--min-games must be a non-negative number");
    if (Number.isNaN(limit) || limit < 1) fail("--limit must be a positive number");

    const opts: RankOptions = { sort, minGames, limit: format === "json" ? undefined : limit };

    try {
      const names = await loadArchetypeNames();
      if (kind === "archetypes") {
        const result = await fetchMeta<ArchetypeStat>("archetypes", gameFormat, rank, period);
        const rows = rankArchetypes(result.rows, names, opts);
        process.stdout.write(`${formatMetaStats(result, rows, format)}\n`);
      } else {
        const result = await fetchMeta<DeckStat>("decks", gameFormat, rank, period);
        const rows = rankDecks(result.rows, names, opts);
        process.stdout.write(`${formatMetaStats(result, rows, format)}\n`);
      }
    } catch (err) {
      fail(
        `Failed to fetch meta from Firestone: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  },
});
