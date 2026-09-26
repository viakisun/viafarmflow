import { useMemo } from "react";
import { HangingBed } from "./HangingBed";
import type { HangingBedConfig } from "../types/greenhouse";

/**
 * HangingBeds Component - 매달린 재배 베드 배열
 *
 * 좌표계:
 * - X축: 좌우 (Width) - 베드가 이 방향으로 뻗어나감
 * - Y축: 전후 (Length/Depth) - 베드들이 이 방향으로 배열됨
 * - Z축: 높이 (Height) - 지면으로부터 베드 높이
 */

interface HangingBedsProps {
  config: HangingBedConfig;
  visibility?: {
    platforms: boolean;
    cables: boolean;
    plants: boolean;
  };
}

export function HangingBeds({ config, visibility }: HangingBedsProps) {
  const { length, width, height, count, spacing, heightFromGround } = config;

  // 베드 위치 계산 (Y축 방향으로 배열)
  const bedPositions = useMemo(() => {
    const totalLengthY = (count - 1) * spacing;
    const startY = -totalLengthY / 2;
    const positions = [];

    for (let i = 0; i < count; i++) {
      positions.push({
        x: 0, // 중앙 (X축)
        y: startY + i * spacing, // Y축 방향 배열
        z: heightFromGround, // 지면으로부터 높이
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
          // 회전 없음 - 베드는 이미 X축 방향으로 뻗어있음
        >
          <HangingBed
            length={length}
            width={width}
            height={height}
            visibility={visibility}
          />
        </group>
      ))}
    </group>
  );
}
