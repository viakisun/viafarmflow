// 정적 맵 데이터 타입 정의 (JSON 저장용)

import type { SceneElementsData } from './core/scene';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Metadata {
  id: string;
  name: string;
  created: string;
  modified: string;
  author: string;
}

export interface GreenhouseData {
  // 바닥 평면도 (2D 다각형)
  floorBoundaries: Vec3[];  // XZ 평면상의 점들 (Y는 무시됨)

  // 벽 높이
  wallHeight: number;

  // 위치/회전 (전체 온실의)
  position: Vec3;
  rotation: Vec3;

  // DEPRECATED: 하위 호환성을 위해 유지
  dimensions: Vec3;
}

export interface BedSpecification {
  width: number;
  height: number;
  defaultLength: number;
}

export interface BedLayout {
  type: 'array' | 'custom';
  startPosition: Vec3;
  count: number;
  spacing: number;
  direction: 'x' | 'z';
  rows: number;
  rowSpacing: number;
}

export interface BedInstance {
  id: string;
  position: Vec3;
  dimensions: {
    width: number;
    height: number;
    length: number;
  };
  rotation: Vec3;
  cropType?: string;
  plantDate?: string;
}

export interface BedsData {
  specification: BedSpecification;
  layout: BedLayout;
  instances: BedInstance[];
}

export type ZoneType = 'work' | 'storage' | 'pathway' | 'restricted';

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  boundaries: Vec3[];
  height: number;
  color: string;
  opacity: number;
}

export interface Line {
  id: string;
  points: Vec3[];
  diameter?: number;
  width?: number;
}

export interface Infrastructure {
  irrigationLines: Line[];
  powerLines: Line[];
  rails: Line[];
}

export interface CoordinateAxesData {
  enabled: boolean;
  length?: number;
}

export interface StaticMapData {
  version: string;
  metadata: Metadata;
  greenhouse: GreenhouseData;
  beds: BedsData;
  zones: Zone[];
  infrastructure?: Infrastructure;
  coordinateAxes?: CoordinateAxesData; // DEPRECATED: Use sceneSettings.coordinateAxes instead

  // Scene visualization settings (Grid, Lighting, Axes)
  // 시각화 설정 (그리드, 조명, 좌표축) - Map Editor에서 편집 가능
  sceneSettings?: SceneElementsData;
}
