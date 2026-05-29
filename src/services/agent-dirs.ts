import { homedir } from "node:os";
import { join } from "node:path";

export type AgentId = "claude" | "cursor" | "codex" | "copilot" | "opencode";

export interface AgentDef {
  readonly id: AgentId;
  readonly label: string;
  readonly globalDir: string;
  readonly projectDir: string;
}

export const AGENTS: readonly AgentDef[] = [
  { id: "claude", label: "Claude Code", globalDir: ".claude/skills", projectDir: ".claude/skills" },
  { id: "cursor", label: "Cursor", globalDir: ".cursor/skills", projectDir: ".agents/skills" },
  { id: "codex", label: "Codex", globalDir: ".codex/skills", projectDir: ".agents/skills" },
  {
    id: "copilot",
    label: "GitHub Copilot",
    globalDir: ".copilot/skills",
    projectDir: ".agents/skills",
  },
  {
    id: "opencode",
    label: "OpenCode",
    globalDir: ".config/opencode/skills",
    projectDir: ".agents/skills",
  },
];

export const isAgentId = (value: string): value is AgentId => AGENTS.some((a) => a.id === value);

export interface ResolveOptions {
  readonly scope: "global" | "project";
  readonly home?: string;
  readonly cwd?: string;
}

export const resolveAgentDir = (agent: AgentDef, opts: ResolveOptions): string =>
  opts.scope === "global"
    ? join(opts.home ?? homedir(), agent.globalDir)
    : join(opts.cwd ?? process.cwd(), agent.projectDir);
