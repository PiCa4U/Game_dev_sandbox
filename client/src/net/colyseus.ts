import { Client, Room } from "colyseus.js";
import { C2S, S2C, type BattleEvent, type CardOffer, type PhaseUpdate } from "@autobattler/shared";
import { useMatchStore } from "../state/store";
import { useVisualQueue } from "../battlelog/queue";

const WS_ENDPOINT = import.meta.env.VITE_COLYSEUS_URL ?? "ws://localhost:2567";

let room: Room | null = null;

export const connectMatch = async (): Promise<void> => {
  const client = new Client(WS_ENDPOINT);
  room = await client.joinOrCreate("match");
  useMatchStore.getState().setBootError("");

  room.onMessage(S2C.PHASE_UPDATE, (msg: PhaseUpdate) => {
    useMatchStore.getState().setPhase(msg.phase, msg.endsAt, msg.round);
  });

  room.onMessage(S2C.OFFERS_CARDS, (msg: { offerId: string; cards: CardOffer[] }) => {
    useMatchStore.getState().setOffers(msg.offerId, msg.cards);
  });

  room.onMessage(S2C.ACTION_REJECTED, (msg: { action: string; reason: string }) => {
    useMatchStore.getState().setRejected(`${msg.action}: ${msg.reason}`);
  });

  room.onMessage(S2C.BATTLE_LOG, (msg: { battleId: string; events: BattleEvent[] }) => {
    useVisualQueue.getState().enqueueEvents(msg.events);
    useMatchStore.getState().addBattleEvents(msg.events);
  });

  room.onStateChange((state: any) => {
    const me = state.players?.get(room?.sessionId);
    if (me) {
      useMatchStore.getState().setEconomy(me.sessionHp, me.gold);
    }
  });

  room.onError((code, message) => {
    useMatchStore.getState().setBootError(`room_error_${code}: ${message}`);
  });

  room.onLeave((code) => {
    useMatchStore.getState().setBootError(`disconnected: ${code}`);
  });

  room.send(C2S.MATCHMAKING_JOIN);
  room.send(C2S.CLIENT_READY);
};

export const sendCharacterSelect = (characterId: string): void => room?.send(C2S.CHARACTER_SELECT, { characterId });
export const sendCardPick = (offerId: string, cardId: string): void => room?.send(C2S.CARD_PICK, { offerId, cardId });
