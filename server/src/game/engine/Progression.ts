import { CONFIG } from "src/config";

export const levelUpCard = (current: number, maxLevel: number): number => Math.min(current + 1, maxLevel);

export const canBuyCard = (gold: number): boolean => gold >= CONFIG.CARD_COST;

export const applySessionHpLoss = (sessionHp: number): number => sessionHp - CONFIG.SESSION_HP_LOSS;
