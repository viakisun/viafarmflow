import { useEditor } from "../../contexts";
import { DraggableRobot } from "./DraggableRobot";

export function Robots() {
  const { robots, selectedRobot, selectRobot, editorState } = useEditor();
  const { mode } = editorState;

  const handleRobotClick = (robotId: string) => {
    if (mode === "robot" || mode === "edit" || mode === "view") {
      selectRobot(robotId);
    }
  };

  return (
    <group name="robots">
      {robots.map((robot) => (
        <DraggableRobot
          key={robot.id}
          robot={robot}
          isSelected={selectedRobot?.id === robot.id}
          onClick={() => handleRobotClick(robot.id)}
        />
      ))}
    </group>
  );
}
