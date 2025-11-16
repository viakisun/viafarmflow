/**
 * Dynamic Robot Data → Hierarchy 변환
 * 실시간 로봇 데이터를 Scene Tree에 표시할 수 있도록 변환
 */

import type { DynamicRobotData } from '../types/dynamicRobotData';
import type { GroupObject, MapObject, RobotObject, WaypointObject, PathObject } from '../types/mapData';

/**
 * Dynamic Robot Data를 Hierarchy 구조로 변환
 */
export function syncDynamicToHierarchy(
  dynamicData: DynamicRobotData,
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
  if (dynamicData.robots && dynamicData.robots.length > 0) {
    const robotsGroupId = 'robots-group';
    group.children.push(robotsGroupId);

    const robotsGroup: GroupObject = {
      id: robotsGroupId,
      type: 'group',
      groupType: 'dynamic',
      name: `Robots (${dynamicData.robots.length})`,
      parentId: groupId,
      children: [],
      visible: true,
      locked: false,
    };
    objects.set(robotsGroupId, robotsGroup);

    // 각 로봇 객체 생성
    dynamicData.robots.forEach((robot) => {
      const robotObj: RobotObject = {
        id: robot.id,
        type: 'robot',
        name: robot.name,
        parentId: robotsGroupId,
        children: [],
        visible: true,
        locked: false,
        position: robot.position,
        rotation: robot.orientation?.yaw || 0,
        robotType: 'default',
        status: mapRobotStatus(robot.status),
        color: getStatusColor(robot.status),
      };

      robotsGroup.children.push(robotObj.id);
      objects.set(robotObj.id, robotObj);
    });
  }

  // 2. Waypoints 그룹
  if (dynamicData.waypoints && dynamicData.waypoints.length > 0) {
    const waypointsGroupId = 'waypoints-group';
    group.children.push(waypointsGroupId);

    const waypointsGroup: GroupObject = {
      id: waypointsGroupId,
      type: 'group',
      groupType: 'dynamic',
      name: `Waypoints (${dynamicData.waypoints.length})`,
      parentId: groupId,
      children: [],
      visible: true,
      locked: false,
    };
    objects.set(waypointsGroupId, waypointsGroup);

    // 각 웨이포인트 객체 생성
    dynamicData.waypoints.forEach((waypoint) => {
      const waypointObj: WaypointObject = {
        id: waypoint.id,
        type: 'waypoint',
        name: waypoint.name || waypoint.id,
        parentId: waypointsGroupId,
        children: [],
        visible: true,
        locked: false,
        position: waypoint.position,
        waypointType: waypoint.type || 'normal',
        robotId: null,
      };

      waypointsGroup.children.push(waypointObj.id);
      objects.set(waypointObj.id, waypointObj);
    });
  }

  // 3. Paths 그룹
  if (dynamicData.paths && dynamicData.paths.length > 0) {
    const pathsGroupId = 'paths-group';
    group.children.push(pathsGroupId);

    const pathsGroup: GroupObject = {
      id: pathsGroupId,
      type: 'group',
      groupType: 'dynamic',
      name: `Paths (${dynamicData.paths.length})`,
      parentId: groupId,
      children: [],
      visible: true,
      locked: false,
    };
    objects.set(pathsGroupId, pathsGroup);

    // 각 경로 객체 생성
    dynamicData.paths.forEach((path) => {
      const pathObj: PathObject = {
        id: path.id,
        type: 'path',
        name: path.name || `Path ${path.id}`,
        parentId: pathsGroupId,
        children: [],
        visible: true,
        locked: false,
        waypoints: path.waypointIds || [],
        robotId: path.robotId || null,
        color: '#00ff00',
      };

      pathsGroup.children.push(pathObj.id);
      objects.set(pathObj.id, pathObj);
    });
  }

  return { group, objects };
}

/**
 * Dynamic 로봇 상태를 Hierarchy 로봇 상태로 매핑
 */
function mapRobotStatus(status: string): 'idle' | 'moving' | 'working' {
  switch (status.toLowerCase()) {
    case 'idle':
    case 'standby':
      return 'idle';
    case 'moving':
    case 'navigating':
    case 'traveling':
      return 'moving';
    case 'working':
    case 'harvesting':
    case 'spraying':
    case 'monitoring':
      return 'working';
    default:
      return 'idle';
  }
}

/**
 * 로봇 상태에 따른 색상 반환
 */
function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'idle':
    case 'standby':
      return '#6b7280'; // Gray
    case 'moving':
    case 'navigating':
    case 'traveling':
      return '#10b981'; // Green
    case 'working':
    case 'harvesting':
    case 'spraying':
    case 'monitoring':
      return '#3b82f6'; // Blue
    default:
      return '#6b7280';
  }
}
