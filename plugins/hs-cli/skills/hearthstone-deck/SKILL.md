---
name: hearthstone-deck
description: Use when the user wants to inspect, compare, analyze, or look up Hearthstone decks or cards. Triggers on deck-code strings (base64 starting with "AAEC", "AAEB", "AAEA"), mentions of Hearthstone or its localized names and nicknames (HS, Blizzard Hearthstone, 하스스톤, 하스, ハースストーン, ハース, 炉石传说, 炉石, 爐石戰記, 爐石, Pedra do Lar), card lookups by name/dbfId/cardId, deck comparison or sideboard analysis, mana-curve/dust/win-condition discussion, class/format/expansion queries, or Wild/Standard/Twist/Battlegrounds/Arena questions.
---

# Hearthstone Deck Analysis

Use the `hs` CLI to decode deck codes, look up cards, and query game metadata for any agent task that involves Hearthstone.

## Language and naming triggers

This skill applies whenever the user references Hearthstone in any language. Common names and nicknames to recognize:

- English: Hearthstone, HS, Blizzard Hearthstone
- 한국어: 하스스톤, 하스, HS
- 日本語: ハースストーン, ハース, HS
- 中文 (简体): 炉石传说, 炉石, 炉石卡牌, HS
- 中文 (繁體): 爐石戰記, 爐石, HS
- Português: Hearthstone, HS, Pedra do Lar (colloquial)
- Español / Français / Deutsch: Hearthstone, HS (no official localized title)
- Mode / format keywords: Standard, Wild, Twist, Classic, Arena, Battlegrounds (BG), Mercenaries, Duels

Treat all of the above as triggers. The CLI itself returns Korean card names by default (the data source is HearthstoneJSON `koKR`), so output may contain Hangul even when the user's prompt language is something else — this is expected.

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

## Quick Start

```bash
hs deck <code>                                # decode deck -> table (default)
hs deck <code> -f json                        # decode deck -> raw JSON
hs card <dbfId>                               # single card by dbfId
hs card <cardId>                              # single card by ID (e.g. EX1_591)
hs card --search "Lich King"                  # search by name (English or Korean both work)
hs card --search "Zilliax" --class MAGE --cost 3  # filtered search
hs meta sets|classes|types|rarities           # game metadata
```

## Output Formats

- `table` (default): agent-friendly compressed output — class, format, dust, mana curve, card list
- `json`: full structured data for programmatic use

Use `table` first to minimize token usage. Switch to `json` only when extracting specific fields for computation or diff.

## DO

- Use table format by default for token efficiency.
- When comparing decks, decode both and diff by card name + count.
- Report mana curve shape as a quick health check (top-heavy? no early game? double-peak?).
- For "how is this deck?" style questions in any language, check: mana curve balance, dust cost, legendary count, identifiable win condition.
- Translate class names for the user's prompt language when helpful (table output includes both localized and English class codes).
- Pass deck-code search queries directly to `hs card --search` — the CLI handles both English and Korean strings against the `koKR` dataset.

## DO NOT

- Do not dump raw JSON of a 30-card deck into context without reason. Use table format first; extract specific cards only when needed.
- Do not guess card names from IDs. Always use `hs card <id>` to resolve.
- Do not assume all dbfIds resolve. Some very old or removed cards show as `Unknown (dbfId)`. This is a HearthstoneJSON data gap, not a bug.
- Do not run `hs meta` repeatedly. Cache the output in working memory for the session.
- Do not invoke the Battle.net API as a fallback for missing cards — the official endpoint silently drops the same unknown dbfIds (verified 2026-05-28).

## Recipes

### Deck summary (most common request)

```bash
hs deck <code>
```

### Compare two decks

```bash
hs deck $A -f json > /tmp/a.json
hs deck $B -f json > /tmp/b.json
# Then diff card lists programmatically.
```

### Find replacement cards at the same cost / class

```bash
hs card --search "" --class PRIEST --cost 3
# Browse alternatives at the same mana cost and class.
```

### Check if a deck code is syntactically valid

```bash
hs deck <code> 2>&1
# Exit code 0 = valid, 1 = invalid or corrupted.
```

### Resolve a single dbfId quickly

```bash
hs card 64034                                 # by dbfId
hs card EX1_572 -f json | jq .cost            # by cardId, extract a field
```

## Limitations

- **No user profile data**: Battle.net API has no Hearthstone profile endpoints. Cannot query saved decks, match history, or collection.
- **Deck code required**: The user must paste the base64 deck code copied from the in-game share dialog.
- **Some old cards missing**: HearthstoneJSON does not cover every dbfId ever shipped. Removed or pre-Witchwood cards may surface as `Unknown (dbfId)`.
- **Offline-capable after first fetch**: Card data is cached locally for 24h.

## Future (Phase 2, not yet shipped)

- `hs log parse` — Power.log parsing for match history (requires `python-hslog` subprocess).
- `hs log show <match-id>` — individual match replay data.
- `hs log watch` — real-time tail during play.
- Battle.net OAuth integration for server-side deck validation via an optional `--verify` flag.
