# hs-cli

[English](./README.md) · [한국어](./README.ko.md) · [日本語](./README.ja.md) · [中文](./README.zh.md) · **Español**

[![Hearthstone](https://img.shields.io/badge/Hearthstone-F0A020?style=flat&logo=battledotnet&logoColor=white)](https://hearthstone.blizzard.com)
[![Bun](https://img.shields.io/badge/Bun_1.3-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![citty](https://img.shields.io/badge/citty-111827?style=flat&logo=unjs&logoColor=ECDC5A)](https://github.com/unjs/citty)
[![oxlint](https://img.shields.io/badge/oxlint-000000?style=flat&logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0NiIgdmlld0JveD0iMCAwIDQ4IDQ2Ij48cGF0aCBkPSJNMzAuMzE2NCA2Ljc4ODc2QzMwLjMxNjQgOC4wMzgxNyAzMS4zMjg5IDkuMDUwNjMgMzIuNTc4MyA5LjA1MDYzSDQxLjE2MDVDNDIuMTY4NyA5LjA1MDYzIDQyLjY3MjcgMTAuMjY5OSA0MS45NTk3IDEwLjk4MDhMMzAuOTc3NyAyMS45NjI3QzMwLjU1MzQgMjIuMzg3MSAzMC4zMTQzIDIyLjk2MjIgMzAuMzE0MyAyMy41NjMzVjI3LjMxOEMzMC4zMTQzIDI4Ljg3OTcgMzEuODYzMSAyOS45NjMzIDMzLjIzMzIgMjkuMjE3OUMzNC42MjkxIDI4LjQ1OTcgMzUuOTI4IDI3LjU0MiAzNy4xMDIgMjYuNDkwOEMzNy41NjczIDI2LjA3NSAzOC4yODI1IDI2LjA3MDcgMzguNzI0MSAyNi41MTQ1TDQ2LjcyMjUgMzQuNTEyOUM0Ny4xNjQyIDM0Ljk1NDUgNDcuMTY2MyAzNS42NzE4IDQ2LjcwOTYgMzYuMDk4NEM0MC42NDM1IDQxLjc3NDYgMzIuNDkgNDUuMjUxNCAyMy41MjY1IDQ1LjI1MTRDMTQuNTYzIDQ1LjI1MTQgNi40MDk0NyA0MS43NzQ2IDAuMzQzMzMyIDM2LjA5ODRDLTAuMTEzMzUxIDM1LjY3MTggLTAuMTExMTk3IDM0Ljk1NDUgMC4zMzA0MDggMzQuNTEyOUw4LjMyODgzIDI2LjUxNDVDOC43NzA0NCAyNi4wNzI5IDkuNDg1NjMgMjYuMDc1IDkuOTUwOTIgMjYuNDkwOEMxMS4xMjQ5IDI3LjU0MiAxMi40MjM5IDI4LjQ1OTcgMTMuODE5OCAyOS4yMTc5QzE1LjE5MiAyOS45NjMzIDE2LjczODcgMjguODc5NyAxNi43Mzg3IDI3LjMxOFYyMy41NjMzQzE2LjczODcgMjIuOTYyMiAxNi40OTk2IDIyLjM4NzEgMTYuMDc1MiAyMS45NjI3TDUuMDkzMjcgMTAuOTgwOEM0LjM4MDI0IDEwLjI2NzcgNC44ODQzMiA5LjA1MDYzIDUuODkyNDcgOS4wNTA2M0gxNC40NzQ3QzE1LjcyNDEgOS4wNTA2MyAxNi43MzY2IDguMDM4MTcgMTYuNzM2NiA2Ljc4ODc2VjEuMTMxOTFDMTYuNzM2NiAwLjUwNzIwNiAxNy4yNDI4IDAuMDAwOTc2NTYyIDE3Ljg2NzUgMC4wMDA5NzY1NjJIMjkuMTc5QzI5LjgwMzcgMC4wMDA5NzY1NjIgMzAuMzEgMC41MDcyMDYgMzAuMzEgMS4xMzE5MVY2Ljc4ODc2SDMwLjMxNjRaIiBmaWxsPSIjMDBGN0YxIi8%2BPC9zdmc%2B)](https://oxc.rs)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-D77757?style=flat&logo=anthropic&logoColor=white)](https://code.claude.com)

> CLI de Hearthstone para agentes de IA y humanos. Decodifica códigos de mazo, busca cartas, consulta metadatos — sin API key. Construido sobre **Bun**.

`hs-cli` es una herramienta CLI rápida y compatible con agentes que envuelve la fuente de datos pública [HearthstoneJSON](https://hearthstonejson.com/) y la librería `deckstrings` para proporcionar datos de mazos y cartas de Hearthstone con capacidad offline. La salida está diseñada para ser legible tanto por humanos como por agentes LLM (Claude Code, Codex, etc.) sin gastar tokens en JSON crudo.

## Por qué existe

El ecosistema de Hearthstone tiene librerías y una API oficial de Blizzard, pero **ningún CLI de calidad de producción** y **ninguna integración lista para Claude Code**. Este proyecto cubre ese vacío. Las decisiones y compromisos están documentados en [CLAUDE.md](./CLAUDE.md).

## Instalación

### Homebrew (macOS / Linux — recomendado)

No requiere ningún runtime. Instala un binario autocontenido de ~64 MB.

```bash
brew install say8425/tap/hs-cli
```

Compatible con darwin arm64/x64 y linux arm64/x64.

### npm (cualquier SO con Node 24+)

```bash
npm install -g @say8425/hs-cli
```

Requiere **Node 24+**. Bun no es necesario.

### Binario precompilado

Descarga el binario para tu plataforma desde [GitHub Releases](https://github.com/say8425/hs-cli/releases/latest) y dale permisos de ejecución:

```bash
chmod +x hs-<platform>
mv hs-<platform> /usr/local/bin/hs
```

Plataformas disponibles: darwin arm64/x64, linux arm64/x64, windows x64. No requiere runtime.

### Desde el código fuente (para desarrollo)

Requiere **Bun 1.3+** ([instalar](https://bun.sh)).

```bash
git clone https://github.com/say8425/hs-cli.git hs-cli
cd hs-cli
bun install
bun run build
bun link            # hace `hs` disponible globalmente
```

Verificar:

```bash
hs --version
hs deck "AAECAQcAA0VjgAEAAA=="
```

### Instalar la skill de Claude Code

El CLI `hs` incluye la skill `hearthstone-deck`. Tras instalar el CLI:

```bash
hs skill install              # interactivo: elige agentes
hs skill install --agent claude   # no interactivo
```

Instalación multi-agente vía [skills.sh](https://www.skills.sh/) (Cursor, Codex, Copilot, OpenCode):

```bash
npx skills add say8425/hs-cli
```

## Uso

### Decodificar un mazo

```bash
hs deck <deckcode>
```

```
Class:  Chamán (SHAMAN)
Format: Estándar
Dust:   15,760
Cards:  30

Mana Curve
  1 █████ 4
  2 ████████████ 10
  ...
```

Símbolos de rareza: `★` Legendaria · `◆` Épica · `◇` Rara · `·` Común.

### Buscar una carta

```bash
hs card 1124              # por dbfId
hs card CS2_151           # por ID de carta
hs card --search "Zilliax"
hs card --search "fuego" --class MAGE --cost 3
hs card --class MAGE --cost 3   # listar todas las cartas de Mago de coste 3 (sin --search)
```

### Consultar metadatos

```bash
hs meta classes           # las 14 clases
hs meta sets              # todas las expansiones
hs meta rarities          # FREE, COMMON, RARE, EPIC, LEGENDARY
hs meta types             # MINION, SPELL, WEAPON, HERO, ...
```

### Meta en vivo (tasas de victoria, tiers, códigos de mazo)

`hs meta archetypes` y `hs meta decks` muestran las tasas de victoria actuales del modo construido, tiers y códigos de mazo.

```bash
hs meta archetypes --game-format standard --rank legend --period past-7
hs meta decks --rank top-2000-legend -f json
```

Flags: `--game-format standard|wild|twist`, `--rank legend|top-2000-legend|competitive|legend-diamond|diamond|platinum|bronze-gold|all`, `--period last-patch|past-3|past-7|past-20|current-season`, `--min-games N`, `--sort wilson|winrate|games`, `--limit N`. Las filas están ordenadas por el límite inferior de Wilson (no por la tasa de victoria bruta) y muestran una columna de ±margen de error.

Datos: **Firestone** (firestoneapp.com), usado con permiso. Los códigos de mazo de `hs meta decks` se pueden pasar mediante pipe a `hs deck <code>`.

### Salida JSON

Agrega `-f json` a cualquier comando:

```bash
hs deck <code> -f json | jq '.cards | length'
hs card --search "Rey Exánime" -f json | jq '.[].dbfId'
```

## Integración con agentes

Este repositorio también funciona como **marketplace de Claude Code** y expone el [plugin `hs-cli`](./plugins/hs-cli/). Instálalo una vez y Claude Code aprenderá a usar el CLI automáticamente:

```
/plugin marketplace add say8425/hs-cli
/plugin install hs-cli@say8425
```

Para desarrollo local:

```bash
claude --plugin-dir ./plugins/hs-cli
```

El plugin incluye la [skill `hearthstone-deck`](./plugins/hs-cli/skills/hearthstone-deck/SKILL.md), con namespace `/hs-cli:hearthstone-deck`.

Luego pídele al agente cosas como:

> "Analiza este mazo: AAECAQcAA0VjgAEAAA=="
>
> "Encuentra las cartas comunes entre estos dos mazos"
>
> "Recomienda cartas de 3 maná para sacerdote"

El skill enseña al agente a:

- Usar formato `table` por defecto (eficiente en tokens)
- Recurrir a `json | jq` solo para extraer campos específicos
- Traducir nombres de clases para usuarios multilingües
- Detectar códigos de mazo antiguos/inválidos mediante marcadores `Unknown (id)` en la salida

## Localización

`hs` usa **enUS (inglés)** como configuración regional predeterminada. Puedes sobreescribirla con `-l, --locale <code>` en cualquier comando, o exportar `HS_CLI_LOCALE` para un cambio permanente.

```bash
hs deck <code> -l esES              # decodificar con nombres de carta en español
hs card --search "Zilliax" -l esES  # buscar en datos de nombre en español
hs card --search "Zilliax"          # búsqueda en inglés (enUS por defecto)
export HS_CLI_LOCALE=esES          # configuración permanente — todos los comandos en español
```

**Configuraciones regionales disponibles (14):** `enUS` `enGB` `frFR` `deDE` `koKR` `esES` `esMX` `ruRU` `zhTW` `zhCN` `itIT` `ptBR` `plPL` `jaJP` `thTH`

La entrada es flexible — `es`, `es-ES`, `es_ES` y `esES` se resuelven al mismo locale.

**Orden de detección automática** (cuando se omite `-l`): `HS_CLI_LOCALE` → `LC_ALL` → `LC_MESSAGES` → `LANG` → `LANGUAGE` → `enUS`

Los datos de cartas se almacenan en caché por locale en `~/.hs-cli/cards-<locale>.json` durante 24h.

## Arquitectura

```
src/
├── index.ts           # citty runMain
├── commands/
│   ├── deck.ts        # `hs deck <code>` — defineCommand
│   ├── card.ts        # `hs card <q>` / `--search`
│   └── meta.ts        # `hs meta <type>`
├── services/
│   ├── card-db.ts     # fetch HearthstoneJSON + caché en disco de 24h en ~/.hs-cli/
│   ├── deck-decoder.ts # envoltorio de `deckstrings`, une con DB de cartas
│   └── formatter.ts   # salida table / json
└── types/index.ts
```

### Fuente de datos: HearthstoneJSON (no Battle.net API)

Verificado el 2026-05-28 que HearthstoneJSON — que extrae datos directamente del `CardDefs.xml` del cliente del juego — es **más preciso** que la API oficial `/hearthstone/cards` de Blizzard:

| | HearthstoneJSON | Battle.net API |
|---|---|---|
| Fuente | Extracto del cliente | API gateway (downstream de los datos del juego) |
| Retraso de actualización | Horas después del parche | Más lento |
| dbfIds faltantes | Muestra `Unknown (id)` | **Los descarta silenciosamente** |
| Cobertura de Battlegrounds | Mejor | Tiene huecos |
| Autenticación requerida | No | OAuth client credentials |
| Funciona offline | Sí (caché de 24h) | No |

La integración con Battle.net API fue investigada y **deliberadamente no añadida** — no resuelve el problema de "carta desconocida" y solo añade complejidad. Ver [CLAUDE.md](./CLAUDE.md) para el razonamiento completo.

## Cadena de herramientas

| Herramienta | Propósito |
|------|---------|
| **Bun 1.3+** | Runtime + gestor de paquetes + runner de tests + bundler (reemplaza Node + pnpm + tsx + Vitest) |
| **TypeScript 6** | Lenguaje fuente (tsc solo para typecheck — Bun ejecuta TS nativamente) |
| **citty** | Parseo de argumentos CLI (unjs, type-inferred, ESM-first) |
| **oxlint** | Linter (sin ESLint) — estricto en correctness/perf, solo arrow |
| **oxfmt** | Formatter (sin Prettier) |
| **bun:test** | Runner de tests con API compatible con Jest (sin Vitest/Jest/node:test) |
| **deckstrings** | Codec oficial de HearthSim para códigos de mazo |

## Desarrollo

```bash
bun run dev deck <code>    # ejecuta vía Bun, sin build (TS nativo)
bun test                   # todos los tests
bun run lint               # oxlint
bun run lint:fix           # auto-arreglo
bun run fmt                # oxfmt write
bun run fmt:check          # oxfmt check (CI)
bun run typecheck          # tsc --noEmit
bun run check              # lint + fmt:check + typecheck + test
bun run build              # bun build → dist/ (minified)
```

## Roadmap

### Phase 1 — ✅ completa

- [x] `hs deck` — decodificar códigos de mazo
- [x] `hs card` — individual + búsqueda
- [x] `hs meta` — sets/classes/types/rarities
- [x] Caché local, salida amigable para agentes, SKILL.md
- [x] Nativo de Bun (sin dependencia de Node)

### Phase 2 — planificada

- [ ] `hs log parse` — parsear el `Power.log` de Hearthstone vía subproceso [python-hslog](https://github.com/HearthSim/python-hslog)
- [ ] `hs log show <match-id>` — replay de partidas individuales
- [ ] `hs log watch` — tail en tiempo real durante el juego
- [ ] Integración Battle.net OAuth como flag opcional `--verify` para validación oficial de mazos

Phase 2 será exclusivo de PC/Mac (Power.log no existe en móvil/consola).

## Lo que no puede hacer

Limitaciones de Phase 1 — no son bugs:

- ❌ **Mis mazos guardados** — la API de Blizzard no tiene endpoints de perfil de Hearthstone (WoW/D3 sí; Hearthstone nunca recibió uno)
- ❌ **Historial de partidas / ratio de victorias / colección** — misma razón
- ❌ **Esbirros de taberna de Battlegrounds** — cobertura parcial en ambas fuentes
- ❌ **Cartas eliminadas anteriores a Bosque Embrujado** — algunos `dbfId` muy antiguos aparecen como `Unknown (id)` tanto en HearthstoneJSON como en la API oficial

Si tu mazo decodificado está lleno de `Unknown (id)` para un mazo que funcionaba ayer, o el código está corrupto o es de una cuenta no sincronizada.

## Contribuir

Proyecto personal en etapa temprana pero PRs bienvenidas. Abre un issue primero para cambios no triviales.

El estilo está forzado por oxlint — `bun run check` debe pasar.

## Licencia

MIT
