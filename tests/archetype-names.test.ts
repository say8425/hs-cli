import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { CLASS_SLUGS, displayName, isOtherBucket } from "../src/services/archetype-names.ts";

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
  it("detects catch-all class-name buckets", () => {
    expect(isOtherBucket("druid")).toBe(true);
    expect(isOtherBucket("xl-druid")).toBe(true);
    expect(isOtherBucket("mech-rogue")).toBe(false);
  });
  it("exposes the 11 class slugs", () => {
    expect(CLASS_SLUGS.includes("deathknight")).toBe(true);
    expect(CLASS_SLUGS.length).toBe(11);
  });
});
