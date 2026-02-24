export enum Phase {
  CHARACTER_SELECT = "CHARACTER_SELECT",
  CHOICE = "CHOICE",
  BATTLE = "BATTLE",
  ROUND_RESULT = "ROUND_RESULT",
  ENDED = "ENDED"
}

export enum Element {
  WATER = "water",
  FIRE = "fire",
  WIND = "wind",
  LIGHT = "light",
  DARK = "dark",
  LIGHTNING = "lightning"
}

export enum Rarity {
  COMMON = "common",
  EPIC = "epic",
  LEGENDARY = "legendary"
}

export enum BattleEventType {
  ATTACK = "ATTACK",
  DAMAGE = "DAMAGE",
  HEAL = "HEAL",
  MANA_GAIN = "MANA_GAIN",
  ULT_CAST = "ULT_CAST",
  ABILITY_PROC = "ABILITY_PROC",
  CARD_PROC = "CARD_PROC",
  DEATH = "DEATH"
}

export enum BattleStatus {
  PENDING = "pending",
  RUNNING = "running",
  ENDED = "ended"
}
