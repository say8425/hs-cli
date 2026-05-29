import { AGENTS, isAgentId, type AgentId } from "./agent-dirs.ts";

export type Selection =
  | { readonly kind: "explicit"; readonly agents: readonly AgentId[] }
  | { readonly kind: "prompt" }
  | { readonly kind: "error"; readonly message: string };

export interface SelectionInput {
  readonly agents: readonly string[];
  readonly isTTY: boolean;
}

const validIds = (): string => AGENTS.map((a) => a.id).join(", ");

export const resolveSelection = (input: SelectionInput): Selection => {
  if (input.agents.length > 0) {
    const invalid = input.agents.filter((a) => !isAgentId(a));
    if (invalid.length > 0) {
      return {
        kind: "error",
        message: `Unknown agent(s): ${invalid.join(", ")}. Valid: ${validIds()}`,
      };
    }
    return { kind: "explicit", agents: input.agents as readonly AgentId[] };
  }
  if (input.isTTY) return { kind: "prompt" };
  return {
    kind: "error",
    message: `Not interactive: pass --agent <id> (comma-separated). Valid: ${validIds()}. e.g. hs skill install --agent claude`,
  };
};
