import { useMemo, useRef } from "react";
import { Vector3, CatmullRomCurve3, Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { Line, Cone } from "@react-three/drei";
import type { Waypoint } from "../../types/greenhouse";
import { COLORS } from "../../constants/materials";

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

  // 경로 점들 계산
  const points = useMemo(() => {
    if (waypoints.length < 2) return [];

    // 순서대로 정렬
    const sorted = [...waypoints].sort((a, b) => a.order - b.order);

    return sorted.map((wp) => new Vector3(wp.position.x, wp.position.y + 0.5, wp.position.z));
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

      arrows.push({
        position,
        rotation: {
          x: Math.atan2(-tangent.y, Math.sqrt(tangent.x * tangent.x + tangent.z * tangent.z)),
          y: Math.atan2(tangent.x, tangent.z),
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
            rotation={[arrow.rotation.x + Math.PI / 2, arrow.rotation.y, 0]}
          >
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
          </Cone>
        ))}

      {/* 시작점 표시 */}
      {points.length > 0 && (
        <mesh position={points[0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* 끝점 표시 */}
      {points.length > 0 && (
        <mesh position={points[points.length - 1]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}
