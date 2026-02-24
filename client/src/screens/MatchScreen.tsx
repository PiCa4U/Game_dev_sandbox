import React from "react";
import { ScrollView, Text, View } from "react-native";
import { sendCardPick } from "../net/colyseus";
import { useMatchStore } from "../state/store";
import { CardOfferRow } from "../components/CardOfferRow";
import { BattleScene } from "../scene/BattleScene";

export const MatchScreen: React.FC = () => {
  const { phase, endsAt, round, sessionHp, gold, offers, offerId, rejectedMessage, battleTextLog } = useMatchStore();
  const timer = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text>Phase: {phase}</Text>
      <Text>Round: {round} / Time left: {timer}s</Text>
      <Text>Session HP: {sessionHp}</Text>
      <Text>Gold: {gold}</Text>
      {rejectedMessage ? <Text style={{ color: "red" }}>Rejected: {rejectedMessage}</Text> : null}
      <CardOfferRow offerId={offerId} offers={offers} onPick={sendCardPick} />
      <BattleScene />
      <View>
        <Text>Battle Debug Log:</Text>
        {battleTextLog.map((l, i) => (<Text key={`${l}-${i}`}>{l}</Text>))}
      </View>
    </ScrollView>
  );
};
