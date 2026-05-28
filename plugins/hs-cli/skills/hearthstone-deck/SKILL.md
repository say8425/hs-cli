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

### Korean class names (used by table output)

The CLI returns Korean class names by default (data source is HearthstoneJSON `koKR`), so output may contain Hangul even when the prompt language is something else — this is expected.

| Class code | 한국어 |
|---|---|
| DEATHKNIGHT | 죽음의 기사 |
| DEMONHUNTER | 악마 사냥꾼 |
| DRUID | 드루이드 |
| HUNTER | 사냥꾼 |
| MAGE | 마법사 |
| PALADIN | 성기사 |
| PRIEST | 사제 |
| ROGUE | 도적 |
| SHAMAN | 주술사 |
| WARLOCK | 흑마법사 |
| WARRIOR | 전사 |
| NEUTRAL | 중립 |

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

Passing `--search ""` (empty) plus a filter is a valid way to "browse all X-cost Y-class cards".

```bash
hs card --search "Zilliax"
hs card -s "fire" --class MAGE --cost 3
hs card --search "" --class PRIEST --cost 3   # browse all 3-cost priest cards
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

### Compare two decks

```bash
hs deck "$A" -f json > /tmp/a.json
hs deck "$B" -f json > /tmp/b.json
# Diff card lists programmatically with jq / node / etc.
diff <(jq -r '.cards[] | "\(.count) \(.name)"' /tmp/a.json | sort) \
     <(jq -r '.cards[] | "\(.count) \(.name)"' /tmp/b.json | sort)
```

### Identify expensive cards to swap

```bash
hs deck <code> -f json | jq '.cards[] | select(.rarity == "LEGENDARY") | {name, dust}'
```

### Suggest replacements at the same cost/class

```bash
# 1) Inspect target card to learn its class and cost.
hs card <id> -f json
# 2) Browse alternatives at that cost + class.
hs card --search "" --class PRIEST --cost 3
```

### Validate user input before running deeper analysis

```bash
if ! hs deck "$CODE" > /dev/null 2>&1; then
  echo "Invalid deck code"
  exit 1
fi
hs deck "$CODE"          # safe to run table summary now
```

### Resolve a card name when language is ambiguous

```bash
# Try English first; fall back to Korean if no match.
hs card --search "$Q" || hs card --search "$Q_KO"
```

## Limitations

- **No user profile data**: Battle.net API has no Hearthstone profile endpoints. Cannot query saved decks, match history, or collection.
- **Deck code required**: User must paste the base64 deck code copied from the in-game share dialog.
- **Some old cards missing**: HearthstoneJSON does not cover every dbfId ever shipped. Removed or pre-Witchwood cards may surface as `Unknown (dbfId)`.
- **Offline-capable after first fetch**: Card data is cached locally for 24h.
