import type { StaticMapData, BedInstance } from '../types/staticMapData';
import type { DynamicRobotData, RobotState } from '../types/dynamicRobotData';
import type { HierarchicalMapData } from '../types/mapData';
import type { Robot } from '../types/greenhouse';
import { generateBedInstances } from './bedLayoutGenerator';

/**
 * HierarchicalMapData를 StaticMapData + DynamicRobotData로 변환
 */
export function convertHierarchicalToSeparated(
  hierarchical: HierarchicalMapData
): { staticMap: StaticMapData; robotData: DynamicRobotData } {
  // 정적 맵 데이터 생성
  const staticMap: StaticMapData = {
    version: '2.0.0',
    metadata: {
      id: hierarchical.root.id,
      name: hierarchical.name || 'Greenhouse Map',
      created: new Date().toISOString(),
      modified: hierarchical.metadata?.lastModified || new Date().toISOString(),
      author: 'ViaFarm'
    },
    greenhouse: {
      dimensions: {
        x: hierarchical.root.config.dimensions.width,
        y: hierarchical.root.config.dimensions.height,
        z: hierarchical.root.config.dimensions.length
      },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    },
    beds: {
      specification: {
        width: hierarchical.root.config.beds.width,
        height: hierarchical.root.config.beds.height,
        defaultLength: hierarchical.root.config.beds.length
      },
      layout: {
        type: 'array',
        startPosition: { x: -18, y: 3, z: -40 },
        count: hierarchical.root.config.beds.count,
        spacing: hierarchical.root.config.beds.spacing,
        direction: 'x',
        rows: 2,
        rowSpacing: 4
      },
      instances: [] // 자동 생성됨
    },
    zones: [],
    sensors: []
  };

  // 베드 인스턴스 자동 생성
  staticMap.beds.instances = generateBedInstances(
    staticMap.beds.specification,
    staticMap.beds.layout
  );

  // Zone 객체 추출
  Array.from(hierarchical.objects.values())
    .filter(obj => obj.type === 'zone')
    .forEach(zoneObj => {
      // Zone 타입 변환은 추후 구현
    });

  // 동적 로봇 데이터 생성
  const robots: RobotState[] = Array.from(hierarchical.objects.values())
    .filter(obj => obj.type === 'robot')
    .map(robotObj => {
      const metadata = robotObj.metadata as any;
      return {
        id: robotObj.id,
        name: robotObj.name,
        model: metadata?.model || 'VF-H100',
        position: metadata?.position || { x: 0, y: 0, z: 0 },
        rotation: metadata?.rotation || { x: 0, y: 0, z: 0 },
        status: (metadata?.status || 'idle') as any,
        battery: metadata?.battery || 100,
        speed: 0
      };
    });

  const robotData: DynamicRobotData = {
    timestamp: new Date().toISOString(),
    robots,
    waypoints: [],
    paths: []
  };

  return { staticMap, robotData };
}

/**
 * 레거시 Robot 배열을 DynamicRobotData로 변환
 */
export function convertLegacyRobotsToDynamic(robots: Robot[]): DynamicRobotData {
  const robotStates: RobotState[] = robots.map(robot => ({
    id: robot.id,
    name: robot.name,
    model: robot.model || 'VF-H100',
    position: robot.position,
    rotation: { x: 0, y: robot.rotation, z: 0 },
    status: robot.status,
    battery: 100,
    speed: 0
  }));

  return {
    timestamp: new Date().toISOString(),
    robots: robotStates,
    waypoints: [],
    paths: []
  };
}

/**
 * DynamicRobotData를 레거시 Robot 배열로 변환
 */
export function convertDynamicToLegacyRobots(robotData: DynamicRobotData): Robot[] {
  return robotData.robots.map(robot => ({
    id: robot.id,
    name: robot.name,
    model: robot.model,
    position: robot.position,
    rotation: robot.rotation.y,
    status: robot.status
  }));
}

/**
 * StaticMapData 검증
 */
export function validateStaticMapData(data: any): data is StaticMapData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.version === 'string' &&
    typeof data.metadata === 'object' &&
    typeof data.greenhouse === 'object' &&
    typeof data.beds === 'object' &&
    Array.isArray(data.zones) &&
    Array.isArray(data.sensors)
  );
}

/**
 * DynamicRobotData 검증
 */
export function validateDynamicRobotData(data: any): data is DynamicRobotData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.timestamp === 'string' &&
    Array.isArray(data.robots) &&
    Array.isArray(data.waypoints) &&
    Array.isArray(data.paths)
  );
}
