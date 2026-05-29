# Deck-analysis recipes

Multi-step workflows that operate on `hs deck <code> -f json` output. Use these whenever the user asks about a specific deck (curve, dust, tribe count, archetype, win condition, etc.).

## Contents

- [JSON shape reminder](#json-shape-reminder)
- [Compare two decks](#compare-two-decks)
- [Total dust cost](#total-dust-cost)
- [Mana-curve breakdown](#mana-curve-breakdown)
- [Rarity distribution](#rarity-distribution)
- [Spell vs Minion ratio](#spell-vs-minion-ratio)
- [Class vs Neutral split](#class-vs-neutral-split)
- [Tribe / synergy count](#tribe--synergy-count)
- [Set distribution & rotation risk](#set-distribution--rotation-risk)
- [Identify expensive cards to swap](#identify-expensive-cards-to-swap)
- [Spot Unknown / dropped cards](#spot-unknown--dropped-cards)
- [Validate user input before deeper analysis](#validate-user-input-before-deeper-analysis)
- [Mechanic / keyword breakdown](#mechanic--keyword-breakdown)
- [Locate cards with a specific keyword](#locate-cards-with-a-specific-keyword)
- [Card draw / cycle count](#card-draw--cycle-count)
- [Spell-school breakdown](#spell-school-breakdown)
- [Multi-tribe card detection](#multi-tribe-card-detection)
- [Find tribe synergy candidates](#find-tribe-synergy-candidates)
- [Win-condition / finisher detection](#win-condition--finisher-detection)
- [Archetype recognition](#archetype-recognition)
- [Highlander / singleton validation](#highlander--singleton-validation)
- [Board-clear / AoE count](#board-clear--aoe-count)
- [Heal + Armor source count](#heal--armor-source-count)
- [Burst / direct-damage potential ("do I have lethal?")](#burst--direct-damage-potential-do-i-have-lethal)
- [Mulligan candidates (opening hand)](#mulligan-candidates-opening-hand)

## JSON shape reminder

```text
hs deck <code> -f json
{
  "heroClass": "WARRIOR",
  "heroDbfId": 7,
  "format": "standard"|"wild",
  "cards": [ { "card": { ... }, "count": 1|2 }, ... ]
}
```

Inner card object keys: `artist, attack, cardClass, collectible, cost, dbfId, flavor, health, id, mechanics[], name, race, races[], rarity, referencedTags[], set, spellSchool, text, type`. `text` / `name` are in the active locale. Deck JSON does NOT include total dust or curve — compute via `jq`.

## Compare two decks

User intent: "내 덱이랑 이 덱이 뭐가 달라?", "what's different vs the deck I copied?"

```bash
hs deck "$A" -f json > /tmp/a.json
hs deck "$B" -f json > /tmp/b.json
diff <(jq -r '.cards[] | "\(.count) \(.card.name)"' /tmp/a.json | sort) \
     <(jq -r '.cards[] | "\(.count) \(.card.name)"' /tmp/b.json | sort)
```

## Total dust cost

User intent: "dust 얼마 들어요?", "how much dust to craft?". Map rarity → craft cost in jq:

```bash
hs deck "$CODE" -f json | jq '
  def dust:
    if   . == "LEGENDARY" then 1600
    elif . == "EPIC"      then 400
    elif . == "RARE"      then 100
    else 40 end;
  [ .cards[] | .count * (.card.rarity | dust) ] | add
'
```

## Mana-curve breakdown

User intent: "커브 어때?", "is this deck too top-heavy?"

```bash
hs deck "$CODE" -f json | jq '
  [.cards[] | {cost: .card.cost, count}]
  | group_by(.cost)
  | map({cost: .[0].cost, total: (map(.count) | add)})
'
```

## Rarity distribution

User intent: "이 덱 핀 몇 장?", "legendary count?", "金卡几张?"

```bash
hs deck "$CODE" -f json | jq '
  [.cards[] | {r: .card.rarity, n: .count}]
  | group_by(.r)
  | map({rarity: .[0].r, count: (map(.n) | add)})
'
```

## Spell vs Minion ratio

User intent: "주문 위주 덱?", "spell-heavy?"

```bash
hs deck "$CODE" -f json | jq '
  [.cards[] | {t: .card.type, n: .count}]
  | group_by(.t)
  | map({type: .[0].t, count: (map(.n) | add)})
'
```

## Class vs Neutral split

User intent: "중립 카드 비중", "are too many neutrals diluting the deck?"

```bash
hs deck "$CODE" -f json | jq '
  [.cards[] | {n: .count, neutral: (.card.cardClass == "NEUTRAL")}]
  | group_by(.neutral)
  | map({neutral: .[0].neutral, count: (map(.n) | add)})
'
```

## Tribe / synergy count

User intent: "이 덱 용족 몇 장?", "how many Dragons / Pirates / Murlocs?"

Tribes: `MURLOC, PIRATE, BEAST, DEMON, MECH, ELEMENTAL, UNDEAD, NAGA, QUILBOAR, DRAGON, ALL`.

```bash
TRIBE=DRAGON
hs deck "$CODE" -f json | jq --arg t "$TRIBE" '
  [.cards[] | select(.card.race == $t) | {name: .card.name, n: .count}]
'
```

## Set distribution & rotation risk

User intent: "야생 가는 카드 얼마나?", "what rotates?"

```bash
hs deck "$CODE" -f json | jq '
  [.cards[] | {set: .card.set, n: .count}]
  | group_by(.set)
  | map({set: .[0].set, count: (map(.n) | add)})
  | sort_by(-.count)
'
```

## Identify expensive cards to swap

User intent: "이 덱에서 핀 뭐 빼야 dust 아껴?", "cheapest-craft replacements?"

```bash
hs deck "$CODE" -f json | jq '
  .cards[] | select(.card.rarity == "LEGENDARY") | {name: .card.name, count}
'
```

## Spot Unknown / dropped cards

User intent: "왜 카드 수가 30 미만이야?", "missing cards?"

HearthstoneJSON data gaps surface as `name: "Unknown (<id>)"`, `type: "UNKNOWN"`.

```bash
hs deck "$CODE" -f json | jq '.cards[] | select(.card.type == "UNKNOWN") | .card'
```

## Validate user input before deeper analysis

```bash
if ! hs deck "$CODE" > /dev/null 2>&1; then
  echo "Invalid deck code"
  exit 1
fi
hs deck "$CODE"          # table summary first
```

## Mechanic / keyword breakdown

User intent: "이 덱 도발/은신/속공 몇 장?", "How many Battlecry / Deathrattle minions?"

```bash
hs deck "$CODE" -f json | jq '
  [ .cards[] as $c | ($c.card.mechanics // []) | .[] | {mech: ., n: $c.count} ]
  | group_by(.mech)
  | map({mech: .[0].mech, total: (map(.n) | add)})
  | sort_by(-.total)
'
```

Common mechanic codes: `BATTLECRY, DEATHRATTLE, RUSH, CHARGE, TAUNT, STEALTH, DIVINE_SHIELD, LIFESTEAL, WINDFURY, POISONOUS, SECRET, OVERLOAD, COMBO, INSPIRE, SPELL_POWER`. Korean labels: 전투의 함성, 죽음의 메아리, 속공, 돌진, 도발, 은신, 천상의 보호막, 생명력 흡수.

## Locate cards with a specific keyword

User intent: "도발 / 은신 / 천보 누구 있어?"

```bash
hs deck "$CODE" -f json | jq --arg k "TAUNT" '
  .cards[] | select((.card.mechanics // []) | index($k))
  | {name: .card.name, cost: .card.cost, n: .count}
'
```

Swap `TAUNT` for `RUSH, DIVINE_SHIELD, LIFESTEAL, DEATHRATTLE, SECRET`, etc.

## Card draw / cycle count

User intent: "이 덱 카드 드로우 몇 장?", "how much card draw?"

Card text is locale-dependent. Use `-l ko` and grep `카드를 뽑`, or default `enUS` and grep `Draw`.

```bash
hs deck "$CODE" -l ko -f json | jq '
  [ .cards[] | select(.card.text and (.card.text | test("카드를 뽑"))) | {name: .card.name, n: .count} ]
  | {sources: ., total: (map(.n) | add // 0)}
'
```

## Spell-school breakdown

User intent: "이 덱 불 마법 비중", "Fire / Frost / Holy ratio?"

`spellSchool` is set on spell cards only.

```bash
hs deck "$CODE" -f json | jq '
  [ .cards[] | select(.card.type == "SPELL") | {school: (.card.spellSchool // "NONE"), n: .count} ]
  | group_by(.school)
  | map({school: .[0].school, count: (map(.n) | add)})
  | sort_by(-.count)
'
```

Spell-school codes: `FIRE, FROST, NATURE, ARCANE, HOLY, SHADOW, FEL`, …

## Multi-tribe card detection

User intent: "이 카드 다종족이야?", "ALL tribe?"

`races` is set when a card belongs to more than one tribe (e.g. Murloc + Beast, or `ALL`).

```bash
hs deck "$CODE" -f json | jq '
  .cards[] | select((.card.races // []) | length > 1)
  | {name: .card.name, races: .card.races, n: .count}
'
```

## Find tribe synergy candidates

User intent: "우리 덱 용족 5장, 더 넣을 후보?", "more Pirate cards to add?"

```bash
HERO_CLASS=$(hs deck "$CODE" -f json | jq -r .heroClass)
TRIBE=DRAGON
hs card --class "$HERO_CLASS" -f json | jq --arg t "$TRIBE" '
  .[] | select(.race == $t or ((.races // []) | index($t))) | {name, cost, attack, health, dbfId}
'
hs card --class NEUTRAL -f json | jq --arg t "$TRIBE" '
  .[] | select(.race == $t or ((.races // []) | index($t))) | {name, cost, attack, health, dbfId}
'
```

## Win-condition / finisher detection

User intent: "이 덱 win con 뭐야?", "what's the closer?"

Heuristic: high-cost legendaries.

```bash
hs deck "$CODE" -f json | jq '
  .cards[] | select(.card.rarity == "LEGENDARY" and .card.cost >= 5)
  | {name: .card.name, cost: .card.cost, type: .card.type, n: .count, text: .card.text}
'
```

## Archetype recognition

User intent: "이거 미라클인가 도적 OTK?", "Aggro Pirate Rogue or Tempo Rogue?"

CLI does not classify archetypes. Approximate with signals:

```bash
hs deck "$CODE" -f json | jq '
  {
    avg_cost: ([.cards[] | .card.cost * .count] | add) / 30,
    pirate_count: ([.cards[] | select(.card.race == "PIRATE") | .count] | add // 0),
    dragon_count: ([.cards[] | select(.card.race == "DRAGON") | .count] | add // 0),
    has_taunt:  ([.cards[] | select((.card.mechanics // []) | index("TAUNT"))]  | length > 0),
    has_secret: ([.cards[] | select((.card.mechanics // []) | index("SECRET"))] | length > 0),
    big_cards:  [.cards[] | select(.card.cost >= 7) | {name: .card.name, cost: .card.cost, n: .count}]
  }
'
```

Rules of thumb:

- `avg_cost < 2.7` → Aggro
- `2.7 <= avg < 3.5` → Midrange / Tempo
- `avg_cost >= 3.5` → Control
- `pirate_count >= 6` or `dragon_count >= 6` → tribe-themed
- All cards unique (see Highlander recipe below) → Reno / Highlander / Singleton

## Highlander / singleton validation

User intent: "이거 하이랜더 덱이야?", "Is this a Reno / singleton deck?", "宇宙战卡组吗?"

A Highlander deck contains every card at most once. Several recent payoff legendaries (Reno-line cards) trigger only if the deck has no duplicates.

```bash
hs deck "$CODE" -f json | jq '
  {
    is_highlander: (all(.cards[]; .count == 1)),
    duplicates: [ .cards[] | select(.count > 1) | {name: .card.name, count} ]
  }
'
```

## Board-clear / AoE count

User intent: "광역기 몇 장?", "How many board clears?", "几张AOE?"

Approximate by spells with text damaging all enemy minions. Korean keys: `모든 적 하수인` / `모든 하수인에게`. enUS keys: `all enemy minions` / `all minions`. zhCN keys: `所有敌方随从` / `所有随从`.

```bash
# Korean deck
hs deck "$CODE" -l ko -f json | jq '
  [ .cards[] | select(.card.type == "SPELL" and .card.text and
      (.card.text | test("모든 적 하수인|모든 하수인"))) ]
  | {sources: map({name: .card.name, n: .count}), total: (map(.count) | add // 0)}
'

# enUS deck (default)
hs deck "$CODE" -f json | jq '
  [ .cards[] | select(.card.type == "SPELL" and .card.text and
      (.card.text | test("all enemy minions|all minions"; "i"))) ]
  | {sources: map({name: .card.name, n: .count}), total: (map(.count) | add // 0)}
'
```

Misses non-spell board clears (e.g. weapon-equipped Brawl variants, Battlecry-AoE minions). For broader coverage also grep `Brawl|brawl|난투` and Battlecry-AoE cards by class context.

## Heal + Armor source count

User intent: "회복 몇 장?", "How much healing / armor?", "回血几张?", "叠多少甲?"

Heal cards mention `Restore` + `Health` (en) / `생명력` + `회복` (ko) / `恢复` + `生命值` (zhCN). Armor cards mention `Armor` / `방어도` / `护甲`.

Swap the regex per locale + per metric. The two examples below show ko-heal and en-heal; for armor, swap the keyword (`Armor` / `방어도` / `护甲`).

```bash
# Korean deck — heal sources (swap 회복 → 방어도 for armor)
hs deck "$CODE" -l ko -f json | jq '
  [ .cards[] | select(.card.text and (.card.text | test("회복"))) ]
  | {sources: map({name: .card.name, text: .card.text, n: .count}), total: (map(.count) | add // 0)}
'

# enUS deck — heal sources (swap "Restore.*Health" → "Armor" for armor)
hs deck "$CODE" -f json | jq '
  [ .cards[] | select(.card.text and (.card.text | test("Restore.*Health"; "i"))) ]
  | {sources: map({name: .card.name, text: .card.text, n: .count}), total: (map(.count) | add // 0)}
'
```

Control Warrior decks routinely stack 50+ armor across the game. Use this to assess survivability vs aggro.

## Burst / direct-damage potential ("do I have lethal?")

User intent: "리쌜 가능?", "do I have lethal?", "斩杀线?"

True lethal calculation needs live hand + board state — beyond CLI scope. Approximate by listing untargeted-damage spells and high-attack charge/rush minions in the deck:

```bash
# Damage spells that can hit the enemy hero (exclude AoE-only / minion-only)
hs deck "$CODE" -f json | jq '
  [ .cards[]
    | select(.card.type == "SPELL"
             and .card.text
             and (.card.text | test("damage"; "i"))
             and ((.card.text | test("all enemy minions|all minions|all characters|minion only|chosen minion|target.*minion"; "i")) | not))
    | {name: .card.name, cost: .card.cost, text: .card.text, n: .count} ]
'

# Charge / Rush finishers (go-face threats)
hs deck "$CODE" -f json | jq '
  [ .cards[]
    | select(.card.type == "MINION" and ((.card.mechanics // []) | any(. == "CHARGE" or . == "RUSH")))
    | {name: .card.name, attack: .card.attack, cost: .card.cost, mechs: .card.mechanics, n: .count} ]
'
```

Note: `RUSH` minions can only attack minions the turn they're played, so they are tempo not burst. `CHARGE` minions go face immediately. Both are listed because RUSH still counts for clearing taunts that block lethal.

Korean note: text greps use `피해` for "damage" (e.g. `2의 피해를 줍니다`); AoE markers are `모든 적 하수인|모든 하수인`. Swap the regex when running against `-l ko` data.

## Mulligan candidates (opening hand)

User intent: "어떤 카드 마리건해야해?", "what to mulligan?", "起手留什么牌?"

Universal heuristic: keep low-cost (≤3) cards that establish board or proactive tempo. List the deck's cheap cards as a starting filter — final keeps depend on matchup.

```bash
hs deck "$CODE" -f json | jq '
  [ .cards[] | select(.card.cost <= 3)
    | {name: .card.name, cost: .card.cost, type: .card.type, mechs: .card.mechanics, n: .count} ]
  | sort_by(.cost, .name)
'
# Aggro decks: keep 1- and 2-drop minions; spells usually toss
# Midrange: keep 2- and 3-drops + class enablers (Discover, draw)
# Control: keep early removal / Taunt; toss expensive payoff cards
```

The mulligan is the highest-EV decision per turn — see community guides (Vicious Syndicate, Boosteria) for matchup-specific keeps.
