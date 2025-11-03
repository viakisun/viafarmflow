import { useRef } from "react";
import { Mesh } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { useEditor } from "../contexts";
import type { Robot } from "../types/greenhouse";

export function InteractiveFloor() {
  const meshRef = useRef<Mesh>(null);
  const { editorState, addRobot, config } = useEditor();
  const { mode } = editorState;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // 로봇 모드에서만 클릭으로 로봇 추가
    if (mode === "robot") {
      event.stopPropagation();

      const point = event.point;

      // 온실 경계 내에 있는지 확인
      const bounds = {
        x: config.dimensions.width / 2,
        z: config.dimensions.length / 2,
      };

      if (Math.abs(point.x) <= bounds.x && Math.abs(point.z) <= bounds.z) {
        const newRobot: Robot = {
          id: `robot-${Date.now()}`,
          name: `Robot-${Math.floor(Math.random() * 1000)}`,
          position: {
            x: point.x,
            y: 0.5,
            z: point.z,
          },
          rotation: 0,
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
      rotation={[-Math.PI / 2, 0, 0]}
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
