# hs-cli

[English](./README.md) · **한국어** · [日本語](./README.ja.md) · [中文](./README.zh.md) · [Español](./README.es.md)

[![Hearthstone](https://img.shields.io/badge/Hearthstone-F0A020?style=flat&logo=battledotnet&logoColor=white)](https://hearthstone.blizzard.com)
[![Bun](https://img.shields.io/badge/Bun_1.3-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![citty](https://img.shields.io/badge/citty-111827?style=flat&logo=unjs&logoColor=ECDC5A)](https://github.com/unjs/citty)
[![oxlint](https://img.shields.io/badge/oxlint-000000?style=flat&logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0NiIgdmlld0JveD0iMCAwIDQ4IDQ2Ij48cGF0aCBkPSJNMzAuMzE2NCA2Ljc4ODc2QzMwLjMxNjQgOC4wMzgxNyAzMS4zMjg5IDkuMDUwNjMgMzIuNTc4MyA5LjA1MDYzSDQxLjE2MDVDNDIuMTY4NyA5LjA1MDYzIDQyLjY3MjcgMTAuMjY5OSA0MS45NTk3IDEwLjk4MDhMMzAuOTc3NyAyMS45NjI3QzMwLjU1MzQgMjIuMzg3MSAzMC4zMTQzIDIyLjk2MjIgMzAuMzE0MyAyMy41NjMzVjI3LjMxOEMzMC4zMTQzIDI4Ljg3OTcgMzEuODYzMSAyOS45NjMzIDMzLjIzMzIgMjkuMjE3OUMzNC42MjkxIDI4LjQ1OTcgMzUuOTI4IDI3LjU0MiAzNy4xMDIgMjYuNDkwOEMzNy41NjczIDI2LjA3NSAzOC4yODI1IDI2LjA3MDcgMzguNzI0MSAyNi41MTQ1TDQ2LjcyMjUgMzQuNTEyOUM0Ny4xNjQyIDM0Ljk1NDUgNDcuMTY2MyAzNS42NzE4IDQ2LjcwOTYgMzYuMDk4NEM0MC42NDM1IDQxLjc3NDYgMzIuNDkgNDUuMjUxNCAyMy41MjY1IDQ1LjI1MTRDMTQuNTYzIDQ1LjI1MTQgNi40MDk0NyA0MS43NzQ2IDAuMzQzMzMyIDM2LjA5ODRDLTAuMTEzMzUxIDM1LjY3MTggLTAuMTExMTk3IDM0Ljk1NDUgMC4zMzA0MDggMzQuNTEyOUw4LjMyODgzIDI2LjUxNDVDOC43NzA0NCAyNi4wNzI5IDkuNDg1NjMgMjYuMDc1IDkuOTUwOTIgMjYuNDkwOEMxMS4xMjQ5IDI3LjU0MiAxMi40MjM5IDI4LjQ1OTcgMTMuODE5OCAyOS4yMTc5QzE1LjE5MiAyOS45NjMzIDE2LjczODcgMjguODc5NyAxNi43Mzg3IDI3LjMxOFYyMy41NjMzQzE2LjczODcgMjIuOTYyMiAxNi40OTk2IDIyLjM4NzEgMTYuMDc1MiAyMS45NjI3TDUuMDkzMjcgMTAuOTgwOEM0LjM4MDI0IDEwLjI2NzcgNC44ODQzMiA5LjA1MDYzIDUuODkyNDcgOS4wNTA2M0gxNC40NzQ3QzE1LjcyNDEgOS4wNTA2MyAxNi43MzY2IDguMDM4MTcgMTYuNzM2NiA2Ljc4ODc2VjEuMTMxOTFDMTYuNzM2NiAwLjUwNzIwNiAxNy4yNDI4IDAuMDAwOTc2NTYyIDE3Ljg2NzUgMC4wMDA5NzY1NjJIMjkuMTc5QzI5LjgwMzcgMC4wMDA5NzY1NjIgMzAuMzEgMC41MDcyMDYgMzAuMzEgMS4xMzE5MVY2Ljc4ODc2SDMwLjMxNjRaIiBmaWxsPSIjMDBGN0YxIi8%2BPC9zdmc%2B)](https://oxc.rs)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-D77757?style=flat&logo=anthropic&logoColor=white)](https://code.claude.com)

> AI 에이전트와 사람을 위한 하스스톤 CLI. 덱 코드 디코딩, 카드 조회, 메타데이터 검색 — API 키 불필요. **Bun** 기반.

`hs-cli`는 공개된 [HearthstoneJSON](https://hearthstonejson.com/) 데이터 소스와 `deckstrings` 라이브러리를 감싸 오프라인에서도 동작하는 빠른 에이전트 친화 CLI 도구입니다. 출력은 사람과 LLM 에이전트(Claude Code, Codex 등) 둘 다 읽기 좋게 설계되어, raw JSON으로 토큰을 낭비하지 않습니다.

## 왜 만들었나

하스스톤 생태계에는 라이브러리와 Blizzard 공식 API 하나가 있지만 **프로덕션급 CLI도 없고 Claude Code 통합도 없습니다.** 이 도구가 그 공백을 채웁니다. 의사결정과 트레이드오프는 [CLAUDE.md](./CLAUDE.md)에 정리되어 있습니다.

## 설치

### Homebrew (macOS / Linux — 권장)

별도 런타임 불필요. 약 64 MB 자체 실행 바이너리를 설치합니다.

```bash
brew install say8425/tap/hs-cli
```

darwin arm64/x64 및 linux arm64/x64 지원.

### npm (Node 24+ 환경)

```bash
npm install -g @say8425/hs-cli
```

**Node 24+** 필요. Bun은 불필요.

### 사전 빌드 바이너리

[GitHub Releases](https://github.com/say8425/hs-cli/releases/latest)에서 해당 플랫폼 바이너리를 다운로드한 후 실행 권한을 부여합니다:

```bash
chmod +x hs-<platform>
mv hs-<platform> /usr/local/bin/hs
```

지원 플랫폼: darwin arm64/x64, linux arm64/x64, windows x64. 별도 런타임 불필요.

### 소스에서 빌드 (개발용)

**Bun 1.3+** 필요 ([설치](https://bun.sh)).

```bash
git clone https://github.com/say8425/hs-cli.git hs-cli
cd hs-cli
bun install
bun run build
bun link           # 어디서든 `hs` 사용 가능
```

확인:

```bash
hs --version
hs deck "AAECAQcAA0VjgAEAAA=="
```

### Claude Code 스킬 설치

`hs` CLI에는 `hearthstone-deck` 스킬이 포함되어 있습니다. CLI 설치 후:

```bash
hs skill install              # 대화형: 에이전트 선택
hs skill install --agent claude   # 비대화형
```

[skills.sh](https://www.skills.sh/)를 통한 멀티 에이전트 설치 (Cursor, Codex, Copilot, OpenCode):

```bash
npx skills add say8425/hs-cli
```

## 사용법

### 덱 디코딩

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
  ...
```

등급 기호: `★` 전설 · `◆` 영웅 · `◇` 희귀 · `·` 일반.

### 카드 조회

```bash
hs card 1124              # dbfId로
hs card CS2_151           # 카드 ID로
hs card --search "질리악스"
hs card --search "화염" --class MAGE --cost 3
hs card --class MAGE --cost 3   # 3코스트 마법사 카드 전체 조회 (--search 불필요)
```

### 메타데이터

```bash
hs meta classes           # 14개 직업
hs meta sets              # 모든 확장팩
hs meta rarities          # FREE, COMMON, RARE, EPIC, LEGENDARY
hs meta types             # MINION, SPELL, WEAPON, HERO, ...
```

### 라이브 메타 (승률, 티어, 덱 코드)

`hs meta archetypes`와 `hs meta decks`는 현재 일반 모드 승률, 티어, 덱 코드를 보여줍니다.

```bash
hs meta archetypes --game-format standard --rank legend --period past-7
hs meta decks --rank top-2000-legend -f json
```

플래그: `--game-format standard|wild|twist`, `--rank legend|top-2000-legend|competitive|legend-diamond|diamond|platinum|bronze-gold|all`, `--period last-patch|past-3|past-7|past-20|current-season`, `--min-games N`, `--sort wilson|winrate|games`, `--limit N`. 행은 Wilson 하한값(원시 승률 기준 아님)으로 정렬되며 ±오차 범위 열이 포함됩니다.

데이터: **Firestone** (firestoneapp.com), 허가 후 사용. `hs meta decks`의 덱 코드는 `hs deck <code>`에 파이프로 전달할 수 있습니다.

### JSON 출력

모든 명령어에 `-f json` 추가:

```bash
hs deck <code> -f json | jq '.cards | length'
hs card --search "리치 왕" -f json | jq '.[].dbfId'
```

## 에이전트 통합

이 저장소는 **Claude Code 마켓플레이스** 역할도 합니다. [`hs-cli` 플러그인](./plugins/hs-cli/)을 한 번 설치하면 Claude Code가 CLI 사용법을 익혀 자동으로 호출합니다:

```
/plugin marketplace add say8425/hs-cli
/plugin install hs-cli@say8425
```

로컬 개발용:

```bash
claude --plugin-dir ./plugins/hs-cli
```

플러그인은 [`hearthstone-deck` 스킬](./plugins/hs-cli/skills/hearthstone-deck/SKILL.md)을 제공하며 네임스페이스는 `/hs-cli:hearthstone-deck` 입니다.

이후 에이전트에게:

> "이 덱 분석해줘: AAECAQcAA0VjgAEAAA=="
>
> "두 덱의 공통 카드 찾아줘"
>
> "사제 3코스트 추천해줘"

SKILL이 가르치는 것:

- `table` 포맷 기본 사용 (토큰 효율)
- 특정 필드 추출할 때만 `json | jq`
- 한국어 사용자를 위해 직업명 번역
- `Unknown (id)` 표시로 오래된/잘못된 덱 코드 감지

## 다국어 지원

`hs`의 기본 로케일은 **enUS(영어)**입니다. 명령마다 `-l, --locale <code>` 플래그로 덮어쓰거나, `HS_CLI_LOCALE`을 환경 변수로 설정해 영구 적용할 수 있습니다.

```bash
hs deck <code> -l koKR              # 한국어 카드 이름으로 덱 디코딩
hs card --search "질리악스" -l ko   # 한국어 카드명 검색
hs card --search "Zilliax"          # 기본(enUS) 영어 검색
export HS_CLI_LOCALE=ko            # 영구 설정 — 모든 명령에 한국어 적용
```

**지원 로케일 (14개):** `enUS` `enGB` `frFR` `deDE` `koKR` `esES` `esMX` `ruRU` `zhTW` `zhCN` `itIT` `ptBR` `plPL` `jaJP` `thTH`

입력 표기는 유연합니다 — `ko`, `ko-KR`, `ko_KR`, `koKR` 모두 동일하게 처리됩니다.

**자동 감지 순서** (`-l` 생략 시): `HS_CLI_LOCALE` → `LC_ALL` → `LC_MESSAGES` → `LANG` → `LANGUAGE` → `enUS`

카드 데이터는 로케일별로 `~/.hs-cli/cards-<locale>.json`에 24시간 캐싱됩니다.

## 아키텍처

```
src/
├── index.ts           # citty runMain
├── commands/
│   ├── deck.ts        # `hs deck <code>` — defineCommand
│   ├── card.ts        # `hs card <q>` / `--search`
│   └── meta.ts        # `hs meta <type>`
├── services/
│   ├── card-db.ts     # HearthstoneJSON fetch + ~/.hs-cli/ 24시간 디스크 캐시
│   ├── deck-decoder.ts # `deckstrings` 래퍼, 카드 DB 조인
│   └── formatter.ts   # table / json 출력
└── types/index.ts
```

### 데이터 소스: HearthstoneJSON (Battle.net API 아님)

2026-05-28 검증 결과, 게임 클라이언트의 `CardDefs.xml`에서 직접 추출하는 HearthstoneJSON이 Blizzard 공식 `/hearthstone/cards` API보다 **더 정확함**:

| | HearthstoneJSON | Battle.net API |
|---|---|---|
| 출처 | 게임 클라이언트 추출 | API gateway (게임 데이터의 하위) |
| 업데이트 지연 | 패치 후 수시간 | 더 느림 |
| 누락된 dbfId | `Unknown (id)` 표시 | **알림 없이 drop** |
| Battlegrounds 커버리지 | 더 좋음 | 빈틈 있음 |
| 인증 필요 | 없음 | OAuth client credentials |
| 오프라인 가능 | 예 (24시간 캐시) | 아니오 |

Battle.net API 통합은 조사 후 **의도적으로 추가하지 않음** — "unknown 카드" 문제를 해결 못 하고 복잡도만 증가. 자세한 내용은 [CLAUDE.md](./CLAUDE.md) 참조.

## 툴체인

| 도구 | 용도 |
|------|------|
| **Bun 1.3+** | 런타임 + 패키지 매니저 + 테스트 러너 + 번들러 (Node + pnpm + tsx + Vitest 대체) |
| **TypeScript 6** | 소스 언어 (tsc는 typecheck 전용 — Bun이 TS 네이티브 실행) |
| **citty** | CLI 인자 파싱 (unjs, 타입 추론, ESM-first) |
| **oxlint** | 린터 (ESLint 미사용) — 엄격한 correctness/perf, arrow-only |
| **oxfmt** | 포매터 (Prettier 미사용) |
| **bun:test** | Jest 호환 API 테스트 러너 (Vitest/Jest/node:test 미사용) |
| **deckstrings** | HearthSim 공식 덱 코드 코덱 |

## 개발

```bash
bun run dev deck <code>    # Bun으로 빌드 없이 실행 (네이티브 TS)
bun test                   # 모든 테스트 실행
bun run lint               # oxlint
bun run lint:fix           # 자동 수정
bun run fmt                # oxfmt 쓰기
bun run fmt:check          # oxfmt 검증 (CI용)
bun run typecheck          # tsc --noEmit
bun run check              # lint + fmt:check + typecheck + test
bun run build              # bun build → dist/ (minified)
```

## 로드맵

### Phase 1 — ✅ 완료

- [x] `hs deck` — 덱 코드 디코딩
- [x] `hs card` — 단일 + 검색
- [x] `hs meta` — sets/classes/types/rarities
- [x] 로컬 캐시, 에이전트 친화 출력, SKILL.md
- [x] Bun 네이티브 (Node 의존성 없음)

### Phase 2 — 계획

- [ ] `hs log parse` — [python-hslog](https://github.com/HearthSim/python-hslog) subprocess로 하스스톤 `Power.log` 파싱
- [ ] `hs log show <match-id>` — 개별 매치 리플레이
- [ ] `hs log watch` — 플레이 중 실시간 tail
- [ ] Battle.net OAuth — 공식 덱 검증용 옵셔널 `--verify` 플래그

Phase 2는 PC/Mac 전용 (모바일/콘솔에는 Power.log 없음).

## 못 하는 것

Phase 1 한계 — 버그 아님:

- ❌ **내 저장된 덱** — Blizzard API에 하스스톤 프로필 엔드포인트 없음 (WoW/D3에는 있지만 하스스톤만 없음)
- ❌ **매치 히스토리 / 승률 / 컬렉션** — 같은 이유
- ❌ **Battlegrounds 선술집 하수인** — 두 데이터 소스 모두 부분 커버리지
- ❌ **마녀숲 이전 폐기 카드** — 매우 오래된 일부 `dbfId`가 HearthstoneJSON과 공식 API 둘 다에서 `Unknown (id)`로 표시

어제까지 동작하던 덱 코드에 `Unknown (id)`이 잔뜩이면 코드가 손상됐거나 동기화 안 된 계정.

## 기여

초기 단계 개인 프로젝트지만 PR 환영. 큰 변경은 먼저 이슈로.

스타일은 oxlint로 강제 — `bun run check` 통과 필수.

## 라이선스

MIT
