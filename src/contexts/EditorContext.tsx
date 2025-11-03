import { useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { GreenhouseConfig, Robot, Waypoint, WorkZone, MapData } from "../types/greenhouse";
import { DEFAULT_GREENHOUSE_CONFIG } from "../constants/defaults";
import {
  EditorContext,
  type EditorContextType,
  type EditorState,
  type EditorMode,
  type PanelTab,
} from "./EditorContextDefinition";

interface EditorProviderProps {
  children: ReactNode;
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [config, setConfig] = useState<GreenhouseConfig>(DEFAULT_GREENHOUSE_CONFIG);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [zones, setZones] = useState<WorkZone[]>([]);
  const [editorState, setEditorState] = useState<EditorState>({
    mode: "view",
    selectedRobotId: null,
    selectedZoneId: null,
    isPlaying: false,
    showGrid: true,
    showDimensions: false,
    activePanel: "properties",
  });

  // Config actions
  const updateConfig = useCallback((updates: Partial<GreenhouseConfig>) => {
    setConfig((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, ...updates.dimensions },
      beds: { ...prev.beds, ...updates.beds },
    }));
  }, []);

  // Editor state actions
  const setEditorMode = useCallback((mode: EditorMode) => {
    setEditorState((prev) => ({ ...prev, mode }));
  }, []);

  const selectRobot = useCallback((robotId: string | null) => {
    setEditorState((prev) => ({
      ...prev,
      selectedRobotId: robotId,
      selectedZoneId: null,
      activePanel: robotId ? "robots" : prev.activePanel,
    }));
  }, []);

  const selectZone = useCallback((zoneId: string | null) => {
    setEditorState((prev) => ({
      ...prev,
      selectedZoneId: zoneId,
      selectedRobotId: null,
      activePanel: zoneId ? "zones" : prev.activePanel,
    }));
  }, []);

  // Robot actions
  const addRobot = useCallback(
    (robot: Robot) => {
      setRobots((prev) => [...prev, robot]);
      selectRobot(robot.id);
    },
    [selectRobot],
  );

  const updateRobot = useCallback((robotId: string, updates: Partial<Robot>) => {
    setRobots((prev) =>
      prev.map((robot) => (robot.id === robotId ? { ...robot, ...updates } : robot)),
    );
  }, []);

  const deleteRobot = useCallback(
    (robotId: string) => {
      setRobots((prev) => prev.filter((robot) => robot.id !== robotId));
      if (editorState.selectedRobotId === robotId) {
        selectRobot(null);
      }
    },
    [editorState.selectedRobotId, selectRobot],
  );

  // Waypoint actions
  const addWaypoint = useCallback((waypoint: Waypoint) => {
    setWaypoints((prev) => [...prev, waypoint]);
  }, []);

  const updateWaypoint = useCallback((waypointId: string, updates: Partial<Waypoint>) => {
    setWaypoints((prev) => prev.map((wp) => (wp.id === waypointId ? { ...wp, ...updates } : wp)));
  }, []);

  const deleteWaypoint = useCallback((waypointId: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== waypointId));
  }, []);

  // Zone actions
  const addZone = useCallback(
    (zone: WorkZone) => {
      setZones((prev) => [...prev, zone]);
      selectZone(zone.id);
    },
    [selectZone],
  );

  const updateZone = useCallback((zoneId: string, updates: Partial<WorkZone>) => {
    setZones((prev) => prev.map((zone) => (zone.id === zoneId ? { ...zone, ...updates } : zone)));
  }, []);

  const deleteZone = useCallback(
    (zoneId: string) => {
      setZones((prev) => prev.filter((zone) => zone.id !== zoneId));
      if (editorState.selectedZoneId === zoneId) {
        selectZone(null);
      }
    },
    [editorState.selectedZoneId, selectZone],
  );

  // UI toggles
  const toggleGrid = useCallback(() => {
    setEditorState((prev) => ({ ...prev, showGrid: !prev.showGrid }));
  }, []);

  const toggleDimensions = useCallback(() => {
    setEditorState((prev) => ({
      ...prev,
      showDimensions: !prev.showDimensions,
    }));
  }, []);

  const setActivePanel = useCallback((panel: PanelTab) => {
    setEditorState((prev) => ({ ...prev, activePanel: panel }));
  }, []);

  const setPlaying = useCallback((playing: boolean) => {
    setEditorState((prev) => ({ ...prev, isPlaying: playing }));
  }, []);

  const loadMapData = useCallback((mapData: MapData) => {
    setConfig(mapData.config);
    setRobots(mapData.robots);
    setWaypoints(mapData.waypoints);
    setZones(mapData.zones);
    setEditorState((prev) => ({
      ...prev,
      mode: "view",
      selectedRobotId: null,
      selectedZoneId: null,
      isPlaying: false,
    }));
  }, []);

  const resetAll = useCallback(() => {
    setConfig(DEFAULT_GREENHOUSE_CONFIG);
    setRobots([]);
    setWaypoints([]);
    setZones([]);
    setEditorState({
      mode: "view",
      selectedRobotId: null,
      selectedZoneId: null,
      isPlaying: false,
      showGrid: true,
      showDimensions: false,
      activePanel: "properties",
    });
  }, []);

  // Computed values
  const selectedRobot = useMemo(
    () => robots.find((r) => r.id === editorState.selectedRobotId),
    [robots, editorState.selectedRobotId],
  );

  const selectedZone = useMemo(
    () => zones.find((z) => z.id === editorState.selectedZoneId),
    [zones, editorState.selectedZoneId],
  );

  const value: EditorContextType = {
    config,
    robots,
    waypoints,
    zones,
    editorState,
    updateConfig,
    setEditorMode,
    selectRobot,
    selectZone,
    addRobot,
    updateRobot,
    deleteRobot,
    addWaypoint,
    updateWaypoint,
    deleteWaypoint,
    addZone,
    updateZone,
    deleteZone,
    toggleGrid,
    toggleDimensions,
    setActivePanel,
    setPlaying,
    loadMapData,
    resetAll,
    selectedRobot,
    selectedZone,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}
