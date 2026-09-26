import { useMemo } from "react";
import * as THREE from "three";
import type { GreenhouseDimensions } from "../types/greenhouse";
import { MATERIALS, FRAME_THICKNESS, ROOF_ANGLE } from "../constants/materials";

/**
 * Greenhouse 3D Structure Component
 *
 * 좌표계:
 * - X축: 좌우 (Width)
 * - Y축: 전후 (Length/Depth)
 * - Z축: 높이 (Height)
 * - 바닥: XY 평면 (Z=0)
 */

interface GreenhouseProps {
  dimensions: GreenhouseDimensions;
  visibility?: {
    floor: boolean;
    walls: boolean;
    roof: boolean;
    columns: boolean;
    frame: boolean;
  };
}

export function Greenhouse({ dimensions, visibility }: GreenhouseProps) {
  const { length, width, height } = dimensions;

  // 프레임 포스트 위치들 (네 모서리, Z축 방향 수직)
  // X축: 좌우, Y축: 전후, Z축: 지면에서 높이
  const postPositions = useMemo(
    () => [
      [-width / 2, -length / 2, height / 2], // 좌-앞
      [-width / 2, length / 2, height / 2],  // 좌-뒤
      [width / 2, -length / 2, height / 2],  // 우-앞
      [width / 2, length / 2, height / 2],   // 우-뒤
    ],
    [width, height, length],
  );

  // 수평 프레임 위치들 (Y축 방향 - 전후)
  const horizontalFrames = useMemo(() => {
    const frames = [];
    for (let i = -length / 2; i <= length / 2; i += 10) {
      frames.push(i);
    }
    return frames;
  }, [length]);

  return (
    <group position={[width / 2, length / 2, 0]}>
      {/* 바닥 (XY 평면, Z=0) - BoxGeometry로 변경 */}
      {visibility?.floor !== false && (
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[width, length, 0.1]} />
          <meshStandardMaterial {...MATERIALS.floor} />
        </mesh>
      )}

      {/* 유리 벽 - BoxGeometry(x, y, z) 사용 */}
      {visibility?.walls !== false && (
        <>
          {/* 앞 벽 (Y = -length/2)
              BoxGeometry args: [X축=width, Y축=0.1(두께), Z축=height] */}
          <mesh position={[0, -length / 2, height / 2]} castShadow>
            <boxGeometry args={[width, 0.1, height]} />
            <meshPhysicalMaterial {...MATERIALS.glass} />
          </mesh>

          {/* 뒤 벽 (Y = +length/2)
              BoxGeometry args: [X축=width, Y축=0.1(두께), Z축=height] */}
          <mesh position={[0, length / 2, height / 2]} castShadow>
            <boxGeometry args={[width, 0.1, height]} />
            <meshPhysicalMaterial {...MATERIALS.glass} />
          </mesh>

          {/* 좌 벽 (X = -width/2)
              BoxGeometry args: [X축=0.1(두께), Y축=length, Z축=height] */}
          <mesh position={[-width / 2, 0, height / 2]} castShadow>
            <boxGeometry args={[0.1, length, height]} />
            <meshPhysicalMaterial {...MATERIALS.glass} />
          </mesh>

          {/* 우 벽 (X = +width/2)
              BoxGeometry args: [X축=0.1(두께), Y축=length, Z축=height] */}
          <mesh position={[width / 2, 0, height / 2]} castShadow>
            <boxGeometry args={[0.1, length, height]} />
            <meshPhysicalMaterial {...MATERIALS.glass} />
          </mesh>
        </>
      )}

      {/* 지붕 - 삭제됨 */}

      {/* 수직 기둥들 (Z축 방향) */}
      {visibility?.columns !== false &&
        postPositions.map((pos, idx) => (
          <mesh key={`post-${idx}`} position={pos as THREE.Vector3Tuple} castShadow>
            <boxGeometry args={[FRAME_THICKNESS, FRAME_THICKNESS, height]} />
            <meshStandardMaterial {...MATERIALS.frame} />
          </mesh>
        ))}

      {/* 수평 프레임들 (Y축 방향 - 전후) */}
      {visibility?.frame !== false &&
        horizontalFrames.map((y, idx) => (
          <group key={`frame-group-${idx}`}>
            {/* 하단 프레임 (Z=0, 바닥) */}
            <mesh position={[0, y, 0]}>
              <boxGeometry args={[width, FRAME_THICKNESS, FRAME_THICKNESS]} />
              <meshStandardMaterial {...MATERIALS.frame} />
            </mesh>
            {/* 상단 프레임 (Z=height, 천장) */}
            <mesh position={[0, y, height]}>
              <boxGeometry args={[width, FRAME_THICKNESS, FRAME_THICKNESS]} />
              <meshStandardMaterial {...MATERIALS.frame} />
            </mesh>
          </group>
        ))}
    </group>
  );
}
