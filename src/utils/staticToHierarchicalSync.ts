/**
 * Static Map Data → Hierarchical Map Data 변환 유틸리티
 * JSON 기반 정적 데이터를 SceneTree가 표시할 수 있는 계층 구조로 변환
 */

import type { StaticMapData, BedInstance, Zone } from '../types/staticMapData';
import type {
  HierarchicalMapData,
  GreenhouseObject,
  FloorObject,
  WallObject,
  BedObject,
  ZoneObject,
  AxesObject,
  MapObject
} from '../types/core/hierarchy';
import { generateBedInstances } from './bedLayoutGenerator';

/**
 * StaticMapData를 HierarchicalMapData로 변환
 * SceneTree에서 JSON 구조를 표시할 수 있도록 함
 */
export function syncStaticToHierarchical(
  staticData: StaticMapData,
  existingMapData?: HierarchicalMapData
): HierarchicalMapData {
  const objects = new Map<string, MapObject>();

  // 1. Greenhouse 루트 객체 생성
  const greenhouseId = 'greenhouse-main';
  const greenhouseObj: GreenhouseObject = {
    id: greenhouseId,
    type: 'greenhouse',
    name: staticData.metadata.name || 'Main Greenhouse',
    parentId: null,
    children: [],
    visible: true,
    locked: false,
    dimensions: {
      width: staticData.greenhouse.dimensions.x,
      height: staticData.greenhouse.dimensions.y,
      length: staticData.greenhouse.dimensions.z,
    },
    position: staticData.greenhouse.position,
    rotation: staticData.greenhouse.rotation,
    floorBoundaries: staticData.greenhouse.floorBoundaries,
    wallHeight: staticData.greenhouse.wallHeight,
  };

  objects.set(greenhouseId, greenhouseObj);

  // 1-1. Floor 객체 생성
  if (staticData.greenhouse.floorBoundaries && staticData.greenhouse.floorBoundaries.length > 0) {
    const floorId = 'greenhouse-floor';
    greenhouseObj.children.push(floorId);

    const floorObj: FloorObject = {
      id: floorId,
      type: 'floor',
      name: 'Floor',
      parentId: greenhouseId,
      children: [],
      visible: true,
      locked: false,
      boundaries: staticData.greenhouse.floorBoundaries.map(p => ({ x: p.x, z: p.z })),
    };
    objects.set(floorId, floorObj);
  }

  // 1-2. Wall 객체들 생성 (바닥 경계선 기반)
  if (staticData.greenhouse.floorBoundaries && staticData.greenhouse.floorBoundaries.length > 1) {
    const boundaries = staticData.greenhouse.floorBoundaries;
    const wallHeight = staticData.greenhouse.wallHeight || staticData.greenhouse.dimensions.y;

    for (let i = 0; i < boundaries.length; i++) {
      const start = boundaries[i];
      const end = boundaries[(i + 1) % boundaries.length];  // 다음 점 (마지막은 첫점과 연결)

      const wallId = `greenhouse-wall-${i}`;
      greenhouseObj.children.push(wallId);

      const wallObj: WallObject = {
        id: wallId,
        type: 'wall',
        name: `Wall ${i + 1}`,
        parentId: greenhouseId,
        children: [],
        visible: true,
        locked: false,
        wallType: 'segment',
        startPoint: { x: start.x, z: start.z },
        endPoint: { x: end.x, z: end.z },
        height: wallHeight,
      };
      objects.set(wallId, wallObj);
    }
  }

  // 2. Beds 변환
  const bedInstances = staticData.beds.instances && staticData.beds.instances.length > 0
    ? staticData.beds.instances
    : generateBedInstances(staticData.beds.specification, staticData.beds.layout);

  const bedsGroupId = 'beds-group';
  greenhouseObj.children.push(bedsGroupId);

  // Beds 그룹 객체 (가상의 그룹)
  const bedsGroup: BedObject = {
    id: bedsGroupId,
    type: 'bed',
    name: `Beds (${bedInstances.length})`,
    parentId: greenhouseId,
    children: [],
    visible: true,
    locked: false,
    position: { x: 0, y: 0, z: 0 },
    dimensions: {
      width: staticData.beds.specification.width,
      length: staticData.beds.specification.length,
      height: 0.3,
    },
    rotation: { x: 0, y: 0, z: 0 },
  };
  objects.set(bedsGroupId, bedsGroup);

  bedInstances.forEach((bedInstance: BedInstance) => {
    const bedObj: BedObject = {
      id: bedInstance.id,
      type: 'bed',
      name: bedInstance.name || bedInstance.id,
      parentId: bedsGroupId,
      children: [],
      visible: true,
      locked: false,
      position: bedInstance.position,
      dimensions: {
        width: staticData.beds.specification.width,
        length: staticData.beds.specification.length,
        height: 0.3,
      },
      rotation: bedInstance.rotation || { x: 0, y: 0, z: 0 },
      metadata: bedInstance.metadata,
    };

    bedsGroup.children.push(bedObj.id);
    objects.set(bedObj.id, bedObj);
  });

  // 3. Zones 변환
  if (staticData.zones && staticData.zones.length > 0) {
    const zonesGroupId = 'zones-group';
    greenhouseObj.children.push(zonesGroupId);

    // Zones 그룹 (가상)
    const zonesGroup: ZoneObject = {
      id: zonesGroupId,
      type: 'zone',
      name: `Zones (${staticData.zones.length})`,
      parentId: greenhouseId,
      children: [],
      visible: true,
      locked: false,
      color: '#888888',
      points: [],
      assignedRobotIds: [],
    };
    objects.set(zonesGroupId, zonesGroup);

    staticData.zones.forEach((zone: Zone) => {
      const zoneObj: ZoneObject = {
        id: zone.id,
        type: 'zone',
        name: zone.name,
        parentId: zonesGroupId,
        children: [],
        visible: true,
        locked: false,
        color: zone.color || '#00ff00',
        points: zone.boundaries.map(b => ({ x: b.x, z: b.z })),
        assignedRobotIds: [],
      };

      zonesGroup.children.push(zoneObj.id);
      objects.set(zoneObj.id, zoneObj);
    });
  }

  // 4. Coordinate Axes 변환
  if (staticData.coordinateAxes) {
    const axesId = 'coordinate-axes';
    greenhouseObj.children.push(axesId);

    const axesObj: AxesObject = {
      id: axesId,
      type: 'axes',
      name: 'Coordinate Axes',
      parentId: greenhouseId,
      children: [],
      visible: staticData.coordinateAxes.enabled,
      locked: false,
      length: staticData.coordinateAxes.length || 1000,
    };
    objects.set(axesId, axesObj);
  }

  // 5. HierarchicalMapData 구조 생성
  // 기본 확장 노드: greenhouse, beds-group, zones-group
  const defaultExpandedNodes = [greenhouseId];
  if (objects.has('beds-group')) defaultExpandedNodes.push('beds-group');
  if (objects.has('zones-group')) defaultExpandedNodes.push('zones-group');

  const hierarchicalData: HierarchicalMapData = {
    version: staticData.version,
    name: staticData.metadata.name,
    description: staticData.metadata.description,
    createdAt: staticData.metadata.created,
    updatedAt: staticData.metadata.modified,
    author: staticData.metadata.author,
    root: greenhouseObj,
    objects,
    selection: existingMapData?.selection || {
      primary: null,
      secondary: [],
    },
    viewSettings: {
      expandedNodes: defaultExpandedNodes,
      hiddenObjects: existingMapData?.viewSettings.hiddenObjects || [],
      lockedLayers: existingMapData?.viewSettings.lockedLayers || [],
    },
  };

  return hierarchicalData;
}
