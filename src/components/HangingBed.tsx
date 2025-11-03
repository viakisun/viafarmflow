import { useMemo } from "react";
import { MATERIALS } from "../constants/materials";

interface HangingBedProps {
  length: number;
  width: number;
  height: number;
}

export function HangingBed({ length, width, height }: HangingBedProps) {
  // 케이블 위치
  const cablePositions = useMemo(
    () => [
      [-width / 2, 1.5, -length / 2 + 2],
      [width / 2, 1.5, -length / 2 + 2],
      [-width / 2, 1.5, length / 2 - 2],
      [width / 2, 1.5, length / 2 - 2],
    ],
    [width, length],
  );

  // 식물 위치
  const plantPositions = useMemo(() => {
    const positions = [];
    for (let i = -length / 2 + 2; i < length / 2 - 2; i += 2.5) {
      positions.push(i);
    }
    return positions;
  }, [length]);

  return (
    <group>
      {/* 베드 플랫폼 */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, length]} />
        <meshStandardMaterial {...MATERIALS.bed} />
      </mesh>

      {/* 지지 케이블 */}
      {cablePositions.map((pos, idx) => (
        <mesh key={`cable-${idx}`} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.03, 0.03, 3]} />
          <meshStandardMaterial {...MATERIALS.cable} />
        </mesh>
      ))}

      {/* 식물 (간단한 구형) */}
      {plantPositions.map((z, idx) => (
        <mesh key={`plant-${idx}`} position={[0, height / 2 + 0.4, z]} scale={[1, 0.7, 1]}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial {...MATERIALS.plant} />
        </mesh>
      ))}
    </group>
  );
}
