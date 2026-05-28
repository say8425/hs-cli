---
name: hearthstone-deck
description: Use when the user wants anything involving Hearthstone — decode/analyze/compare decks, look up cards by name or id, search cards with filters, or query game metadata (sets, classes, card types, rarities). Triggers on deck-code strings (base64 starting with "AAEC", "AAEB", "AAEA"), Hearthstone in any language or community nickname (HS, Blizzard Hearthstone; 하스스톤, 하스, 돌겜, 하섭; ハースストーン, ハース, ハスス; 炉石传说, 炉石, 炉石酒馆战棋; 爐石戰記, 爐石, 爐戰; Hearth, Pedra do Lar; Хартстоун, Хартса), mode keywords in any language (Standard / Wild / Twist / Arena / Battlegrounds / BG; 정규 / 야생 / 전장 / 투기장 / 선술집난투 / 용병단; 标准 / 狂野 / 酒馆战棋 / 竞技场), mana-curve/dust/win-condition/meta/nerf discussion, single-card lookups, name searches in any language, and class/format/expansion queries.
---

# Hearthstone CLI (decks, cards, metadata)

Use the `hs` CLI to decode deck codes, look up and search cards, and query game metadata for any agent task that involves Hearthstone.

This skill covers the full surface of the `hs` CLI:

- `hs deck <code>` — decode and summarize a deck code
- `hs card <dbfId|cardId|name>` — single-card lookup
- `hs card --search <q> [--class CLASS] [--cost N]` — name + filter search
- `hs meta sets|classes|types|rarities` — game metadata

## Language and naming triggers

This skill applies whenever the user references Hearthstone in any language, including community nicknames. Common names to recognize:

### Game name (community nicknames included)

| Locale | Official | Common short / slang |
|---|---|---|
| English (global) | Hearthstone | HS, Hearth |
| 한국어 (KR) | 하스스톤 | 하스, 돌겜, 하섭 (server context), HS |
| 日本語 (JP) | ハースストーン | ハース, ハスス, HS |
| 中文 (简体, CN) | 炉石传说 | 炉石, LSCS (pinyin abbr.), HS |
| 中文 (繁體, TW/HK) | 爐石戰記 | 爐石, 爐戰, HS |
| Português (BR) | Hearthstone | HS, Hearth, Pedra do Lar (colloquial) |
| Español (ES/LATAM) | Hearthstone | HS, Hearth |
| Français (FR) | Hearthstone | HS |
| Deutsch (DE) | Hearthstone | HS |
| Русский (RU) | Hearthstone / Хартстоун | Хартса, HS |
| Tiếng Việt (VN) | Hearthstone | HS |
| ภาษาไทย (TH) | Hearthstone | HS |

### Game modes

| Mode | English | 한국어 | 日本語 | 中文(简) |
|---|---|---|---|---|
| Constructed Standard | Standard | 정규 | スタンダード | 标准 |
| Constructed Wild | Wild | 야생 | ワイルド | 狂野 |
| Constructed Twist | Twist | 트위스트 | ツイスト | 时变 |
| Arena | Arena | 투기장 | 闘技場 | 竞技场 |
| Battlegrounds | Battlegrounds / BG | 전장 | バトルグラウンド / BG | 酒馆战棋 |
| Tavern Brawl | Tavern Brawl | 선술집 난투 | 酒場の喧嘩 | 乱斗 |
| Mercenaries | Mercenaries | 용병단 | 傭兵団 | 佣兵战纪 |
| Duels (retired 2026) | Duels | 결투 | デュエル | 决斗 |
| Ranked ladder | Ranked / Constructed | 등급전, 일반전 | ランク戦 | 排名赛 |

Treat any of the above as a trigger.

### Common community shorthand for game concepts

These are not modes but appear frequently in community discussion across languages — recognize them as Hearthstone context:

- nerf / buff (en, jp ナーフ, ko 너프, zh 削弱/加强), meta (메타, メタ, 环境)
- legendary card (en legendary, ko 핀/전설, jp レジェ, zh 金卡/橙卡)
- hero power (en, ko 영능, jp ヒーローパワー, zh 英雄技能)
- dust / disenchant (en dust, ko 가루, jp 魔素, zh 奥术之尘)

### Class names across languages and community shorthand

The CLI returns Korean class names by default (data source is HearthstoneJSON `koKR`), so output may contain Hangul even when the prompt language is something else — this is expected. Use the table to translate output for the user's prompt language and to recognize community slang as a trigger.

Cell format: `Official (short / slang)`. Empty cell = no widely-used localized form, English is used.

| Class code | English (slang) | 한국어 (축약) | 日本語 (略) | 中文 (简, 简称) | 中文 (繁, 簡稱) | Español | Français | Deutsch (Kürzel) | Русский |
|---|---|---|---|---|---|---|---|---|---|
| DEATHKNIGHT | Death Knight (DK) | 죽음의 기사 (죽기, DK) | デスナイト (DK) | 死亡骑士 (死骑, DK) | 死亡騎士 (DK) | Caballero de la Muerte (DK) | Chevalier de la mort (CdM) | Todesritter (TR) | Рыцарь Смерти (РС) |
| DEMONHUNTER | Demon Hunter (DH) | 악마 사냥꾼 (악사, DH) | デーモンハンター (DH) | 恶魔猎手 (恶魔, DH) | 惡魔獵人 (DH) | Cazador de demonios (DH) | Chasseur de démons (CdD) | Dämonenjäger (DJ) | Охотник на демонов (ОД) |
| DRUID | Druid | 드루이드 (드루) | ドルイド (ドル) | 德鲁伊 (德) | 德魯伊 (德) | Druida | Druide | Druide | Друид |
| HUNTER | Hunter (Hunt) | 사냥꾼 (사냥, 헌터) | ハンター (ハン) | 猎人 (猎) | 獵人 (獵) | Cazador | Chasseur | Jäger | Охотник |
| MAGE | Mage | 마법사 (법사, 마법) | メイジ | 法师 (法) | 法師 (法) | Mago | Mage | Magier | Маг |
| PALADIN | Paladin (Pally / Pal) | 성기사 (성기, 팔라, 팔라딘) | パラディン (パラ) | 圣骑士 (圣骑, 骑士) | 聖騎士 (聖騎, 騎士) | Paladín | Paladin | Paladin | Паладин (Палыч) |
| PRIEST | Priest | 사제 (프리스트) | プリースト (プリ) | 牧师 (牧) | 牧師 (牧) | Sacerdote | Prêtre | Priester | Жрец |
| ROGUE | Rogue | 도적 (도둑, 로그) | ローグ | 潜行者 (盗贼, 贼) | 盜賊 (賊) | Pícaro | Voleur | Schurke | Разбойник (Роуг) |
| SHAMAN | Shaman (Shammy) | 주술사 (주술, 슈먼) | シャーマン (シャマ) | 萨满 (萨) | 薩滿 (薩) | Chamán | Chaman | Schamane | Шаман |
| WARLOCK | Warlock (Lock / Locks) | 흑마법사 (흑마, 흑법) | ウォーロック (ロック) | 术士 (术) | 術士 (術) | Brujo | Démoniste | Hexenmeister (Hexer) | Чернокнижник (ЧК) |
| WARRIOR | Warrior (Warr) | 전사 (워리) | ウォリアー (ウォリ) | 战士 (战) | 戰士 (戰) | Guerrero | Guerrier | Krieger | Воин |
| NEUTRAL | Neutral | 중립 | 中立 | 中立 | 中立 | Neutral | Neutre | Neutral | Нейтрал |

Two additional codes appear in CLI filter validation but rarely in community talk:

- `WHIZBANG` — Maestro Whizbang dynamic-deck hero. Most languages just write "Whizbang" / 위즈뱅 / ウィズバン / 维兹班.
- `DREAM` — internal "Dream" class for boss-token cards (Ysera-only historically). Not used in community deck talk.

When the user uses any cell in the table (e.g. "용암 흑법덱 보여줘", "Lock deck", "术士 OTK"), normalize to the class code in the first column and pass it as `--class`.

## Prerequisites

The `hs` binary must be on PATH. Install via any of:

```bash
brew install say8425/tap/hs-cli              # macOS / Linux, no runtime needed
npm install -g @say8425/hs-cli               # any OS with Node 22+
# or download a binary from https://github.com/say8425/hs-cli/releases/latest
```

For local development of the CLI itself, clone the repo and run `bun install && bun run build && bun link` (requires Bun 1.3+).

```bash
hs --version                                  # verify
```

Card data is auto-fetched from the HearthstoneJSON CDN on first use (cached 24h at `~/.hs-cli/`). No API key required.

If `hs` is not on PATH, instruct the user to install via one of the channels above before running any commands.

## Global flags

Every subcommand accepts:

- `-f, --format <table|json>` — output format. Default `table` (agent-friendly compressed). Switch to `json` only to extract specific fields.
- `--help` — show usage for the subcommand.

Top-level: `hs --version`, `hs --help`.

## Command reference

### `hs deck <code>`

Decode a deck code into a card list. Reports class, format, dust cost, mana curve, and the 30 cards.

- Positional `<code>`: **required**, base64 deck code (typically starts with `AAEC` / `AAEB` / `AAEA`).
- Exit code: `0` if the code decodes cleanly, `1` if invalid or corrupted.

```bash
hs deck AAECAQcAA0VjgAEAAA==                  # table (default)
hs deck AAECAQcAA0VjgAEAAA== -f json          # raw JSON
```

### `hs card <id|name>`

Single-card lookup. The positional accepts a dbfId (numeric), a cardId (string), or a name. Resolution order:

1. If the value parses as an integer → `findCardByDbfId`.
2. Else → `findCardById` (exact cardId match like `EX1_572`).
3. If `findCardById` returns nothing → fallback to `searchCards(query)` and pick the first match.

- Positional: **optional** in the CLI signature, but **either the positional or `--search` must be provided**. Otherwise the CLI exits with `Provide a card ID, dbfId, or use --search`.

```bash
hs card 64034                                 # by dbfId
hs card EX1_572                               # by cardId
hs card "Lich King"                           # by name (fallback to search)
hs card "리치 왕"                              # Korean name (data is koKR)
hs card EX1_572 -f json | jq .cost            # extract a single field
```

### `hs card --search <query>`

Substring search with optional filters. Both `--search` and `-s` (short alias) work.

- `--search, -s <string>` — substring match against card name (English and Korean fields).
- `--class <CLASS>` — one of `DEATHKNIGHT, DEMONHUNTER, DRUID, HUNTER, MAGE, PALADIN, PRIEST, ROGUE, SHAMAN, WARLOCK, WARRIOR, NEUTRAL, WHIZBANG, DREAM`. Case-insensitive (CLI uppercases internally).
- `--cost <N>` — mana cost. Accepts a string; CLI parses it as an integer.

An empty `--search ""` is **rejected** by the CLI (treated as missing). Use `--search " "` (single space) as a wildcard substring to "browse all X-cost Y-class cards".

```bash
hs card --search "Zilliax"
hs card -s "fire" --class MAGE --cost 3
hs card --search " " --class PRIEST --cost 3   # browse all 3-cost priest cards
```

### `hs meta <type>`

Game metadata. Useful for filtering, validation, or class-name translation.

- Positional `<type>`: **required**. One of `sets`, `classes`, `types`, `rarities`. Any other value exits with `Invalid type: ... Must be one of: sets, classes, types, rarities`.

```bash
hs meta classes                               # 14 class codes
hs meta sets                                  # every released set
hs meta types                                 # MINION, SPELL, WEAPON, HERO, ...
hs meta rarities                              # FREE, COMMON, RARE, EPIC, LEGENDARY
```

Cache the output in working memory for the session — these rarely change.

## DO

- Default to `table`. Switch to `-f json` only when you need specific fields.
- Use `hs deck` first, then drill into individual cards with `hs card <id>` only if needed.
- For "how is this deck?" style questions (any language), check: mana curve balance, dust cost, legendary count, identifiable win condition, class/format.
- Compare two decks by decoding both as JSON and diffing card names + counts.
- Resolve names via `hs card --search` rather than guessing IDs.
- Translate class names for the user's prompt language when helpful (table output includes both the localized and English class codes).

## DO NOT

- Do not dump raw JSON of a 30-card deck into context without reason.
- Do not guess card names from IDs — always resolve with `hs card <id>`.
- Do not assume all dbfIds resolve. Very old or removed cards show as `Unknown (dbfId)`. This is a HearthstoneJSON data gap, not a CLI bug.
- Do not run `hs meta` repeatedly within a session — cache the output.
- Do not invoke the Battle.net API as a fallback for missing cards — the official endpoint silently drops the same unknown dbfIds (verified 2026-05-28).

## Recipes

Multi-step workflows that combine commands or pipe to `jq`. Single-command usage lives in **Command reference**.

These recipes target the questions Hearthstone players actually ask in communities (Reddit /r/hearthstone & /r/CompetitiveHS, 인벤 하스 갤러리, NGA 炉石区, 5ch ハース). Each one is tagged with the colloquial question it answers.

### JSON schema reminder

```text
hs deck <code> -f json
{
  "heroClass": "WARRIOR",          # class code (KO/EN map in table form)
  "heroDbfId": 7,
  "format": "standard"|"wild",
  "cards": [ { "card": { ... }, "count": 1|2 }, ... ]
}

hs card <id> -f json | jq keys
# artist, attack, cardClass, collectible, cost, dbfId, flavor, health,
# id, mechanics[], name, race, races[], rarity, referencedTags[], set,
# spellSchool, text, type
# Notes:
#   - mechanics / referencedTags can be null
#   - race is single ("DRAGON"), races is the multi-tribe array ("ALL" etc.)
#   - text and name are koKR (data source is HearthstoneJSON koKR)
#   - spellSchool is set only on cards with type == "SPELL"
#     (values: FIRE, FROST, NATURE, ARCANE, HOLY, SHADOW, FEL, ...)

hs meta <type> -f json
{ "type": "sets"|"classes"|"types"|"rarities", "values": [ "...", ... ] }
```

The deck JSON does NOT include total dust or mana curve — only the `table` format renders those. Compute them with jq when needed (see "Total dust" recipe).

`hs meta` returns raw enum codes (English). The CLI does not embed a Standard / Wild rotation tag, dust cost, or localized labels — these come from the table in the Class names / Game modes / Common community shorthand sections above, or from official Blizzard rotation pages.

### Compare two decks ("내 덱이랑 이 덱이 뭐가 달라?", "what's different vs the deck I copied?")

```bash
hs deck "$A" -f json > /tmp/a.json
hs deck "$B" -f json > /tmp/b.json
diff <(jq -r '.cards[] | "\(.count) \(.card.name)"' /tmp/a.json | sort) \
     <(jq -r '.cards[] | "\(.count) \(.card.name)"' /tmp/b.json | sort)
```

### Total dust cost ("dust 얼마 들어요?", "how much dust to craft?")

The deck JSON has rarity but no per-card dust value. Map rarity → craft cost in jq:

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

### Mana-curve breakdown ("커브 어때?", "is this deck too top-heavy?")

```bash
hs deck "$CODE" -f json | jq '
  [.cards[] | {cost: .card.cost, count}]
  | group_by(.cost)
  | map({cost: .[0].cost, total: (map(.count) | add)})
'
```

### Rarity distribution ("이 덱 핀 몇 장?", "legendary count?", "金卡几张?")

```bash
hs deck "$CODE" -f json | jq '
  [.cards[] | {r: .card.rarity, n: .count}]
  | group_by(.r)
  | map({rarity: .[0].r, count: (map(.n) | add)})
'
```

### Spell vs Minion ratio ("주문 위주 덱?", "spell-heavy?")

```bash
hs deck "$CODE" -f json | jq '
  [.cards[] | {t: .card.type, n: .count}]
  | group_by(.t)
  | map({type: .[0].t, count: (map(.n) | add)})
'
```

### Class vs Neutral split ("중립 카드 비중", "are too many neutrals diluting the deck?")

```bash
hs deck "$CODE" -f json | jq '
  [.cards[] | {n: .count, neutral: (.card.cardClass == "NEUTRAL")}]
  | group_by(.neutral)
  | map({neutral: .[0].neutral, count: (map(.n) | add)})
'
```

### Tribe / synergy count ("이 덱 용족 몇 장?", "how many Dragons / Pirates / Murlocs?")

```bash
TRIBE=DRAGON   # MURLOC, PIRATE, BEAST, DEMON, MECH, ELEMENTAL, UNDEAD, NAGA, QUILBOAR, ALL
hs deck "$CODE" -f json | jq --arg t "$TRIBE" '
  [.cards[] | select(.card.race == $t) | {name: .card.name, n: .count}]
'
```

### Set distribution & rotation risk ("야생 가는 카드 얼마나?", "what rotates?")

```bash
hs deck "$CODE" -f json | jq '
  [.cards[] | {set: .card.set, n: .count}]
  | group_by(.set)
  | map({set: .[0].set, count: (map(.n) | add)})
  | sort_by(-.count)
'
```

### Compare two cards stat-for-stat ("이 카드 vs 저 카드 뭐가 나아?", "X or Y in this slot?")

```bash
for ID in EX1_572 OG_141; do
  hs card "$ID" -f json | jq '{name, cost, attack, health, type, rarity, text}'
done
```

### Find aggro/midrange/control candidates by curve

The CLI doesn't classify archetype directly. Use `--search " "` plus `--class` and `--cost` to enumerate the candidate pool, then build your own curve:

```bash
for COST in 1 2 3; do
  hs card --search " " --class ROGUE --cost "$COST" -f json | jq '.[].name'
done
```

### Identify expensive cards to swap ("이 덱에서 핀 뭐 빼야 dust 아껴?", "cheapest-craft replacements?")

```bash
hs deck "$CODE" -f json | jq '
  .cards[] | select(.card.rarity == "LEGENDARY") | {name: .card.name, count}
'
```

### Tribe + class + cost filter ("3코 마법사 용족", "1-cost Pirate Rogue")

`--search " "` returns all candidates at that filter; pipe through jq for tribe:

```bash
hs card --search " " --class MAGE --cost 3 -f json | jq '
  .[] | select(.race == "DRAGON") | {name, attack, health, text}
'
```

### Spot Unknown / dropped cards ("왜 카드 수가 30 미만이야?", "missing cards?")

When HearthstoneJSON doesn't have a dbfId, the card object shows `name: "Unknown (<id>)"`. Surface them so the user understands the data gap:

```bash
hs deck "$CODE" -f json | jq '.cards[] | select(.card.type == "UNKNOWN") | .card'
```

### Validate user input before running deeper analysis

```bash
if ! hs deck "$CODE" > /dev/null 2>&1; then
  echo "Invalid deck code"
  exit 1
fi
hs deck "$CODE"          # table summary
```

### Resolve a card name across languages ("이게 영어로 뭐?", "English name of 리치 왕?")

```bash
hs card --search "리치 왕" -f json | jq '.[0] | {name, id, dbfId}'
# Use the resolved id/dbfId for any further lookups in the user's prompt language.
```

### Normalize user-provided class to a valid `--class` code ("법사 카드 뽑아줘", "show me Lock cards", "术士牌")

The user types a class in their language or slang. Validate with `hs meta classes` before passing to `--class`, and fall back to the multilingual class table in this skill for translation.

```bash
USER_CLASS="법사"                       # could be Lock, 法师, Mage, パラ, etc.
# Step 1: translate via the class table in this SKILL (above) -> e.g. "법사" -> MAGE
CLASS_CODE="MAGE"
# Step 2: verify it is a valid CLI filter value
if hs meta classes -f json | jq -e --arg c "$CLASS_CODE" '.values | index($c)' > /dev/null; then
  hs card --search " " --class "$CLASS_CODE"
else
  echo "Invalid class code"; hs meta classes
fi
```

### Mechanic / keyword breakdown of a deck ("이 덱 도발/은신/속공 몇 장?", "How many Battlecry / Deathrattle minions?")

Mechanics live on each card object as an array. Aggregate them across the deck:

```bash
hs deck "$CODE" -f json | jq '
  [.cards[] | (.card.mechanics // []) | .[] as $m | {mech: $m, count: $count // 1}]
'
# Compact version: how many copies of each mechanic appear
hs deck "$CODE" -f json | jq '
  [ .cards[] as $c | ($c.card.mechanics // []) | .[] | {mech: ., n: $c.count} ]
  | group_by(.mech)
  | map({mech: .[0].mech, total: (map(.n) | add)})
  | sort_by(-.total)
'
```

Common mechanics in card data: `BATTLECRY`, `DEATHRATTLE`, `RUSH`, `CHARGE`, `TAUNT`, `STEALTH`, `DIVINE_SHIELD`, `LIFESTEAL`, `WINDFURY`, `POISONOUS`, `SECRET`, `OVERLOAD`, `COMBO`, `INSPIRE`, `SPELL_POWER`. Korean community labels: 전투의 함성 / 죽음의 메아리 / 속공 / 돌진 / 도발 / 은신 / 천상의 보호막 / 생명력 흡수.

### Build a dust cheat-sheet from `hs meta rarities`

`hs meta rarities` enumerates the rarity tier codes; dust values come from community knowledge (no CLI source for them). Useful when displaying rarity → craft cost together:

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

### List play-relevant card types only ("어떤 type 있어?", "Battlegrounds 카드 빼고")

`hs meta types` includes Battlegrounds-internal, Mercenaries, and editor-mode codes that never appear in a constructed deck. Filter to the codes a deck-analysis agent actually cares about:

```bash
hs meta types -f json | jq -r '
  .values[] | select(test("BATTLEGROUND|LETTUCE|MOVE_MINION|GAME_MODE|PET") | not)
'
# Yields: ENCHANTMENT, HERO, HERO_POWER, LOCATION, MINION, SPELL, WEAPON.
# For a "what's in this deck?" answer, only MINION / SPELL / WEAPON / LOCATION matter.
```

### Latest expansion / which set is a card from ("최근 확장팩이 뭐였더라?", "is this card new?")

The CLI does NOT tag sets with Standard / Wild membership or release date. Workarounds:

```bash
# All set codes (raw enum, alphabetical):
hs meta sets

# Set of a specific card (the card object carries it):
hs card EX1_572 -f json | jq .set       # -> "EXPERT1"

# Per-deck set distribution (see "Set distribution & rotation risk" recipe above).
```

For "is this set in Standard right now?", point the user to the official Blizzard rotation page — that data is not in the CLI.

### Recognize a deck's archetype from card text + mechanics ("이거 미라클인가 도적 OTK?", "Aggro Pirate Rogue or Tempo Rogue?")

The CLI doesn't classify archetypes. Approximate by sampling cards and checking signals:

```bash
hs deck "$CODE" -f json | jq '
  {
    avg_cost: ([.cards[] | .card.cost * .count] | add) / 30,
    pirate_count: ([.cards[] | select(.card.race == "PIRATE") | .count] | add // 0),
    dragon_count: ([.cards[] | select(.card.race == "DRAGON") | .count] | add // 0),
    has_taunt: ([.cards[] | select((.card.mechanics // []) | index("TAUNT"))] | length > 0),
    has_secret: ([.cards[] | select((.card.mechanics // []) | index("SECRET"))] | length > 0),
    big_cards: [.cards[] | select(.card.cost >= 7) | {name: .card.name, cost: .card.cost, n: .count}]
  }
'
# Interpretation rules of thumb:
#   avg_cost < 2.7   -> Aggro
#   2.7 <= avg < 3.5 -> Midrange / Tempo
#   avg_cost >= 3.5  -> Control
#   pirate_count >= 6 or dragon_count >= 6 -> tribe-themed
```

### Card draw / cycle count ("이 덱 카드 드로우 몇 장?", "how much card draw?")

Card text is `koKR`. Grep for the Korean phrase **"카드를 뽑"** which covers "카드를 뽑습니다", "카드를 뽑으세요", etc. Add other locale-equivalent strings if needed.

```bash
hs deck "$CODE" -f json | jq '
  [ .cards[] | select(.card.text and (.card.text | test("카드를 뽑"))) | {name: .card.name, n: .count} ]
  | {sources: ., total: (map(.n) | add // 0)}
'
```

### Spell-school breakdown ("이 덱 불 마법 비중", "Fire / Frost / Holy ratio?")

`spellSchool` is set on spell cards only.

```bash
hs deck "$CODE" -f json | jq '
  [ .cards[] | select(.card.type == "SPELL") | {school: (.card.spellSchool // "NONE"), n: .count} ]
  | group_by(.school)
  | map({school: .[0].school, count: (map(.n) | add)})
  | sort_by(-.count)
'
```

### Find tribe synergy candidates for a deck ("우리 덱 용족 5장, 더 넣을 후보?", "more Pirate cards to add?")

Step 1: figure out the user's class and current tribe count from the deck. Step 2: enumerate tribe candidates inside the same class.

```bash
HERO_CLASS=$(hs deck "$CODE" -f json | jq -r .heroClass)
TRIBE=DRAGON
# class-locked + neutral candidates that share the tribe:
hs card --search " " --class "$HERO_CLASS" -f json | jq --arg t "$TRIBE" '
  .[] | select(.race == $t or (.races // []) | index($t)) | {name, cost, attack, health, dbfId}
'
hs card --search " " --class NEUTRAL -f json | jq --arg t "$TRIBE" '
  .[] | select(.race == $t or (.races // []) | index($t)) | {name, cost, attack, health, dbfId}
'
```

### Average minion stats per mana ("3코 미니언 평균 스탯", "vanilla check for X-cost minions")

Useful for evaluating whether a custom card / class identity card is over- or under-statted versus the 2/cost vanilla benchmark.

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

### Win-condition / finisher detection ("이 덱 win con 뭐야?", "what's the closer?")

Heuristic: high-cost legendaries with damage / kill text. Combine cost threshold + rarity + Korean text greps.

```bash
hs deck "$CODE" -f json | jq '
  .cards[] | select(.card.rarity == "LEGENDARY" and .card.cost >= 5)
  | {name: .card.name, cost: .card.cost, type: .card.type, n: .count, text: .card.text}
'
```

### Find all DISCOVER / Battlecry-Discover engines ("발견 효과 카드 보여줘", "what runs Discover?")

Discover effects are tagged in `referencedTags` (not always in `mechanics`). Korean text key: `발견`.

```bash
hs card --search "발견" -f json | jq '
  .[] | select(.collectible and (.cardClass == "PRIEST"))   # tweak class
  | {name, cost, type, text}
'
```

### Locate cards with a specific keyword across the deck ("도발 / 은신 / 천보 누구 있어?")

```bash
hs deck "$CODE" -f json | jq --arg k "TAUNT" '
  .cards[] | select((.card.mechanics // []) | index($k))
  | {name: .card.name, cost: .card.cost, n: .count}
'
# Replace TAUNT with RUSH, DIVINE_SHIELD, LIFESTEAL, DEATHRATTLE, SECRET, etc.
```

### Multi-tribe card detection ("이 카드 다종족이야?", "ALL tribe?")

`races` array is set when a card belongs to more than one tribe (e.g. "Murloc + Beast" or "ALL").

```bash
hs deck "$CODE" -f json | jq '
  .cards[] | select((.card.races // []) | length > 1)
  | {name: .card.name, races: .card.races, n: .count}
'
```

### Important: `hs card --search` is Korean-only

The CLI matches against the `koKR` card name and text fields. **English / Japanese / Chinese / Spanish search strings will return 0 hits.** When the user types a query in another language:

```bash
# Wrong: search will return nothing
hs card --search "Doomhammer"
# Right: look up by cardId or dbfId if the user knows it
hs card EX1_567        # Doomhammer
# Right: translate to Korean first, then search
hs card --search "운명의 망치"
```

Use the multilingual class table in this skill as a cheat sheet for class words. For card names, ask the user for the Korean name, the cardId (`EX1_*`), or the dbfId (integer). The koKR-only behavior is a HearthstoneJSON data choice, not a CLI bug.

## Limitations

- **No user profile data**: Battle.net API has no Hearthstone profile endpoints. Cannot query saved decks, match history, or collection.
- **Deck code required**: User must paste the base64 deck code copied from the in-game share dialog.
- **Some old cards missing**: HearthstoneJSON does not cover every dbfId ever shipped. Removed or pre-Witchwood cards may surface as `Unknown (dbfId)`.
- **Offline-capable after first fetch**: Card data is cached locally for 24h.
