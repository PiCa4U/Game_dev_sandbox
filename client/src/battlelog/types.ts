import { BattleEventType } from "@autobattler/shared";

export type VisualAction = {
  id: string;
  type: BattleEventType;
  actorId?: string;
  targetId?: string;
  amount?: number;
  startedAt: number;
};
