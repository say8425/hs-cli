export interface Card {
  readonly dbfId: number;
  readonly id: string;
  readonly name: string;
  readonly cost: number;
  readonly attack?: number;
  readonly health?: number;
  readonly durability?: number;
  readonly armor?: number;
  readonly text?: string;
  readonly flavor?: string;
  readonly rarity?: string;
  readonly type: string;
  readonly cardClass?: string;
  readonly set?: string;
  readonly mechanics?: readonly string[];
  readonly race?: string;
  readonly artist?: string;
  readonly collectible?: boolean;
}

export interface DeckCard {
  readonly card: Card;
  readonly count: number;
}

export interface Deck {
  readonly heroClass: string;
  readonly heroDbfId: number;
  readonly format: DeckFormat;
  readonly cards: readonly DeckCard[];
  readonly deckCode: string;
  readonly totalDust: number;
}

export type DeckFormat = "standard" | "wild" | "classic" | "twist" | "unknown";

export type OutputFormat = "table" | "json";

export interface SkillOutcome {
  readonly agent: string;
  readonly path: string;
  readonly status: "installed" | "overwritten" | "skipped" | "failed";
  readonly error?: string;
}

export const FORMAT_MAP: Record<number, DeckFormat> = {
  1: "wild",
  2: "standard",
  3: "classic",
  4: "twist",
};

export const RARITY_DUST: Record<string, number> = {
  COMMON: 40,
  RARE: 100,
  EPIC: 400,
  LEGENDARY: 1600,
  FREE: 0,
};

export const CLASS_NAMES_KO: Record<string, string> = {
  DEMONHUNTER: "악마사냥꾼",
  DRUID: "드루이드",
  HUNTER: "사냥꾼",
  MAGE: "마법사",
  PALADIN: "성기사",
  PRIEST: "사제",
  ROGUE: "도적",
  SHAMAN: "주술사",
  WARLOCK: "흑마법사",
  WARRIOR: "전사",
  DEATHKNIGHT: "죽음의 기사",
  NEUTRAL: "중립",
};
