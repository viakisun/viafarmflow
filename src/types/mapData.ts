// Hierarchical Map Data Types for ViaFarmFlow

import type { GreenhouseConfig, Robot, Waypoint, WorkZone } from './greenhouse';

// Object type enumeration
export type ObjectType = 'greenhouse' | 'zone' | 'robot' | 'waypoint' | 'bed' | 'sensor' | 'axes';

// Base object interface for all map objects
export interface BaseObject {
  id: string;
  type: ObjectType;
  name: string;
  parentId: string | null;
  children: string[];
  visible: boolean;
  locked: boolean;
  metadata?: Record<string, any>;
}

// Extended interfaces for specific object types
export interface GreenhouseObject extends BaseObject {
  type: 'greenhouse';
  config: GreenhouseConfig;
}

export interface ZoneObject extends BaseObject {
  type: 'zone';
  color: string;
  points: { x: number; z: number }[];
  assignedRobotIds: string[];
}

export interface RobotObject extends BaseObject {
  type: 'robot';
  position: { x: number; y: number; z: number };
  rotation: number;
  status: 'idle' | 'moving' | 'working';
  model: string;
  zoneId?: string;
}

export interface WaypointObject extends BaseObject {
  type: 'waypoint';
  position: { x: number; y: number; z: number };
  robotId: string;
  order: number;
  waitTime?: number;
  action?: string;
}

export interface BedObject extends BaseObject {
  type: 'bed';
  position: { x: number; y: number; z: number };
  dimensions: { width: number; length: number; height: number };
  cropType?: string;
  plantedDate?: string;
}

export interface SensorObject extends BaseObject {
  type: 'sensor';
  position: { x: number; y: number; z: number };
  sensorType: 'temperature' | 'humidity' | 'light' | 'ph' | 'moisture';
  value: number;
  unit: string;
}

export interface AxesObject extends BaseObject {
  type: 'axes';
  length: number;
}

// Union type for all object types
export type MapObject =
  | GreenhouseObject
  | ZoneObject
  | RobotObject
  | WaypointObject
  | BedObject
  | SensorObject
  | AxesObject;

// Complete hierarchical map data structure
export interface HierarchicalMapData {
  version: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  author?: string;

  // Root object (greenhouse)
  root: GreenhouseObject;

  // All objects in a flat map for quick lookup
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

  // Metadata
  metadata?: {
    tags?: string[];
    notes?: string;
    lastModified?: {
      userId: string;
      timestamp: string;
      changes: string;
    };
  };
}

// Utility functions for working with hierarchical data
export class MapDataUtils {
  static createObject(type: ObjectType, parentId: string | null = null): MapObject {
    const baseProps: BaseObject = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      parentId,
      children: [],
      visible: true,
      locked: false,
    };

    switch (type) {
      case 'greenhouse':
        return {
          ...baseProps,
          type: 'greenhouse',
          config: {
            dimensions: { width: 40, height: 8, length: 100 },
            beds: {
              width: 1.5,
              height: 3,
              length: 80,
              count: 10,
              spacing: 2,
              heightFromGround: 3,
            },
          },
        } as GreenhouseObject;

      case 'zone':
        return {
          ...baseProps,
          type: 'zone',
          color: '#' + Math.floor(Math.random()*16777215).toString(16),
          points: [],
          assignedRobotIds: [],
        } as ZoneObject;

      case 'robot':
        return {
          ...baseProps,
          type: 'robot',
          position: { x: 0, y: 0.5, z: 0 },
          rotation: 0,
          status: 'idle',
          model: 'standard',
        } as RobotObject;

      case 'waypoint':
        return {
          ...baseProps,
          type: 'waypoint',
          position: { x: 0, y: 0.5, z: 0 },
          robotId: '',
          order: 0,
        } as WaypointObject;

      case 'bed':
        return {
          ...baseProps,
          type: 'bed',
          position: { x: 0, y: 3, z: 0 },
          dimensions: { width: 1.5, length: 80, height: 0.3 },
        } as BedObject;

      case 'sensor':
        return {
          ...baseProps,
          type: 'sensor',
          position: { x: 0, y: 2, z: 0 },
          sensorType: 'temperature',
          value: 0,
          unit: '°C',
        } as SensorObject;

      default:
        throw new Error(`Unknown object type: ${type}`);
    }
  }

  static getChildren(mapData: HierarchicalMapData, parentId: string): MapObject[] {
    const parent = mapData.objects.get(parentId);
    if (!parent) return [];

    return parent.children
      .map(childId => mapData.objects.get(childId))
      .filter(Boolean) as MapObject[];
  }

  static getParent(mapData: HierarchicalMapData, objectId: string): MapObject | null {
    const object = mapData.objects.get(objectId);
    if (!object || !object.parentId) return null;

    return mapData.objects.get(object.parentId) || null;
  }

  static getAncestors(mapData: HierarchicalMapData, objectId: string): MapObject[] {
    const ancestors: MapObject[] = [];
    let current = mapData.objects.get(objectId);

    while (current && current.parentId) {
      const parent = mapData.objects.get(current.parentId);
      if (parent) {
        ancestors.push(parent);
        current = parent;
      } else {
        break;
      }
    }

    return ancestors.reverse();
  }

  static addChild(mapData: HierarchicalMapData, parentId: string, child: MapObject): void {
    const parent = mapData.objects.get(parentId);
    if (!parent) throw new Error(`Parent ${parentId} not found`);

    child.parentId = parentId;
    parent.children.push(child.id);
    mapData.objects.set(child.id, child);
  }

  static removeObject(mapData: HierarchicalMapData, objectId: string): void {
    const object = mapData.objects.get(objectId);
    if (!object) return;

    // Remove from parent's children
    if (object.parentId) {
      const parent = mapData.objects.get(object.parentId);
      if (parent) {
        parent.children = parent.children.filter(id => id !== objectId);
      }
    }

    // Remove all children recursively
    object.children.forEach(childId => {
      this.removeObject(mapData, childId);
    });

    // Remove from map
    mapData.objects.delete(objectId);
  }

  static moveObject(mapData: HierarchicalMapData, objectId: string, newParentId: string): void {
    const object = mapData.objects.get(objectId);
    const newParent = mapData.objects.get(newParentId);

    if (!object || !newParent) {
      throw new Error('Object or new parent not found');
    }

    // Check for circular reference
    if (this.getAncestors(mapData, newParentId).some(a => a.id === objectId)) {
      throw new Error('Circular reference detected');
    }

    // Remove from old parent
    if (object.parentId) {
      const oldParent = mapData.objects.get(object.parentId);
      if (oldParent) {
        oldParent.children = oldParent.children.filter(id => id !== objectId);
      }
    }

    // Add to new parent
    object.parentId = newParentId;
    newParent.children.push(objectId);
  }

  static clone(object: MapObject): MapObject {
    const cloned = JSON.parse(JSON.stringify(object));
    cloned.id = `${object.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    cloned.name = `${object.name} (Copy)`;
    cloned.children = [];
    return cloned;
  }
}

// Export conversion utilities
export function convertFromLegacy(
  config: GreenhouseConfig,
  robots: Robot[],
  waypoints: Waypoint[],
  zones: WorkZone[]
): HierarchicalMapData {
  const mapData: HierarchicalMapData = {
    version: '2.0.0',
    name: 'Converted Map',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    root: {
      id: 'greenhouse-main',
      type: 'greenhouse',
      name: 'Main Greenhouse',
      parentId: null,
      children: [],
      visible: true,
      locked: false,
      config,
    },
    objects: new Map(),
    selection: {
      primary: null,
      secondary: [],
    },
    viewSettings: {
      expandedNodes: ['greenhouse-main'],
      hiddenObjects: [],
      lockedLayers: [],
    },
  };

  // Add root to objects
  mapData.objects.set(mapData.root.id, mapData.root);

  // Convert zones
  zones.forEach(zone => {
    const zoneObj: ZoneObject = {
      id: zone.id,
      type: 'zone',
      name: zone.name,
      parentId: mapData.root.id,
      children: [],
      visible: true,
      locked: false,
      color: zone.color,
      points: zone.points.map(p => ({ x: p.x, z: p.z })),
      assignedRobotIds: zone.assignedRobotIds,
    };

    mapData.root.children.push(zoneObj.id);
    mapData.objects.set(zoneObj.id, zoneObj);

    // Add robots to zones
    robots
      .filter(robot => zone.assignedRobotIds.includes(robot.id))
      .forEach(robot => {
        const robotObj: RobotObject = {
          id: robot.id,
          type: 'robot',
          name: robot.name,
          parentId: zoneObj.id,
          children: [],
          visible: true,
          locked: false,
          position: robot.position,
          rotation: robot.rotation,
          status: robot.status,
          model: robot.type,
          zoneId: zone.id,
        };

        zoneObj.children.push(robotObj.id);
        mapData.objects.set(robotObj.id, robotObj);

        // Add waypoints to robots
        waypoints
          .filter(wp => wp.robotId === robot.id)
          .forEach(wp => {
            const wpObj: WaypointObject = {
              id: wp.id,
              type: 'waypoint',
              name: `Waypoint ${wp.order}`,
              parentId: robotObj.id,
              children: [],
              visible: true,
              locked: false,
              position: wp.position,
              robotId: robot.id,
              order: wp.order,
            };

            robotObj.children.push(wpObj.id);
            mapData.objects.set(wpObj.id, wpObj);
          });
      });
  });

  // Add unassigned robots to root
  robots
    .filter(robot => !zones.some(z => z.assignedRobotIds.includes(robot.id)))
    .forEach(robot => {
      const robotObj: RobotObject = {
        id: robot.id,
        type: 'robot',
        name: robot.name,
        parentId: mapData.root.id,
        children: [],
        visible: true,
        locked: false,
        position: robot.position,
        rotation: robot.rotation,
        status: robot.status,
        model: robot.type,
      };

      mapData.root.children.push(robotObj.id);
      mapData.objects.set(robotObj.id, robotObj);
    });

  return mapData;
}

export function convertToLegacy(mapData: HierarchicalMapData): {
  config: GreenhouseConfig;
  robots: Robot[];
  waypoints: Waypoint[];
  zones: WorkZone[];
} {
  const robots: Robot[] = [];
  const waypoints: Waypoint[] = [];
  const zones: WorkZone[] = [];

  mapData.objects.forEach(obj => {
    switch (obj.type) {
      case 'robot':
        robots.push({
          id: obj.id,
          name: obj.name,
          position: obj.position,
          rotation: obj.rotation,
          type: obj.model,
          status: obj.status,
        });
        break;

      case 'waypoint':
        waypoints.push({
          id: obj.id,
          position: obj.position,
          robotId: obj.robotId,
          order: obj.order,
        });
        break;

      case 'zone':
        zones.push({
          id: obj.id,
          name: obj.name,
          color: obj.color,
          points: obj.points.map(p => ({ ...p, y: 0 })),
          assignedRobotIds: obj.assignedRobotIds,
        });
        break;
    }
  });

  return {
    config: mapData.root.config,
    robots,
    waypoints,
    zones,
  };
}