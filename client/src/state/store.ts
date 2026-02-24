import { create } from "zustand";
import { CardOffer, Phase, type BattleEvent } from "@autobattler/shared";

type MatchStore = {
  phase: Phase;
  endsAt: number;
  round: number;
  sessionHp: number;
  gold: number;
  offers: CardOffer[];
  offerId: string;
  rejectedMessage: string;
  bootError: string;
  battleTextLog: string[];
  setPhase: (phase: Phase, endsAt: number, round: number) => void;
  setEconomy: (sessionHp: number, gold: number) => void;
  setOffers: (offerId: string, offers: CardOffer[]) => void;
  setRejected: (message: string) => void;
  setBootError: (message: string) => void;
  addBattleEvents: (events: BattleEvent[]) => void;
};

export const useMatchStore = create<MatchStore>((set, get) => ({
  phase: Phase.CHARACTER_SELECT,
  endsAt: 0,
  round: 0,
  sessionHp: 40,
  gold: 3,
  offers: [],
  offerId: "",
  rejectedMessage: "",
  bootError: "",
  battleTextLog: [],
  setPhase: (phase, endsAt, round) => set({ phase, endsAt, round }),
  setEconomy: (sessionHp, gold) => set({ sessionHp, gold }),
  setOffers: (offerId, offers) => set({ offerId, offers }),
  setRejected: (message) => set({ rejectedMessage: message }),
  setBootError: (message) => set({ bootError: message }),
  addBattleEvents: (events) => {
    const lines = events.map((e) => `${e.timestampTick} ${e.type} ${e.actorId ?? ""} -> ${e.targetId ?? ""} (${e.amount ?? 0})`);
    set({ battleTextLog: [...get().battleTextLog, ...lines].slice(-100) });
  }
}));
