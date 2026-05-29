import { describe, expect, it } from "bun:test";
import { marginOfError, tierBand, wilsonLower } from "../src/services/stats-math.ts";

describe("stats-math", () => {
  it("wilsonLower penalises small samples below high raw winrate", () => {
    const small = wilsonLower(95, 100);
    const large = wilsonLower(950, 1000);
    expect(large).toBeGreaterThan(small);
    expect(wilsonLower(3, 3)).toBeLessThan(large);
  });

  it("wilsonLower returns 0 for zero games", () => {
    expect(wilsonLower(0, 0)).toBe(0);
  });

  it("wilsonLower is between 0 and the raw rate", () => {
    const w = wilsonLower(550, 1000);
    expect(w).toBeGreaterThan(0);
    expect(w).toBeLessThan(0.55);
  });

  it("marginOfError matches 0.98/sqrt(n)", () => {
    expect(marginOfError(100)).toBeCloseTo(0.098, 3);
    expect(marginOfError(1000)).toBeCloseTo(0.031, 3);
    expect(marginOfError(0)).toBe(1);
  });

  it("tierBand maps winrate percent to S/A/B/C/D", () => {
    expect(tierBand(58)).toBe("S");
    expect(tierBand(57)).toBe("S");
    expect(tierBand(55)).toBe("A");
    expect(tierBand(53)).toBe("B");
    expect(tierBand(51)).toBe("C");
    expect(tierBand(49)).toBe("D");
  });
});
