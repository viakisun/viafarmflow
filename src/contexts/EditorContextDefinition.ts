import { createContext } from "react";
import type { GreenhouseConfig, Robot, Waypoint, WorkZone, MapData } from "../types/greenhouse";

export type EditorMode = "view" | "edit" | "robot" | "path" | "zone";
export type PanelTab = "properties" | "robots" | "paths" | "zones" | "settings";

export interface EditorState {
  mode: EditorMode;
  selectedRobotId: string | null;
  selectedZoneId: string | null;
  isPlaying: boolean;
  showGrid: boolean;
  showDimensions: boolean;
  activePanel: PanelTab;
}

export interface EditorContextType {
  // State
  config: GreenhouseConfig;
  robots: Robot[];
  waypoints: Waypoint[];
  zones: WorkZone[];
  editorState: EditorState;

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
  loadMapData: (mapData: MapData) => void;
  resetAll: () => void;

  // Computed
  selectedRobot: Robot | undefined;
  selectedZone: WorkZone | undefined;
}

export const EditorContext = createContext<EditorContextType | undefined>(undefined);
