import { useRef, useMemo } from "react";
import { Mesh, Group, MeshStandardMaterial, Color } from "three";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Sphere, Cylinder, Cone } from "@react-three/drei";
import type { Robot as RobotType } from "../../types/greenhouse";
import { COLORS } from "../../constants/materials";

interface RobotProps {
  robot: RobotType;
  isSelected: boolean;
  onClick?: () => void;
}

export function Robot({ robot, isSelected, onClick }: RobotProps) {
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const indicatorRef = useRef<Mesh>(null);

  // 상태별 색상 - 선택 시 더 밝은 색상 사용
  const robotColor = useMemo(() => {
    if (isSelected) return COLORS.robot.selected;
    switch (robot.status) {
      case "idle":
        return COLORS.robot.idle;
      case "moving":
        return COLORS.robot.moving;
      case "working":
        return COLORS.robot.working;
      default:
        return COLORS.robot.default;
    }
  }, [robot.status, isSelected]);

  // 선택 시 발광 색상
  const glowColor = isSelected ? COLORS.robot.selectedGlow : robotColor;

  // 애니메이션
  useFrame((state) => {
    if (groupRef.current) {
      // 선택된 로봇은 위아래로 부드럽게 움직임
      if (isSelected) {
        groupRef.current.position.y =
          robot.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        groupRef.current.position.y = robot.position.y;
      }

      // 작업 중인 로봇은 회전
      if (robot.status === "working" && bodyRef.current) {
        bodyRef.current.rotation.y += 0.01;
      }

      // 이동 중인 로봇은 인디케이터 깜빡임
      if (robot.status === "moving" && indicatorRef.current) {
        const material = indicatorRef.current.material as MeshStandardMaterial;
        material.emissive = new Color(COLORS.robot.moving);
        material.emissiveIntensity = Math.abs(Math.sin(state.clock.elapsedTime * 3));
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={[robot.position.x, robot.position.y, robot.position.z]}
      rotation={[0, robot.rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* 로봇 본체 */}
      <group>
        {/* 베이스 */}
        <Box ref={bodyRef} args={[0.8, 0.4, 1.2]} position={[0, 0.2, 0]}>
          <meshStandardMaterial
            color={robotColor}
            metalness={isSelected ? 0.8 : 0.6}
            roughness={isSelected ? 0.1 : 0.3}
            emissive={isSelected ? glowColor : 0x000000}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        </Box>

        {/* 휠 */}
        {[
          [-0.35, 0, -0.4],
          [0.35, 0, -0.4],
          [-0.35, 0, 0.4],
          [0.35, 0, 0.4],
        ].map((pos, i) => (
          <Cylinder
            key={`wheel-${i}`}
            args={[0.15, 0.15, 0.1, 16]}
            position={pos as [number, number, number]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial color={0x333333} metalness={0.8} roughness={0.2} />
          </Cylinder>
        ))}

        {/* 센서 타워 */}
        <Cylinder args={[0.1, 0.15, 0.4, 8]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color={0x444444} metalness={0.7} roughness={0.3} />
        </Cylinder>

        {/* 센서 헤드 */}
        <Sphere args={[0.15, 16, 16]} position={[0, 0.85, 0]}>
          <meshStandardMaterial color={0x222222} metalness={0.8} roughness={0.2} />
        </Sphere>

        {/* 상태 인디케이터 - 선택 시 더 밝게 */}
        <Sphere ref={indicatorRef} args={[0.08, 8, 8]} position={[0, 1.0, 0]}>
          <meshStandardMaterial
            color={robotColor}
            emissive={glowColor}
            emissiveIntensity={isSelected ? 1.0 : 0.5}
          />
        </Sphere>

        {/* 방향 표시 화살표 */}
        <Cone args={[0.15, 0.3, 4]} position={[0, 0.5, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={robotColor} metalness={0.5} roughness={0.4} />
        </Cone>
      </group>

      {/* 로봇 이름 라벨 - 선택 시 더 크고 밝게 */}
      <Text
        position={[0, isSelected ? 1.7 : 1.5, 0]}
        fontSize={isSelected ? 0.35 : 0.3}
        color={isSelected ? "#00ffaa" : "#cccccc"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={isSelected ? 0.03 : 0.02}
        outlineColor={isSelected ? "#004422" : "#000000"}
      >
        {robot.name}
      </Text>

      {/* 선택 시 추가 정보 표시 */}
      {isSelected && (
        <Text
          position={[0, 1.3, 0]}
          fontSize={0.2}
          color="#88ffcc"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#002211"
        >
          {robot.status.toUpperCase()}
        </Text>
      )}

      {/* 선택 표시 링 - 더 밝고 애니메이션 효과 */}
      {isSelected && (
        <>
          {/* 외부 링 - 펄싱 효과 */}
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 1.8, 32]} />
            <meshBasicMaterial
              color={COLORS.robot.selectedRing}
              opacity={0.3 + Math.sin(Date.now() * 0.003) * 0.2}
              transparent
            />
          </mesh>
          {/* 내부 링 - 고정 */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.0, 1.3, 32]} />
            <meshBasicMaterial
              color={COLORS.robot.selected}
              opacity={0.5}
              transparent
            />
          </mesh>
        </>
      )}

      {/* 그림자 */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.5, 1.5]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </group>
  );
}
