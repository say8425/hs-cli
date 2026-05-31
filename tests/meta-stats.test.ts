import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { buildMetaUrl, rankArchetypes, rankDecks } from "../src/services/meta-stats.ts";
import type { ArchetypeStat, DeckStat, MetaResult, RankedRow } from "../src/types/index.ts";
import { formatMetaStats } from "../src/services/formatter.ts";

const NAMES = { "mech-rogue": "Mech Rogue", "pure-paladin": "Pure Paladin" };

const archFixture = JSON.parse(readFileSync("tests/fixtures/firestone-archetypes.json", "utf8"))
  .archetypeStats as ArchetypeStat[];
const deckFixture = JSON.parse(readFileSync("tests/fixtures/firestone-decks.json", "utf8"))
  .deckStats as DeckStat[];

describe("meta-stats buildMetaUrl", () => {
  it("builds the archetypes endpoint URL", () => {
    expect(buildMetaUrl("archetypes", "standard", "legend", "past-7")).toBe(
      "https://static.zerotoheroes.com/api/constructed/stats/archetypes/standard/legend/past-7/overview-from-hourly.gz.json",
    );
  });
  it("builds the decks endpoint URL", () => {
    expect(buildMetaUrl("decks", "wild", "top-2000-legend", "last-patch")).toBe(
      "https://static.zerotoheroes.com/api/constructed/stats/decks/wild/top-2000-legend/last-patch/overview-from-hourly.gz.json",
    );
  });
});

describe("rankArchetypes", () => {
  it("filters by min-games (drops the 50-game spike) and sorts by wilson", () => {
    const rows = rankArchetypes(archFixture, NAMES, { sort: "wilson", minGames: 2000 });
    expect(rows.find((r) => r.displayName === "spike-deck")).toBeUndefined();
    expect(rows[0].displayName).toBe("Mech Rogue");
    expect(rows[0].tier).toBeDefined();
    expect(rows[0].wilsonLower).toBeLessThan(rows[0].winrate);
  });
  it("respects limit", () => {
    const rows = rankArchetypes(archFixture, NAMES, { sort: "winrate", minGames: 1, limit: 1 });
    expect(rows.length).toBe(1);
  });
  it("sort=winrate orders by raw winrate (spike-deck top when not filtered)", () => {
    const rows = rankArchetypes(archFixture, NAMES, { sort: "winrate", minGames: 1 });
    expect(rows[0].displayName).toBe("spike-deck");
  });
});

describe("rankDecks", () => {
  it("filters by min-games and carries the deck code", () => {
    const rows = rankDecks(deckFixture, NAMES, { sort: "wilson", minGames: 400 });
    expect(rows.length).toBe(1);
    expect(rows[0].deckcode).toBe("AAECCODE_A");
    expect(rows[0].displayName).toBe("Mech Rogue");
  });
});

const sampleResult: MetaResult<unknown> = {
  lastUpdated: "2026-05-29T05:59:51.000Z",
  dataPoints: 568483,
  gameFormat: "standard",
  rank: "legend",
  period: "past-7",
  rows: [],
};
const sampleRows: RankedRow[] = [
  {
    displayName: "Mech Rogue",
    playerClass: "rogue",
    winrate: 0.55,
    wilsonLower: 0.541,
    moe: 0.014,
    tier: "A",
    totalGames: 5000,
    deckcode: "AAECCODE_A",
  },
];

describe("formatMetaStats", () => {
  it("json output round-trips the rows with meta block", () => {
    const out = formatMetaStats(sampleResult, sampleRows, "json");
    const parsed = JSON.parse(out);
    expect(parsed.meta.source).toContain("Firestone");
    expect(parsed.meta.dataPoints).toBe(568483);
    expect(parsed.rows[0].displayName).toBe("Mech Rogue");
  });
  it("table output contains header attribution and row data", () => {
    const out = formatMetaStats(sampleResult, sampleRows, "table");
    expect(out).toContain("Firestone");
    expect(out).toContain("Mech Rogue");
    expect(out).toContain("AAECCODE_A");
    expect(out).toContain("A");
  });
  it("table output flags low sample for a thin bracket/period", () => {
    const lowResult = { ...sampleResult, dataPoints: 15000 };
    expect(formatMetaStats(lowResult, sampleRows, "table")).toContain("low sample");
  });

  it("table output does NOT flag low sample when the dataset is ample", () => {
    const ampleResult = { ...sampleResult, dataPoints: 600000 };
    expect(formatMetaStats(ampleResult, sampleRows, "table")).not.toContain("low sample");
  });

  it("low-sample boundary: exactly 20000 dataPoints is not flagged", () => {
    const boundaryResult = { ...sampleResult, dataPoints: 20000 };
    expect(formatMetaStats(boundaryResult, sampleRows, "table")).not.toContain("low sample");
  });

  it("json output is unaffected by empty rows (returns rows: [])", () => {
    const parsed = JSON.parse(formatMetaStats(sampleResult, [], "json"));
    expect(parsed.rows).toEqual([]);
    expect(parsed.meta.source).toContain("Firestone");
  });

  it("table output shows a no-rows message when nothing meets the threshold", () => {
    const out = formatMetaStats(sampleResult, [], "table");
    expect(out).toContain("Firestone");
    expect(out).toContain("--min-games");
  });
});
