#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import pkg from "../package.json" with { type: "json" };
import { cardCommand } from "./commands/card.ts";
import { deckCommand } from "./commands/deck.ts";
import { metaCommand } from "./commands/meta.ts";
import { skillCommand } from "./commands/skill.ts";

const main = defineCommand({
  meta: {
    name: "hs",
    version: pkg.version,
    description: "Hearthstone CLI — deck decoder, card search, metadata",
  },
  subCommands: {
    deck: deckCommand,
    card: cardCommand,
    meta: metaCommand,
    skill: skillCommand,
  },
});

runMain(main);
