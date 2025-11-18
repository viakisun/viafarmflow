/**
 * Hierarchical to Static Map Data Sync
 * HierarchicalMapData의 변경사항을 StaticMapData로 역방향 동기화
 *
 * Purpose: Properties Panel에서 position 등을 편집하면 HierarchicalMapData가 업데이트됨.
 * 이 변경사항을 StaticMapData로 반영하여 JSON Export 시 저장되도록 함.
 */

import type { HierarchicalMapData } from '../types/mapData';
import type { StaticMapData, Vec3 } from '../types/staticMapData';
import type {
  GreenhouseObject,
  BedObject,
  ZoneObject,
  SensorObject,
} from '../types/core/hierarchy';

/**
 * HierarchicalMapData → StaticMapData 역방향 동기화
 * @param hierarchical 계층 구조 맵 데이터
 * @param existingStatic 기존 정적 맵 데이터 (기본값 사용)
 * @returns 업데이트된 StaticMapData
 */
export function syncHierarchicalToStatic(
  hierarchical: HierarchicalMapData,
  existingStatic: StaticMapData
): StaticMapData {
  const updatedStatic: StaticMapData = {
    ...existingStatic,
    metadata: {
      ...existingStatic.metadata,
      modified: new Date().toISOString(),
    },
  };

  // Greenhouse object에서 position/rotation 동기화
  const greenhouseObj = Array.from(hierarchical.objects.values()).find(
    (obj) => obj.type === 'greenhouse'
  ) as GreenhouseObject | undefined;

  if (greenhouseObj) {
    updatedStatic.greenhouse = {
      ...updatedStatic.greenhouse,
      dimensions: {
        x: greenhouseObj.dimensions.width,
        y: greenhouseObj.dimensions.height,
        z: greenhouseObj.dimensions.length,
      },
      position: greenhouseObj.position || existingStatic.greenhouse.position,
      rotation: greenhouseObj.rotation || existingStatic.greenhouse.rotation,
    };
  }

  // Bed objects에서 position/rotation 동기화
  const bedObjects = Array.from(hierarchical.objects.values()).filter(
    (obj) => obj.type === 'bed'
  ) as BedObject[];

  if (bedObjects.length > 0) {
    updatedStatic.beds = {
      ...updatedStatic.beds,
      instances: bedObjects.map((bedObj) => {
        // 기존 bed instance 찾기
        const existingBed = existingStatic.beds.instances.find(
          (bed) => bed.id === bedObj.id
        );

        return {
          id: bedObj.id,
          position: bedObj.position || existingBed?.position || { x: 0, y: 0, z: 0 },
          dimensions: {
            width: bedObj.dimensions.width,
            height: bedObj.dimensions.height,
            length: bedObj.dimensions.length,
          },
          rotation: bedObj.rotation || existingBed?.rotation || { x: 0, y: 0, z: 0 },
          cropType: existingBed?.cropType,
          plantDate: existingBed?.plantDate,
        };
      }),
    };
  }

  // Zone objects에서 boundaries 동기화
  const zoneObjects = Array.from(hierarchical.objects.values()).filter(
    (obj) => obj.type === 'zone'
  ) as ZoneObject[];

  if (zoneObjects.length > 0) {
    updatedStatic.zones = zoneObjects.map((zoneObj) => {
      const existingZone = existingStatic.zones.find((z) => z.id === zoneObj.id);

      return {
        id: zoneObj.id,
        name: zoneObj.name,
        type: existingZone?.type || 'work',
        boundaries: zoneObj.points || existingZone?.boundaries || [],
        height: existingZone?.height || 2.5,
        color: zoneObj.color || existingZone?.color || '#00ff00',
        opacity: existingZone?.opacity || 0.3,
      };
    });
  }

  // Sensor objects에서 position 동기화
  const sensorObjects = Array.from(hierarchical.objects.values()).filter(
    (obj) => obj.type === 'sensor'
  ) as SensorObject[];

  if (sensorObjects.length > 0) {
    updatedStatic.sensors = sensorObjects.map((sensorObj) => {
      const existingSensor = existingStatic.sensors.find((s) => s.id === sensorObj.id);

      return {
        id: sensorObj.id,
        type: existingSensor?.type || 'camera',
        model: existingSensor?.model || 'Unknown',
        position: sensorObj.position || existingSensor?.position || { x: 0, y: 0, z: 0 },
        orientation: existingSensor?.orientation,
        range: existingSensor?.range,
      };
    });
  }

  return updatedStatic;
}

/**
 * Helper: Vec3 객체가 유효한지 확인
 */
function isValidVec3(vec: any): vec is Vec3 {
  return (
    vec &&
    typeof vec.x === 'number' &&
    typeof vec.y === 'number' &&
    typeof vec.z === 'number'
  );
}
