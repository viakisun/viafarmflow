/**
 * Scene Elements 타입 정의
 * UI/시각화 보조 요소 (JSON 저장 안함, UI 상태만 저장)
 */

export interface GridConfig {
  enabled: boolean;
  size: number;
  divisions: number;
  fadeDistance: number;
  fadeStrength: number;
}

export interface LightConfig {
  ambient: {
    enabled: boolean;
    color: string;
    intensity: number;
  };
  directional: {
    enabled: boolean;
    color: string;
    intensity: number;
    position: { x: number; y: number; z: number };
    castShadow: boolean;
  };
  hemisphere: {
    enabled: boolean;
    skyColor: string;
    groundColor: string;
    intensity: number;
  };
}

export interface CoordinateAxesConfig {
  enabled: boolean;
  length: number;
}

export interface SceneElementsData {
  grid: GridConfig;
  lighting: LightConfig;
  coordinateAxes: CoordinateAxesConfig;
}

export const DEFAULT_SCENE_ELEMENTS: SceneElementsData = {
  grid: {
    enabled: true,
    size: 200,
    divisions: 50,
    fadeDistance: 300,
    fadeStrength: 1,
  },
  lighting: {
    ambient: {
      enabled: true,
      color: '#ffffff',
      intensity: 0.4,
    },
    directional: {
      enabled: true,
      color: '#ffffff',
      intensity: 0.8,
      position: { x: 50, y: 100, z: 50 },
      castShadow: true,
    },
    hemisphere: {
      enabled: true,
      skyColor: '#87ceeb',
      groundColor: '#8b7355',
      intensity: 0.3,
    },
  },
  coordinateAxes: {
    enabled: true,
    length: 1000,
  },
};
