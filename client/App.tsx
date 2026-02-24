import { Phase } from "@autobattler/shared";
import { useEffect } from "react";
import { connectMatch } from "./src/net/colyseus";
import { CharacterSelectScreen } from "./src/screens/CharacterSelectScreen";
import { MatchScreen } from "./src/screens/MatchScreen";
import { MatchmakingScreen } from "./src/screens/MatchmakingScreen";
import { useMatchStore } from "./src/state/store";

export default function App(): JSX.Element {
  const phase = useMatchStore((s) => s.phase);
  const bootError = useMatchStore((s) => s.bootError);
  const setBootError = useMatchStore((s) => s.setBootError);

  useEffect(() => {
    void connectMatch().catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      setBootError(message);
    });
  }, []);

  return (
    <div className="app">
      <h2>Session Auto-Battler (Web)</h2>
      {bootError ? <div className="error">Connection error: {bootError}</div> : null}
      {phase === Phase.CHARACTER_SELECT ? <CharacterSelectScreen /> : null}
      {phase === Phase.CHOICE || phase === Phase.BATTLE || phase === Phase.ROUND_RESULT ? <MatchScreen /> : null}
      {phase === Phase.ENDED ? <div>Match ended.</div> : null}
      {phase !== Phase.CHARACTER_SELECT && phase !== Phase.CHOICE && phase !== Phase.BATTLE && phase !== Phase.ROUND_RESULT && phase !== Phase.ENDED ? (
        <MatchmakingScreen />
      ) : null}
    </div>
  );
}
