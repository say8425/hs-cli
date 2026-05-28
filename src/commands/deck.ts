import { defineCommand } from "citty";
import { decodeDeck } from "../services/deck-decoder.ts";
import { formatDeck } from "../services/formatter.ts";
import type { OutputFormat } from "../types/index.ts";

export const deckCommand = defineCommand({
  meta: {
    name: "deck",
    description: "Decode a Hearthstone deck code",
  },
  args: {
    code: {
      type: "positional",
      required: true,
      description: "Deck code (base64 string starting with AAEC)",
    },
    format: {
      type: "string",
      alias: "f",
      default: "table",
      description: "Output format: table or json",
    },
  },
  run: async ({ args }) => {
    try {
      const deck = await decodeDeck(args.code);
      process.stdout.write(`${formatDeck(deck, args.format as OutputFormat)}\n`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`Error decoding deck: ${msg}\n`);
      process.exit(1);
    }
  },
});
