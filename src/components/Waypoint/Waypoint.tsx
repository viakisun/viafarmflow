import { useRef } from "react";
import { Mesh } from "three";
import { Text, Sphere, Cylinder } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Waypoint as WaypointType } from "../../types/greenhouse";
import { COLORS } from "../../constants/materials";

interface WaypointProps {
  waypoint: WaypointType;
  isSelected: boolean;
  onClick?: () => void;
  showOrder?: boolean;
  connected?: boolean;
}

export function Waypoint({
  waypoint,
  isSelected,
  onClick,
  showOrder = true,
  connected = false,
}: WaypointProps) {
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  // 애니메이션
  useFrame((state) => {
    if (ringRef.current && isSelected) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  const color = isSelected
    ? COLORS.robot.selected
    : connected
      ? COLORS.robot.moving
      : COLORS.robot.default;

  return (
    <group
      position={[waypoint.position.x, waypoint.position.y, waypoint.position.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* 웨이포인트 기둥 */}
      <Cylinder args={[0.1, 0.15, 1, 8]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </Cylinder>

      {/* 웨이포인트 구체 */}
      <Sphere ref={meshRef} args={[0.25, 16, 16]} position={[0, 1, 0]}>
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          emissive={color}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
        />
      </Sphere>

      {/* 순서 번호 표시 */}
      {showOrder && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {waypoint.order}
        </Text>
      )}

      {/* 선택 링 */}
      {isSelected && (
        <mesh ref={ringRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.8, 32]} />
          <meshBasicMaterial color={color} opacity={0.5} transparent />
        </mesh>
      )}

      {/* 연결 표시 */}
      {connected && (
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      )}
    </group>
  );
}
