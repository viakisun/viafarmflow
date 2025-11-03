import type { GreenhouseConfig } from "../types/greenhouse";

export const DEFAULT_GREENHOUSE_CONFIG: GreenhouseConfig = {
  dimensions: {
    length: 100, // Z축
    width: 40, // X축
    height: 8, // Y축
  },
  beds: {
    length: 30,
    width: 2.0,
    height: 0.4,
    count: 20,
    spacing: 4,
    heightFromGround: 4,
  },
};

export const CAMERA_CONFIG = {
  fov: 60,
  near: 0.1,
  far: 1000,
  initialPosition: {
    x: 60,
    y: 40,
    z: 80,
  },
  controls: {
    minDistance: 30,
    maxDistance: 200,
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
    position: { x: 50, y: 80, z: 50 },
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
