import { useMemo } from "react";
import { HangingBed } from "./HangingBed";
import type { HangingBedConfig } from "../types/greenhouse";

interface HangingBedsProps {
  config: HangingBedConfig;
}

export function HangingBeds({ config }: HangingBedsProps) {
  const { length, width, height, count, spacing, heightFromGround } = config;

  // 베드 위치 계산
  const bedPositions = useMemo(() => {
    const totalLengthZ = (count - 1) * spacing;
    const startZ = -totalLengthZ / 2;
    const positions = [];

    for (let i = 0; i < count; i++) {
      positions.push({
        x: 0,
        y: heightFromGround,
        z: startZ + i * spacing,
      });
    }

    return positions;
  }, [count, spacing, heightFromGround]);

  return (
    <group>
      {bedPositions.map((pos, idx) => (
        <group
          key={`bed-${idx}`}
          position={[pos.x, pos.y, pos.z]}
          rotation-y={Math.PI / 2} // X축 방향으로 회전
        >
          <HangingBed length={length} width={width} height={height} />
        </group>
      ))}
    </group>
  );
}
