import { decode } from "deckstrings";
import {
  CLASS_NAMES_KO,
  FORMAT_MAP,
  RARITY_DUST,
  type Card,
  type Deck,
  type DeckCard,
  type DeckFormat,
} from "../types/index.js";
import { loadCards } from "./card-db.js";

export const decodeDeck = async (deckCode: string): Promise<Deck> => {
  const decoded = decode(deckCode);
  const cards = await loadCards();
  const dbfMap = new Map<number, Card>();
  for (const card of cards) {
    dbfMap.set(card.dbfId, card);
  }

  const deckCards: DeckCard[] = decoded.cards.map(([dbfId, count]) => {
    const card = dbfMap.get(dbfId);
    if (!card) {
      return {
        card: {
          dbfId,
          id: `UNKNOWN_${dbfId}`,
          name: `Unknown (${dbfId})`,
          cost: 0,
          type: "UNKNOWN",
        },
        count,
      };
    }
    return { card, count };
  });

  const sortedCards = deckCards.toSorted(
    (a, b) => a.card.cost - b.card.cost || a.card.name.localeCompare(b.card.name),
  );

  const heroCard = dbfMap.get(decoded.heroes[0]);
  const heroClass = heroCard?.cardClass ?? "UNKNOWN";
  const format: DeckFormat = FORMAT_MAP[decoded.format] ?? "unknown";

  let totalDust = 0;
  for (const { card, count } of sortedCards) {
    const rarityDust = RARITY_DUST[card.rarity ?? "FREE"] ?? 0;
    totalDust += rarityDust * count;
  }

  return {
    heroClass,
    heroDbfId: decoded.heroes[0],
    format,
    cards: sortedCards,
    deckCode,
    totalDust,
  };
};

export const getHeroClassKo = (heroClass: string): string => CLASS_NAMES_KO[heroClass] ?? heroClass;

export const getFormatKo = (format: DeckFormat): string => {
  const map: Record<DeckFormat, string> = {
    standard: "정규",
    wild: "야생",
    classic: "클래식",
    twist: "트위스트",
    unknown: "알 수 없음",
  };
  return map[format];
};
