import { create } from "zustand";
import { type BattleEvent } from "@autobattler/shared";
import { mapBattleEventToVisual } from "./mapper";
import { VisualAction } from "./types";

type State = {
  queue: VisualAction[];
  enqueueEvents: (events: BattleEvent[]) => void;
  shift: () => VisualAction | undefined;
};

export const useVisualQueue = create<State>((set, get) => ({
  queue: [],
  enqueueEvents: (events) => {
    const mapped = events.map(mapBattleEventToVisual);
    set({ queue: [...get().queue, ...mapped] });
  },
  shift: () => {
    const [head, ...rest] = get().queue;
    set({ queue: rest });
    return head;
  }
}));
