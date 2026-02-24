import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { connectMatch } from "../net/colyseus";

export const MatchmakingScreen: React.FC = () => {
  useEffect(() => {
    void connectMatch();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Connecting to matchmaking...</Text>
    </View>
  );
};
