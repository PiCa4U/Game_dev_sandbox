import { sendCardPick } from "../net/colyseus";
import { BattleScene } from "../scene/BattleScene";
import { useMatchStore } from "../state/store";
import { CardOfferRow } from "../components/CardOfferRow";

export const MatchScreen = (): JSX.Element => {
  const { phase, endsAt, round, sessionHp, gold, offers, offerId, rejectedMessage, battleTextLog } = useMatchStore();
  const timer = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));

  return (
    <div>
      <div className="row"><strong>Phase:</strong> {phase} <strong>Round:</strong> {round} <strong>Time left:</strong> {timer}s</div>
      <div className="row"><strong>Session HP:</strong> {sessionHp} <strong>Gold:</strong> {gold}</div>
      {rejectedMessage ? <div className="error">Rejected: {rejectedMessage}</div> : null}
      <h4>Card Offers</h4>
      <CardOfferRow offerId={offerId} offers={offers} onPick={sendCardPick} />
      <h4>Battle Visual</h4>
      <BattleScene />
      <h4>Battle Debug Log</h4>
      <div className="log">
        {battleTextLog.map((l, i) => (
          <div key={`${i}-${l}`}>{l}</div>
        ))}
      </div>
    </div>
  );
};
