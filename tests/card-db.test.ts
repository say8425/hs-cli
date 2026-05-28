import { describe, it, expect } from "bun:test";
import {
  findCardByDbfId,
  findCardById,
  getMetadata,
  loadCards,
  searchCards,
} from "../src/services/card-db.ts";

describe("loadCards", () => {
  it("loads non-empty card list", async () => {
    const cards = await loadCards();
    expect(cards.length).toBeGreaterThan(1000);
  });

  it("returns cards with required fields", async () => {
    const cards = await loadCards();
    const sample = cards[0];
    expect(typeof sample.dbfId).toBe("number");
    expect(typeof sample.id).toBe("string");
    expect(typeof sample.name).toBe("string");
  });
});

describe("findCardByDbfId", () => {
  it("finds known card by dbfId 69 (Silver Hand Knight)", async () => {
    const card = await findCardByDbfId(69);
    expect(card).toBeDefined();
    expect(card?.dbfId).toBe(69);
  });

  it("returns undefined for unknown dbfId", async () => {
    const card = await findCardByDbfId(99999999);
    expect(card).toBeUndefined();
  });
});

describe("findCardById", () => {
  it("finds known card by string ID", async () => {
    const card = await findCardById("CS2_151");
    expect(card).toBeDefined();
    expect(card?.id).toBe("CS2_151");
  });

  it("returns undefined for unknown ID", async () => {
    const card = await findCardById("NONEXISTENT_ID");
    expect(card).toBeUndefined();
  });
});

describe("searchCards", () => {
  it("finds Korean cards by name substring (koKR locale)", async () => {
    const results = await searchCards("질리악스", "koKR");
    expect(results.length).toBeGreaterThan(0);
  });

  it("finds English cards by name substring (default locale)", async () => {
    const results = await searchCards("Zilliax");
    expect(results.length).toBeGreaterThan(0);
  });

  it("filters out non-collectible by default", async () => {
    const results = await searchCards("Zilliax");
    for (const card of results) {
      expect(card.collectible).toBe(true);
    }
  });

  it("returns empty for impossible query", async () => {
    const results = await searchCards("zzzzzzzzzzz_nope");
    expect(results.length).toBe(0);
  });
});

describe("getMetadata", () => {
  it("returns classes including DEATHKNIGHT and NEUTRAL", async () => {
    const classes = await getMetadata("classes");
    expect(classes).toContain("DEATHKNIGHT");
    expect(classes).toContain("NEUTRAL");
    expect(classes.length).toBeGreaterThanOrEqual(12);
  });

  it("returns rarities", async () => {
    const rarities = await getMetadata("rarities");
    expect(rarities).toContain("LEGENDARY");
    expect(rarities).toContain("COMMON");
  });

  it("returns sorted output", async () => {
    const classes = await getMetadata("classes");
    const sorted = [...classes].toSorted();
    expect(classes).toEqual(sorted);
  });
});
