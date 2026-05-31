# hs-cli plugin

Claude Code plugin that wraps the [`hs` CLI](https://github.com/say8425/hs-cli) for Hearthstone deck and card analysis.

## What this plugin gives Claude

A `hearthstone-deck` skill that teaches Claude how to:

- Decode Hearthstone deck codes (base64 strings starting with `AAEC`)
- Look up cards by dbfId / card ID / name
- Compare two decks, analyze mana curve, suggest replacements
- Use token-efficient `table` output by default and only reach for `json | jq` when extracting specific fields

The skill auto-triggers when the user pastes a deck code, asks "이 덱 분석해줘", or otherwise references Hearthstone deck/card analysis.

## Prerequisite: install the `hs` CLI

The skill is a **wrapper around the `hs` binary**, not a self-contained tool. You must install the CLI separately:

```bash
git clone https://github.com/say8425/hs-cli.git
cd hs-cli
bun install
bun run build
bun link            # makes `hs` available globally
```

Requires [Bun 1.3+](https://bun.sh). The first `hs` command fetches card data from HearthstoneJSON CDN (~3 MB) and caches it at `~/.hs-cli/` for 24h.

Verify before using the plugin:

```bash
hs --version
hs deck "AAECAQcAA0VjgAEAAA=="
```

### Install the Claude Code skill

The `hs` CLI ships the `hearthstone-deck` skill. After installing the CLI:

```bash
hs skill install              # interactive: pick agents
hs skill install --agent claude   # non-interactive
```

Cross-agent install via [skills.sh](https://www.skills.sh/) (Cursor, Codex, Copilot, OpenCode):

```bash
npx skills add say8425/hs-cli
```

## Install the plugin

From the marketplace:

```
/plugin marketplace add say8425/hs-cli
/plugin install hs-cli@say8425
```

Or test locally during development:

```bash
claude --plugin-dir ./plugins/hs-cli
```

## Usage

Once installed, just talk to Claude:

> "이 덱 분석해줘: AAECAQcAA0VjgAEAAA=="
>
> "두 덱 비교: <code A> vs <code B>"
>
> "사제 3코스트 카드 추천"

Or invoke explicitly: `/hs-cli:hearthstone-deck`.

## Live meta (win rates, tiers, deck codes)

`hs meta archetypes` and `hs meta decks` show current constructed win rates, tiers, and deck codes.

```bash
hs meta archetypes --game-format standard --rank legend --period past-7
hs meta decks --rank top-2000-legend -f json
```

Flags: `--game-format standard|wild|twist`, `--rank legend|top-2000-legend|competitive|legend-diamond|diamond|platinum|bronze-gold|all`, `--period last-patch|past-3|past-7|past-20|current-season`, `--min-games N`, `--sort wilson|winrate|games`, `--limit N`. Rows are ranked by the Wilson lower bound (not raw win rate) and show a ±margin-of-error column.

Data: **Firestone** (firestoneapp.com), used with permission. Deck codes from `hs meta decks` can be piped into `hs deck <code>`.

## Scope (Phase 1)

- ✅ Deck code decoding (offline-capable after first fetch)
- ✅ Card lookup + search with class/cost filters
- ✅ Game metadata (sets, classes, types, rarities)
- ✅ Live meta stats: archetype win rates, tiers, deck codes (Firestone)
- ❌ Match history / win rate (Phase 2 — requires Power.log parsing)
- ❌ "My saved decks" (Blizzard API has no Hearthstone profile endpoint — no workaround exists)

See the [main repo README](../../README.md) for the full design rationale, data source comparison (HearthstoneJSON vs Battle.net API), and roadmap.
