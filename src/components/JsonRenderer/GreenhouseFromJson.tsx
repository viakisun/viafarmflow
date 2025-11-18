import * as THREE from 'three';
import type { GreenhouseData } from '../../types/staticMapData';
import { MATERIALS } from '../../constants/materials';

interface GreenhouseFromJsonProps {
  greenhouseData: GreenhouseData;
}

export function GreenhouseFromJson({ greenhouseData }: GreenhouseFromJsonProps) {
  const { floorBoundaries, wallHeight, dimensions } = greenhouseData;

  // 바닥 경계선이 없으면 레거시 방식으로 사각형 생성
  const boundaries = floorBoundaries && floorBoundaries.length > 0
    ? floorBoundaries
    : [
        { x: -dimensions.x / 2, y: 0, z: -dimensions.z / 2 },
        { x: dimensions.x / 2, y: 0, z: -dimensions.z / 2 },
        { x: dimensions.x / 2, y: 0, z: dimensions.z / 2 },
        { x: -dimensions.x / 2, y: 0, z: dimensions.z / 2 },
      ];

  const height = wallHeight || dimensions.y;

  // 바닥 Shape 생성
  const floorShape = new THREE.Shape();
  boundaries.forEach((point, i) => {
    if (i === 0) {
      floorShape.moveTo(point.x, point.z);
    } else {
      floorShape.lineTo(point.x, point.z);
    }
  });
  floorShape.closePath();

  return (
    <group
      position={[
        greenhouseData.position.x,
        greenhouseData.position.y,
        greenhouseData.position.z
      ]}
      rotation={[
        greenhouseData.rotation.x,
        greenhouseData.rotation.y,
        greenhouseData.rotation.z
      ]}
    >
      {/* 바닥 */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <shapeGeometry args={[floorShape]} />
        <meshStandardMaterial {...MATERIALS.floor} />
      </mesh>

      {/* 벽들 - 경계선 각 세그먼트마다 생성 */}
      {boundaries.map((start, i) => {
        const end = boundaries[(i + 1) % boundaries.length];

        // 벽의 중심 위치 계산
        const centerX = (start.x + end.x) / 2;
        const centerZ = (start.z + end.z) / 2;

        // 벽의 길이 계산
        const wallLength = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.z - start.z, 2)
        );

        // 벽의 회전 각도 계산 (Y축)
        const angle = Math.atan2(end.z - start.z, end.x - start.x);

        return (
          <mesh
            key={`wall-${i}`}
            position={[centerX, height / 2, centerZ]}
            rotation={[0, angle, 0]}
          >
            <planeGeometry args={[wallLength, height]} />
            <meshPhysicalMaterial {...MATERIALS.glass} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}
