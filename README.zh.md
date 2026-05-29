# hs-cli

[English](./README.md) · [한국어](./README.ko.md) · [日本語](./README.ja.md) · **中文** · [Español](./README.es.md)

[![CI](https://github.com/say8425/hs-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/say8425/hs-cli/actions/workflows/ci.yml)
[![Release](https://github.com/say8425/hs-cli/actions/workflows/release.yml/badge.svg)](https://github.com/say8425/hs-cli/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat)](https://github.com/say8425/hs-cli/blob/main/LICENSE)
[![Bun](https://img.shields.io/badge/Bun_1.3-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![citty](https://img.shields.io/badge/citty-1B6FEE?style=flat&logo=unjs&logoColor=white)](https://github.com/unjs/citty)
[![oxlint](https://img.shields.io/badge/oxlint-CB2435?style=flat)](https://oxc.rs)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-D77757?style=flat&logo=anthropic&logoColor=white)](https://code.claude.com)

> 面向 AI 代理与人类的炉石传说 CLI。解码套牌代码、查询卡牌、检索元数据 — 无需 API key。基于 **Bun**。

`hs-cli` 是一个快速、对代理友好的命令行工具,封装了公开的 [HearthstoneJSON](https://hearthstonejson.com/) 数据源和 `deckstrings` 库,提供可离线工作的炉石传说套牌与卡牌数据。输出针对人类和 LLM 代理(Claude Code、Codex 等)的可读性进行了优化,不会用原始 JSON 浪费 token。

## 为什么有这个项目

炉石传说生态系统中有库,有一个 Blizzard 官方 API,但**没有生产级 CLI**,也**没有 Claude Code 集成**。本工具填补这一空白。决策和权衡记录在 [CLAUDE.md](./CLAUDE.md) 中。

## 安装

### Homebrew (macOS / Linux — 推荐)

无需任何运行时。安装约 64 MB 的独立二进制文件。

```bash
brew install say8425/tap/hs-cli
```

支持 darwin arm64/x64 和 linux arm64/x64。

### npm (需要 Node 24+)

```bash
npm install -g @say8425/hs-cli
```

需要 **Node 24+**。无需 Bun。

### 预构建二进制文件

从 [GitHub Releases](https://github.com/say8425/hs-cli/releases/latest) 下载对应平台的二进制文件，然后赋予执行权限:

```bash
chmod +x hs-<platform>
mv hs-<platform> /usr/local/bin/hs
```

支持平台: darwin arm64/x64、linux arm64/x64、windows x64。无需运行时。

### 从源码构建 (开发用)

需要 **Bun 1.3+**([安装](https://bun.sh))。

```bash
git clone https://github.com/say8425/hs-cli.git hs-cli
cd hs-cli
bun install
bun run build
bun link           # 全局可用 `hs`
```

验证:

```bash
hs --version
hs deck "AAECAQcAA0VjgAEAAA=="
```

## 使用方法

### 解码套牌

```bash
hs deck <deckcode>
```

```
Class:  萨满 (SHAMAN)
Format: 标准
Dust:   15,760
Cards:  30

Mana Curve
  1 █████ 4
  2 ████████████ 10
  ...
```

稀有度符号:`★` 传说 · `◆` 史诗 · `◇` 稀有 · `·` 普通。

### 查询卡牌

```bash
hs card 1124              # 通过 dbfId
hs card CS2_151           # 通过卡牌 ID
hs card --search "吉里亚克斯"
hs card --search "fire" --class MAGE --cost 3
hs card --class MAGE --cost 3   # 浏览全部 3 费法师卡牌(无需 --search)
```

### 元数据

```bash
hs meta classes           # 全部 14 个职业
hs meta sets              # 所有版本
hs meta rarities          # FREE, COMMON, RARE, EPIC, LEGENDARY
hs meta types             # MINION, SPELL, WEAPON, HERO, ...
```

### JSON 输出

任何命令添加 `-f json`:

```bash
hs deck <code> -f json | jq '.cards | length'
hs card --search "巫妖王" -f json | jq '.[].dbfId'
```

## 代理集成

本仓库同时是一个 **Claude Code 市场**,提供 [`hs-cli` 插件](./plugins/hs-cli/)。安装一次后 Claude Code 就会学会自动调用 CLI:

```
/plugin marketplace add say8425/hs-cli
/plugin install hs-cli@say8425
```

本地开发:

```bash
claude --plugin-dir ./plugins/hs-cli
```

插件包含 [`hearthstone-deck` 技能](./plugins/hs-cli/skills/hearthstone-deck/SKILL.md),命名空间为 `/hs-cli:hearthstone-deck`。

然后可以这样问代理:

> "帮我分析这套牌:AAECAQcAA0VjgAEAAA=="
>
> "找出两套牌的共同卡牌"
>
> "推荐法师 3 费的卡"

SKILL 教代理:

- 默认使用 `table` 格式(token 高效)
- 仅在提取特定字段时用 `json | jq`
- 为多语言用户翻译职业名
- 通过输出中的 `Unknown (id)` 标记检测旧/无效套牌代码

## 本地化

`hs` 默认使用 **enUS（英语）** 语言环境。可通过每条命令的 `-l, --locale <code>` 标志覆盖，或导出 `HS_CLI_LOCALE` 环境变量以永久生效。

```bash
hs deck <code> -l zhCN              # 用中文卡牌名称解码套牌
hs card --search "吉里亚克斯" -l zhCN  # 搜索中文卡牌名称
hs card --search "Zilliax"          # 默认(enUS)英文搜索
export HS_CLI_LOCALE=zhCN          # 永久设置 — 所有命令均使用中文
```

**支持的语言环境（14 个）：** `enUS` `enGB` `frFR` `deDE` `koKR` `esES` `esMX` `ruRU` `zhTW` `zhCN` `itIT` `ptBR` `plPL` `jaJP` `thTH`

输入格式灵活 — `zh`, `zh-CN`, `zh_CN`, `zhCN` 均解析为同一语言环境。

**自动检测顺序**（省略 `-l` 时）：`HS_CLI_LOCALE` → `LC_ALL` → `LC_MESSAGES` → `LANG` → `LANGUAGE` → `enUS`

卡牌数据按语言环境缓存于 `~/.hs-cli/cards-<locale>.json`，有效期 24 小时。

## 架构

```
src/
├── index.ts           # citty runMain
├── commands/
│   ├── deck.ts        # `hs deck <code>` — defineCommand
│   ├── card.ts        # `hs card <q>` / `--search`
│   └── meta.ts        # `hs meta <type>`
├── services/
│   ├── card-db.ts     # HearthstoneJSON fetch + ~/.hs-cli/ 24小时磁盘缓存
│   ├── deck-decoder.ts # `deckstrings` 封装,关联卡牌 DB
│   └── formatter.ts   # table / json 输出
└── types/index.ts
```

### 数据源:HearthstoneJSON(非 Battle.net API)

2026-05-28 经验证,直接从游戏客户端 `CardDefs.xml` 提取的 HearthstoneJSON 比 Blizzard 官方 `/hearthstone/cards` API **更准确**:

| | HearthstoneJSON | Battle.net API |
|---|---|---|
| 来源 | 游戏客户端提取 | API 网关(游戏数据下游) |
| 更新延迟 | 补丁后数小时 | 更慢 |
| 缺失的 dbfId | 显示 `Unknown (id)` | **静默丢弃** |
| 战棋覆盖 | 更好 | 有缺漏 |
| 是否需要认证 | 否 | OAuth 客户端凭证 |
| 可离线使用 | 是(24小时缓存) | 否 |

Battle.net API 集成经研究后**故意未添加** — 它无法解决"未知卡"问题,只会增加复杂度。详见 [CLAUDE.md](./CLAUDE.md)。

## 工具链

| 工具 | 用途 |
|------|------|
| **Bun 1.3+** | 运行时 + 包管理器 + 测试运行器 + 打包器(替代 Node + pnpm + tsx + Vitest) |
| **TypeScript 6** | 源语言(tsc 仅用于 typecheck — Bun 原生执行 TS) |
| **citty** | CLI 参数解析(unjs,类型推断,ESM-first) |
| **oxlint** | linter(不用 ESLint)— 严格的 correctness/perf,仅 arrow |
| **oxfmt** | 格式化(不用 Prettier) |
| **bun:test** | Jest 兼容 API 测试运行器(不用 Vitest/Jest/node:test) |
| **deckstrings** | HearthSim 官方套牌代码 codec |

## 开发

```bash
bun run dev deck <code>    # Bun 直接运行,无需构建(原生 TS)
bun test                   # 运行所有测试
bun run lint               # oxlint
bun run lint:fix           # 自动修复
bun run fmt                # oxfmt 写入
bun run fmt:check          # oxfmt 检查(CI)
bun run typecheck          # tsc --noEmit
bun run check              # lint + fmt:check + typecheck + test
bun run build              # bun build → dist/(minified)
```

## 路线图

### Phase 1 — ✅ 完成

- [x] `hs deck` — 解码套牌代码
- [x] `hs card` — 单卡 + 搜索
- [x] `hs meta` — sets/classes/types/rarities
- [x] 本地缓存、代理友好输出、SKILL.md
- [x] Bun 原生(无 Node 依赖)

### Phase 2 — 计划中

- [ ] `hs log parse` — 通过 [python-hslog](https://github.com/HearthSim/python-hslog) 子进程解析 `Power.log`
- [ ] `hs log show <match-id>` — 单场对局回放
- [ ] `hs log watch` — 游戏过程中实时 tail
- [ ] Battle.net OAuth — 用于官方套牌验证的可选 `--verify` 标志

Phase 2 仅限 PC/Mac(移动端/主机无 Power.log)。

## 做不到的

Phase 1 的限制 — 这不是 bug:

- ❌ **我保存的套牌** — Blizzard API 没有炉石传说档案端点(WoW/D3 有,但炉石传说从未提供)
- ❌ **对战历史 / 胜率 / 收藏** — 同上
- ❌ **战棋酒馆随从** — 两个数据源都只有部分覆盖
- ❌ **女巫森林之前移除的卡** — 一些非常老的 `dbfId` 在 HearthstoneJSON 和官方 API 中都显示为 `Unknown (id)`

如果昨天还能用的套牌代码突然全是 `Unknown (id)`,要么代码损坏,要么是未同步的账号。

## 贡献

早期个人项目但欢迎 PR。重大改动请先开 issue。

风格由 oxlint 强制 — `bun run check` 必须通过。

## 许可证

MIT
