# hs-cli

**English** · [한국어](./README.ko.md) · [日本語](./README.ja.md) · [中文](./README.zh.md) · [Español](./README.es.md)

[![Bun](https://img.shields.io/badge/Bun_1.3-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![citty](https://img.shields.io/badge/citty-ECDC5A?style=flat&logo=unjs&logoColor=111827)](https://github.com/unjs/citty)
[![oxlint](https://img.shields.io/badge/oxlint-000000?style=flat&logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0NiIgdmlld0JveD0iMCAwIDQ4IDQ2Ij48cGF0aCBkPSJNMzAuMzE2NCA2Ljc4ODc2QzMwLjMxNjQgOC4wMzgxNyAzMS4zMjg5IDkuMDUwNjMgMzIuNTc4MyA5LjA1MDYzSDQxLjE2MDVDNDIuMTY4NyA5LjA1MDYzIDQyLjY3MjcgMTAuMjY5OSA0MS45NTk3IDEwLjk4MDhMMzAuOTc3NyAyMS45NjI3QzMwLjU1MzQgMjIuMzg3MSAzMC4zMTQzIDIyLjk2MjIgMzAuMzE0MyAyMy41NjMzVjI3LjMxOEMzMC4zMTQzIDI4Ljg3OTcgMzEuODYzMSAyOS45NjMzIDMzLjIzMzIgMjkuMjE3OUMzNC42MjkxIDI4LjQ1OTcgMzUuOTI4IDI3LjU0MiAzNy4xMDIgMjYuNDkwOEMzNy41NjczIDI2LjA3NSAzOC4yODI1IDI2LjA3MDcgMzguNzI0MSAyNi41MTQ1TDQ2LjcyMjUgMzQuNTEyOUM0Ny4xNjQyIDM0Ljk1NDUgNDcuMTY2MyAzNS42NzE4IDQ2LjcwOTYgMzYuMDk4NEM0MC42NDM1IDQxLjc3NDYgMzIuNDkgNDUuMjUxNCAyMy41MjY1IDQ1LjI1MTRDMTQuNTYzIDQ1LjI1MTQgNi40MDk0NyA0MS43NzQ2IDAuMzQzMzMyIDM2LjA5ODRDLTAuMTEzMzUxIDM1LjY3MTggLTAuMTExMTk3IDM0Ljk1NDUgMC4zMzA0MDggMzQuNTEyOUw4LjMyODgzIDI2LjUxNDVDOC43NzA0NCAyNi4wNzI5IDkuNDg1NjMgMjYuMDc1IDkuOTUwOTIgMjYuNDkwOEMxMS4xMjQ5IDI3LjU0MiAxMi40MjM5IDI4LjQ1OTcgMTMuODE5OCAyOS4yMTc5QzE1LjE5MiAyOS45NjMzIDE2LjczODcgMjguODc5NyAxNi43Mzg3IDI3LjMxOFYyMy41NjMzQzE2LjczODcgMjIuOTYyMiAxNi40OTk2IDIyLjM4NzEgMTYuMDc1MiAyMS45NjI3TDUuMDkzMjcgMTAuOTgwOEM0LjM4MDI0IDEwLjI2NzcgNC44ODQzMiA5LjA1MDYzIDUuODkyNDcgOS4wNTA2M0gxNC40NzQ3QzE1LjcyNDEgOS4wNTA2MyAxNi43MzY2IDguMDM4MTcgMTYuNzM2NiA2Ljc4ODc2VjEuMTMxOTFDMTYuNzM2NiAwLjUwNzIwNiAxNy4yNDI4IDAuMDAwOTc2NTYyIDE3Ljg2NzUgMC4wMDA5NzY1NjJIMjkuMTc5QzI5LjgwMzcgMC4wMDA5NzY1NjIgMzAuMzEgMC41MDcyMDYgMzAuMzEgMS4xMzE5MVY2Ljc4ODc2SDMwLjMxNjRaIiBmaWxsPSIjMDBGN0YxIi8%2BPC9zdmc%2B)](https://oxc.rs)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-D77757?style=flat&logo=anthropic&logoColor=white)](https://code.claude.com)

> Hearthstone CLI for AI agents and humans. Decode deck codes, look up cards, query metadata — no API key required. Built on **Bun**.

`hs-cli` is a fast, agent-friendly command-line tool that wraps the public [HearthstoneJSON](https://hearthstonejson.com/) data source and the `deckstrings` library to give you offline-capable Hearthstone deck and card data. Output is designed to be readable by both humans and LLM agents (Claude Code, Codex, etc.) without burning tokens on raw JSON.

## Why this exists

The Hearthstone ecosystem has libraries and one official Blizzard API, but **no production-grade CLI** and **no Claude-Code-ready integration**. This fills that gap. Decisions and tradeoffs are documented in [CLAUDE.md](./CLAUDE.md).

## Install

### Homebrew (macOS / Linux — recommended)

No runtime required. Installs a self-contained ~64 MB binary.

```bash
brew install say8425/tap/hs-cli
```

Supports darwin arm64/x64 and linux arm64/x64.

### npm (any OS with Node 24+)

```bash
npm install -g @say8425/hs-cli
```

Requires **Node 24+**. Bun is not required.

### Pre-built binary

Download the binary for your platform from [GitHub Releases](https://github.com/say8425/hs-cli/releases/latest), then make it executable:

```bash
chmod +x hs-<platform>
mv hs-<platform> /usr/local/bin/hs
```

Available platforms: darwin arm64/x64, linux arm64/x64, windows x64. No runtime required.

### From source (for development)

Requires **Bun 1.3+** ([install](https://bun.sh)).

```bash
git clone https://github.com/say8425/hs-cli.git hs-cli
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
Class:  Shaman (SHAMAN)
Format: Standard
Dust:   15,760
Cards:  30

Mana Curve
  1 █████ 4
  2 ████████████ 10
  3 ███ 2
  ...

Cards (30)
  ×2  (1) Earth Shock ·
  ×2  (1) Murloc Tidecaller ◇
  ×2  (2) Lorekeeper Polkelt ★
  ...
```

Rarity glyphs: `★` Legendary · `◆` Epic · `◇` Rare · `·` Common.

### Look up a card

```bash
hs card 1124              # by dbfId
hs card CS2_151           # by card ID
hs card --search "Zilliax"
hs card --search "fire" --class MAGE --cost 3
hs card --class MAGE --cost 3   # browse all 3-cost Mage cards (no --search needed)
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
hs card --search "Lich King" -f json | jq '.[].dbfId'
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

> "Analyze this deck: AAECAQcAA0VjgAEAAA=="
>
> "Find the cards that overlap between these two decks"
>
> "Recommend 3-mana cards for Priest"

The skill teaches the agent:

- Use `table` format by default (token-efficient)
- Reach for `json | jq` only when extracting specific fields
- Translate class names for Korean users
- Detect old/invalid deck codes by `Unknown (id)` markers in output

## Localization

`hs` defaults to **enUS**. Override with `-l, --locale <code>` on any command, or export `HS_CLI_LOCALE` to make it permanent.

```bash
hs deck <code> -l koKR              # decode with Korean card names
hs card --search "질리악스" -l ko   # search Korean name data
hs card --search "ジリアックス" -l jaJP  # search Japanese name data
export HS_CLI_LOCALE=ko            # permanent – all commands use Korean
```

**Supported locales (14):** `enUS` `enGB` `frFR` `deDE` `koKR` `esES` `esMX` `ruRU` `zhTW` `zhCN` `itIT` `ptBR` `plPL` `jaJP` `thTH`

Input is flexible — `ko`, `ko-KR`, `ko_KR`, and `koKR` all resolve to the same locale.

**Auto-detect order** (when `-l` is omitted): `HS_CLI_LOCALE` → `LC_ALL` → `LC_MESSAGES` → `LANG` → `LANGUAGE` → `enUS`

Card data is cached per locale at `~/.hs-cli/cards-<locale>.json` for 24h.

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
