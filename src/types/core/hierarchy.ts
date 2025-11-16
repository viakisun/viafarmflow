/**
 * 통합 계층 구조 타입 정의
 * Scene Hierarchy에 표시되는 모든 객체의 통합 구조
 */

import type { BaseObject } from './base';

// Object Types
export type ObjectType =
  | 'root'
  | 'group'
  // Static Objects
  | 'greenhouse'
  | 'bed'
  | 'zone'
  | 'sensor'
  | 'infrastructure'
  // Dynamic Objects
  | 'robot'
  | 'waypoint'
  | 'path'
  // Scene Elements
  | 'grid'
  | 'lighting'
  | 'axes';

// Base Hierarchy Object
export interface HierarchyObject extends BaseObject {
  type: ObjectType;
  parentId: string | null;
  children: string[];
}

// Group Objects (containers)
export interface GroupObject extends HierarchyObject {
  type: 'group';
  groupType: 'static' | 'dynamic' | 'scene';
}

// Static Object Interfaces
export interface GreenhouseObject extends HierarchyObject {
  type: 'greenhouse';
  dimensions: { width: number; height: number; length: number };
}

export interface BedObject extends HierarchyObject {
  type: 'bed';
  position: { x: number; y: number; z: number };
  dimensions: { width: number; length: number; height: number };
}

export interface ZoneObject extends HierarchyObject {
  type: 'zone';
  color: string;
  points: { x: number; z: number }[];
}

export interface SensorObject extends HierarchyObject {
  type: 'sensor';
  position: { x: number; y: number; z: number };
  sensorType: 'temperature' | 'humidity' | 'light' | 'ph' | 'moisture' | 'camera';
}

// Dynamic Object Interfaces
export interface RobotObject extends HierarchyObject {
  type: 'robot';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  status: 'idle' | 'moving' | 'working' | 'charging' | 'error';
  battery: number;
}

export interface WaypointObject extends HierarchyObject {
  type: 'waypoint';
  position: { x: number; y: number; z: number };
  waypointType: 'checkpoint' | 'intersection' | 'charging' | 'parking';
}

// Scene Element Interfaces
export interface GridObject extends HierarchyObject {
  type: 'grid';
  size: number;
  divisions: number;
}

export interface LightingObject extends HierarchyObject {
  type: 'lighting';
  lightType: 'ambient' | 'directional' | 'hemisphere';
  color: string;
  intensity: number;
}

export interface AxesObject extends HierarchyObject {
  type: 'axes';
  length: number;
}

// Union Type
export type MapObject =
  | GroupObject
  | GreenhouseObject
  | BedObject
  | ZoneObject
  | SensorObject
  | RobotObject
  | WaypointObject
  | GridObject
  | LightingObject
  | AxesObject;

// Complete Hierarchy Structure
export interface HierarchicalMapData {
  version: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  author?: string;

  // Root object
  root: GroupObject;

  // All objects (flat map for quick lookup)
  objects: Map<string, MapObject>;

  // Selection state
  selection: {
    primary: string | null;
    secondary: string[];
  };

  // View settings
  viewSettings: {
    expandedNodes: string[];
    hiddenObjects: string[];
    lockedLayers: string[];
  };
}
