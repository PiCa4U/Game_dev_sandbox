import React, { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { Text } from "react-native";
import { useVisualQueue } from "../battlelog/queue";
import { BattleEventType } from "@autobattler/shared";

const AnimatedCube: React.FC = () => {
  const [flash, setFlash] = useState(0);
  const queue = useVisualQueue((s) => s.queue);
  const shift = useVisualQueue((s) => s.shift);

  useEffect(() => {
    if (queue.length === 0) return;
    const head = shift();
    if (!head) return;
    if (head.type === BattleEventType.DAMAGE || head.type === BattleEventType.ULT_CAST) {
      setFlash(0.4);
    }
  }, [queue.length, shift]);

  useFrame((_, delta) => {
    setFlash((f) => Math.max(0, f - delta));
  });

  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={flash > 0 ? "orange" : "royalblue"} />
    </mesh>
  );
};

export const BattleScene: React.FC = () => (
  <>
    <Text>Battle Visual</Text>
    <Canvas style={{ height: 220 }}>
      <ambientLight />
      <pointLight position={[5, 5, 5]} />
      <AnimatedCube />
    </Canvas>
  </>
);
