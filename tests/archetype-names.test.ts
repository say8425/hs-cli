import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { displayName } from "../src/services/archetype-names.ts";

const map = (
  JSON.parse(readFileSync("tests/fixtures/firestone-translations.json", "utf8")) as {
    archetype: Record<string, string>;
  }
).archetype;

describe("archetype-names", () => {
  it("maps a known slug to its display name", () => {
    expect(displayName("mech-rogue", map)).toBe("Mech Rogue");
  });
  it("strips a leading std- prefix before lookup", () => {
    expect(displayName("std-mech-rogue", map)).toBe("Mech Rogue");
  });
  it("falls back to the raw slug when unmapped", () => {
    expect(displayName("brand-new-deck", map)).toBe("brand-new-deck");
  });
});
