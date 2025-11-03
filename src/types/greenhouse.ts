export interface GreenhouseDimensions {
  length: number; // Z축 방향 (m)
  width: number; // X축 방향 (m)
  height: number; // Y축 방향 (m)
}

export interface HangingBedConfig {
  length: number;
  width: number;
  height: number;
  count: number;
  spacing: number; // 베드 간 간격 (m)
  heightFromGround: number;
}

export interface GreenhouseConfig {
  dimensions: GreenhouseDimensions;
  beds: HangingBedConfig;
}

export interface RobotPosition {
  x: number;
  y: number;
  z: number;
}

export interface Robot {
  id: string;
  name: string;
  position: RobotPosition;
  rotation: number; // Y축 회전 (라디안)
  type: string;
  status: "idle" | "moving" | "working";
  color?: string;
}

export interface Waypoint {
  id: string;
  position: RobotPosition;
  robotId: string;
  order: number;
}

export interface WorkZone {
  id: string;
  name: string;
  color: string;
  points: RobotPosition[]; // 영역을 정의하는 점들
  assignedRobotIds: string[];
}

export interface MapData {
  config: GreenhouseConfig;
  robots: Robot[];
  waypoints: Waypoint[];
  zones: WorkZone[];
  version: string;
  createdAt: string;
  updatedAt: string;
}
