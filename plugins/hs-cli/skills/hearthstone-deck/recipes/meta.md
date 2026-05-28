# Metadata recipes

Workflows that use `hs meta sets|classes|types|rarities` to validate filters, normalize user input, or build enum-driven helpers.

## Contents

- [JSON shape reminder](#json-shape-reminder)
- [Normalize user-provided class to `--class` code](#normalize-user-provided-class-to---class-code)
- [Dust cheat-sheet from rarities](#dust-cheat-sheet-from-rarities)
- [Play-relevant card types only](#play-relevant-card-types-only)
- [Latest expansion / set membership of a card](#latest-expansion--set-membership-of-a-card)

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
  hs card --search " " --class "$CLASS_CODE"
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
