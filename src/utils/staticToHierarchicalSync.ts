/**
 * Static Map Data → Hierarchical Map Data 변환 유틸리티
 * JSON 기반 정적 데이터를 SceneTree가 표시할 수 있는 계층 구조로 변환
 */

import type { StaticMapData, BedInstance, Zone, Sensor } from '../types/staticMapData';
import type {
  HierarchicalMapData,
  GreenhouseObject,
  BedObject,
  ZoneObject,
  SensorObject,
  AxesObject,
  MapObject
} from '../types/mapData';
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
    config: {
      dimensions: {
        width: staticData.greenhouse.dimensions.x,
        height: staticData.greenhouse.dimensions.y,
        length: staticData.greenhouse.dimensions.z,
      },
      beds: {
        width: staticData.beds.specification.width,
        height: 0.3, // 기본 높이
        length: staticData.beds.specification.length,
        count: staticData.beds.layout.count,
        spacing: staticData.beds.layout.spacing,
        heightFromGround: staticData.beds.layout.startPosition.y,
      },
    },
  };

  objects.set(greenhouseId, greenhouseObj);

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

  // 4. Sensors 변환
  if (staticData.sensors && staticData.sensors.length > 0) {
    const sensorsGroupId = 'sensors-group';
    greenhouseObj.children.push(sensorsGroupId);

    // Sensors 그룹 (가상)
    const sensorsGroup: SensorObject = {
      id: sensorsGroupId,
      type: 'sensor',
      name: `Sensors (${staticData.sensors.length})`,
      parentId: greenhouseId,
      children: [],
      visible: true,
      locked: false,
      position: { x: 0, y: 0, z: 0 },
      sensorType: 'temperature',
      value: 0,
      unit: '',
    };
    objects.set(sensorsGroupId, sensorsGroup);

    staticData.sensors.forEach((sensor: Sensor) => {
      const sensorObj: SensorObject = {
        id: sensor.id,
        type: 'sensor',
        name: sensor.name || `${sensor.type} (${sensor.id})`,
        parentId: sensorsGroupId,
        children: [],
        visible: true,
        locked: false,
        position: sensor.position,
        sensorType: mapSensorType(sensor.type),
        value: 0,
        unit: getSensorUnit(sensor.type),
      };

      sensorsGroup.children.push(sensorObj.id);
      objects.set(sensorObj.id, sensorObj);
    });
  }

  // 5. Coordinate Axes 변환
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

  // 6. HierarchicalMapData 구조 생성
  // 기본 확장 노드: greenhouse, beds-group, zones-group, sensors-group
  const defaultExpandedNodes = [greenhouseId];
  if (objects.has('beds-group')) defaultExpandedNodes.push('beds-group');
  if (objects.has('zones-group')) defaultExpandedNodes.push('zones-group');
  if (objects.has('sensors-group')) defaultExpandedNodes.push('sensors-group');

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

/**
 * StaticMapData 센서 타입을 HierarchicalMapData 센서 타입으로 매핑
 */
function mapSensorType(type: string): 'temperature' | 'humidity' | 'light' | 'ph' | 'moisture' {
  switch (type.toLowerCase()) {
    case 'temperature':
    case 'temp':
      return 'temperature';
    case 'humidity':
    case 'humid':
      return 'humidity';
    case 'light':
    case 'illuminance':
      return 'light';
    case 'ph':
      return 'ph';
    case 'moisture':
    case 'soil_moisture':
      return 'moisture';
    case 'camera':
    case 'thermal':
    default:
      return 'temperature'; // 기본값
  }
}

/**
 * 센서 타입에 따른 단위 반환
 */
function getSensorUnit(type: string): string {
  switch (type.toLowerCase()) {
    case 'temperature':
    case 'temp':
    case 'thermal':
      return '°C';
    case 'humidity':
    case 'humid':
      return '%';
    case 'light':
    case 'illuminance':
      return 'lux';
    case 'ph':
      return 'pH';
    case 'moisture':
    case 'soil_moisture':
      return '%';
    case 'camera':
      return '';
    default:
      return '';
  }
}
