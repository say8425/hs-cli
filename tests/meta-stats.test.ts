import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { buildMetaUrl, rankArchetypes, rankDecks } from "../src/services/meta-stats.ts";
import type { ArchetypeStat, DeckStat } from "../src/types/index.ts";

const NAMES = { "mech-rogue": "Mech Rogue", "pure-paladin": "Pure Paladin" };

const archFixture = JSON.parse(
  readFileSync("tests/fixtures/firestone-archetypes.json", "utf8"),
).archetypeStats as ArchetypeStat[];
const deckFixture = JSON.parse(
  readFileSync("tests/fixtures/firestone-decks.json", "utf8"),
).deckStats as DeckStat[];

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
