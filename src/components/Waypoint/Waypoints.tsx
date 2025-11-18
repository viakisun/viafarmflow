import { useEditor } from "../../contexts";
import { Waypoint } from "./Waypoint";
import { PathLine } from "./PathLine";
import type { Waypoint as WaypointType } from "../../types/greenhouse";
import { COLORS } from "../../constants/materials";

export function Waypoints() {
  const { waypoints, robots, editorState, mapData } = useEditor();
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

  // paths-group의 visibility 확인
  const pathsGroupVisible = mapData.objects.get('paths-group')?.visible ?? true;
  const waypointsGroupVisible = mapData.objects.get('waypoints-group')?.visible ?? true;

  return (
    <group name="waypoints">
      {/* 각 로봇의 경로 표시 */}
      {Object.entries(waypointsByRobot).map(([robotId, robotWaypoints]) => {
        const robot = robots.find((r) => r.id === robotId);
        if (!robot) return null;

        // 이 로봇의 path 객체가 hierarchy에 있는지 확인
        const pathId = `path-${robotId}`;
        const pathObj = mapData.objects.get(pathId);
        const pathVisible = pathObj?.visible ?? pathsGroupVisible;

        return (
          <group key={robotId}>
            {/* 경로 라인 - hierarchy visibility 반영 */}
            {pathVisible && (
              <PathLine
                waypoints={robotWaypoints}
                color={robot.color || `#${COLORS.robot.default.toString(16).padStart(6, '0')}`}
                animated={robot.status === "moving"}
                showArrows={true}
              />
            )}

            {/* 웨이포인트들 - hierarchy visibility 반영 */}
            {robotWaypoints.map((wp) => {
              const waypointObj = mapData.objects.get(wp.id);
              const waypointVisible = waypointObj?.visible ?? waypointsGroupVisible;

              if (!waypointVisible) return null;

              return (
                <Waypoint
                  key={wp.id}
                  waypoint={wp}
                  isSelected={false}
                  showOrder={true}
                  connected={true}
                />
              );
            })}
          </group>
        );
      })}
    </group>
  );
}
