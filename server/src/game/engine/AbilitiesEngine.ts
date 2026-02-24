import { BattleEventType, Element, type BattleEvent } from "@autobattler/shared";
import { CONFIG } from "src/config";
import { Rng } from "./Rng";

export class AbilitiesEngine {
  constructor(private readonly rng: Rng) {}

  onDealDamage(params: { actorId: string; element: Element; battleId: string; tick: number; mana: number }): BattleEvent[] {
    const events: BattleEvent[] = [];
    if (this.rng.next() <= 0.2) {
      events.push({
        timestampTick: params.tick,
        battleId: params.battleId,
        actorId: params.actorId,
        type: BattleEventType.ABILITY_PROC,
        source: "ability_elemental_proc",
        amount: 1,
        element: params.element
      });
      events.push({
        timestampTick: params.tick,
        battleId: params.battleId,
        actorId: params.actorId,
        type: BattleEventType.MANA_GAIN,
        amount: Math.min(1, CONFIG.MANA_MAX - params.mana),
        element: params.element,
        source: "ability_elemental_proc"
      });
    }
    return events;
  }
}
