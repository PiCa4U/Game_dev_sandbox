import React from "react";
import { Phase } from "@autobattler/shared";
import { MatchmakingScreen } from "./src/screens/MatchmakingScreen";
import { CharacterSelectScreen } from "./src/screens/CharacterSelectScreen";
import { MatchScreen } from "./src/screens/MatchScreen";
import { useMatchStore } from "./src/state/store";

export default function App(): JSX.Element {
  const phase = useMatchStore((s) => s.phase);

  if (phase === Phase.CHARACTER_SELECT) return <CharacterSelectScreen />;
  if (phase === Phase.CHOICE || phase === Phase.BATTLE || phase === Phase.ROUND_RESULT) return <MatchScreen />;
  return <MatchmakingScreen />;
}
