import React from "react";
import { View, Text, Button } from "react-native";
import { sendCharacterSelect } from "../net/colyseus";

const fallbackIds = ["char_1", "char_2", "char_3"];

export const CharacterSelectScreen: React.FC = () => (
  <View style={{ padding: 20, gap: 10 }}>
    <Text>Character Select</Text>
    {fallbackIds.map((id) => (
      <Button key={id} title={`Select ${id}`} onPress={() => sendCharacterSelect(id)} />
    ))}
  </View>
);
