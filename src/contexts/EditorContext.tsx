import { useState, useCallback, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import type { GreenhouseConfig, Robot, Waypoint, WorkZone, MapData } from "../types/greenhouse";
import { DEFAULT_GREENHOUSE_CONFIG } from "../constants/defaults";
import {
  EditorContext,
  type EditorContextType,
  type EditorState,
  type EditorMode,
  type PanelTab,
  type ObjectVisibility,
} from "./EditorContextDefinition";
import { useProject } from "./ProjectContext";

interface EditorProviderProps {
  children: ReactNode;
}

const DEFAULT_VISIBILITY: ObjectVisibility = {
  xyPlane: true,
  axes: true,
  greenhouse: {
    enabled: true,
    floor: true,
    walls: true,
    roof: true,
    columns: true,
    frame: true,
  },
  beds: {
    enabled: true,
    platforms: true,
    cables: true,
    plants: true,
  },
  robots: true,
  paths: true,
  zones: true,
  labels: true,
  shadows: true,
};

export function EditorProvider({ children }: EditorProviderProps) {
  const { state: projectState, updateProject: updateProjectData } = useProject();
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
    visibility: DEFAULT_VISIBILITY,
  });

  // Track loaded project ID to prevent unnecessary reloads
  const [loadedProjectId, setLoadedProjectId] = useState<string | null>(null);

  // Load project data when current project ID changes (not object reference)
  useEffect(() => {
    const currentProject = projectState.currentProject;
    const currentProjectId = currentProject?.id;

    console.log('[EditorContext] Project Load Effect Triggered', {
      timestamp: new Date().toISOString(),
      currentProjectId,
      loadedProjectId,
      willLoad: !!(currentProject && currentProjectId && currentProjectId !== loadedProjectId),
    });

    if (currentProject && currentProjectId && currentProjectId !== loadedProjectId) {
      console.log('[EditorContext] Loading Project Data', {
        projectId: currentProjectId,
        robotsCount: currentProject.mapData.robots.length,
        waypointsCount: currentProject.mapData.waypoints.length,
        zonesCount: currentProject.mapData.zones.length,
      });

      // Ensure config has grid property (for backward compatibility)
      const loadedConfig = {
        ...currentProject.mapData.config,
        grid: currentProject.mapData.config.grid || DEFAULT_GREENHOUSE_CONFIG.grid,
      };

      setConfig(loadedConfig);
      setRobots(currentProject.mapData.robots);
      setWaypoints(currentProject.mapData.waypoints);
      setZones(currentProject.mapData.zones);
      setEditorState((prev) => ({
        ...prev,
        mode: "view",
        selectedRobotId: null,
        selectedZoneId: null,
        isPlaying: false,
      }));
      setLoadedProjectId(currentProjectId);
    }
  }, [projectState.currentProject?.id, loadedProjectId]);

  // Sync to project when data changes (auto-save)
  useEffect(() => {
    const currentProject = projectState.currentProject;

    console.log('[EditorContext] Auto-save Effect Triggered', {
      timestamp: new Date().toISOString(),
      hasProject: !!currentProject,
      loadedProjectId,
      currentProjectId: currentProject?.id,
      robotsCount: robots.length,
      waypointsCount: waypoints.length,
      zonesCount: zones.length,
    });

    // Only auto-save if project is loaded and matches the loaded project ID
    if (currentProject && loadedProjectId === currentProject.id) {
      console.log('[EditorContext] Auto-save scheduled (1s debounce)');

      const timeoutId = setTimeout(() => {
        console.log('[EditorContext] Executing auto-save', {
          projectId: currentProject.id,
          timestamp: new Date().toISOString(),
        });

        // Directly update the project's mapData in place to avoid object reference change
        currentProject.mapData.config = config;
        currentProject.mapData.robots = robots;
        currentProject.mapData.waypoints = waypoints;
        currentProject.mapData.zones = zones;
        currentProject.mapData.updatedAt = new Date().toISOString();

        // Save to storage without triggering state update
        updateProjectData({
          mapData: currentProject.mapData,
        }).catch((error) => {
          console.error('Failed to auto-save project:', error);
        });
      }, 1000); // Debounce 1 second

      return () => {
        console.log('[EditorContext] Auto-save cancelled (cleanup)');
        clearTimeout(timeoutId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, robots, waypoints, zones, loadedProjectId]);

  // Config actions
  const updateConfig = useCallback((updates: Partial<GreenhouseConfig>) => {
    setConfig((prev) => {
      const newConfig = {
        ...prev,
        dimensions: { ...prev.dimensions, ...updates.dimensions },
        beds: { ...prev.beds, ...updates.beds },
      };
      return newConfig;
    });
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

  // Visibility actions
  const updateVisibility = useCallback((updates: Partial<ObjectVisibility>) => {
    setEditorState((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, ...updates },
    }));
  }, []);

  const toggleObjectVisibility = useCallback((key: keyof ObjectVisibility) => {
    setEditorState((prev) => {
      const currentValue = prev.visibility[key];

      // Handle nested objects (greenhouse, beds)
      if (typeof currentValue === 'object') {
        return {
          ...prev,
          visibility: {
            ...prev.visibility,
            [key]: {
              ...currentValue,
              enabled: !currentValue.enabled,
            },
          },
        };
      }

      // Handle boolean values
      return {
        ...prev,
        visibility: {
          ...prev.visibility,
          [key]: !currentValue,
        },
      };
    });
  }, []);

  const loadMapData = useCallback((mapData: MapData) => {
    // Ensure config has grid property (for backward compatibility)
    const loadedConfig = {
      ...mapData.config,
      grid: mapData.config.grid || DEFAULT_GREENHOUSE_CONFIG.grid,
    };

    setConfig(loadedConfig);
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
      visibility: DEFAULT_VISIBILITY,
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
    updateVisibility,
    toggleObjectVisibility,
    loadMapData,
    resetAll,
    selectedRobot,
    selectedZone,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}
