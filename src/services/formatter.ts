import type { Card, Deck, DeckCard, OutputFormat } from "../types/index.js";
import { getFormatKo, getHeroClassKo } from "./deck-decoder.js";

const buildManaCurve = (cards: readonly DeckCard[]): Record<number, number> => {
  const curve: Record<number, number> = {};
  for (const { card, count } of cards) {
    const bucket = Math.min(card.cost, 10);
    curve[bucket] = (curve[bucket] ?? 0) + count;
  }
  return curve;
};

const raritySymbol = (rarity?: string): string => {
  switch (rarity) {
    case "LEGENDARY":
      return "★";
    case "EPIC":
      return "◆";
    case "RARE":
      return "◇";
    case "COMMON":
      return "·";
    default:
      return "";
  }
};

const stripHtml = (text: string): string => text.replaceAll(/<[^>]*>/g, "").replaceAll("\n", " ");

const formatDeckTable = (deck: Deck): string => {
  const classKo = getHeroClassKo(deck.heroClass);
  const formatKo = getFormatKo(deck.format);
  const totalCards = deck.cards.reduce((sum, c) => sum + c.count, 0);

  const lines: string[] = [
    `Class:  ${classKo} (${deck.heroClass})`,
    `Format: ${formatKo}`,
    `Dust:   ${deck.totalDust.toLocaleString()}`,
    `Cards:  ${totalCards}`,
    "",
    "Mana Curve",
  ];

  const manaCounts = buildManaCurve(deck.cards);
  const maxCount = Math.max(...Object.values(manaCounts), 1);
  for (let mana = 0; mana <= 10; mana++) {
    const count = manaCounts[mana] ?? 0;
    if (count === 0) continue;
    const bar = "█".repeat(Math.ceil((count / maxCount) * 12));
    const label = mana === 10 ? "10+" : ` ${mana} `;
    lines.push(` ${label} ${bar} ${count}`);
  }
  lines.push("", `Cards (${totalCards})`);

  for (const { card, count } of deck.cards) {
    const rarity = raritySymbol(card.rarity);
    lines.push(`  ×${count}  (${card.cost}) ${card.name} ${rarity}`);
  }

  lines.push("", `Code: ${deck.deckCode}`);
  return lines.join("\n");
};

const formatCardTable = (card: Card): string => {
  const lines: string[] = [
    `${card.name} (${card.id})`,
    `  Cost: ${card.cost}  Type: ${card.type}  Rarity: ${card.rarity ?? "FREE"}`,
  ];
  if (card.attack !== undefined) {
    lines.push(`  Attack: ${card.attack}  Health: ${card.health ?? card.durability ?? "-"}`);
  }
  if (card.cardClass) lines.push(`  Class: ${card.cardClass}`);
  if (card.set) lines.push(`  Set: ${card.set}`);
  if (card.text) lines.push(`  Text: ${stripHtml(card.text)}`);
  if (card.mechanics?.length) lines.push(`  Mechanics: ${card.mechanics.join(", ")}`);
  return lines.join("\n");
};

export const formatDeck = (deck: Deck, format: OutputFormat): string => {
  if (format === "json") return JSON.stringify(deck, undefined, 2);
  return formatDeckTable(deck);
};

export const formatCard = (card: Card, format: OutputFormat): string => {
  if (format === "json") return JSON.stringify(card, undefined, 2);
  return formatCardTable(card);
};

export const formatCardList = (cards: readonly Card[], format: OutputFormat): string => {
  if (format === "json") return JSON.stringify(cards, undefined, 2);
  if (cards.length === 0) return "No cards found.";
  const lines = cards
    .slice(0, 30)
    .map((c) => `  (${c.cost}) ${c.name} [${c.cardClass ?? "NEUTRAL"}] ${raritySymbol(c.rarity)}`);
  if (cards.length > 30) lines.push(`  ... and ${cards.length - 30} more`);
  return `Found ${cards.length} cards:\n${lines.join("\n")}`;
};

export const formatMeta = (
  type: string,
  values: readonly string[],
  format: OutputFormat,
): string => {
  if (format === "json") return JSON.stringify({ type, values }, undefined, 2);
  return `${type} (${values.length}):\n${values.map((v) => `  ${v}`).join("\n")}`;
};
