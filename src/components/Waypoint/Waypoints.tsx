import { useEditor } from "../../contexts";
import { Waypoint } from "./Waypoint";
import { PathLine } from "./PathLine";
import type { Waypoint as WaypointType } from "../../types/greenhouse";
import { COLORS } from "../../constants/materials";

export function Waypoints() {
  const { waypoints, robots, editorState } = useEditor();
  const { mode } = editorState;

  // 로봇별로 웨이포인트 그룹화
  const waypointsByRobot = waypoints.reduce<Record<string, WaypointType[]>>((acc, wp) => {
    if (!acc[wp.robotId]) {
      acc[wp.robotId] = [];
    }
    acc[wp.robotId].push(wp);
    return acc;
  }, {});

  // 경로 모드가 아니면 숨기기
  if (mode !== "path" && mode !== "view") {
    return null;
  }

  return (
    <group name="waypoints">
      {/* 각 로봇의 경로 표시 */}
      {Object.entries(waypointsByRobot).map(([robotId, robotWaypoints]) => {
        const robot = robots.find((r) => r.id === robotId);
        if (!robot) return null;

        return (
          <group key={robotId}>
            {/* 경로 라인 */}
            <PathLine
              waypoints={robotWaypoints}
              color={robot.color || `#${COLORS.robot.default.toString(16).padStart(6, '0')}`}
              animated={robot.status === "moving"}
              showArrows={true}
            />

            {/* 웨이포인트들 */}
            {robotWaypoints.map((wp) => (
              <Waypoint
                key={wp.id}
                waypoint={wp}
                isSelected={false}
                showOrder={true}
                connected={true}
              />
            ))}
          </group>
        );
      })}
    </group>
  );
}
