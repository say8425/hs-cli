import { defineCommand } from "citty";
import { getMetadata } from "../services/card-db.ts";
import { formatMeta } from "../services/formatter.ts";
import type { OutputFormat } from "../types/index.ts";

const VALID_TYPES = ["sets", "classes", "types", "rarities"] as const;
type MetaType = (typeof VALID_TYPES)[number];

export const metaCommand = defineCommand({
  meta: {
    name: "meta",
    description: "Show Hearthstone metadata (sets, classes, types, rarities)",
  },
  args: {
    type: {
      type: "positional",
      required: true,
      description: `One of: ${VALID_TYPES.join(", ")}`,
    },
    format: {
      type: "string",
      alias: "f",
      default: "table",
      description: "Output format: table or json",
    },
  },
  run: async ({ args }) => {
    const format = args.format as OutputFormat;
    const { type } = args;

    if (!VALID_TYPES.includes(type as MetaType)) {
      process.stderr.write(`Invalid type: ${type}. Must be one of: ${VALID_TYPES.join(", ")}\n`);
      process.exit(1);
    }

    try {
      const values = await getMetadata(type as MetaType);
      process.stdout.write(`${formatMeta(type, values, format)}\n`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`Error: ${msg}\n`);
      process.exit(1);
    }
  },
});
