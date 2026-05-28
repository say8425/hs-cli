# hs-cli

Hearthstone CLI for AI agents. Decode deck codes, look up cards, query metadata.

## Toolchain (dev / build)

- **Bun 1.3+** as dev runtime, package manager, test runner, and bundler. **No Node, no pnpm, no tsx** for development.
- **citty** for CLI parsing (unjs, ESM-first, type-inferred). **No commander.**
- **oxlint + oxfmt** for lint/format. `tsc` for typecheck only. **No ESLint, no Prettier.**
- **bun:test** for testing (Jest-compatible API). **No Vitest/Jest/node:test.**

Note: Bun is a **development** requirement, not an end-user install requirement. End users install via Homebrew (no runtime), npm (Node 22+), or a pre-built binary (no runtime).

## Commands

```bash
bun install                         # install deps + lockfile (bun.lock)
bun run dev deck <code>             # run via Bun (native TS, no build)
bun run build                       # bun build → dist/ (minified, ~95KB)
bun link                            # install `hs` globally
bun test                            # bun's built-in test runner
bun run lint                        # oxlint
bun run lint:fix                    # oxlint --fix
bun run fmt                         # oxfmt src tests (writes)
bun run fmt:check                   # oxfmt src tests --check (CI)
bun run typecheck                   # tsc --noEmit
bun run check                       # lint + fmt:check + typecheck + test
hs deck <code> [-l koKR]            # decode deck (table format default)
hs card <dbfId|cardId|name> [-l koKR]  # card lookup
hs card --search <q> --class CLASS [-l koKR]  # filtered search
hs meta sets|classes|types|rarities [-l koKR]
```

Add `-f json` to any command for raw JSON. Default `table` format is agent-friendly (compressed).

## Marketplace + plugin layout

This repo is both a **Bun CLI project** and a **Claude Code marketplace** that distributes the `hs-cli` plugin. Layout:

```
.claude-plugin/marketplace.json         # marketplace catalog, lists plugins
plugins/hs-cli/
├── .claude-plugin/plugin.json          # plugin manifest
├── README.md                           # plugin-specific install + usage
└── skills/hearthstone-deck/SKILL.md    # the skill itself, namespace hs-cli:hearthstone-deck
```

Install channels for end users (CLI):

- **Homebrew** (macOS/Linux, recommended): `brew install say8425/tap/hs-cli` — no runtime required, ~64 MB self-contained binary, 4 platforms (darwin arm64/x64, linux arm64/x64).
- **npm**: `npm install -g @say8425/hs-cli` — requires Node 22+, Bun not needed (build target=node).
- **Pre-built binary**: download from [GitHub Releases](https://github.com/say8425/hs-cli/releases/latest), `chmod +x`, move to PATH — no runtime required, 5 platforms (+ windows x64).
- **From source (dev)**: `git clone + bun install + bun run build + bun link` — requires Bun 1.3+.

Claude Code plugin install (all channels): `/plugin marketplace add say8425/hs-cli` + `/plugin install hs-cli@say8425`. Validate with `claude plugin validate .` (marketplace) or `claude plugin validate ./plugins/hs-cli` (plugin).

**Do not duplicate SKILL.md at the repo root.** The single source of truth lives inside the plugin. Root-level docs should link to it, not copy it.

## Architecture

- `src/index.ts` — citty `runMain`, registers subcommands
- `src/commands/` — one file per command (deck/card/meta), each exports `defineCommand` instance
- `src/services/card-db.ts` — HearthstoneJSON CDN fetch + local cache at `~/.hs-cli/`
- `src/services/deck-decoder.ts` — wraps `deckstrings` npm, joins with card DB
- `src/services/formatter.ts` — table/json output. **Add new formatters here, not in commands.**
- `src/services/locale.ts` — locale detection + normalization (`ko` / `ko-KR` / `ko_KR` / `koKR` → `koKR`)
- `src/types/index.ts` — `Card`, `Deck`, `DeckCard` types + Korean class name map
- `tests/` — bun:test files, one per service. Imports use `.ts` extension (Bun resolves native TS).
- `tsconfig.json` — typecheck + IDE config. `noEmit: true`, `allowImportingTsExtensions: true`. No separate build config.

## Locales

14 locales supported: `enUS`, `enGB`, `frFR`, `deDE`, `koKR`, `esES`, `esMX`, `ruRU`, `zhTW`, `zhCN`, `itIT`, `ptBR`, `plPL`, `jaJP`, `thTH`.

Default locale is **enUS**. Override per command with `-l <code>` or set permanently via `HS_CLI_LOCALE`.

Auto-detect order: `HS_CLI_LOCALE` → `LC_ALL` → `LC_MESSAGES` → `LANG` → `LANGUAGE` → `enUS`.

Input normalization: `ko`, `ko-KR`, `ko_KR`, `koKR` all resolve to `koKR` (same for all locales).

Card data is cached per locale at `~/.hs-cli/cards-<locale>.json` (24h TTL).

## Data source: HearthstoneJSON, NOT Battle.net API

We verified 2026-05-28 that HearthstoneJSON (extracts directly from game client `CardDefs.xml`) is more accurate than Blizzard's official API:

- Battle.net `/hearthstone/deck` **silently drops unknown dbfIds** (returns deck minus those cards, no warning)
- HearthstoneJSON shows `Unknown (dbfId)` so agents can detect the gap
- Both miss the same ancient/removed cards — API fallback does NOT fix this
- HearthstoneJSON updates within hours of each game patch (verified: 2026-05-19 build)

**Do not add Battle.net API as a fallback for missing cards.** It won't help. Only consider it for: server-side errata catch, official deck validation, or Battlegrounds expansion (where API has worse coverage anyway).

## Code style (enforced by oxlint)

- **Arrow functions only for module-level fns** (`func-style: expression, allowArrowFunctions`). Use `const fn = () => {}` not `function fn() {}`.
- **citty pattern**: each command is `defineCommand({ meta, args, run })`. Aggregate via `subCommands` in `src/index.ts`. Use `runMain(rootCommand)` — never `program.parse()`.
- Bun runs TypeScript natively. Imports between source files use `.ts` extension (not `.js`). The previous Node convention of using `.js` imports for `.ts` source no longer applies.
- Immutable patterns. Use `readonly` on types. Spread to update, `toSorted()` over `sort()`.
- `String.replaceAll()` over `replace(/g)`. No `null` literals in new code (use `undefined`).
- `process.stderr.write` for warnings/diagnostics, `process.stdout.write` for data. **Never `console.log` in CLI commands** — it pollutes stdout and breaks piping. `console.error`/`console.warn` allowed.
- Exit code 0 success, 1 user/data error.
- No `any` — use `unknown` and narrow. `typescript/consistent-type-imports` enforced.
- Filenames kebab-case (enforced by `unicorn/filename-case`).

If oxlint complains, fix the code — don't disable rules. The config is intentionally strict on correctness + perf, lax on pedantic style.

## Test conventions

- One test file per service in `tests/`: `<service>.test.ts`
- Use `bun:test` `describe`/`it`/`expect` (Jest-compatible)
- Import source with `.ts` extension (Bun resolves native TS)
- No mocks — these are integration tests against real HearthstoneJSON cache
- Card-bound tests use `requireCard(dbfId)` helper to fail fast if test fixture missing
- `tests/locale.test.ts` covers locale detection and normalization logic

## Gotchas

- `deckstrings.decode()` returns dbfIds; you MUST join with card DB to get names/costs
- HearthstoneJSON `koKR` translations are official Blizzard strings (extracted from game), not community
- Card cache TTL is 24h. Force refresh: `rm ~/.hs-cli/cards-all.json ~/.hs-cli/cards.meta.json`
- Cache is per locale. `rm ~/.hs-cli/cards-*.json` to force re-fetch all locales.
- Bun's `bun run` works for both scripts and direct file execution. `bun run dev` is just an alias for the `dev` script.
- env vars on same line as `curl -u "$VAR"` don't expand correctly in zsh. Use `export VAR=` first or pass via `-d` body
- LSP/IDE may show stale TypeScript errors after big config changes. Trust `bunx tsc --noEmit` output over LSP red squiggles.

## Release pipeline

Merge to `main` → release-please opens a release PR (bumps version, updates CHANGELOG) → merging that PR creates a `v*` tag → CI matrix builds 5-platform binaries (darwin arm64/x64, linux arm64/x64, windows x64) and attaches them to the GitHub Release → npm publish runs automatically → Homebrew tap formula is updated to point to the new binary SHA. Version is currently **0.3.0** (npm + brew both published).

## Phase 2 (planned, not yet built)

- `hs log parse` — Power.log parsing via python-hslog subprocess
- `hs log show <match-id>` — match replay details
- Battle.net OAuth — optional `--verify` flag for server-side deck validation

When adding Phase 2, the python integration should spawn a Python subprocess that outputs JSON to stdout. Keep TS layer thin. Do not embed Python via FFI.
