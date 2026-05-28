import { describe, it, expect } from "bun:test";
import { decodeDeck, getFormatKo, getHeroClassKo } from "../src/services/deck-decoder.ts";

describe("decodeDeck", () => {
  it("decodes a valid deck code", async () => {
    const code = "AAECAQcAA0VjgAEAAA==";
    const deck = await decodeDeck(code);
    expect(deck.deckCode).toBe(code);
    expect(deck.format).toBe("standard");
    expect(deck.heroClass).toBe("WARRIOR");
    expect(deck.cards.length).toBeGreaterThan(0);
  });

  it("sorts cards by cost then name", async () => {
    const deck = await decodeDeck("AAECAQcAA0VjgAEAAA==");
    for (let i = 1; i < deck.cards.length; i++) {
      const prev = deck.cards[i - 1].card.cost;
      const curr = deck.cards[i].card.cost;
      expect(prev).toBeLessThanOrEqual(curr);
    }
  });

  it("computes dust cost", async () => {
    const deck = await decodeDeck("AAECAQcAA0VjgAEAAA==");
    expect(deck.totalDust).toBeGreaterThanOrEqual(0);
    expect(typeof deck.totalDust).toBe("number");
  });

  it("handles unknown dbfIds gracefully", async () => {
    const deck = await decodeDeck("AAECAQcAA0VjgAEAAA==");
    const unknown = deck.cards.find((c) => c.card.id.startsWith("UNKNOWN_"));
    if (unknown) {
      expect(unknown.card.name).toContain("Unknown");
      expect(unknown.card.type).toBe("UNKNOWN");
    }
  });

  it("throws on invalid deck code", async () => {
    await expect(decodeDeck("not-a-real-code")).rejects.toThrow();
  });
});

describe("getHeroClassKo", () => {
  it("translates known classes", () => {
    expect(getHeroClassKo("PRIEST")).toBe("사제");
    expect(getHeroClassKo("WARRIOR")).toBe("전사");
    expect(getHeroClassKo("NEUTRAL")).toBe("중립");
  });

  it("returns original for unknown class", () => {
    expect(getHeroClassKo("UNKNOWN_CLASS")).toBe("UNKNOWN_CLASS");
  });
});

describe("getFormatKo", () => {
  it("translates formats", () => {
    expect(getFormatKo("standard")).toBe("정규");
    expect(getFormatKo("wild")).toBe("야생");
    expect(getFormatKo("unknown")).toBe("알 수 없음");
  });
});
