import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "bun:test";
import { AGENTS, isAgentId, resolveAgentDir, type AgentDef } from "../src/services/agent-dirs.ts";
import { SKILL_BUNDLE, SKILL_NAME } from "../src/services/skill-bundle.ts";
import { skillExists, targetSkillDir, writeBundle } from "../src/services/skill-installer.ts";

const byId = (id: string): AgentDef => {
  const a = AGENTS.find((x) => x.id === id);
  if (!a) throw new Error(`missing agent ${id}`);
  return a;
};

describe("agent-dirs", () => {
  it("exposes the five supported agents", () => {
    expect(AGENTS.map((a) => a.id).toSorted()).toEqual([
      "claude",
      "codex",
      "copilot",
      "cursor",
      "opencode",
    ]);
  });

  it("validates agent ids", () => {
    expect(isAgentId("claude")).toBe(true);
    expect(isAgentId("nope")).toBe(false);
  });

  it("resolves global dirs against an injected home", () => {
    expect(resolveAgentDir(byId("claude"), { scope: "global", home: "/h" })).toBe(
      "/h/.claude/skills",
    );
    expect(resolveAgentDir(byId("opencode"), { scope: "global", home: "/h" })).toBe(
      "/h/.config/opencode/skills",
    );
  });

  it("resolves project dirs against an injected cwd", () => {
    expect(resolveAgentDir(byId("claude"), { scope: "project", cwd: "/p" })).toBe(
      "/p/.claude/skills",
    );
    expect(resolveAgentDir(byId("cursor"), { scope: "project", cwd: "/p" })).toBe(
      "/p/.agents/skills",
    );
  });
});

const SKILL_SRC = "plugins/hs-cli/skills/hearthstone-deck";

describe("skill-bundle", () => {
  it("uses the canonical skill name", () => {
    expect(SKILL_NAME).toBe("hearthstone-deck");
  });

  it("bundles SKILL.md plus all three recipes", () => {
    expect(SKILL_BUNDLE.map((f) => f.relativePath).toSorted()).toEqual([
      "SKILL.md",
      "recipes/card.md",
      "recipes/deck.md",
      "recipes/meta.md",
    ]);
  });

  it("bundle contents match the on-disk source files", async () => {
    const pairs = await Promise.all(
      SKILL_BUNDLE.map(async (f) => ({
        f,
        disk: await readFile(join(SKILL_SRC, f.relativePath), "utf8"),
      })),
    );
    for (const { f, disk } of pairs) {
      expect(f.contents).toBe(disk);
    }
  });
});

import { resolveSelection } from "../src/services/skill-select.ts";

describe("skill-select", () => {
  it("uses explicit --agent ids when valid", () => {
    const r = resolveSelection({ agents: ["claude", "cursor"], isTTY: false });
    expect(r).toEqual({ kind: "explicit", agents: ["claude", "cursor"] });
  });

  it("errors on unknown --agent ids", () => {
    const r = resolveSelection({ agents: ["claude", "bogus"], isTTY: true });
    expect(r.kind).toBe("error");
  });

  it("asks to prompt when interactive and no flags", () => {
    expect(resolveSelection({ agents: [], isTTY: true })).toEqual({ kind: "prompt" });
  });

  it("errors when non-interactive and no flags", () => {
    const r = resolveSelection({ agents: [], isTTY: false });
    expect(r.kind).toBe("error");
  });
});

describe("skill-installer", () => {
  it("targets <baseDir>/hearthstone-deck", () => {
    expect(targetSkillDir("/base")).toBe("/base/hearthstone-deck");
  });

  it("reports non-existence then existence after writing", async () => {
    const base = await mkdtemp(join(tmpdir(), "hs-skill-"));
    try {
      expect(await skillExists(base)).toBe(false);
      await writeBundle(base);
      expect(await skillExists(base)).toBe(true);
    } finally {
      await rm(base, { recursive: true, force: true });
    }
  });

  it("writes SKILL.md and all recipes with correct content, idempotently", async () => {
    const base = await mkdtemp(join(tmpdir(), "hs-skill-"));
    try {
      await writeBundle(base);
      await writeBundle(base); // overwrite must not throw
      const skillPath = join(base, "hearthstone-deck", "SKILL.md");
      const recipePath = join(base, "hearthstone-deck", "recipes", "deck.md");
      await stat(skillPath); // throws if missing
      const disk = await readFile(
        join("plugins/hs-cli/skills/hearthstone-deck", "SKILL.md"),
        "utf8",
      );
      expect(await readFile(skillPath, "utf8")).toBe(disk);
      await stat(recipePath);
    } finally {
      await rm(base, { recursive: true, force: true });
    }
  });
});
