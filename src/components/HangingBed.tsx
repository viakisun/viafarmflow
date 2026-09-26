import { useMemo } from "react";
import { MATERIALS } from "../constants/materials";

/**
 * HangingBed Component - 개별 매달린 재배 베드
 *
 * 좌표계:
 * - X축: 좌우 (Width) - 베드의 폭
 * - Y축: 전후 (Length) - 베드의 길이
 * - Z축: 높이 (Height) - 베드의 두께
 * - 베드는 XY 평면에 평평하게 놓임
 */

interface HangingBedProps {
  length: number; // Y축 방향
  width: number;  // X축 방향
  height: number; // Z축 방향 (두께)
  visibility?: {
    platforms: boolean;
    cables: boolean;
    plants: boolean;
  };
}

export function HangingBed({ length, width, height, visibility }: HangingBedProps) {
  // 케이블 위치 (네 모서리에서 위로 올라가는 지지 케이블)
  const cablePositions = useMemo(
    () => [
      [-width / 2 + 2, -length / 2 + 2, 1.5], // 좌-앞
      [width / 2 - 2, -length / 2 + 2, 1.5],  // 우-앞
      [-width / 2 + 2, length / 2 - 2, 1.5],  // 좌-뒤
      [width / 2 - 2, length / 2 - 2, 1.5],   // 우-뒤
    ],
    [width, length],
  );

  // 식물 위치 (Y축 방향으로 배열)
  const plantPositions = useMemo(() => {
    const positions = [];
    for (let i = -length / 2 + 2; i < length / 2 - 2; i += 2.5) {
      positions.push(i);
    }
    return positions;
  }, [length]);

  return (
    <group>
      {/* 베드 플랫폼 (XY 평면에 평평하게 놓임) */}
      {visibility?.platforms !== false && (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, length, height]} />
          <meshStandardMaterial {...MATERIALS.bed} />
        </mesh>
      )}

      {/* 지지 케이블 (Z축 방향 수직) */}
      {visibility?.cables !== false &&
        cablePositions.map((pos, idx) => (
          <mesh key={`cable-${idx}`} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.03, 0.03, 3]} />
            <meshStandardMaterial {...MATERIALS.cable} />
          </mesh>
        ))}

      {/* 식물 (간단한 구형, Y축 방향 배열) */}
      {visibility?.plants !== false &&
        plantPositions.map((y, idx) => (
          <mesh
            key={`plant-${idx}`}
            position={[0, y, height / 2 + 0.4]}
            scale={[1, 1, 0.7]} // Z축 방향으로 약간 납작
          >
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial {...MATERIALS.plant} />
          </mesh>
        ))}
    </group>
  );
}
