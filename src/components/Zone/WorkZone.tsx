import { useMemo, useRef } from "react";
import { Shape, ShapeGeometry, Vector3, Mesh, MeshBasicMaterial } from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { WorkZone as WorkZoneType } from "../../types/greenhouse";

/**
 * WorkZone Component - 작업 영역 시각화
 *
 * 좌표계:
 * - X축: 좌우 (Width)
 * - Y축: 전후 (Length/Depth)
 * - Z축: 높이 (Height)
 * - 구역: XY 평면에 렌더링됨
 */

interface WorkZoneProps {
  zone: WorkZoneType;
  isSelected: boolean;
  opacity?: number;
  height?: number;
  onClick?: () => void;
}

export function WorkZone({
  zone,
  isSelected,
  opacity = 0.3,
  height = 0.1,
  onClick,
}: WorkZoneProps) {
  const meshRef = useRef<Mesh>(null);
  const outlineRef = useRef<Mesh>(null);

  // Shape 생성 (다각형, XY 평면)
  const geometry = useMemo(() => {
    if (zone.points.length < 3) return null;

    const shape = new Shape();
    zone.points.forEach((point, index) => {
      if (index === 0) {
        shape.moveTo(point.x, point.y); // XY 평면
      } else {
        shape.lineTo(point.x, point.y); // XY 평면
      }
    });
    shape.closePath();

    return new ShapeGeometry(shape);
  }, [zone.points]);

  // 중심점 계산
  const center = useMemo(() => {
    if (zone.points.length === 0) return new Vector3(0, 0, 0);

    const sum = zone.points.reduce(
      (acc, point) => ({
        x: acc.x + point.x,
        y: acc.y + point.y,
        z: acc.z + point.z,
      }),
      { x: 0, y: 0, z: 0 },
    );

    return new Vector3(
      sum.x / zone.points.length,      // X축: 좌우
      sum.y / zone.points.length,      // Y축: 전후
      sum.z / zone.points.length + 2,  // Z축: 높이 + 오프셋
    );
  }, [zone.points]);

  // 애니메이션
  useFrame((state) => {
    if (isSelected && meshRef.current) {
      const material = meshRef.current.material as MeshBasicMaterial;
      material.opacity = opacity + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    if (isSelected && outlineRef.current) {
      outlineRef.current.position.z = height + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  if (!geometry || zone.points.length < 3) return null;

  return (
    <group onClick={onClick}>
      {/* 구역 바닥 (XY 평면) */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[0, 0, 0]} // XY 평면 - 회전 없음
        position={[0, 0, height]}
      >
        <meshStandardMaterial
          color={zone.color}
          transparent
          opacity={isSelected ? opacity + 0.2 : opacity}
          side={2}
        />
      </mesh>

      {/* 구역 아웃라인 */}
      <mesh
        ref={outlineRef}
        geometry={geometry}
        rotation={[0, 0, 0]} // XY 평면 - 회전 없음
        position={[0, 0, height + 0.01]}
      >
        <meshBasicMaterial color={zone.color} wireframe transparent opacity={0.8} />
      </mesh>

      {/* 구역 이름 표시 (위에) */}
      <Text
        position={center}
        fontSize={1.5}
        color={zone.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        {zone.name}
      </Text>

      {/* 구역 포인트 표시 */}
      {zone.points.map((point, index) => (
        <group key={index} position={[point.x, point.y, height + 0.1]}>
          <mesh>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial
              color={zone.color}
              emissive={zone.color}
              emissiveIntensity={isSelected ? 0.5 : 0.2}
            />
          </mesh>
          {index === 0 && (
            <mesh position={[0, 0, 0.5]}>
              <coneGeometry args={[0.15, 0.3, 4]} />
              <meshStandardMaterial color="#00ff00" />
            </mesh>
          )}
        </group>
      ))}

      {/* 구역 벽 (선택시, Z축 방향 수직) */}
      {isSelected &&
        zone.points.map((point, index) => {
          const nextPoint = zone.points[(index + 1) % zone.points.length];
          const dx = nextPoint.x - point.x;
          const dy = nextPoint.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          return (
            <mesh
              key={`wall-${index}`}
              position={[(point.x + nextPoint.x) / 2, (point.y + nextPoint.y) / 2, 1]}
              rotation={[0, 0, -angle + Math.PI / 2]}
            >
              <boxGeometry args={[0.05, distance, 2]} />
              <meshStandardMaterial color={zone.color} transparent opacity={0.2} />
            </mesh>
          );
        })}
    </group>
  );
}
