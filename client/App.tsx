import { Phase } from "@autobattler/shared";
import { CharacterSelectScreen } from "./src/screens/CharacterSelectScreen";
import { MatchScreen } from "./src/screens/MatchScreen";
import { MatchmakingScreen } from "./src/screens/MatchmakingScreen";
import { MainMenuScreen } from "./src/screens/MainMenuScreen";
import { useMatchStore } from "./src/state/store";

export default function App(): JSX.Element {
  const hasStarted = useMatchStore((s) => s.hasStarted);
  const searching = useMatchStore((s) => s.searching);
  const phase = useMatchStore((s) => s.phase);

  return (
    <div className="app">
      <h2>Session Auto-Battler (Web)</h2>
      {!hasStarted ? <MainMenuScreen /> : null}
      {hasStarted && searching ? <MatchmakingScreen /> : null}
      {hasStarted && !searching && phase === Phase.CHARACTER_SELECT ? <CharacterSelectScreen /> : null}
      {hasStarted && !searching && (phase === Phase.CHOICE || phase === Phase.BATTLE || phase === Phase.ROUND_RESULT) ? <MatchScreen /> : null}
      {hasStarted && !searching && phase === Phase.ENDED ? <div>Match ended.</div> : null}
    </div>
  );
}
