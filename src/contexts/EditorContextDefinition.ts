import { createContext } from "react";
import type { GreenhouseConfig, Robot, Waypoint, WorkZone, MapData } from "../types/greenhouse";
import type { HierarchicalMapData, MapObject } from "../types/mapData";
import type { StaticMapData } from "../types/staticMapData";
import type { DynamicRobotData } from "../types/dynamicRobotData";
import type { SceneElementsData } from "../types/core/scene";

export type EditorMode = "view" | "edit" | "robot" | "path" | "zone" | "floor";
export type PanelTab = "properties" | "robots" | "paths" | "zones" | "settings" | "tree" | "json";
export type TransformMode = "translate" | "rotate" | "scale";

export interface EditorState {
  mode: EditorMode;
  selectedRobotId: string | null;
  selectedZoneId: string | null;
  isPlaying: boolean;
  showGrid: boolean;
  showDimensions: boolean;
  activePanel: PanelTab;
  transformMode: TransformMode;
}

export interface EditorContextType {
  // State
  config: GreenhouseConfig;
  robots: Robot[];
  waypoints: Waypoint[];
  zones: WorkZone[];
  editorState: EditorState;

  // Hierarchical map data (legacy)
  mapData: HierarchicalMapData;

  // New: Static/Dynamic/Scene data separation
  staticMapData: StaticMapData | null;
  dynamicRobotData: DynamicRobotData | null;
  sceneElements: SceneElementsData;

  // Actions
  updateConfig: (config: Partial<GreenhouseConfig>) => void;
  setEditorMode: (mode: EditorMode) => void;
  selectRobot: (robotId: string | null) => void;
  selectZone: (zoneId: string | null) => void;
  addRobot: (robot: Robot) => void;
  updateRobot: (robotId: string, updates: Partial<Robot>) => void;
  deleteRobot: (robotId: string) => void;
  addWaypoint: (waypoint: Waypoint) => void;
  updateWaypoint: (waypointId: string, updates: Partial<Waypoint>) => void;
  deleteWaypoint: (waypointId: string) => void;
  addZone: (zone: WorkZone) => void;
  updateZone: (zoneId: string, updates: Partial<WorkZone>) => void;
  deleteZone: (zoneId: string) => void;
  toggleGrid: () => void;
  toggleDimensions: () => void;
  setActivePanel: (panel: PanelTab) => void;
  setPlaying: (playing: boolean) => void;
  setTransformMode: (mode: TransformMode) => void;
  loadMapData: (mapData: MapData) => void;
  resetAll: () => void;

  // Hierarchical data actions
  selectObject: (objectId: string | null) => void;
  updateObject: (objectId: string, updates: Partial<MapObject>) => void;
  deleteObject: (objectId: string) => void;
  toggleObjectVisibility: (objectId: string) => void;
  toggleObjectLock: (objectId: string) => void;
  updateMapData: (data: HierarchicalMapData) => void;

  // New: Static map data actions
  loadStaticMapData: (data: StaticMapData) => void;
  updateStaticMapData: (data: StaticMapData) => void;
  updateGreenhouseDimensions: (dimensions: { x: number; y: number; z: number }) => void;
  updateBedLayout: (layout: StaticMapData['beds']['layout']) => void;
  updateBedInstance: (bedId: string, updates: Partial<StaticMapData['beds']['instances'][0]>) => void;
  addBedInstance: (bed: StaticMapData['beds']['instances'][0]) => void;
  removeBedInstance: (bedId: string) => void;

  // New: Dynamic robot data actions
  loadDynamicRobotData: (data: DynamicRobotData) => void;
  updateDynamicRobotData: (data: DynamicRobotData) => void;
  updateRobotState: (robotId: string, updates: Partial<DynamicRobotData['robots'][0]>) => void;

  // New: Scene Elements actions
  updateSceneElements: (data: Partial<SceneElementsData>) => void;
  toggleSceneGrid: () => void;
  toggleSceneAxes: () => void;
  toggleSceneLight: (type: 'ambient' | 'directional' | 'hemisphere') => void;

  // Computed
  selectedRobot: Robot | undefined;
  selectedZone: WorkZone | undefined;
  selectedObject: MapObject | undefined;
}

export const EditorContext = createContext<EditorContextType | undefined>(undefined);
