import { describe, expect, it } from "bun:test";
import {
  AGENTS,
  isAgentId,
  resolveAgentDir,
  type AgentDef,
} from "../src/services/agent-dirs.ts";

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
