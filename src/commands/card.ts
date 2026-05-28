import { defineCommand } from "citty";
import { findCardByDbfId, findCardById, searchCards } from "../services/card-db.ts";
import { resolveLocale } from "../services/locale.ts";
import { formatCard, formatCardList } from "../services/formatter.ts";
import type { OutputFormat } from "../types/index.ts";

export const cardCommand = defineCommand({
  meta: {
    name: "card",
    description: "Look up or search Hearthstone cards",
  },
  args: {
    query: {
      type: "positional",
      required: false,
      description: "Card dbfId, card ID, or name to look up",
    },
    search: {
      type: "string",
      alias: "s",
      description: "Search cards by name",
    },
    class: {
      type: "string",
      description: "Filter by class (e.g. PRIEST, MAGE)",
    },
    cost: {
      type: "string",
      description: "Filter by mana cost",
    },
    format: {
      type: "string",
      alias: "f",
      default: "table",
      description: "Output format: table or json",
    },
    locale: {
      type: "string",
      alias: "l",
      description:
        "HearthstoneJSON locale (e.g. enUS, koKR, jaJP). Auto-detected from $LANG when omitted.",
    },
  },
  run: async ({ args }) => {
    const format = args.format as OutputFormat;

    try {
      const locale = resolveLocale(args.locale);

      if (args.search) {
        let results = await searchCards(args.search, locale);
        if (args.class) {
          const cls = args.class.toUpperCase();
          results = results.filter((c) => c.cardClass === cls);
        }
        if (args.cost) {
          const cost = Number.parseInt(args.cost, 10);
          results = results.filter((c) => c.cost === cost);
        }
        process.stdout.write(`${formatCardList(results, format)}\n`);
        return;
      }

      const query = args.query;
      if (!query) {
        process.stderr.write("Provide a card ID, dbfId, or use --search\n");
        process.exit(1);
      }

      const numId = Number.parseInt(query, 10);
      const card = Number.isNaN(numId)
        ? ((await findCardById(query, locale)) ?? (await searchCards(query, locale))[0])
        : await findCardByDbfId(numId, locale);

      if (!card) {
        process.stderr.write(`Card not found: ${query}\n`);
        process.exit(1);
      }

      process.stdout.write(`${formatCard(card, format)}\n`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`Error: ${msg}\n`);
      process.exit(1);
    }
  },
});
