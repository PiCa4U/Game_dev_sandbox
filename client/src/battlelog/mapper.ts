import { type BattleEvent } from "@autobattler/shared";
import { VisualAction } from "./types";

export const mapBattleEventToVisual = (event: BattleEvent): VisualAction => ({
  id: `${event.battleId}-${event.timestampTick}-${event.type}-${Math.random().toString(36).slice(2)}`,
  type: event.type,
  actorId: event.actorId,
  targetId: event.targetId,
  amount: event.amount,
  startedAt: Date.now()
});
