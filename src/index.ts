#!/usr/bin/env bun
import { defineCommand, runMain } from "citty";
import { cardCommand } from "./commands/card.ts";
import { deckCommand } from "./commands/deck.ts";
import { metaCommand } from "./commands/meta.ts";

const main = defineCommand({
  meta: {
    name: "hs",
    version: "0.1.0",
    description: "Hearthstone CLI — deck decoder, card search, metadata",
  },
  subCommands: {
    deck: deckCommand,
    card: cardCommand,
    meta: metaCommand,
  },
});

runMain(main);
