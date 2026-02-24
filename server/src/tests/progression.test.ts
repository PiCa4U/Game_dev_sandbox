import { describe, expect, it } from "vitest";
import { CONFIG } from "src/config";
import { getFireManaOnHitGain } from "src/game/engine/EffectsEngine";
import { applySessionHpLoss, canBuyCard, levelUpCard } from "src/game/engine/Progression";

describe("Card leveling", () => {
  it("levels 0->cap", () => {
    let level = 0;
    for (let i = 0; i < 7; i += 1) {
      level = levelUpCard(level, 5);
    }
    expect(level).toBe(5);
  });
});

describe("FireManaOnHit", () => {
  it("returns correct mana for level 1..5", () => {
    expect(getFireManaOnHitGain(1)).toBe(10);
    expect(getFireManaOnHitGain(2)).toBe(15);
    expect(getFireManaOnHitGain(3)).toBe(20);
    expect(getFireManaOnHitGain(4)).toBe(25);
    expect(getFireManaOnHitGain(5)).toBe(30);
  });
});

describe("Validation", () => {
  it("cannot buy without enough gold", () => {
    expect(canBuyCard(CONFIG.CARD_COST - 1)).toBe(false);
    expect(canBuyCard(CONFIG.CARD_COST)).toBe(true);
  });
});

describe("Session hp loss", () => {
  it("applies configured hp loss", () => {
    expect(applySessionHpLoss(40)).toBe(35);
  });
});
