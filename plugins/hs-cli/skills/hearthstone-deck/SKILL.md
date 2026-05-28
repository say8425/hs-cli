---
description: Use when the user wants to inspect, compare, or analyze Hearthstone decks or cards. Triggers on deck codes (long base64 strings starting with "AAEC"), questions like "이 덱 뭐야", "덱 분석해줘", card lookups, or requests to compare decks.
---

# Hearthstone Deck Analysis

## Prerequisites

This skill requires the `hs` CLI binary on PATH. Install it once with Bun before using the skill:

```bash
git clone https://github.com/penguin/hs-cli.git
cd hs-cli && bun install && bun run build && bun link
hs --version    # verify
```

Card data is auto-fetched from HearthstoneJSON CDN on first use (cached 24h at `~/.hs-cli/`). No API key needed.

If `hs` is not on PATH, tell the user to install per the steps above before running any commands in this skill.

## Quick Start

```bash
hs deck <code>                  # decode deck → table (default)
hs deck <code> -f json          # decode deck → raw JSON
hs card <dbfId>                 # single card by dbfId
hs card <cardId>                # single card by ID (e.g. EX1_591)
hs card --search "리치 왕"      # search by name
hs card --search "드루이드" --class DRUID --cost 3  # filtered search
hs meta sets|classes|types|rarities  # game metadata
```

## Output Formats

- `table` (default): agent-friendly compressed output — class, format, mana curve, card list
- `json`: full structured data for programmatic use

Always use `table` first to minimize token usage. Only use `json` when you need specific fields for computation.

## DO NOT

- Put raw JSON of 30-card decks into context without reason — use table format first, extract specific cards only when needed
- Guess card names from IDs. Always use `hs card <id>` to resolve
- Assume all dbfIds resolve — some very old/removed cards show as "Unknown (dbfId)". This is a HearthstoneJSON data gap, not a bug
- Run `hs meta` repeatedly — cache the output in your working memory for the session

## DO

- Use table format by default for token efficiency
- When comparing decks, decode both and diff by card name + count
- Report mana curve shape as a quick health check (too top-heavy? no early game?)
- For "이 덱 어때?" questions: check mana curve balance, dust cost, legendary count, win condition identification
- Translate class names for Korean users (table output includes both KO and EN)

## Recipes

### Deck summary (most common request)

```bash
hs deck <code>
```

### Compare two decks

```bash
hs deck $A -f json > /tmp/a.json
hs deck $B -f json > /tmp/b.json
# Then diff card lists programmatically
```

### Find replacement cards

```bash
# User wants to replace an expensive card
hs card --search "" --class PRIEST --cost 3
# Browse alternatives at same mana cost + class
```

### Check if deck code is valid

```bash
hs deck <code> 2>&1
# Exit code 0 = valid, 1 = invalid
```

## Limitations

- **No user profile data**: Battle.net API has no Hearthstone profile endpoints. Cannot query "my saved decks", match history, or collection
- **Deck code required**: User must provide the base64 deck code from the game client (copy from deck → share)
- **Some old cards missing**: HearthstoneJSON doesn't cover every dbfId ever created. Very old/removed cards show as Unknown
- **Offline-capable after first fetch**: Card data cached locally for 24h

## Future (Phase 2)

- `hs log parse` — Power.log parsing for match history (requires python-hslog)
- `hs log show <match-id>` — individual match replay data
- Battle.net OAuth integration for server-side deck validation with `locale=ko_KR`
