import { useMemo } from "react";
import * as THREE from "three";
import type { GreenhouseDimensions } from "../types/greenhouse";
import { MATERIALS, FRAME_THICKNESS } from "../constants/materials";

interface GreenhouseProps {
  dimensions: GreenhouseDimensions;
}

export function Greenhouse({ dimensions }: GreenhouseProps) {
  const { length, width, height } = dimensions;

  // 수평 프레임 위치들 (Z축 방향)
  const horizontalFrames = useMemo(() => {
    const frames = [];
    for (let i = -length / 2; i <= length / 2; i += 10) {
      frames.push(i);
    }
    return frames;
  }, [length]);

  return (
    <group>
      {/* 바닥 */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial {...MATERIALS.floor} />
      </mesh>

      {/* 유리 벽 - 앞 (Z+) */}
      <mesh position={[0, height / 2, length / 2]}>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial {...MATERIALS.glass} side={THREE.DoubleSide} />
      </mesh>

      {/* 유리 벽 - 뒤 (Z-) */}
      <mesh position={[0, height / 2, -length / 2]} rotation-y={Math.PI}>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial {...MATERIALS.glass} side={THREE.DoubleSide} />
      </mesh>

      {/* 유리 벽 - 좌 (X-) */}
      <mesh position={[-width / 2, height / 2, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[length, height]} />
        <meshPhysicalMaterial {...MATERIALS.glass} side={THREE.DoubleSide} />
      </mesh>

      {/* 유리 벽 - 우 (X+) */}
      <mesh position={[width / 2, height / 2, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[length, height]} />
        <meshPhysicalMaterial {...MATERIALS.glass} side={THREE.DoubleSide} />
      </mesh>

      {/* 수직 기둥들 - 온실 모서리에 배치 */}
      {[
        [-width / 2, height / 2, -length / 2],  // 왼쪽 뒤
        [-width / 2, height / 2, length / 2],   // 왼쪽 앞
        [width / 2, height / 2, -length / 2],   // 오른쪽 뒤
        [width / 2, height / 2, length / 2],    // 오른쪽 앞
      ].map((pos, idx) => (
        <mesh key={`corner-post-${idx}`} position={pos as THREE.Vector3Tuple} castShadow>
          <boxGeometry args={[FRAME_THICKNESS * 2, height, FRAME_THICKNESS * 2]} />
          <meshStandardMaterial {...MATERIALS.frame} />
        </mesh>
      ))}

      {/* 지붕 지지 기둥들 - 길이 방향으로 20m 간격 */}
      {horizontalFrames
        .filter((_, idx) => idx % 2 === 0)  // 20m 간격으로 필터링
        .map((z, idx) => (
          <group key={`support-posts-${idx}`}>
            {/* 왼쪽 지지 기둥 */}
            <mesh position={[-width / 2, height / 2, z]} castShadow>
              <boxGeometry args={[FRAME_THICKNESS, height, FRAME_THICKNESS]} />
              <meshStandardMaterial {...MATERIALS.frame} />
            </mesh>
            {/* 오른쪽 지지 기둥 */}
            <mesh position={[width / 2, height / 2, z]} castShadow>
              <boxGeometry args={[FRAME_THICKNESS, height, FRAME_THICKNESS]} />
              <meshStandardMaterial {...MATERIALS.frame} />
            </mesh>
          </group>
        ))}

      {/* 수평 프레임들 */}
      {horizontalFrames.map((z, idx) => (
        <group key={`frame-group-${idx}`}>
          {/* 하단 프레임 */}
          <mesh position={[0, 0, z]}>
            <boxGeometry args={[width, FRAME_THICKNESS, FRAME_THICKNESS]} />
            <meshStandardMaterial {...MATERIALS.frame} />
          </mesh>
          {/* 상단 프레임 */}
          <mesh position={[0, height, z]}>
            <boxGeometry args={[width, FRAME_THICKNESS, FRAME_THICKNESS]} />
            <meshStandardMaterial {...MATERIALS.frame} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
