import { useCallback } from "react";
import { useEditor } from "../../contexts";
import { Robot } from "./Robot";
import { TransformableObject } from "../TransformableObject";
import type { Robot as RobotType } from "../../types/greenhouse";
import type { Vector3, Euler } from "three";

interface DraggableRobotProps {
  robot: RobotType;
  isSelected: boolean;
  onClick: () => void;
  greenhouseDimensions?: { width: number; height: number; length: number };
}

export function DraggableRobot({
  robot,
  isSelected,
  onClick,
  greenhouseDimensions = { width: 40, height: 8, length: 100 }
}: DraggableRobotProps) {
  const { editorState, mapData } = useEditor();
  const { mode, transformMode } = editorState;

  // Get the full object from hierarchical data
  const robotObject = mapData.objects.get(robot.id);

  // Check visibility
  if (robotObject && !robotObject.visible) {
    return null; // Don't render if not visible
  }

  const isEditMode = mode === "edit" || mode === "robot";

  const handleTransform = useCallback(
    (position: Vector3, rotation: Euler) => {
      // Transform callback is handled in TransformableObject
      // Additional logic can be added here if needed
    },
    []
  );

  const constraints = {
    minX: -greenhouseDimensions.width / 2 + 1,
    maxX: greenhouseDimensions.width / 2 - 1,
    minY: 0,
    maxY: 2,
    minZ: -greenhouseDimensions.length / 2 + 1,
    maxZ: greenhouseDimensions.length / 2 - 1,
  };

  return (
    <TransformableObject
      objectId={robot.id}
      position={[robot.position.x, robot.position.y, robot.position.z]}
      rotation={[0, (robot.rotation * Math.PI) / 180, 0]}
      scale={[1, 1, 1]}
      enabled={isEditMode && isSelected}
      mode={transformMode}
      onTransform={handleTransform}
      constraints={constraints}
    >
      <Robot robot={robot} isSelected={isSelected} onClick={onClick} />
    </TransformableObject>
  );
}
