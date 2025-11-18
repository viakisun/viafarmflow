/**
 * Scene Elements 타입 정의
 * UI/시각화 보조 요소
 *
 * ✅ StaticMapData.sceneSettings에 JSON 저장됨
 * - Map Editor에서 편집 가능
 * - JSON 파일 Export/Import 시 포함됨
 * - Grid, Lighting, Axes 설정 저장
 */

export interface GridConfig {
  enabled: boolean;
  sizeX: number;  // 가로 (Width)
  sizeZ: number;  // 세로 (Length)
  divisionsX: number;  // 가로 분할 수
  divisionsZ: number;  // 세로 분할 수
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
    sizeX: 400,  // 가로 400m
    sizeZ: 100,  // 세로 100m
    divisionsX: 80,  // 가로 80칸 (5m 간격)
    divisionsZ: 20,  // 세로 20칸 (5m 간격)
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
