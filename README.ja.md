# hs-cli

[English](./README.md) · [한국어](./README.ko.md) · **日本語** · [中文](./README.zh.md) · [Español](./README.es.md)

[![CI](https://github.com/say8425/hs-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/say8425/hs-cli/actions/workflows/ci.yml)
[![Release](https://github.com/say8425/hs-cli/actions/workflows/release.yml/badge.svg)](https://github.com/say8425/hs-cli/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat)](https://github.com/say8425/hs-cli/blob/main/LICENSE)
[![Bun](https://img.shields.io/badge/Bun_1.3-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![citty](https://img.shields.io/badge/citty-1B6FEE?style=flat&logo=unjs&logoColor=white)](https://github.com/unjs/citty)
[![oxlint](https://img.shields.io/badge/oxlint-CB2435?style=flat)](https://oxc.rs)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-D77757?style=flat&logo=anthropic&logoColor=white)](https://code.claude.com)

> AIエージェントと人間のためのハースストーンCLI。デッキコードのデコード、カード検索、メタデータ照会 — APIキー不要。**Bun** ベース。

`hs-cli` は、公開されている [HearthstoneJSON](https://hearthstonejson.com/) データソースと `deckstrings` ライブラリをラップしたオフライン対応の高速エージェント向けCLIツールです。出力は人間とLLMエージェント(Claude Code、Codex など)の両方が読みやすいよう設計されており、生のJSONでトークンを浪費しません。

## なぜ作ったか

ハースストーンのエコシステムにはライブラリと Blizzard 公式 API はありますが、**プロダクション級の CLI も Claude Code 統合もありません**。このツールがその空白を埋めます。設計判断とトレードオフは [CLAUDE.md](./CLAUDE.md) に記載。

## インストール

**Bun 1.3+** が必要([インストール](https://bun.sh))。Node、pnpm、tsx は不要。

```bash
git clone <repo> hs-cli
cd hs-cli
bun install
bun run build
bun link            # どこからでも `hs` を実行可能
```

動作確認:

```bash
hs --version
hs deck "AAECAQcAA0VjgAEAAA=="
```

## 使い方

### デッキをデコード

```bash
hs deck <deckcode>
```

```
Class:  シャーマン (SHAMAN)
Format: スタンダード
Dust:   15,760
Cards:  30

Mana Curve
  1 █████ 4
  2 ████████████ 10
  ...
```

レアリティ記号: `★` レジェンド · `◆` エピック · `◇` レア · `·` コモン。

### カード検索

```bash
hs card 1124              # dbfId で
hs card CS2_151           # カードID で
hs card --search "ジリアックス"
hs card --search "fire" --class MAGE --cost 3
```

### メタデータ

```bash
hs meta classes           # 14クラス
hs meta sets              # 全拡張
hs meta rarities          # FREE, COMMON, RARE, EPIC, LEGENDARY
hs meta types             # MINION, SPELL, WEAPON, HERO, ...
```

### JSON出力

任意のコマンドに `-f json` を追加:

```bash
hs deck <code> -f json | jq '.cards | length'
hs card --search "リッチキング" -f json | jq '.[].dbfId'
```

## エージェント統合

このリポジトリは **Claude Code マーケットプレイス** も兼ねており、[`hs-cli` プラグイン](./plugins/hs-cli/) を提供します。一度インストールすれば Claude Code が CLI の使い方を学習して自動で呼び出します:

```
/plugin marketplace add say8425/hs-cli
/plugin install hs-cli@say8425
```

ローカル開発用:

```bash
claude --plugin-dir ./plugins/hs-cli
```

プラグインには [`hearthstone-deck` スキル](./plugins/hs-cli/skills/hearthstone-deck/SKILL.md) が含まれ、ネームスペースは `/hs-cli:hearthstone-deck` です。

その後エージェントに:

> "このデッキを分析して: AAECAQcAA0VjgAEAAA=="
>
> "二つのデッキの共通カードを探して"
>
> "プリーストでマナ3のカードを推薦して"

SKILL がエージェントに教えること:

- デフォルトで `table` 形式を使う(トークン効率)
- 特定フィールド抽出時のみ `json | jq`
- マルチ言語ユーザー向けにクラス名を翻訳
- 出力内の `Unknown (id)` で古い/無効なデッキコードを検出

## アーキテクチャ

```
src/
├── index.ts           # citty runMain
├── commands/
│   ├── deck.ts        # `hs deck <code>` — defineCommand
│   ├── card.ts        # `hs card <q>` / `--search`
│   └── meta.ts        # `hs meta <type>`
├── services/
│   ├── card-db.ts     # HearthstoneJSON fetch + ~/.hs-cli/ 24時間ディスクキャッシュ
│   ├── deck-decoder.ts # `deckstrings` ラッパー、カードDBと結合
│   └── formatter.ts   # table / json 出力
└── types/index.ts
```

### データソース: HearthstoneJSON(Battle.net API ではない)

2026-05-28 検証の結果、ゲームクライアントの `CardDefs.xml` から直接抽出する HearthstoneJSON は Blizzard 公式 `/hearthstone/cards` API より **正確**:

| | HearthstoneJSON | Battle.net API |
|---|---|---|
| ソース | ゲームクライアント抽出 | API ゲートウェイ(ゲームデータの下流) |
| 更新ラグ | パッチ後 数時間 | より遅い |
| 不明な dbfId | `Unknown (id)` を表示 | **警告なくドロップ** |
| バトルグラウンド カバレッジ | より良い | 抜けあり |
| 認証 | 不要 | OAuth クライアント資格情報 |
| オフライン | 可(24時間キャッシュ) | 不可 |

Battle.net API 統合は調査後 **意図的に未追加** — "unknown カード" 問題は解決せず、複雑さだけ増える。詳細は [CLAUDE.md](./CLAUDE.md)。

## ツールチェーン

| ツール | 用途 |
|------|------|
| **Bun 1.3+** | ランタイム + パッケージマネージャ + テストランナー + バンドラ(Node + pnpm + tsx + Vitest を置き換え) |
| **TypeScript 6** | ソース言語(tsc は typecheck 専用 — Bun が TS をネイティブ実行) |
| **citty** | CLI 引数解析(unjs、型推論、ESM-first) |
| **oxlint** | リンター(ESLint 不使用)— correctness/perf 厳格、arrow のみ |
| **oxfmt** | フォーマッタ(Prettier 不使用) |
| **bun:test** | Jest 互換 API のテストランナー(Vitest/Jest/node:test 不使用) |
| **deckstrings** | HearthSim 公式デッキコードコーデック |

## 開発

```bash
bun run dev deck <code>    # Bun でビルド無しに実行(ネイティブ TS)
bun test                   # 全テスト実行
bun run lint               # oxlint
bun run lint:fix           # 自動修正
bun run fmt                # oxfmt 書き込み
bun run fmt:check          # oxfmt チェック(CI)
bun run typecheck          # tsc --noEmit
bun run check              # lint + fmt:check + typecheck + test
bun run build              # bun build → dist/(minified)
```

## ロードマップ

### Phase 1 — ✅ 完了

- [x] `hs deck` — デッキコードデコード
- [x] `hs card` — 単一 + 検索
- [x] `hs meta` — sets/classes/types/rarities
- [x] ローカルキャッシュ、エージェント向け出力、SKILL.md
- [x] Bun ネイティブ(Node 依存なし)

### Phase 2 — 計画中

- [ ] `hs log parse` — [python-hslog](https://github.com/HearthSim/python-hslog) サブプロセスで `Power.log` を解析
- [ ] `hs log show <match-id>` — 個別マッチのリプレイ
- [ ] `hs log watch` — プレイ中のリアルタイム tail
- [ ] Battle.net OAuth — 公式デッキ検証用オプション `--verify` フラグ

Phase 2 は PC/Mac 限定(モバイル/コンソールに Power.log なし)。

## できないこと

Phase 1 の制限 — バグではない:

- ❌ **保存済みデッキ一覧** — Blizzard API にハースストーン プロフィールエンドポイントなし(WoW/D3 にはあるが、ハースストーンだけ未提供)
- ❌ **マッチ履歴 / 勝率 / コレクション** — 同上
- ❌ **バトルグラウンドの酒場ミニオン** — 両データソースで部分カバレッジのみ
- ❌ **ウィッチウッド以前の削除カード** — 非常に古い一部 `dbfId` は HearthstoneJSON と公式 API の両方で `Unknown (id)` 表示

昨日まで動いていたデッキコードに `Unknown (id)` が大量出現する場合、コードが破損しているか、同期されていないアカウントのもの。

## コントリビュート

初期段階の個人プロジェクトですが PR 歓迎。大きな変更はまず issue で。

スタイルは oxlint で強制 — `bun run check` 必須通過。

## ライセンス

MIT
