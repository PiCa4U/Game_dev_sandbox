import { BattleEventType, Element, type BattleEvent } from "@autobattler/shared";

export type CardLevels = Record<string, number>;

export const getFireManaOnHitGain = (level: number): number => Math.min(10 + (Math.max(level, 1) - 1) * 5, 30);

export class EffectsEngine {
  onDealDamage(params: {
    actorId: string;
    element: Element;
    cardLevels: CardLevels;
    tick: number;
    battleId: string;
  }): BattleEvent[] {
    const events: BattleEvent[] = [];
    const level = params.cardLevels.fire_mana_on_hit ?? 0;
    if (level > 0 && params.element === Element.FIRE) {
      const amount = getFireManaOnHitGain(level);
      events.push({
        timestampTick: params.tick,
        battleId: params.battleId,
        actorId: params.actorId,
        type: BattleEventType.CARD_PROC,
        source: "fire_mana_on_hit",
        amount,
        element: Element.FIRE
      });
      events.push({
        timestampTick: params.tick,
        battleId: params.battleId,
        actorId: params.actorId,
        type: BattleEventType.MANA_GAIN,
        source: "fire_mana_on_hit",
        amount,
        element: Element.FIRE
      });
    }
    return events;
  }
}
