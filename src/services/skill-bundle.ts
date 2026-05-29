import skillMd from "../../plugins/hs-cli/skills/hearthstone-deck/SKILL.md" with { type: "text" };
import cardRecipe from "../../plugins/hs-cli/skills/hearthstone-deck/recipes/card.md" with { type: "text" };
import deckRecipe from "../../plugins/hs-cli/skills/hearthstone-deck/recipes/deck.md" with { type: "text" };
import metaRecipe from "../../plugins/hs-cli/skills/hearthstone-deck/recipes/meta.md" with { type: "text" };

export const SKILL_NAME = "hearthstone-deck";

export interface BundledFile {
  readonly relativePath: string;
  readonly contents: string;
}

export const SKILL_BUNDLE: readonly BundledFile[] = [
  { relativePath: "SKILL.md", contents: skillMd },
  { relativePath: "recipes/card.md", contents: cardRecipe },
  { relativePath: "recipes/deck.md", contents: deckRecipe },
  { relativePath: "recipes/meta.md", contents: metaRecipe },
];
