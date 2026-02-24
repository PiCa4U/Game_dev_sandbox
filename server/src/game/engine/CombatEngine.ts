import { BattleEventType, BattleStatus, Element, type BattleEvent } from "@autobattler/shared";
import { CONFIG } from "src/config";
import { EffectsEngine, type CardLevels } from "./EffectsEngine";
import { AbilitiesEngine } from "./AbilitiesEngine";

type UnitRuntime = {
  playerId: string;
  hp: number;
  hpMax: number;
  attackDamage: number;
  attackCooldown: number;
  attackIntervalTicks: number;
  attackElement: Element;
  regenPerTick: number;
  mana: number;
  alive: boolean;
};

export type CombatParticipant = {
  playerId: string;
  battleHpMax: number;
  attackDamage: number;
  attackSpeed: number;
  healthRegen: number;
  element: Element;
  cardLevels: CardLevels;
};

export type CombatResult = {
  status: BattleStatus;
  winnerId: string;
  loserId: string;
  events: BattleEvent[];
};

export class CombatEngine {
  private readonly ring: BattleEvent[] = [];

  constructor(private readonly effects: EffectsEngine, private readonly abilities: AbilitiesEngine) {}

  private pushEvent(event: BattleEvent): void {
    this.ring.push(event);
    if (this.ring.length > CONFIG.BATTLE_LOG_RING_SIZE) this.ring.shift();
  }

  runBattle(battleId: string, p1: CombatParticipant, p2: CombatParticipant): CombatResult {
    const unitA: UnitRuntime = {
      playerId: p1.playerId,
      hp: p1.battleHpMax,
      hpMax: p1.battleHpMax,
      attackDamage: p1.attackDamage,
      attackCooldown: 0,
      attackIntervalTicks: Math.max(1, Math.floor(CONFIG.TICK_RATE / Math.max(0.1, p1.attackSpeed))),
      attackElement: p1.element,
      regenPerTick: p1.healthRegen / CONFIG.TICK_RATE,
      mana: 0,
      alive: true
    };
    const unitB: UnitRuntime = {
      playerId: p2.playerId,
      hp: p2.battleHpMax,
      hpMax: p2.battleHpMax,
      attackDamage: p2.attackDamage,
      attackCooldown: 0,
      attackIntervalTicks: Math.max(1, Math.floor(CONFIG.TICK_RATE / Math.max(0.1, p2.attackSpeed))),
      attackElement: p2.element,
      regenPerTick: p2.healthRegen / CONFIG.TICK_RATE,
      mana: 0,
      alive: true
    };

    const events: BattleEvent[] = [];
    const maxTicks = CONFIG.BATTLE_DURATION_MS / (1000 / CONFIG.TICK_RATE);

    for (let tick = 0; tick < maxTicks; tick += 1) {
      this.tickUnit(tick, battleId, unitA, unitB, p1.cardLevels, events);
      this.tickUnit(tick, battleId, unitB, unitA, p2.cardLevels, events);
      for (const u of [unitA, unitB]) {
        if (!u.alive) continue;
        const pre = u.hp;
        u.hp = Math.min(u.hpMax, u.hp + u.regenPerTick);
        if (u.hp > pre) {
          events.push({ timestampTick: tick, battleId, actorId: u.playerId, type: BattleEventType.HEAL, amount: Math.round(u.hp - pre) });
        }
      }
      if (tick % CONFIG.TICK_RATE === 0) {
        for (const u of [unitA, unitB]) {
          if (!u.alive) continue;
          const gain = Math.min(CONFIG.MANA_REGEN_PER_SEC, CONFIG.MANA_MAX - u.mana);
          u.mana += gain;
          events.push({ timestampTick: tick, battleId, actorId: u.playerId, type: BattleEventType.MANA_GAIN, amount: gain });
          if (u.mana >= CONFIG.MANA_MAX) {
            u.mana = 0;
            events.push({ timestampTick: tick, battleId, actorId: u.playerId, targetId: u === unitA ? unitB.playerId : unitA.playerId, type: BattleEventType.ULT_CAST, source: "ult_burst", amount: 80 });
            const target = u === unitA ? unitB : unitA;
            target.hp -= 80;
            if (target.hp <= 0 && target.alive) {
              target.alive = false;
              events.push({ timestampTick: tick, battleId, actorId: u.playerId, targetId: target.playerId, type: BattleEventType.DEATH });
            }
          }
        }
      }
      if (!unitA.alive || !unitB.alive) break;
    }

    const winner = unitA.alive && !unitB.alive ? unitA : unitB.alive && !unitA.alive ? unitB : unitA.hp >= unitB.hp ? unitA : unitB;
    const loser = winner.playerId === unitA.playerId ? unitB : unitA;
    return { status: BattleStatus.ENDED, winnerId: winner.playerId, loserId: loser.playerId, events };
  }

  private tickUnit(
    tick: number,
    battleId: string,
    source: UnitRuntime,
    target: UnitRuntime,
    cards: CardLevels,
    events: BattleEvent[]
  ): void {
    if (!source.alive || !target.alive) return;
    source.attackCooldown -= 1;
    if (source.attackCooldown > 0) return;
    source.attackCooldown = source.attackIntervalTicks;
    events.push({ timestampTick: tick, battleId, actorId: source.playerId, targetId: target.playerId, type: BattleEventType.ATTACK, element: source.attackElement });
    target.hp -= source.attackDamage;
    events.push({
      timestampTick: tick,
      battleId,
      actorId: source.playerId,
      targetId: target.playerId,
      type: BattleEventType.DAMAGE,
      amount: source.attackDamage,
      element: source.attackElement
    });
    for (const event of this.effects.onDealDamage({ actorId: source.playerId, element: source.attackElement, cardLevels: cards, tick, battleId })) {
      events.push(event);
      if (event.type === BattleEventType.MANA_GAIN) source.mana = Math.min(CONFIG.MANA_MAX, source.mana + (event.amount ?? 0));
    }
    for (const event of this.abilities.onDealDamage({ actorId: source.playerId, element: source.attackElement, battleId, tick, mana: source.mana })) {
      events.push(event);
      if (event.type === BattleEventType.MANA_GAIN) source.mana = Math.min(CONFIG.MANA_MAX, source.mana + (event.amount ?? 0));
    }
    if (target.hp <= 0 && target.alive) {
      target.alive = false;
      events.push({ timestampTick: tick, battleId, actorId: source.playerId, targetId: target.playerId, type: BattleEventType.DEATH });
    }
  }
}
