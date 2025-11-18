/**
 * Legacy Robot/Waypoint Data → Hierarchy 변환
 * EditorContext의 legacy robots/waypoints를 Hierarchy에 추가
 */

import type { Robot, Waypoint } from '../types/greenhouse';
import type { GroupObject, MapObject, RobotObject, WaypointObject, PathObject } from '../types/core/hierarchy';

/**
 * Legacy Robot/Waypoint 데이터를 Hierarchy 구조로 변환
 */
export function syncLegacyToHierarchy(
  robots: Robot[],
  waypoints: Waypoint[],
  parentId: string = 'root'
): {
  group: GroupObject;
  objects: Map<string, MapObject>;
} {
  const objects = new Map<string, MapObject>();
  const groupId = 'dynamic-elements';

  // Dynamic Elements 그룹 생성
  const group: GroupObject = {
    id: groupId,
    type: 'group',
    groupType: 'dynamic',
    name: 'Robots & Navigation',
    parentId,
    children: [],
    visible: true,
    locked: false,
  };

  objects.set(groupId, group);

  // 1. Robots 그룹
  if (robots && robots.length > 0) {
    const robotsGroupId = 'robots-group';
    group.children.push(robotsGroupId);

    const robotsGroup: GroupObject = {
      id: robotsGroupId,
      type: 'group',
      groupType: 'dynamic',
      name: `Robots (${robots.length})`,
      parentId: groupId,
      children: [],
      visible: true,
      locked: false,
    };
    objects.set(robotsGroupId, robotsGroup);

    // 각 로봇 객체 생성
    robots.forEach((robot) => {
      const robotObj: RobotObject = {
        id: robot.id,
        type: 'robot',
        name: robot.name || robot.id,
        parentId: robotsGroupId,
        children: [],
        visible: true,
        locked: false,
        position: robot.position,
        rotation: robot.rotation?.y || 0,
        robotType: 'default',
        status: robot.status || 'idle',
        color: robot.color,
      };

      robotsGroup.children.push(robotObj.id);
      objects.set(robotObj.id, robotObj);
    });
  }

  // 2. Waypoints 그룹
  if (waypoints && waypoints.length > 0) {
    const waypointsGroupId = 'waypoints-group';
    group.children.push(waypointsGroupId);

    const waypointsGroup: GroupObject = {
      id: waypointsGroupId,
      type: 'group',
      groupType: 'dynamic',
      name: `Waypoints (${waypoints.length})`,
      parentId: groupId,
      children: [],
      visible: true,
      locked: false,
    };
    objects.set(waypointsGroupId, waypointsGroup);

    // 각 웨이포인트 객체 생성
    waypoints.forEach((waypoint) => {
      const waypointObj: WaypointObject = {
        id: waypoint.id,
        type: 'waypoint',
        name: waypoint.id,
        parentId: waypointsGroupId,
        children: [],
        visible: true,
        locked: false,
        position: waypoint.position,
        waypointType: 'normal',
        robotId: waypoint.robotId,
      };

      waypointsGroup.children.push(waypointObj.id);
      objects.set(waypointObj.id, waypointObj);
    });
  }

  // 3. Paths 그룹 - 로봇별로 경로 생성
  const robotsWithWaypoints = robots.filter((robot) =>
    waypoints.some((wp) => wp.robotId === robot.id)
  );

  if (robotsWithWaypoints.length > 0) {
    const pathsGroupId = 'paths-group';
    group.children.push(pathsGroupId);

    const pathsGroup: GroupObject = {
      id: pathsGroupId,
      type: 'group',
      groupType: 'dynamic',
      name: `Paths (${robotsWithWaypoints.length})`,
      parentId: groupId,
      children: [],
      visible: true,
      locked: false,
    };
    objects.set(pathsGroupId, pathsGroup);

    // 각 로봇의 경로 생성
    robotsWithWaypoints.forEach((robot) => {
      const robotWaypoints = waypoints.filter((wp) => wp.robotId === robot.id);
      const pathId = `path-${robot.id}`;

      const pathObj: PathObject = {
        id: pathId,
        type: 'path',
        name: `${robot.name || robot.id} Path`,
        parentId: pathsGroupId,
        children: [],
        visible: true,
        locked: false,
        waypoints: robotWaypoints.map((wp) => wp.id),
        robotId: robot.id,
        color: robot.color || '#00ff00',
      };

      pathsGroup.children.push(pathObj.id);
      objects.set(pathObj.id, pathObj);
    });
  }

  return { group, objects };
}
