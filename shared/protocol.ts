export const PROTOCOL_VERSION = "1.0.0";

export const C2S = {
  MATCHMAKING_JOIN: "matchmaking:join",
  CLIENT_READY: "client:ready",
  CHARACTER_SELECT: "character:select",
  CARD_PICK: "card:pick"
} as const;

export const S2C = {
  MATCHMAKING_QUEUED: "matchmaking:queued",
  MATCHMAKING_MATCHED: "matchmaking:matched",
  PHASE_UPDATE: "phase:update",
  OFFERS_CARDS: "offers:cards",
  PRIVATE_STATE: "state:private",
  ACTION_REJECTED: "action:rejected",
  BATTLE_LOG: "battle:log",
  ROUND_RESULT: "round:result",
  MATCH_ENDED: "match:ended"
} as const;
