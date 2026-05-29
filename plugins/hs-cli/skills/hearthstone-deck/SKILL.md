---
name: hearthstone-deck
description: Use when the user wants anything involving Hearthstone — decode/analyze/compare decks, look up cards by name or id, search cards with filters, or query game metadata (sets, classes, card types, rarities). Triggers on deck-code strings (base64 starting with "AAEC", "AAEB", "AAEA"), Hearthstone in any language or community nickname (HS, Blizzard Hearthstone; 하스스톤, 하스, 돌겜, 하섭; ハースストーン, ハース, ハスス; 炉石传说, 炉石, 炉石酒馆战棋; 爐石戰記, 爐石, 爐戰; Hearth, Pedra do Lar; Хартстоун, Хартса), mode keywords in any language (Standard / Wild / Twist / Arena / Battlegrounds / BG; 정규 / 야생 / 전장 / 투기장 / 선술집난투 / 용병단; 标准 / 狂野 / 酒馆战棋 / 竞技场), mana-curve/dust/win-condition/meta/nerf discussion, single-card lookups, name searches in any language, class/format/expansion queries, and current-meta tier-list / win-rate / best-deck questions (tier list, winrate, what's strong/best, 메타/티어/승률/무슨 덱이 좋아, ティア/勝率, 强势/胜率/上分).
---

# Hearthstone CLI (decks, cards, metadata)

Use the `hs` CLI to decode deck codes, look up and search cards, and query game metadata for any agent task that involves Hearthstone.

This skill covers the full surface of the `hs` CLI:

- `hs deck <code>` — decode and summarize a deck code
- `hs card <dbfId|cardId|name>` — single-card lookup
- `hs card --search <q> [--class CLASS] [--cost N]` — name + filter search
- `hs meta sets|classes|types|rarities` — game metadata
- `hs meta archetypes` — live archetype win rates + tiers (current meta, Firestone data)
- `hs meta decks` — live top decks with deck codes (current meta, Firestone data)

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

The CLI defaults to `enUS` data. When the user passes `-l ko` or has `HS_CLI_LOCALE=ko` set, output will contain Korean (Hangul) class and card names. Use the table to translate output for the user's prompt language and to recognize community slang as a trigger.

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

Default locale is **enUS**. Use `-l ko` (or `HS_CLI_LOCALE=ko`) for Korean card names.

## Global flags

Every subcommand accepts:

- `-f, --format <table|json>` — output format. Default `table` (agent-friendly compressed). Switch to `json` only to extract specific fields.
- `-l, --locale <code>` — card data locale. Default `enUS`. Accepts short forms: `ko`, `ko-KR`, `koKR` all resolve to `koKR`. Supported: `enUS` `enGB` `frFR` `deDE` `koKR` `esES` `esMX` `ruRU` `zhTW` `zhCN` `itIT` `ptBR` `plPL` `jaJP` `thTH`.
- `--help` — show usage for the subcommand.

Top-level: `hs --version`, `hs --help`.

## Command reference

### `hs deck <code>`

Decode a deck code into a card list. Reports class, format, dust cost, mana curve, and the 30 cards.

- Positional `<code>`: **required**, base64 deck code (typically starts with `AAEC` / `AAEB` / `AAEA`).
- Exit code: `0` if the code decodes cleanly, `1` if invalid or corrupted.

```bash
hs deck AAECAQcAA0VjgAEAAA==                  # table (default, enUS)
hs deck AAECAQcAA0VjgAEAAA== -l koKR          # Korean card names
hs deck AAECAQcAA0VjgAEAAA== -f json          # raw JSON
```

### `hs card <id|name>`

Single-card lookup. The positional accepts a dbfId (numeric), a cardId (string), or a name. Resolution order:

1. If the value parses as an integer → `findCardByDbfId`.
2. Else → `findCardById` (exact cardId match like `EX1_572`).
3. If `findCardById` returns nothing → fallback to `searchCards(query)` and pick the first match.

- Positional: **optional** in the CLI signature, but **either the positional or `--search` must be provided**. Otherwise the CLI exits with `Provide a card ID, dbfId, or use --search`.

```bash
hs card 64034                                 # by dbfId (enUS, default)
hs card EX1_572                               # by cardId
hs card "Lich King"                           # by name (enUS data)
hs card "리치 왕" -l ko                        # Korean name (koKR data)
hs card EX1_572 -f json | jq .cost            # extract a single field
```

### `hs card --search <query>`

Substring search with optional filters. Both `--search` and `-s` (short alias) work.

- `--search, -s <string>` — substring match against card name (active-locale field). The query is trimmed; a blank or whitespace-only value (`""`, `" "`) acts as a **match-all wildcard**.
- `--class <CLASS>` — one of `DEATHKNIGHT, DEMONHUNTER, DRUID, HUNTER, MAGE, PALADIN, PRIEST, ROGUE, SHAMAN, WARLOCK, WARRIOR, NEUTRAL, WHIZBANG, DREAM`. Case-insensitive (CLI uppercases internally).
- `--cost <N>` — mana cost. Accepts a string; CLI parses it as an integer.

Browse mode: passing `--class` and/or `--cost` **without** `--search` lists every card matching those filters. An empty/whitespace `--search` does the same. (Bare `hs card` with no positional and no filter still errors.)

```bash
hs card --search "Zilliax"                     # enUS (default)
hs card --search "질리악스" -l ko              # Korean search
hs card -s "fire" --class MAGE --cost 3
hs card --class PRIEST --cost 3                # browse all 3-cost priest cards
hs card --search "" --class PRIEST --cost 3    # same (blank search = wildcard)
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

Multi-step workflows live in domain-specific reference files. Read the file that matches the user's question — each one has a table of contents at the top so you can jump straight to the recipe by name.

| File | When to read |
|---|---|
| [recipes/deck.md](recipes/deck.md) | User asks about a specific deck — curve, dust, rarity, tribe count, mechanic / keyword breakdown, draw count, win condition, archetype, missing cards, Standard/Wild risk, deck diff. |
| [recipes/card.md](recipes/card.md) | User asks about specific cards — stat compare, name resolution across locales, candidate enumeration (class + cost + tribe), vanilla baselines, Discover engines. |
| [recipes/meta.md](recipes/meta.md) | User asks about classes / sets / types / rarities — class-code normalization from slang, dust cheat-sheet, filtering Battlegrounds-only types, set membership. |

These recipes target the questions Hearthstone players actually ask in communities. Surveyed (2026-05): Reddit `/r/hearthstone`, `/r/CompetitiveHS`, `/r/wildhearthstone`; Hearthstone Top Decks, HSReplay.net meta reports, Vicious Syndicate Data Reaper Report; 인벤 하스 갤러리, 하스스터디; NGA 炉石区, 旅法师营地; 5ch ハース板. Recurring asks the recipes cover: dust to craft, mana-curve health, archetype identification, board-clear and heal/armor counts, burst potential, Highlander validation, mulligan, tribe/keyword synergy, rotation risk, card-name translation.

### Shared JSON shape

All recipe files assume this contract:

```text
hs deck <code> -f json
{ "heroClass": "WARRIOR", "heroDbfId": 7, "format": "standard"|"wild",
  "cards": [ { "card": { ... }, "count": 1|2 }, ... ] }

hs card <id|name> -f json    # one card object
hs card --search ... -f json # array of card objects

hs meta <type> -f json
{ "type": "sets"|"classes"|"types"|"rarities", "values": [ ... ] }
```

Inner card object keys: `artist, attack, cardClass, collectible, cost, dbfId, flavor, health, id, mechanics[], name, race, races[], rarity, referencedTags[], set, spellSchool, text, type`. `mechanics` / `referencedTags` may be null or absent entirely — guard with `// []` in jq. `race` is a single tribe; `races` is the multi-tribe array (e.g. Murloc + Beast, or `ALL`). `spellSchool` is set only on `type == "SPELL"`. `text` / `name` follow the active locale (default `enUS`; use `-l <code>` to switch).

Deck JSON does NOT include total dust or mana curve — only the `table` format renders those. Compute via jq when needed (recipes/deck.md → "Total dust cost", "Mana-curve breakdown"). `hs meta` returns raw English enum codes; Standard/Wild rotation tags and localized labels come from the tables in this SKILL.md or from official Blizzard pages.

## Limitations

- **No user profile data**: Battle.net API has no Hearthstone profile endpoints. Cannot query saved decks, match history, or collection.
- **Deck code required**: User must paste the base64 deck code copied from the in-game share dialog.
- **Some old cards missing**: HearthstoneJSON does not cover every dbfId ever shipped. Removed or pre-Witchwood cards may surface as `Unknown (dbfId)`.
- **Offline-capable after first fetch**: Card data is cached locally for 24h.
