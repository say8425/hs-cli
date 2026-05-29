import { spawnSync } from "node:child_process";
import { defineCommand } from "citty";
import { isCancel, multiselect, confirm } from "@clack/prompts";
import { AGENTS, resolveAgentDir, type AgentId } from "../services/agent-dirs.ts";
import { resolveSelection } from "../services/skill-select.ts";
import { skillExists, writeBundle, targetSkillDir } from "../services/skill-installer.ts";
import { SKILL_NAME } from "../services/skill-bundle.ts";
import { formatSkillOutcomes } from "../services/formatter.ts";
import type { OutputFormat, SkillOutcome } from "../types/index.ts";

const fail = (message: string): never => {
  process.stderr.write(`${message}\n`);
  process.exit(1);
};

const promptAgents = async (): Promise<readonly AgentId[]> => {
  const picked = await multiselect({
    message: "Install the hearthstone-deck skill for which agents?",
    options: AGENTS.map((a) => ({ value: a.id, label: a.label })),
    required: true,
    output: process.stderr,
  });
  if (isCancel(picked)) process.exit(0);
  return picked as readonly AgentId[];
};

const delegateToNpx = (global: boolean): never => {
  const args = ["skills", "add", "say8425/hs-cli", "--skill", SKILL_NAME];
  if (global) args.push("-g");
  process.stderr.write(`Delegating to: npx ${args.join(" ")}\n`);
  const res = spawnSync("npx", args, { stdio: "inherit" });
  process.exit(res.status ?? 1);
};

const installCommand = defineCommand({
  meta: {
    name: "install",
    description: "Install the hearthstone-deck skill into agent skills dirs",
  },
  args: {
    agent: {
      type: "string",
      description: "Comma-separated agent ids: claude,cursor,codex,copilot,opencode",
    },
    project: {
      type: "boolean",
      default: false,
      description: "Install into the current project instead of the user home (global)",
    },
    "use-npx": {
      type: "boolean",
      default: false,
      description:
        "Delegate to `npx skills add` when npx is available (installs for all agents skills detects; ignores --agent)",
    },
    force: {
      type: "boolean",
      default: false,
      description: "Overwrite an existing skill without prompting",
    },
    format: {
      type: "string",
      alias: "f",
      default: "table",
      description: "Output format: table or json",
    },
  },
  run: async ({ args }) => {
    const scope = args.project ? "project" : "global";

    if (args["use-npx"]) {
      const hasNpx = spawnSync("npx", ["--version"], { stdio: "ignore" }).status === 0;
      if (hasNpx) delegateToNpx(scope === "global");
      process.stderr.write("npx not found; falling back to embedded install.\n");
    }

    const agentFlags = (args.agent ?? "")
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    const selection = resolveSelection({
      agents: agentFlags,
      isTTY: process.stdout.isTTY === true,
    });
    if (selection.kind === "error") fail(selection.message);

    const agentIds: readonly AgentId[] =
      selection.kind === "explicit" ? selection.agents : await promptAgents();

    const outcomes: SkillOutcome[] = [];

    // Several agents can resolve to the same dir (e.g. project scope: cursor/codex/
    // copilot/opencode all map to .agents/skills). Dedupe by resolved target dir so we
    // writeBundle once per physical dir and report a single accurate outcome for it.
    const byDir = new Map<string, string[]>();
    const order: string[] = [];
    for (const id of agentIds) {
      const def = AGENTS.find((a) => a.id === id);
      if (!def) {
        outcomes.push({ agent: id, path: id, status: "failed", error: "unknown agent" });
        continue;
      }
      const baseDir = resolveAgentDir(def, { scope });
      const existing = byDir.get(baseDir);
      if (existing) {
        existing.push(id);
      } else {
        byDir.set(baseDir, [id]);
        order.push(baseDir);
      }
    }

    // Sequential on purpose: the overwrite confirm() prompt must be shown one dir at a time.
    for (const baseDir of order) {
      const ids = byDir.get(baseDir) ?? [];
      const agentLabel = ids.join(",");
      try {
        const exists = await skillExists(baseDir);
        if (exists && !args.force && process.stdout.isTTY === true) {
          const ok = await confirm({
            message: `${agentLabel}: skill exists at ${baseDir}. Overwrite?`,
            output: process.stderr,
          });
          if (isCancel(ok)) process.exit(0);
          if (ok === false) {
            outcomes.push({ agent: agentLabel, path: baseDir, status: "skipped" });
            continue;
          }
        }
        await writeBundle(baseDir);
        outcomes.push({
          agent: agentLabel,
          path: targetSkillDir(baseDir),
          status: exists ? "overwritten" : "installed",
        });
      } catch (err) {
        outcomes.push({
          agent: agentLabel,
          path: baseDir,
          status: "failed",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    process.stdout.write(`${formatSkillOutcomes(outcomes, args.format as OutputFormat)}\n`);

    const anySuccess = outcomes.some((o) => o.status === "installed" || o.status === "overwritten");
    process.exit(anySuccess ? 0 : 1);
  },
});

export const skillCommand = defineCommand({
  meta: { name: "skill", description: "Manage the hearthstone-deck Claude Code skill" },
  subCommands: { install: installCommand },
});
