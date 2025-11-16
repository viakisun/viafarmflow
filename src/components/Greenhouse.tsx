import { useMemo } from "react";
import * as THREE from "three";
import type { GreenhouseDimensions } from "../types/greenhouse";
import { MATERIALS, FRAME_THICKNESS, ROOF_ANGLE } from "../constants/materials";

interface GreenhouseProps {
  dimensions: GreenhouseDimensions;
}

export function Greenhouse({ dimensions }: GreenhouseProps) {
  const { length, width, height } = dimensions;
  const roofHeight = (width / 2) * Math.tan(ROOF_ANGLE);

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

      {/* 지붕 - 왼쪽 */}
      <mesh
        position={[-width / 4, height + (width / 4) * Math.tan(ROOF_ANGLE), 0]}
        rotation={[0, 0, ROOF_ANGLE]}
      >
        <planeGeometry args={[width / 2 / Math.cos(ROOF_ANGLE), length]} />
        <meshPhysicalMaterial {...MATERIALS.glass} side={THREE.DoubleSide} />
      </mesh>

      {/* 지붕 - 오른쪽 */}
      <mesh
        position={[width / 4, height + (width / 4) * Math.tan(ROOF_ANGLE), 0]}
        rotation={[0, 0, -ROOF_ANGLE]}
      >
        <planeGeometry args={[width / 2 / Math.cos(ROOF_ANGLE), length]} />
        <meshPhysicalMaterial {...MATERIALS.glass} side={THREE.DoubleSide} />
      </mesh>

      {/* 지붕 중앙 빔 (Ridge) */}
      <mesh position={[0, height + (width / 2) * Math.tan(ROOF_ANGLE), 0]}>
        <boxGeometry args={[FRAME_THICKNESS, FRAME_THICKNESS, length]} />
        <meshStandardMaterial {...MATERIALS.frame} />
      </mesh>

      {/* 지붕 삼각형 끝 - 앞면 (3개의 삼각형으로 구성) */}
      <mesh position={[0, height + roofHeight / 2, length / 2]}>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              -width / 2, -roofHeight / 2, 0,  // 왼쪽 하단
              width / 2, -roofHeight / 2, 0,   // 오른쪽 하단
              0, roofHeight / 2, 0,            // 꼭대기
            ]), 3]}
          />
          <float32BufferAttribute
            attach="attributes-normal"
            args={[new Float32Array([
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
            ]), 3]}
          />
        </bufferGeometry>
        <meshPhysicalMaterial {...MATERIALS.glass} side={THREE.DoubleSide} />
      </mesh>

      {/* 지붕 삼각형 끝 - 뒷면 */}
      <mesh position={[0, height + roofHeight / 2, -length / 2]}>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              -width / 2, -roofHeight / 2, 0,  // 왼쪽 하단
              width / 2, -roofHeight / 2, 0,   // 오른쪽 하단
              0, roofHeight / 2, 0,            // 꼭대기
            ]), 3]}
          />
          <float32BufferAttribute
            attach="attributes-normal"
            args={[new Float32Array([
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
            ]), 3]}
          />
        </bufferGeometry>
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
