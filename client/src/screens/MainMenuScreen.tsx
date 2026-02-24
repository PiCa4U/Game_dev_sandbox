import { startMatchmaking } from "../net/colyseus";
import { useMatchStore } from "../state/store";

export const MainMenuScreen = (): JSX.Element => {
  const bootError = useMatchStore((s) => s.bootError);
  const searching = useMatchStore((s) => s.searching);

  const onStart = async (): Promise<void> => {
    await startMatchmaking();
  };

  return (
    <div>
      <h3>Main Menu</h3>
      <p className="muted">Нажми кнопку, чтобы начать поиск игроков для игровой сессии.</p>
      <button onClick={() => void onStart()} disabled={searching}>Начать играть</button>
      {searching ? <p>Поиск игроков...</p> : null}
      {bootError ? <div className="error">{bootError}</div> : null}
    </div>
  );
};
