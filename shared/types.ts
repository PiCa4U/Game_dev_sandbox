import { BattleEventType, BattleStatus, Element, Phase, Rarity } from "./enums";

export type PublicStats = {
  battleHpMax: number;
  attackDamage: number;
  attackSpeed: number;
  healthRegen: number;
};

export type CharacterDef = {
  id: string;
  name: string;
  element: Element;
  stats: PublicStats;
  abilityId: string;
  ultId: string;
};

export type CardDef = {
  id: string;
  name: string;
  rarity: Rarity;
  element: Element;
  description: string;
  maxLevel: number;
};

export type CardOffer = {
  cardId: string;
  name: string;
  rarity: Rarity;
  element: Element;
  desc: string;
  previewStats: string;
};

export type BattleEvent = {
  timestampTick: number;
  battleId: string;
  actorId?: string;
  targetId?: string;
  type: BattleEventType;
  amount?: number;
  element?: Element;
  source?: string;
};

export type BattlePublic = {
  battleId: string;
  p1Id: string;
  p2Id: string;
  status: BattleStatus;
  winnerId: string;
  loserId: string;
};

export type RoundResultItem = {
  winnerId: string;
  loserId: string;
  sessionHpLoss: number;
  eliminatedIds: string[];
};

export type PhaseUpdate = {
  phase: Phase;
  endsAt: number;
  round: number;
};
