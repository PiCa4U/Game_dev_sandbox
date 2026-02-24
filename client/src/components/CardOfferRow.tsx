import React from "react";
import { View, Text, Button } from "react-native";
import { CardOffer } from "@autobattler/shared";

type Props = {
  offerId: string;
  offers: CardOffer[];
  onPick: (offerId: string, cardId: string) => void;
};

export const CardOfferRow: React.FC<Props> = ({ offerId, offers, onPick }) => (
  <View style={{ gap: 6 }}>
    {offers.map((c) => (
      <View key={c.cardId} style={{ borderWidth: 1, padding: 8 }}>
        <Text>{c.name}</Text>
        <Text>{c.element} / {c.rarity}</Text>
        <Text>{c.desc}</Text>
        <Button title="Buy" onPress={() => onPick(offerId, c.cardId)} />
      </View>
    ))}
  </View>
);
