// Wilson score interval lower bound — the standard way to rank by a positive rate
// without small samples producing flukes. z=1.96 => 95% confidence.
export const wilsonLower = (wins: number, games: number, z = 1.96): number => {
  if (games <= 0) return 0;
  const p = wins / games;
  const z2 = z * z;
  return (
    (p + z2 / (2 * games) - z * Math.sqrt((p * (1 - p) + z2 / (4 * games)) / games)) /
    (1 + z2 / games)
  );
};

// Margin of error of a proportion at p=0.5 (worst case), 95% confidence.
// Returned as a proportion in 0..1 (e.g. 0.098 = ±9.8%).
export const marginOfError = (games: number): number => (games <= 0 ? 1 : 0.98 / Math.sqrt(games));

// Heuristic static tier bands on a winrate PERCENT (apply to the Wilson lower
// bound so small samples cannot inflate a tier).
export const tierBand = (winratePercent: number): string => {
  if (winratePercent >= 57) return "S";
  if (winratePercent >= 54) return "A";
  if (winratePercent >= 52) return "B";
  if (winratePercent >= 50) return "C";
  return "D";
};
