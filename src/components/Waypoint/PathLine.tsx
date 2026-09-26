import { useMemo, useRef } from "react";
import { Vector3, CatmullRomCurve3, Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { Line, Cone } from "@react-three/drei";
import type { Waypoint } from "../../types/greenhouse";
import { COLORS } from "../../constants/materials";

/**
 * PathLine Component - 로봇 경로 시각화
 *
 * 좌표계:
 * - X축: 좌우 (Width)
 * - Y축: 전후 (Length/Depth)
 * - Z축: 높이 (Height)
 * - 경로는 XY 평면 위에 그려짐
 */

interface PathLineProps {
  waypoints: Waypoint[];
  color?: string;
  animated?: boolean;
  showArrows?: boolean;
}

export function PathLine({
  waypoints,
  color = `#${COLORS.robot.moving.toString(16).padStart(6, '0')}`,
  animated = true,
  showArrows = true,
}: PathLineProps) {
  const arrowRefs = useRef<Mesh[]>([]);

  // 경로 점들 계산 (XY 평면, Z는 높이)
  const points = useMemo(() => {
    if (waypoints.length < 2) return [];

    // 순서대로 정렬
    const sorted = [...waypoints].sort((a, b) => a.order - b.order);

    return sorted.map((wp) => new Vector3(
      wp.position.x,      // X축: 좌우
      wp.position.y,      // Y축: 전후
      wp.position.z + 0.5 // Z축: 높이 + 오프셋
    ));
  }, [waypoints]);

  // 곡선 경로 생성
  const curve = useMemo(() => {
    if (points.length < 2) return null;
    return new CatmullRomCurve3(points, false, "centripetal", 0.5);
  }, [points]);

  // 곡선 점들
  const curvePoints = useMemo(() => {
    if (!curve) return [];
    return curve.getPoints(50);
  }, [curve]);

  // 화살표 위치와 방향 계산
  const arrowData = useMemo(() => {
    if (!curve || points.length < 2) return [];

    const arrows = [];
    const segments = Math.min(points.length - 1, 5); // 최대 5개 화살표

    for (let i = 1; i <= segments; i++) {
      const t = i / (segments + 1);
      const position = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);

      // XY 평면에서의 방향 계산
      arrows.push({
        position,
        rotation: {
          z: Math.atan2(tangent.y, tangent.x) - Math.PI / 2, // Z축 회전 (바닥 평면)
          y: Math.atan2(-tangent.z, Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y)), // 경사
        },
      });
    }

    return arrows;
  }, [curve, points]);

  // 애니메이션 (simplified without dashOffset)
  useFrame(() => {
    // Animation removed due to dashOffset incompatibility
    // Can be replaced with other animation effects if needed
  });

  if (points.length < 2) return null;

  return (
    <group>
      {/* 경로 라인 */}
      <Line
        points={curvePoints}
        color={color}
        lineWidth={3}
        dashed={animated}
        dashScale={50}
        dashSize={1}
        gapSize={0.5}
      />

      {/* 화살표 */}
      {showArrows &&
        arrowData.map((arrow, i) => (
          <Cone
            key={i}
            ref={(el) => {
              if (el) arrowRefs.current[i] = el;
            }}
            args={[0.15, 0.3, 4]}
            position={[arrow.position.x, arrow.position.y, arrow.position.z]}
            rotation={[0, arrow.rotation.y, arrow.rotation.z]}
          >
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
          </Cone>
        ))}

      {/* 시작점 표시 (초록색 구) */}
      {points.length > 0 && (
        <mesh position={points[0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* 끝점 표시 (빨간색 박스) */}
      {points.length > 0 && (
        <mesh position={points[points.length - 1]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}
