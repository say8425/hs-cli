# Metadata recipes

Workflows that use `hs meta sets|classes|types|rarities` to validate filters, normalize user input, or build enum-driven helpers — plus the live-meta types `hs meta archetypes|decks` for current win rates, tiers, and deck codes.

## Contents

- [JSON shape reminder](#json-shape-reminder)
- [Normalize user-provided class to `--class` code](#normalize-user-provided-class-to---class-code)
- [Dust cheat-sheet from rarities](#dust-cheat-sheet-from-rarities)
- [Play-relevant card types only](#play-relevant-card-types-only)
- [Latest expansion / set membership of a card](#latest-expansion--set-membership-of-a-card)
- [Live meta: tiers, win rates, deck codes](#live-meta-tiers-win-rates-deck-codes)

## JSON shape reminder

```text
hs meta <type> -f json
{ "type": "sets"|"classes"|"types"|"rarities", "values": [ "...", ... ] }
```

Enum values are raw English codes. CLI does not embed Standard/Wild rotation tags, dust cost, or localized labels — those come from the class/mode/shorthand tables in SKILL.md or from official Blizzard rotation pages.

Cache `hs meta` output across a single agent turn — it rarely changes.

## Normalize user-provided class to `--class` code

User intent: "법사 카드 뽑아줘", "show me Lock cards", "术士牌"

Step 1: translate slang/locale to the class code via the class table in SKILL.md (e.g. `법사` → `MAGE`). Step 2: validate against `hs meta classes`.

```bash
USER_CLASS="법사"                       # Lock, 法师, Mage, パラ, …
CLASS_CODE="MAGE"                       # from class table in SKILL.md
if hs meta classes -f json | jq -e --arg c "$CLASS_CODE" '.values | index($c)' > /dev/null; then
  hs card --class "$CLASS_CODE"
else
  echo "Invalid class code"; hs meta classes
fi
```

## Dust cheat-sheet from rarities

User intent: display rarity → craft cost together. Dust values are community knowledge, not in the CLI.

```bash
hs meta rarities -f json | jq -r '
  .values[] |
  (if   . == "LEGENDARY" then [., 1600]
   elif . == "EPIC"      then [., 400]
   elif . == "RARE"      then [., 100]
   else                       [., 40] end)
  | "\(.[0]): \(.[1]) dust"
'
```

## Play-relevant card types only

User intent: "어떤 type 있어?", "Battlegrounds 카드 빼고"

`hs meta types` includes Battlegrounds-internal, Mercenaries, and editor-mode codes that never appear in a constructed deck. Filter:

```bash
hs meta types -f json | jq -r '
  .values[] | select(test("BATTLEGROUND|LETTUCE|MOVE_MINION|GAME_MODE|PET") | not)
'
# Yields: ENCHANTMENT, HERO, HERO_POWER, LOCATION, MINION, SPELL, WEAPON
# For a "what's in this deck?" answer, only MINION / SPELL / WEAPON / LOCATION matter.
```

## Latest expansion / set membership of a card

User intent: "최근 확장팩이 뭐였더라?", "is this card new?"

CLI does NOT tag sets with Standard/Wild membership or release date.

```bash
hs meta sets                          # all set codes, alphabetical
hs card EX1_572 -f json | jq .set     # set of a specific card -> "EXPERT1"
```

For "is this set in Standard right now?", point the user to the official Blizzard rotation page — that data is not in the CLI. For per-deck set distribution see `recipes/deck.md` (`Set distribution & rotation risk`).

## Live meta: tiers, win rates, deck codes

User intent: "what's the best deck right now?", "현재 메타 티어", "强势卡组", "is X tier 1?"

`hs meta archetypes` (aggregated win rate per archetype = tier view) and `hs meta decks` (individual decks + deck codes) return live constructed stats from **Firestone (firestoneapp.com), used with permission**. This is the ONLY meta/win-rate source in the CLI — `hs meta sets|classes|types|rarities` are static and have no win rates.

Flags (both): `--game-format standard|wild|twist` (default standard), `--rank legend|top-2000-legend|competitive|legend-diamond|diamond|platinum|bronze-gold|all` (default legend), `--period last-patch|past-3|past-7|past-20|current-season` (default last-patch), `--min-games N` (default 2000 archetypes / 400 decks), `--sort wilson|winrate|games` (default wilson), `--limit N` (table only). Add `-f json` for piping.

### Reading the output honestly

```text
hs meta archetypes -f json
{
  "meta": { "source": "Firestone (firestoneapp.com)", "gameFormat", "rank", "period", "lastUpdated", "dataPoints" },
  "rows": [ { "displayName", "playerClass", "winrate", "wilsonLower", "moe", "tier", "totalGames", "deckcode"? } ]
}
```

- **Sort is by `wilsonLower` (Wilson score lower bound), not raw `winrate`** — this prevents a tiny-sample 80% deck from topping a proven 55% one. Report the tier/rank from `wilsonLower`, cite `winrate` as the headline number, and mention `±moe` when a deck is close to another.
- **`winrate`/`wilsonLower`/`moe` are 0–1 fractions** (multiply by 100 for %). `moe` is the ±95% margin of error at p=0.5; large `moe` (small `totalGames`) = treat as preliminary.
- **`tier`** is a heuristic band (S ≥57% · A 54–57 · B 52–54 · C 50–52 · D <50) on `wilsonLower`.
- A `[⚠ low sample]` flag (table) / low `dataPoints` (json) means the whole bracket/period is thin — widen `--period` or drop to a broader `--rank`.
- Always attribute Firestone when surfacing these numbers.

### Top tier list for the current meta

```bash
hs meta archetypes --rank legend --period past-7 -f json | jq -r '
  .rows[] | "\(.tier)  \((.winrate*100)|round/1)%  \(.displayName)  (n=\(.totalGames))"' | head -15
```

### Best deck of a class, with a ready-to-import code

```bash
hs meta decks --rank top-2000-legend -f json \
  | jq -r '[.rows[] | select(.playerClass=="rogue")][0] | .deckcode'
# pipe straight into the decoder for the full card list:
CODE=$(hs meta decks -f json | jq -r '.rows[0].deckcode')
hs deck "$CODE"
```

### "Is X strong right now?"

Match the user's archetype name against `displayName` (case-insensitive substring), then quote `winrate` + `tier` + `totalGames`:

```bash
hs meta archetypes -f json | jq -r --arg q "rogue" '
  .rows[] | select(.displayName|ascii_downcase|contains($q))
  | "\(.displayName): \((.winrate*100)|round/1)% (tier \(.tier), n=\(.totalGames))"'
```

Cache live-meta output within an agent turn (1h server cadence; CLI already caches to `~/.hs-cli/` for 1h).
