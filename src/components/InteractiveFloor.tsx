import { useRef } from "react";
import { Mesh } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { useEditor } from "../contexts";
import type { Robot } from "../types/greenhouse";

/**
 * InteractiveFloor Component - 클릭 가능한 바닥
 *
 * 좌표계:
 * - X축: 좌우 (Width)
 * - Y축: 전후 (Length/Depth)
 * - Z축: 높이 (Height)
 * - 바닥: XY 평면 (Z=0)
 */

export function InteractiveFloor() {
  const meshRef = useRef<Mesh>(null);
  const { editorState, addRobot, config } = useEditor();
  const { mode } = editorState;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // 로봇 모드에서만 클릭으로 로봇 추가
    if (mode === "robot") {
      event.stopPropagation();

      const point = event.point;

      // 온실 경계 내에 있는지 확인 (XY 평면)
      const bounds = {
        x: config.dimensions.width / 2,  // X축 폭
        y: config.dimensions.length / 2, // Y축 길이
      };

      if (Math.abs(point.x) <= bounds.x && Math.abs(point.y) <= bounds.y) {
        const newRobot: Robot = {
          id: `robot-${Date.now()}`,
          name: `Robot-${Math.floor(Math.random() * 1000)}`,
          position: {
            x: point.x, // X축: 좌우
            y: point.y, // Y축: 전후
            z: 0.5,     // Z축: 지면 위 높이
          },
          rotation: 0, // Z축 회전 (바닥 평면)
          type: "default",
          status: "idle",
          color: "#3366ff",
        };

        addRobot(newRobot);
      }
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (mode === "robot") {
      event.stopPropagation();
    }
  };

  return (
    <mesh
      ref={meshRef}
      rotation={[0, 0, 0]} // XY 평면 - 회전 없음
      position={[0, 0, 0]}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      visible={false}
    >
      <planeGeometry args={[config.dimensions.width, config.dimensions.length]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}
