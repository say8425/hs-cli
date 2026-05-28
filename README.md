# hs-cli

**English** · [한국어](./README.ko.md) · [日本語](./README.ja.md) · [中文](./README.zh.md) · [Español](./README.es.md)

> Hearthstone CLI for AI agents and humans. Decode deck codes, look up cards, query metadata — no API key required. Built on **Bun**.

`hs-cli` is a fast, agent-friendly command-line tool that wraps the public [HearthstoneJSON](https://hearthstonejson.com/) data source and the `deckstrings` library to give you offline-capable Hearthstone deck and card data. Output is designed to be readable by both humans and LLM agents (Claude Code, Codex, etc.) without burning tokens on raw JSON.

## Why this exists

The Hearthstone ecosystem has libraries and one official Blizzard API, but **no production-grade CLI** and **no Claude-Code-ready integration**. This fills that gap. Decisions and tradeoffs are documented in [CLAUDE.md](./CLAUDE.md).

## Install

Requires **Bun 1.3+** ([install](https://bun.sh)). No Node, no pnpm, no tsx.

```bash
git clone <repo> hs-cli
cd hs-cli
bun install
bun run build
bun link            # makes `hs` available everywhere
```

Verify:

```bash
hs --version
hs deck "AAECAQcAA0VjgAEAAA=="
```

## Usage

### Decode a deck

```bash
hs deck <deckcode>
```

```
Class:  주술사 (SHAMAN)
Format: 정규
Dust:   15,760
Cards:  30

Mana Curve
  1 █████ 4
  2 ████████████ 10
  3 ███ 2
  ...

Cards (30)
  ×2  (1) 대지 충격 ·
  ×2  (1) 진흙 핥짝이 ◇
  ×2  (2) 전승지기 초 ★
  ...
```

Rarity glyphs: `★` Legendary · `◆` Epic · `◇` Rare · `·` Common.

### Look up a card

```bash
hs card 1124              # by dbfId
hs card CS2_151           # by card ID
hs card --search "질리악스"
hs card --search "fire" --class MAGE --cost 3
```

### Query metadata

```bash
hs meta classes           # all 14 classes
hs meta sets              # every release set
hs meta rarities          # FREE, COMMON, RARE, EPIC, LEGENDARY
hs meta types             # MINION, SPELL, WEAPON, HERO, ...
```

### JSON output

Add `-f json` to any command for raw structured data:

```bash
hs deck <code> -f json | jq '.cards | length'
hs card --search "리치 왕" -f json | jq '.[].dbfId'
```

## Agent integration

This repo doubles as a **Claude Code marketplace** that exposes the [`hs-cli` plugin](./plugins/hs-cli/). Install it once and Claude Code learns to drive the CLI for you:

```
/plugin marketplace add say8425/hs-cli
/plugin install hs-cli@say8425
```

For local development:

```bash
claude --plugin-dir ./plugins/hs-cli
```

The plugin ships the [`hearthstone-deck` skill](./plugins/hs-cli/skills/hearthstone-deck/SKILL.md), namespaced as `/hs-cli:hearthstone-deck`.

Then ask your agent things like:

> "이 덱 분석해줘: AAECAQcAA0VjgAEAAA=="
>
> "두 덱의 공통 카드를 찾아줘"
>
> "사제 직업으로 마나 3 카드 추천해줘"

The skill teaches the agent:

- Use `table` format by default (token-efficient)
- Reach for `json | jq` only when extracting specific fields
- Translate class names for Korean users
- Detect old/invalid deck codes by `Unknown (id)` markers in output

## Architecture

```
src/
├── index.ts           # citty runMain, registers subcommands
├── commands/
│   ├── deck.ts        # `hs deck <code>` — defineCommand
│   ├── card.ts        # `hs card <q>` / `--search`
│   └── meta.ts        # `hs meta <type>`
├── services/
│   ├── card-db.ts     # HearthstoneJSON fetch + 24h disk cache at ~/.hs-cli/
│   ├── deck-decoder.ts # wraps `deckstrings` npm, joins with card DB
│   └── formatter.ts   # table / json output
└── types/index.ts
```

### Data source: HearthstoneJSON (not Battle.net API)

Verified 2026-05-28 that HearthstoneJSON — which extracts directly from the game client's `CardDefs.xml` — is **more accurate** than Blizzard's official `/hearthstone/cards` API:

| | HearthstoneJSON | Battle.net API |
|---|---|---|
| Source | Game client extract | API gateway (downstream of game data) |
| Update lag | Hours after each patch | Slower |
| Missing dbfIds | Shows `Unknown (id)` | **Silently drops them** |
| Battlegrounds coverage | Better | Has gaps |
| Auth required | No | OAuth client credentials |
| Offline-capable | Yes (24h cache) | No |

Battle.net API integration was researched and intentionally **not** added — it doesn't fix the "unknown card" problem and adds complexity. See [CLAUDE.md](./CLAUDE.md) for the full reasoning.

## Toolchain

| Tool | Purpose |
|------|---------|
| **Bun 1.3+** | Runtime + package manager + test runner + bundler (replaces Node + pnpm + tsx + Vitest) |
| **TypeScript 6** | Source language (tsc used for typecheck only — Bun runs TS natively) |
| **citty** | CLI argument parsing (unjs, type-inferred, ESM-first) |
| **oxlint** | Linter (no ESLint) — strict correctness/perf, arrow-only style |
| **oxfmt** | Formatter (no Prettier) |
| **bun:test** | Test runner with Jest-compatible API (no Vitest/Jest/node:test) |
| **deckstrings** | HearthSim official deck code codec |

## Development

```bash
bun run dev deck <code>    # run via Bun, no build needed (native TS)
bun test                   # run all tests
bun run lint               # oxlint
bun run lint:fix           # auto-fix
bun run fmt                # oxfmt write
bun run fmt:check          # oxfmt check (CI)
bun run typecheck          # tsc --noEmit
bun run check              # lint + fmt:check + typecheck + test
bun run build              # bun build → dist/ (minified)
```

## Roadmap

### Phase 1 — ✅ complete

- [x] `hs deck` — decode deck codes
- [x] `hs card` — single + search
- [x] `hs meta` — sets/classes/types/rarities
- [x] Local cache, agent-friendly output, SKILL.md
- [x] Bun-native (no Node dependency)

### Phase 2 — planned

- [ ] `hs log parse` — parse Hearthstone's `Power.log` via [python-hslog](https://github.com/HearthSim/python-hslog) subprocess
- [ ] `hs log show <match-id>` — replay individual matches
- [ ] `hs log watch` — real-time tail during play
- [ ] Battle.net OAuth integration as an optional `--verify` flag for official deck validation

Phase 2 is PC/Mac-only (Power.log doesn't exist on mobile/console).

## What this can't do

Phase 1 limitations — these are not bugs:

- ❌ **My saved decks** — Blizzard's API has no Hearthstone profile endpoints (WoW/D3 do; Hearthstone never got one)
- ❌ **Match history / win rate / collection** — same reason
- ❌ **Battlegrounds tavern minions** — partial coverage in both data sources
- ❌ **Pre-Witchwood removed cards** — some very old `dbfId`s show as `Unknown (id)` in both HearthstoneJSON and the official API

If your decoded deck is full of `Unknown (id)` for a deck that worked yesterday, the source code is corrupted or the deck is from an account that hasn't synced.

## Contributing

This is an early-stage personal project but PRs are welcome. Open an issue first for non-trivial changes.

Style is enforced by oxlint — `bun run check` must pass.

## License

MIT
