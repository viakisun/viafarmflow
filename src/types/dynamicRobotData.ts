// 동적 로봇 데이터 타입 정의 (실시간 업데이트, JSON 저장 안함)

import type { Vec3 } from './staticMapData';

export type RobotStatus = 'idle' | 'moving' | 'working' | 'charging' | 'error';

export interface RobotState {
  id: string;
  name: string;
  model: string;
  position: Vec3;
  rotation: Vec3;
  status: RobotStatus;
  battery: number;
  currentZone?: string;
  currentTask?: string;
  targetPosition?: Vec3;
  speed: number;
  lastUpdate?: string;
}

export type WaypointType = 'checkpoint' | 'intersection' | 'charging' | 'parking';

export interface Waypoint {
  id: string;
  position: Vec3;
  type: WaypointType;
  name: string;
  rotation?: Vec3;
}

export interface Path {
  id: string;
  name?: string;
  waypoints: string[]; // Waypoint IDs
  bidirectional: boolean;
}

export interface ZoneAssignment {
  zoneId: string;
  robotIds: string[];
}

export interface DynamicRobotData {
  timestamp: string;
  robots: RobotState[];
  waypoints: Waypoint[];
  paths: Path[];
  assignments?: ZoneAssignment[];
}
