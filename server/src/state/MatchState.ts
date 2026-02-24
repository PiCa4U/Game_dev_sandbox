import { Schema, type, MapSchema } from "@colyseus/schema";
import { BattleStatus, Element, Phase } from "@autobattler/shared";

export class ConfigState extends Schema {
  @type("number") tickRate = 10;
  @type("number") sessionHpLoss = 5;
  @type("number") cardCost = 3;
  @type("number") manaMax = 100;
}

export class PublicStatsState extends Schema {
  @type("number") battleHpMax = 500;
  @type("number") attackDamage = 40;
  @type("number") attackSpeed = 1;
  @type("number") healthRegen = 2;
}

export class PlayerPublicState extends Schema {
  @type("string") id = "";
  @type("string") name = "";
  @type("boolean") connected = true;
  @type("boolean") ready = false;
  @type("boolean") eliminated = false;
  @type("number") sessionHp = 40;
  @type("number") gold = 3;
  @type("string") characterId = "";
  @type("string") element: Element = Element.FIRE;
  @type(PublicStatsState) publicStats = new PublicStatsState();
  @type("number") battleHp = 500;
}

export class BattlePublicState extends Schema {
  @type("string") battleId = "";
  @type("string") p1Id = "";
  @type("string") p2Id = "";
  @type("string") status: BattleStatus = BattleStatus.PENDING;
  @type("string") winnerId = "";
  @type("string") loserId = "";
}

export class MatchState extends Schema {
  @type("string") phase: Phase = Phase.CHARACTER_SELECT;
  @type("number") phaseEndsAt = 0;
  @type("number") round = 0;
  @type({ map: PlayerPublicState }) players = new MapSchema<PlayerPublicState>();
  @type({ map: BattlePublicState }) battles = new MapSchema<BattlePublicState>();
  @type(ConfigState) config = new ConfigState();
  @type("string") seed = "";
}
