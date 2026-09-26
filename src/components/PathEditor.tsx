import { useRef, useState } from "react";
import { Vector3, Mesh } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { useEditor } from "../contexts";
import type { Waypoint as WaypointType } from "../types/greenhouse";

/**
 * PathEditor Component - 경로 편집기
 *
 * 좌표계:
 * - X축: 좌우 (Width)
 * - Y축: 전후 (Length/Depth)
 * - Z축: 높이 (Height)
 * - 클릭: XY 평면
 */

export function PathEditor() {
  const meshRef = useRef<Mesh>(null);
  const { editorState, selectedRobot, addWaypoint, waypoints, config } = useEditor();
  const { mode } = editorState;
  const [previewPoint, setPreviewPoint] = useState<Vector3 | null>(null);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (mode !== "path" || !selectedRobot) return;

    event.stopPropagation();
    const point = event.point;

    // 온실 경계 내에 있는지 확인 (XY 평면)
    const bounds = {
      x: config.dimensions.width / 2,  // X축: 좌우
      y: config.dimensions.length / 2, // Y축: 전후
    };

    if (Math.abs(point.x) <= bounds.x && Math.abs(point.y) <= bounds.y) {
      // 해당 로봇의 기존 웨이포인트 찾기
      const robotWaypoints = waypoints.filter((wp) => wp.robotId === selectedRobot.id);
      const nextOrder = robotWaypoints.length + 1;

      const newWaypoint: WaypointType = {
        id: `waypoint-${Date.now()}`,
        position: {
          x: point.x, // X축: 좌우
          y: point.y, // Y축: 전후
          z: 0.5,     // Z축: 높이
        },
        robotId: selectedRobot.id,
        order: nextOrder,
      };

      addWaypoint(newWaypoint);
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (mode !== "path" || !selectedRobot) {
      setPreviewPoint(null);
      return;
    }

    event.stopPropagation();
    const point = event.point;

    const bounds = {
      x: config.dimensions.width / 2,  // X축: 좌우
      y: config.dimensions.length / 2, // Y축: 전후
    };

    if (Math.abs(point.x) <= bounds.x && Math.abs(point.y) <= bounds.y) {
      setPreviewPoint(new Vector3(point.x, point.y, 0.5));
    } else {
      setPreviewPoint(null);
    }
  };

  const handlePointerLeave = () => {
    setPreviewPoint(null);
  };

  // 경로 모드가 아니면 비활성화
  if (mode !== "path") {
    return null;
  }

  return (
    <>
      {/* 클릭 가능한 바닥 (XY 평면) */}
      <mesh
        ref={meshRef}
        rotation={[0, 0, 0]} // XY 평면 - 회전 없음
        position={[0, 0, 0.01]}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[config.dimensions.width, config.dimensions.length]} />
        <meshBasicMaterial color={0x0066ff} transparent opacity={0.1} visible={mode === "path"} />
      </mesh>

      {/* 프리뷰 포인트 */}
      {previewPoint && (
        <group position={previewPoint}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={selectedRobot?.color || 0x3366ff} opacity={0.5} transparent />
          </mesh>
          <mesh position={[0, 0, 0.01]} rotation={[0, 0, 0]}>
            <ringGeometry args={[0.4, 0.6, 32]} />
            <meshBasicMaterial color={selectedRobot?.color || 0x3366ff} opacity={0.3} transparent />
          </mesh>
        </group>
      )}
    </>
  );
}
