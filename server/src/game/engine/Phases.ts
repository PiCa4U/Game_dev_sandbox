import { Phase } from "@autobattler/shared";
import { CONFIG } from "src/config";

export const phaseDuration = (phase: Phase): number => {
  switch (phase) {
    case Phase.CHARACTER_SELECT:
      return CONFIG.CHARACTER_SELECT_DURATION_MS;
    case Phase.CHOICE:
      return CONFIG.CHOICE_DURATION_MS;
    case Phase.BATTLE:
      return CONFIG.BATTLE_DURATION_MS;
    case Phase.ROUND_RESULT:
      return CONFIG.ROUND_RESULT_DURATION_MS;
    case Phase.ENDED:
      return 0;
  }
};

export const nextPhase = (phase: Phase): Phase => {
  if (phase === Phase.CHARACTER_SELECT) return Phase.CHOICE;
  if (phase === Phase.CHOICE) return Phase.BATTLE;
  if (phase === Phase.BATTLE) return Phase.ROUND_RESULT;
  if (phase === Phase.ROUND_RESULT) return Phase.CHOICE;
  return Phase.ENDED;
};
