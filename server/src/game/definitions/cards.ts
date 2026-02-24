import { CardDef, Element, Rarity } from "@autobattler/shared";

const elements = [
  Element.FIRE,
  Element.WATER,
  Element.WIND,
  Element.LIGHT,
  Element.DARK,
  Element.LIGHTNING
];

const cards: CardDef[] = [];
for (const element of elements) {
  for (let i = 1; i <= 10; i += 1) {
    cards.push({
      id: `${element}_common_${i}`,
      name: `${element} Common ${i}`,
      rarity: Rarity.COMMON,
      element,
      description: `Common ${element} card ${i}`,
      maxLevel: 5
    });
  }
  for (let i = 1; i <= 3; i += 1) {
    cards.push({
      id: `${element}_epic_${i}`,
      name: `${element} Epic ${i}`,
      rarity: Rarity.EPIC,
      element,
      description: `Epic ${element} card ${i}`,
      maxLevel: 3
    });
  }
  cards.push({
    id: `${element}_legendary_1`,
    name: `${element} Legendary 1`,
    rarity: Rarity.LEGENDARY,
    element,
    description: `Legendary ${element} card`,
    maxLevel: 1
  });
}

cards.push({
  id: "fire_mana_on_hit",
  name: "FireManaOnHit",
  rarity: Rarity.COMMON,
  element: Element.FIRE,
  description: "On fire damage, gain mana scaling by level.",
  maxLevel: 5
});

export const CARDS = cards;
export const CARD_BY_ID = new Map(CARDS.map((c) => [c.id, c]));
export const COMMON_CARDS = CARDS.filter((c) => c.rarity === Rarity.COMMON);
