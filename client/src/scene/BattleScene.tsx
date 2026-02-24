import { Canvas, useFrame } from "@react-three/fiber";
import { BattleEventType } from "@autobattler/shared";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useVisualQueue } from "../battlelog/queue";

const AnimatedUnit = (): JSX.Element => {
  const meshRef = useRef<THREE.Mesh>(null);
  const queue = useVisualQueue((s) => s.queue);
  const shift = useVisualQueue((s) => s.shift);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    if (queue.length === 0) return;
    const next = shift();
    if (!next) return;
    if ([BattleEventType.DAMAGE, BattleEventType.ULT_CAST, BattleEventType.HEAL, BattleEventType.DEATH].includes(next.type)) {
      setFlash(0.5);
    }
  }, [queue.length, shift]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta;
    setFlash((f) => Math.max(0, f - delta));
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={flash > 0 ? "#ff7b72" : "#58a6ff"} />
    </mesh>
  );
};

export const BattleScene = (): JSX.Element => (
  <div style={{ height: 260, border: "1px solid #30363d", borderRadius: 8 }}>
    <Canvas camera={{ position: [0, 0, 4] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 3]} />
      <AnimatedUnit />
    </Canvas>
  </div>
);
