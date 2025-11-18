import { useEditor } from "../../contexts";
import { DraggableRobot } from "./DraggableRobot";

export function Robots() {
  const { robots, selectedRobot, selectRobot, selectObject, editorState, config, staticMapData, mapData } = useEditor();
  const { mode } = editorState;

  // Use staticMapData if available, fallback to legacy config
  const rawDimensions = staticMapData?.greenhouse.dimensions || config?.dimensions;

  // Don't render if dimensions are not available
  if (!rawDimensions) {
    return null;
  }

  // Convert dimensions to legacy format for DraggableRobot
  const dimensions = 'x' in rawDimensions
    ? { width: rawDimensions.x, height: rawDimensions.y, length: rawDimensions.z }
    : rawDimensions;

  const handleRobotClick = (robotId: string) => {
    if (mode === "robot" || mode === "edit" || mode === "view") {
      selectRobot(robotId);
      selectObject(robotId); // Also update hierarchical selection
    }
  };

  // robots-group의 visibility 확인
  const robotsGroupVisible = mapData.objects.get('robots-group')?.visible ?? true;

  return (
    <group name="robots">
      {robots.map((robot) => {
        // 개별 로봇의 hierarchy visibility 확인
        const robotObj = mapData.objects.get(robot.id);
        const robotVisible = robotObj?.visible ?? robotsGroupVisible;

        if (!robotVisible) return null;

        return (
          <DraggableRobot
            key={robot.id}
            robot={robot}
            isSelected={selectedRobot?.id === robot.id}
            onClick={() => handleRobotClick(robot.id)}
            greenhouseDimensions={dimensions}
          />
        );
      })}
    </group>
  );
}
