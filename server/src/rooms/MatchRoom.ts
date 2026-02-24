import { Client, Room } from "colyseus";
import { BattleStatus, C2S, Element, Phase, S2C, type CardOffer, type RoundResultItem } from "@autobattler/shared";
import { MatchState, PlayerPublicState, BattlePublicState } from "src/state/MatchState";
import { CONFIG } from "src/config";
import { CHARACTERS, CHARACTERS_BY_ID } from "src/game/definitions/characters";
import { COMMON_CARDS, CARD_BY_ID } from "src/game/definitions/cards";
import { nextPhase, phaseDuration } from "src/game/engine/Phases";
import { Rng } from "src/game/engine/Rng";
import { EffectsEngine } from "src/game/engine/EffectsEngine";
import { AbilitiesEngine } from "src/game/engine/AbilitiesEngine";
import { CombatEngine } from "src/game/engine/CombatEngine";

type PrivateState = {
  offers: Record<string, CardOffer[]>;
  ownedCardsLevels: Record<string, number>;
};

export class MatchRoom extends Room<MatchState> {
  maxClients = CONFIG.ROOM_MAX_CLIENTS;
  private rng!: Rng;
  private readonly privateState = new Map<string, PrivateState>();

  onCreate(): void {
    this.setState(new MatchState());
    const seed = `${Date.now()}-${Math.random()}`;
    this.state.seed = seed;
    this.rng = new Rng(seed);
    this.state.config.tickRate = CONFIG.TICK_RATE;
    this.state.config.sessionHpLoss = CONFIG.SESSION_HP_LOSS;
    this.state.config.cardCost = CONFIG.CARD_COST;
    this.state.config.manaMax = CONFIG.MANA_MAX;

    this.onMessage(C2S.CLIENT_READY, (client) => this.onReady(client));
    this.onMessage(C2S.MATCHMAKING_JOIN, (client) => client.send(S2C.MATCHMAKING_QUEUED, { ok: true }));
    this.onMessage(C2S.CHARACTER_SELECT, (client, msg: { characterId: string }) => this.onCharacterSelect(client, msg.characterId));
    this.onMessage(C2S.CARD_PICK, (client, msg: { offerId: string; cardId: string }) => this.onCardPick(client, msg.offerId, msg.cardId));

    this.schedulePhase(Phase.CHARACTER_SELECT);
  }

  onJoin(client: Client): void {
    const player = new PlayerPublicState();
    player.id = client.sessionId;
    player.sessionHp = CONFIG.DEFAULT_SESSION_HP;
    player.battleHp = CONFIG.DEFAULT_BATTLE_HP;
    player.gold = CONFIG.START_GOLD;
    this.state.players.set(client.sessionId, player);
    this.privateState.set(client.sessionId, { offers: {}, ownedCardsLevels: {} });
    client.send(S2C.MATCHMAKING_QUEUED, { ok: true });
  }

  onLeave(client: Client): void {
    const p = this.state.players.get(client.sessionId);
    if (p) p.connected = false;
  }

  private onReady(client: Client): void {
    const p = this.state.players.get(client.sessionId);
    if (!p) return;
    p.ready = true;
    if (this.state.players.size === CONFIG.ROOM_MAX_CLIENTS && [...this.state.players.values()].every((x) => x.ready)) {
      this.broadcast(S2C.MATCHMAKING_MATCHED, { roomId: this.roomId });
    }
  }

  private onCharacterSelect(client: Client, characterId: string): void {
    if (this.state.phase !== Phase.CHARACTER_SELECT) return this.reject(client, C2S.CHARACTER_SELECT, "invalid_phase");
    const p = this.state.players.get(client.sessionId);
    const def = CHARACTERS_BY_ID.get(characterId);
    if (!p || !def) return this.reject(client, C2S.CHARACTER_SELECT, "invalid_character");
    p.characterId = characterId;
    p.element = def.element;
    p.publicStats.attackDamage = def.stats.attackDamage;
    p.publicStats.attackSpeed = def.stats.attackSpeed;
    p.publicStats.battleHpMax = def.stats.battleHpMax;
    p.publicStats.healthRegen = def.stats.healthRegen;
    p.battleHp = def.stats.battleHpMax;
  }

  private onCardPick(client: Client, offerId: string, cardId: string): void {
    if (this.state.phase !== Phase.CHOICE) return this.reject(client, C2S.CARD_PICK, "invalid_phase");
    const p = this.state.players.get(client.sessionId);
    const privateState = this.privateState.get(client.sessionId);
    if (!p || !privateState) return;
    if (p.gold < CONFIG.CARD_COST) return this.reject(client, C2S.CARD_PICK, "not_enough_gold");
    const cards = privateState.offers[offerId];
    if (!cards || !cards.some((c) => c.cardId === cardId)) return this.reject(client, C2S.CARD_PICK, "invalid_offer");
    const def = CARD_BY_ID.get(cardId);
    if (!def) return this.reject(client, C2S.CARD_PICK, "unknown_card");
    const current = privateState.ownedCardsLevels[cardId] ?? 0;
    const next = Math.min(current + 1, def.maxLevel);
    if (next === current) return this.reject(client, C2S.CARD_PICK, "already_max");
    privateState.ownedCardsLevels[cardId] = next;
    p.gold -= CONFIG.CARD_COST;
    client.send(S2C.PRIVATE_STATE, { ownedCardsLevels: privateState.ownedCardsLevels });
  }

  private reject(client: Client, action: string, reason: string): void {
    client.send(S2C.ACTION_REJECTED, { action, reason });
  }

  private schedulePhase(phase: Phase): void {
    this.state.phase = phase;
    if (phase === Phase.CHOICE) this.state.round += 1;
    const duration = phaseDuration(phase);
    this.state.phaseEndsAt = Date.now() + duration;
    this.broadcast(S2C.PHASE_UPDATE, { phase, endsAt: this.state.phaseEndsAt, round: this.state.round });

    if (phase === Phase.CHARACTER_SELECT) {
      this.offerCharacters();
    }
    if (phase === Phase.CHOICE) {
      this.startChoice();
    }
    if (phase === Phase.BATTLE) {
      this.startBattlePhase();
    }

    if (phase !== Phase.ENDED) {
      this.clock.setTimeout(() => {
        if (this.state.phase !== phase) return;
        if (phase === Phase.ROUND_RESULT) {
          if (this.checkMatchEnded()) return;
        }
        this.schedulePhase(nextPhase(phase));
      }, duration);
    }
  }

  private offerCharacters(): void {
    for (const client of this.clients) {
      const offer = this.rng.shuffle(CHARACTERS).slice(0, 3);
      client.send(S2C.OFFERS_CARDS, {
        offerId: "character-offer",
        cards: offer.map((c) => ({ cardId: c.id, name: c.name, rarity: "common", element: c.element, desc: "Select hero", previewStats: `${c.stats.attackDamage} ATK` }))
      });
    }
  }

  private startChoice(): void {
    for (const player of this.state.players.values()) {
      if (player.eliminated) continue;
      player.gold = Math.min(CONFIG.GOLD_CAP, player.gold + CONFIG.GOLD_PER_ROUND);
    }
    for (const client of this.clients) {
      const privateState = this.privateState.get(client.sessionId);
      if (!privateState) continue;
      const offerId = `offer-${this.state.round}`;
      const cards = this.rng.shuffle(COMMON_CARDS).slice(0, 3).map((c) => ({
        cardId: c.id,
        name: c.name,
        rarity: c.rarity,
        element: c.element,
        desc: c.description,
        previewStats: "Level up card"
      }));
      privateState.offers[offerId] = cards;
      client.send(S2C.OFFERS_CARDS, { offerId, cards });
      client.send(S2C.PRIVATE_STATE, { ownedCardsLevels: privateState.ownedCardsLevels });
    }
  }

  private startBattlePhase(): void {
    this.state.battles.clear();
    const alive = [...this.state.players.values()].filter((p) => !p.eliminated);
    const shuffled = this.rng.shuffle(alive);
    const results: RoundResultItem[] = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      const a = shuffled[i];
      const b = shuffled[i + 1];
      if (!a || !b) continue;
      const battleId = `r${this.state.round}-${i / 2}`;
      const bp = new BattlePublicState();
      bp.battleId = battleId;
      bp.p1Id = a.id;
      bp.p2Id = b.id;
      bp.status = BattleStatus.RUNNING;
      this.state.battles.set(battleId, bp);

      const effects = new EffectsEngine();
      const abilities = new AbilitiesEngine(this.rng);
      const engine = new CombatEngine(effects, abilities);
      const aPrivate = this.privateState.get(a.id);
      const bPrivate = this.privateState.get(b.id);
      const outcome = engine.runBattle(
        battleId,
        {
          playerId: a.id,
          battleHpMax: a.publicStats.battleHpMax,
          attackDamage: a.publicStats.attackDamage,
          attackSpeed: a.publicStats.attackSpeed,
          healthRegen: a.publicStats.healthRegen,
          element: a.element,
          cardLevels: aPrivate?.ownedCardsLevels ?? {}
        },
        {
          playerId: b.id,
          battleHpMax: b.publicStats.battleHpMax,
          attackDamage: b.publicStats.attackDamage,
          attackSpeed: b.publicStats.attackSpeed,
          healthRegen: b.publicStats.healthRegen,
          element: b.element,
          cardLevels: bPrivate?.ownedCardsLevels ?? {}
        }
      );

      bp.status = outcome.status;
      bp.winnerId = outcome.winnerId;
      bp.loserId = outcome.loserId;
      const loser = this.state.players.get(outcome.loserId);
      if (loser) {
        loser.sessionHp -= CONFIG.SESSION_HP_LOSS;
        if (loser.sessionHp <= 0) loser.eliminated = true;
      }
      results.push({
        winnerId: outcome.winnerId,
        loserId: outcome.loserId,
        sessionHpLoss: CONFIG.SESSION_HP_LOSS,
        eliminatedIds: [...this.state.players.values()].filter((p) => p.eliminated).map((p) => p.id)
      });
      this.broadcast(S2C.BATTLE_LOG, { battleId, events: outcome.events });
    }

    this.clock.setTimeout(() => {
      this.broadcast(S2C.ROUND_RESULT, { round: this.state.round, results });
      this.schedulePhase(Phase.ROUND_RESULT);
    }, 500);
  }

  private checkMatchEnded(): boolean {
    const alive = [...this.state.players.values()].filter((p) => !p.eliminated);
    if (alive.length === 1) {
      this.state.phase = Phase.ENDED;
      this.broadcast(S2C.MATCH_ENDED, { winnerId: alive[0].id });
      return true;
    }
    return false;
  }
}
