import { describe, it, expect } from "bun:test";
import { decodeDeck } from "../src/services/deck-decoder.ts";
import { formatCard, formatCardList, formatDeck, formatMeta } from "../src/services/formatter.ts";
import { findCardByDbfId } from "../src/services/card-db.ts";
import type { Card } from "../src/types/index.ts";

const requireCard = async (dbfId: number): Promise<Card> => {
  const card = await findCardByDbfId(dbfId);
  if (!card) throw new Error(`card ${dbfId} not found in test fixture`);
  return card;
};

describe("formatDeck", () => {
  it("produces table output with class and mana curve", async () => {
    const deck = await decodeDeck("AAECAQcAA0VjgAEAAA==");
    const out = formatDeck(deck, "table");
    expect(out).toMatch(/Class:/);
    expect(out).toMatch(/Mana Curve/);
    expect(out).toMatch(/Cards:/);
    expect(out).toMatch(/Code:/);
  });

  it("produces valid JSON output", async () => {
    const deck = await decodeDeck("AAECAQcAA0VjgAEAAA==");
    const out = formatDeck(deck, "json");
    const parsed = JSON.parse(out);
    expect(parsed.deckCode).toBe(deck.deckCode);
    expect(parsed.heroClass).toBe(deck.heroClass);
  });
});

describe("formatCard", () => {
  it("produces table output", async () => {
    const card = await requireCard(69);
    const out = formatCard(card, "table");
    expect(out).toMatch(new RegExp(card.id));
    expect(out).toMatch(/Cost:/);
  });

  it("produces valid JSON output", async () => {
    const card = await requireCard(69);
    const out = formatCard(card, "json");
    const parsed = JSON.parse(out);
    expect(parsed.dbfId).toBe(69);
  });
});

describe("formatCardList", () => {
  it("shows count and entries", async () => {
    const card = await requireCard(69);
    const out = formatCardList([card], "table");
    expect(out).toMatch(/Found 1 cards/);
    expect(out).toMatch(new RegExp(card.name));
  });

  it("handles empty list", () => {
    const out = formatCardList([], "table");
    expect(out).toBe("No cards found.");
  });
});

describe("formatMeta", () => {
  it("shows count and values", () => {
    const out = formatMeta("classes", ["PRIEST", "MAGE"], "table");
    expect(out).toMatch(/classes \(2\)/);
    expect(out).toMatch(/PRIEST/);
  });

  it("produces valid JSON", () => {
    const out = formatMeta("sets", ["CORE", "EXPERT1"], "json");
    const parsed = JSON.parse(out);
    expect(parsed).toEqual({ type: "sets", values: ["CORE", "EXPERT1"] });
  });
});
