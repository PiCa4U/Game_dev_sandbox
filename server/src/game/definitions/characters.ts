import { CharacterDef, Element } from "@autobattler/shared";

const baseStats = {
  battleHpMax: 500,
  attackDamage: 40,
  attackSpeed: 1,
  healthRegen: 2
};

const elements = [
  Element.FIRE,
  Element.WATER,
  Element.WIND,
  Element.LIGHT,
  Element.DARK,
  Element.LIGHTNING
];

export const CHARACTERS: CharacterDef[] = Array.from({ length: 20 }).map((_, i) => {
  const element = elements[i % elements.length];
  return {
    id: `char_${i + 1}`,
    name: `Hero ${i + 1}`,
    element,
    stats: { ...baseStats },
    abilityId: "ability_elemental_proc",
    ultId: "ult_burst"
  };
});

export const CHARACTERS_BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));
