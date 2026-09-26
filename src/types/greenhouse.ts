/**
 * 좌표계 정의:
 * - X축: 좌우 (Width)
 * - Y축: 전후 (Length/Depth)
 * - Z축: 높이 (Height)
 *
 * 바닥은 XY 평면, Z축이 위를 향함
 */

export interface GreenhouseDimensions {
  length: number; // Y축 방향 - 온실 길이 (전후) (m)
  width: number;  // X축 방향 - 온실 폭 (좌우) (m)
  height: number; // Z축 방향 - 온실 높이 (상하) (m)
}

export interface HangingBedConfig {
  length: number;  // Y축 방향 - 베드 길이 (m)
  width: number;   // X축 방향 - 베드 폭 (m)
  height: number;  // Z축 방향 - 베드 높이 (m)
  count: number;   // 베드 개수
  spacing: number; // 베드 간 간격 (Y축 방향) (m)
  heightFromGround: number; // 지면으로부터 높이 (Z축) (m)
}

export interface GridConfig {
  origin: { x: number; y: number; z: number }; // 그리드 원점
  size: { x: number; y: number };  // 그리드 크기 (XY 평면)
  cellSize: number;  // 격자 크기 (미터)
}

export interface GreenhouseConfig {
  dimensions: GreenhouseDimensions;
  beds: HangingBedConfig;
  grid: GridConfig;
}

export interface RobotPosition {
  x: number; // X축: 좌우 위치
  y: number; // Y축: 전후 위치
  z: number; // Z축: 높이
}

export interface Robot {
  id: string;
  name: string;
  position: RobotPosition;
  rotation: number; // Z축 회전 (라디안) - 바닥 평면에서의 회전
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
