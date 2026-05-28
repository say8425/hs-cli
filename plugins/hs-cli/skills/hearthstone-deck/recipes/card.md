# Card-lookup recipes

Multi-step workflows that operate on `hs card` (single-card lookup and `--search` results). Use when the user asks about a specific card, wants to enumerate candidates by filter, or needs to translate / compare cards.

## Contents

- [JSON shape reminder](#json-shape-reminder)
- [Compare two cards stat-for-stat](#compare-two-cards-stat-for-stat)
- [Resolve a card name across languages](#resolve-a-card-name-across-languages)
- [Locale and `--search`](#locale-and---search)
- [Enumerate candidates by class + cost](#enumerate-candidates-by-class--cost)
- [Tribe + class + cost filter](#tribe--class--cost-filter)
- [Average minion stats per mana](#average-minion-stats-per-mana)
- [Find DISCOVER / Battlecry-Discover engines](#find-discover--battlecry-discover-engines)

## JSON shape reminder

```text
hs card <id|name> -f json
# Single card object. Keys:
#   artist, attack, cardClass, collectible, cost, dbfId, flavor, health,
#   id, mechanics[], name, race, races[], rarity, referencedTags[], set,
#   spellSchool, text, type

hs card --search <q> [--class CLASS] [--cost N] -f json
# Array of card objects (same shape). `race` is single ("DRAGON"),
# `races` is the multi-tribe array. `spellSchool` only on SPELL type.
# `text` and `name` follow the active locale (default enUS).
```

## Compare two cards stat-for-stat

User intent: "이 카드 vs 저 카드 뭐가 나아?", "X or Y in this slot?"

```bash
for ID in EX1_572 OG_141; do
  hs card "$ID" -f json | jq '{name, cost, attack, health, type, rarity, text}'
done
```

## Resolve a card name across languages

User intent: "이게 영어로 뭐?", "English name of 리치 왕?"

```bash
hs card --search "리치 왕" -l ko -f json | jq '.[0] | {name, id, dbfId}'
hs card <dbfId>                    # enUS by default
hs card <dbfId> -l jaJP            # Japanese name
```

cardId and dbfId lookups are locale-independent.

## Locale and `--search`

`hs card --search` matches against the **active locale's** name field. Default locale is `enUS`, so English queries work without a flag. For other languages, pass `-l <code>`.

```bash
hs card --search "Zilliax"                 # default enUS
hs card --search "질리악스" -l ko
hs card --search "ジリアックス" -l jaJP
hs card EX1_567                            # by cardId, locale-independent
hs card 1657                               # by dbfId, locale-independent
```

When the user's prompt is in English, no flag needed. When the prompt is Korean (or any other supported locale), add `-l <code>` or advise `export HS_CLI_LOCALE=<code>`.

## Enumerate candidates by class + cost

User intent: aggro/midrange/control candidates per curve slot.

`--search " "` (single space) acts as wildcard since empty `""` is rejected by the CLI.

```bash
for COST in 1 2 3; do
  hs card --search " " --class ROGUE --cost "$COST" -f json | jq '.[].name'
done
```

## Tribe + class + cost filter

User intent: "3코 마법사 용족", "1-cost Pirate Rogue"

```bash
hs card --search " " --class MAGE --cost 3 -f json | jq '
  .[] | select(.race == "DRAGON") | {name, attack, health, text}
'
```

## Average minion stats per mana

User intent: vanilla check — is this minion above/below the 2/cost baseline?

```bash
hs card --search " " --class NEUTRAL -f json | jq '
  [ .[] | select(.type == "MINION" and .collectible) ]
  | group_by(.cost)
  | map({
      cost: .[0].cost,
      sample: length,
      avg_attack: (map(.attack) | add / length),
      avg_health: (map(.health) | add / length)
    })
'
```

## Find DISCOVER / Battlecry-Discover engines

User intent: "발견 효과 카드 보여줘", "what runs Discover?", "发现卡组?"

Discover effects are flagged in HearthstoneJSON's `referencedTags` (locale-independent — works without `-l ko`). Filter by class as needed.

```bash
hs card --search " " --class PRIEST -f json | jq '
  .[] | select(.collectible
              and (.referencedTags // [] | any(. == "DISCOVER")))
       | {name, cost, type, text}
'
```

For all classes: drop `--class`. Korean text grep (`발견`) is a fallback for older HSJSON snapshots where `referencedTags` is missing — `referencedTags` is more reliable and locale-independent.
