// 정적 맵 데이터 타입 정의 (JSON 저장용)

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
  dimensions: Vec3;
  position: Vec3;
  rotation: Vec3;
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

export type SensorType = 'camera' | 'temperature' | 'humidity' | 'co2' | 'light';

export interface SensorOrientation {
  rotation?: Vec3;
  lookAt?: Vec3;
  fov?: number;
  range?: number;
}

export interface Sensor {
  id: string;
  type: SensorType;
  model: string;
  position: Vec3;
  orientation?: SensorOrientation;
  range?: number;
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
  sensors: Sensor[];
  infrastructure?: Infrastructure;
  coordinateAxes?: CoordinateAxesData;
}
