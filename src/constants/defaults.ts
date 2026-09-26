import type { GreenhouseConfig } from "../types/greenhouse";

/**
 * 좌표계:
 * - X축: 좌우 (Width)
 * - Y축: 전후 (Length/Depth)
 * - Z축: 높이 (Height)
 */

export const DEFAULT_GREENHOUSE_CONFIG: GreenhouseConfig = {
  dimensions: {
    length: 30,  // Y축 방향 - 전후 길이 (0 to 30)
    width: 100,  // X축 방향 - 좌우 폭 (0 to 100)
    height: 20,  // Z축 방향 - 높이
  },
  beds: {
    length: 30,  // Y축 방향 - 베드 길이
    width: 2.0,  // X축 방향 - 베드 폭
    height: 0.4, // Z축 방향 - 베드 두께
    count: 0,    // 베드 제거
    spacing: 4,  // Y축 방향 간격
    heightFromGround: 4, // Z축 방향 - 지면으로부터 높이
  },
  grid: {
    origin: { x: 0, y: 0, z: 0 },  // 그리드 원점
    size: { x: 200, y: 200 },      // 그리드 크기 200x200m
    cellSize: 10,                   // 격자 크기 10m
  },
};

export const CAMERA_CONFIG = {
  fov: 60,
  near: 0.1,
  far: 1000,
  initialPosition: {
    x: 100,  // 온실 우측 (온실 중심 50 + 50)
    y: -30,  // 온실 앞쪽에서 보기 (온실 중심 15 - 45)
    z: 80,   // 위쪽에서 보기
  },
  controls: {
    minDistance: 30,
    maxDistance: 300,
    enableDamping: true,
    dampingFactor: 0.05,
  },
};

export const LIGHTING_CONFIG = {
  ambient: {
    color: 0xffffff,
    intensity: 0.4,
  },
  directional: {
    color: 0xffffff,
    intensity: 0.8,
    position: { x: 50, y: -50, z: 80 }, // Z축이 위
  },
  hemisphere: {
    skyColor: 0x87ceeb,
    groundColor: 0x362312,
    intensity: 0.5,
  },
};

export const GRID_CONFIG = {
  size: 200,
  divisions: 40,
};
