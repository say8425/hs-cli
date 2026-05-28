# hs-cli

[English](./README.md) · [한국어](./README.ko.md) · [日本語](./README.ja.md) · **中文** · [Español](./README.es.md)

> 面向 AI 代理与人类的炉石传说 CLI。解码套牌代码、查询卡牌、检索元数据 — 无需 API key。基于 **Bun**。

`hs-cli` 是一个快速、对代理友好的命令行工具,封装了公开的 [HearthstoneJSON](https://hearthstonejson.com/) 数据源和 `deckstrings` 库,提供可离线工作的炉石传说套牌与卡牌数据。输出针对人类和 LLM 代理(Claude Code、Codex 等)的可读性进行了优化,不会用原始 JSON 浪费 token。

## 为什么有这个项目

炉石传说生态系统中有库,有一个 Blizzard 官方 API,但**没有生产级 CLI**,也**没有 Claude Code 集成**。本工具填补这一空白。决策和权衡记录在 [CLAUDE.md](./CLAUDE.md) 中。

## 安装

需要 **Bun 1.3+**([安装](https://bun.sh))。无需 Node、pnpm、tsx。

```bash
git clone <repo> hs-cli
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

`hs-cli` 自带 [`SKILL.md`](./SKILL.md),Claude Code(及兼容代理)可加载使用。放到 `.claude/skills/hearthstone-deck/`,代理会自动识别。

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
