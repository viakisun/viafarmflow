import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { GreenhouseConfig, Robot, Waypoint, WorkZone, MapData } from "../types/greenhouse";
import type { HierarchicalMapData, HierarchyObject } from "../types/core/hierarchy";
import type { StaticMapData } from "../types/staticMapData";
import type { DynamicRobotData } from "../types/dynamicRobotData";
import type { SceneElementsData } from "../types/core/scene";
import { DEFAULT_GREENHOUSE_CONFIG } from "../constants/defaults";
import { createMockMapData } from "../data/mockMapData";
import { convertToLegacy, convertFromLegacy, MapDataUtils } from "../types/mapData";
import {
  EditorContext,
  type EditorContextType,
  type EditorState,
  type EditorMode,
  type PanelTab,
  type TransformMode,
} from "./EditorContextDefinition";
import { generateBedInstances } from "../utils/bedLayoutGenerator";
import { syncStaticToHierarchical } from "../utils/staticToHierarchicalSync";
import { syncHierarchicalToStatic } from "../sync/hierarchicalToStatic";
import { DEFAULT_SCENE_ELEMENTS } from "../types/core/scene";
import { syncToUnifiedHierarchy } from "../sync/unifiedHierarchySync";

interface EditorProviderProps {
  children: ReactNode;
}

export function EditorProvider({ children }: EditorProviderProps) {
  // Initialize with mock hierarchical map data
  const [mapData, setMapData] = useState<HierarchicalMapData>(() => createMockMapData());

  // New: Static/Dynamic/Scene data separation
  const [staticMapData, setStaticMapData] = useState<StaticMapData | null>(null);
  const [dynamicRobotData, setDynamicRobotData] = useState<DynamicRobotData | null>(null);
  const [sceneElements, setSceneElements] = useState<SceneElementsData>(DEFAULT_SCENE_ELEMENTS);

  // Legacy state for backward compatibility (derived from hierarchical data)
  const [config, setConfig] = useState<GreenhouseConfig>(DEFAULT_GREENHOUSE_CONFIG);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [zones, setZones] = useState<WorkZone[]>([]);

  // Track if we're currently syncing to prevent circular updates
  const isSyncingRef = useRef(false);

  const [editorState, setEditorState] = useState<EditorState>({
    mode: "view",
    selectedRobotId: null,
    selectedZoneId: null,
    isPlaying: false,
    showGrid: true,
    showDimensions: false,
    activePanel: "properties",
    transformMode: "translate",
  });

  // Sync all data to Unified HierarchicalMapData
  useEffect(() => {
    if (isSyncingRef.current) return;

    isSyncingRef.current = true;
    const unified = syncToUnifiedHierarchy(
      staticMapData,
      dynamicRobotData,
      sceneElements,
      mapData,
      robots,
      waypoints
    );
    setMapData(unified);
    isSyncingRef.current = false;
  }, [staticMapData, dynamicRobotData, sceneElements]);

  // Sync legacy state with hierarchical data
  useEffect(() => {
    if (isSyncingRef.current) return;

    isSyncingRef.current = true;
    const legacy = convertToLegacy(mapData);
    setConfig(legacy.config);
    setRobots(legacy.robots);
    setWaypoints(legacy.waypoints);
    setZones(legacy.zones);
    isSyncingRef.current = false;
  }, [mapData]);

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

  const setTransformMode = useCallback((mode: TransformMode) => {
    setEditorState((prev) => ({ ...prev, transformMode: mode }));
  }, []);

  // Hierarchical map data operations
  const selectObject = useCallback((objectId: string | null) => {
    setMapData((prev) => ({
      ...prev,
      selection: {
        ...prev.selection,
        primary: objectId,
        secondary: [],
      },
    }));

    // Update legacy selection state for backward compatibility
    if (objectId) {
      const object = mapData.objects.get(objectId);
      if (object?.type === 'robot') {
        selectRobot(objectId);
      } else if (object?.type === 'zone') {
        selectZone(objectId);
      }
    } else {
      selectRobot(null);
      selectZone(null);
    }
  }, [mapData, selectRobot, selectZone]);

  const updateObject = useCallback((objectId: string, updates: Partial<MapObject>) => {
    setMapData((prev) => {
      const object = prev.objects.get(objectId);
      if (!object) return prev;

      // 새로운 객체 생성 (불변성 유지)
      const updatedObject = { ...object, ...updates } as MapObject;

      // 새로운 Map 생성
      const newObjects = new Map(prev.objects);
      newObjects.set(objectId, updatedObject);

      const updatedMapData = {
        ...prev,
        objects: newObjects,
      };

      // Hierarchical → Static 역방향 동기화
      setStaticMapData((prevStatic) => {
        if (!prevStatic) return prevStatic;
        return syncHierarchicalToStatic(updatedMapData, prevStatic);
      });

      return updatedMapData;
    });
  }, []);

  const deleteObject = useCallback((objectId: string) => {
    setMapData((prev) => {
      const newMapData = { ...prev };
      MapDataUtils.removeObject(newMapData, objectId);
      return newMapData;
    });
  }, []);

  const toggleObjectLock = useCallback((objectId: string) => {
    setMapData((prev) => {
      const object = prev.objects.get(objectId);
      if (!object) return prev;

      // 새로운 객체 생성 (불변성 유지)
      const updatedObject = { ...object, locked: !object.locked };

      // 새로운 Map 생성
      const newObjects = new Map(prev.objects);
      newObjects.set(objectId, updatedObject);

      return {
        ...prev,
        objects: newObjects,
      };
    });
  }, []);

  const updateMapData = useCallback((newMapData: HierarchicalMapData) => {
    setMapData(newMapData);
  }, []);

  const loadMapData = useCallback((mapData: MapData) => {
    // Convert legacy format to hierarchical
    const hierarchicalData = convertFromLegacy(
      mapData.config,
      mapData.robots,
      mapData.waypoints,
      mapData.zones
    );
    setMapData(hierarchicalData);
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
      transformMode: "translate",
    });
  }, []);

  // New: Static map data actions
  const loadStaticMapData = useCallback((data: StaticMapData) => {
    setStaticMapData(data);

    // Restore sceneSettings if present
    if (data.sceneSettings) {
      setSceneElements(data.sceneSettings);
    }
  }, []);

  const updateStaticMapData = useCallback((data: StaticMapData) => {
    setStaticMapData(data);
  }, []);

  const updateGreenhouseDimensions = useCallback((dimensions: { x: number; y: number; z: number }) => {
    setStaticMapData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        greenhouse: {
          ...prev.greenhouse,
          dimensions
        },
        metadata: {
          ...prev.metadata,
          modified: new Date().toISOString()
        }
      };
    });
  }, []);

  const updateBedLayout = useCallback((layout: StaticMapData['beds']['layout']) => {
    setStaticMapData((prev) => {
      if (!prev) return null;

      // 레이아웃 변경 시 인스턴스 재생성
      const newInstances = generateBedInstances(prev.beds.specification, layout);

      return {
        ...prev,
        beds: {
          ...prev.beds,
          layout,
          instances: newInstances
        },
        metadata: {
          ...prev.metadata,
          modified: new Date().toISOString()
        }
      };
    });
  }, []);

  const updateBedInstance = useCallback((bedId: string, updates: Partial<StaticMapData['beds']['instances'][0]>) => {
    setStaticMapData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        beds: {
          ...prev.beds,
          instances: prev.beds.instances.map(bed =>
            bed.id === bedId ? { ...bed, ...updates } : bed
          )
        },
        metadata: {
          ...prev.metadata,
          modified: new Date().toISOString()
        }
      };
    });
  }, []);

  const addBedInstance = useCallback((bed: StaticMapData['beds']['instances'][0]) => {
    setStaticMapData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        beds: {
          ...prev.beds,
          instances: [...prev.beds.instances, bed]
        },
        metadata: {
          ...prev.metadata,
          modified: new Date().toISOString()
        }
      };
    });
  }, []);

  const removeBedInstance = useCallback((bedId: string) => {
    setStaticMapData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        beds: {
          ...prev.beds,
          instances: prev.beds.instances.filter(bed => bed.id !== bedId)
        },
        metadata: {
          ...prev.metadata,
          modified: new Date().toISOString()
        }
      };
    });
  }, []);

  // New: Dynamic robot data actions
  const loadDynamicRobotData = useCallback((data: DynamicRobotData) => {
    setDynamicRobotData(data);
  }, []);

  const updateDynamicRobotData = useCallback((data: DynamicRobotData) => {
    setDynamicRobotData(data);
  }, []);

  const updateRobotState = useCallback((robotId: string, updates: Partial<DynamicRobotData['robots'][0]>) => {
    setDynamicRobotData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        robots: prev.robots.map(robot =>
          robot.id === robotId ? { ...robot, ...updates } : robot
        ),
        timestamp: new Date().toISOString()
      };
    });
  }, []);

  // New: Scene Elements actions
  const updateSceneElements = useCallback((updates: SceneElementsData) => {
    setSceneElements(updates);
  }, []);

  const toggleSceneGrid = useCallback(() => {
    setSceneElements((prev) => ({
      ...prev,
      grid: {
        ...prev.grid,
        enabled: !prev.grid.enabled,
      },
    }));
    // 레거시 showGrid 상태도 업데이트
    setEditorState((prev) => ({
      ...prev,
      showGrid: !prev.showGrid,
    }));
  }, []);

  const toggleSceneAxes = useCallback(() => {
    setSceneElements((prev) => ({
      ...prev,
      coordinateAxes: {
        ...prev.coordinateAxes,
        enabled: !prev.coordinateAxes.enabled,
      },
    }));
  }, []);

  const toggleSceneLight = useCallback((type: 'ambient' | 'directional' | 'hemisphere') => {
    setSceneElements((prev) => ({
      ...prev,
      lighting: {
        ...prev.lighting,
        [type]: {
          ...prev.lighting[type],
          enabled: !prev.lighting[type].enabled,
        },
      },
    }));
  }, []);

  // Object visibility toggle (Scene Elements + Hierarchy Objects)
  const toggleObjectVisibility = useCallback((objectId: string) => {
    // Scene Elements 특수 처리
    if (objectId === 'scene-grid') {
      toggleSceneGrid();
      return;
    }
    if (objectId === 'scene-axes') {
      toggleSceneAxes();
      return;
    }
    if (objectId === 'scene-light-ambient') {
      toggleSceneLight('ambient');
      return;
    }
    if (objectId === 'scene-light-directional') {
      toggleSceneLight('directional');
      return;
    }
    if (objectId === 'scene-light-hemisphere') {
      toggleSceneLight('hemisphere');
      return;
    }

    // 일반 Hierarchy 객체 처리
    setMapData((prev) => {
      const object = prev.objects.get(objectId);
      if (!object) return prev;

      const updatedObject = { ...object, visible: !object.visible };
      const newObjects = new Map(prev.objects);
      newObjects.set(objectId, updatedObject);

      return {
        ...prev,
        objects: newObjects,
      };
    });
  }, [toggleSceneGrid, toggleSceneAxes, toggleSceneLight]);

  // Computed values
  const selectedRobot = useMemo(
    () => robots.find((r) => r.id === editorState.selectedRobotId),
    [robots, editorState.selectedRobotId],
  );

  const selectedZone = useMemo(
    () => zones.find((z) => z.id === editorState.selectedZoneId),
    [zones, editorState.selectedZoneId],
  );

  const selectedObject = useMemo(
    () => mapData.selection.primary ? mapData.objects.get(mapData.selection.primary) : undefined,
    [mapData.selection.primary, mapData.objects],
  );

  const value: EditorContextType = {
    config,
    robots,
    waypoints,
    zones,
    editorState,
    mapData,
    staticMapData,
    dynamicRobotData,
    sceneElements,
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
    setTransformMode,
    loadMapData,
    resetAll,
    selectObject,
    updateObject,
    deleteObject,
    toggleObjectVisibility,
    toggleObjectLock,
    updateMapData,
    loadStaticMapData,
    updateStaticMapData,
    updateGreenhouseDimensions,
    updateBedLayout,
    updateBedInstance,
    addBedInstance,
    removeBedInstance,
    loadDynamicRobotData,
    updateDynamicRobotData,
    updateRobotState,
    updateSceneElements,
    toggleSceneGrid,
    toggleSceneAxes,
    toggleSceneLight,
    selectedRobot,
    selectedZone,
    selectedObject,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

// Export useEditor hook
export { useEditor } from './useEditor';
