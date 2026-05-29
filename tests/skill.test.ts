import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "bun:test";
import {
  AGENTS,
  isAgentId,
  resolveAgentDir,
  type AgentDef,
} from "../src/services/agent-dirs.ts";
import { SKILL_BUNDLE, SKILL_NAME } from "../src/services/skill-bundle.ts";

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
