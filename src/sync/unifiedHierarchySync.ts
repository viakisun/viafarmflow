/**
 * 통합 Hierarchy 동기화
 * Static, Dynamic, Scene Elements를 하나의 Hierarchy로 통합
 */

import type { StaticMapData } from '../types/staticMapData';
import type { DynamicRobotData } from '../types/dynamicRobotData';
import type { Robot, Waypoint } from '../types/greenhouse';
import type { SceneElementsData } from '../types/core/scene';
import type { HierarchicalMapData, GroupObject, MapObject } from '../types/core/hierarchy';
import { syncSceneElementsToHierarchy } from './sceneToHierarchy';
import { syncStaticToHierarchical } from '../utils/staticToHierarchicalSync';
import { syncDynamicToHierarchy } from './dynamicToHierarchy';
import { syncLegacyToHierarchy } from './legacyToHierarchy';

/**
 * Root Group 생성
 */
function createRootGroup(): GroupObject {
  return {
    id: 'root',
    type: 'group',
    groupType: 'static',
    name: 'ViaFarmFlow Scene',
    parentId: null,
    children: [],
    visible: true,
    locked: false,
  };
}

/**
 * Static, Dynamic, Scene을 통합 Hierarchy로 변환
 */
export function syncToUnifiedHierarchy(
  staticData: StaticMapData | null,
  dynamicData: DynamicRobotData | null,
  sceneData: SceneElementsData,
  existingHierarchy?: HierarchicalMapData,
  legacyRobots?: Robot[],
  legacyWaypoints?: Waypoint[]
): HierarchicalMapData {
  const objects = new Map<string, MapObject>();
  const root = createRootGroup();
  objects.set('root', root);

  const defaultExpandedNodes: string[] = ['root'];

  // 1. Static Objects Group (Greenhouse, Beds, Zones, Sensors)
  if (staticData) {
    const staticResult = syncStaticToHierarchical(staticData, existingHierarchy);

    // Static root를 루트의 자식으로 추가
    const greenhouseId = 'greenhouse-main';
    root.children.push(greenhouseId);

    // Static objects를 unified hierarchy에 병합
    staticResult.objects.forEach((obj, id) => {
      // Static root의 parentId를 'root'로 변경
      if (id === greenhouseId) {
        objects.set(id, { ...obj, parentId: 'root' });
      } else {
        objects.set(id, obj);
      }
    });

    // Static의 기본 확장 노드 추가
    defaultExpandedNodes.push(
      greenhouseId,
      'beds-group',
      'zones-group',
      'sensors-group'
    );
  }

  // 2. Dynamic Objects Group (Robots, Waypoints, Paths)
  // DynamicRobotData가 있으면 사용, 없으면 legacy data 사용
  if (dynamicData) {
    const dynamicResult = syncDynamicToHierarchy(dynamicData, 'root');
    root.children.push(dynamicResult.group.id);

    // Dynamic objects를 unified hierarchy에 병합
    objects.set(dynamicResult.group.id, dynamicResult.group);
    dynamicResult.objects.forEach((obj, id) => {
      objects.set(id, obj);
    });

    // Dynamic의 기본 확장 노드 추가
    defaultExpandedNodes.push(
      'dynamic-elements',
      'robots-group',
      'waypoints-group',
      'paths-group'
    );
  } else if (legacyRobots || legacyWaypoints) {
    // Legacy robot/waypoint data를 hierarchy에 추가
    const legacyResult = syncLegacyToHierarchy(
      legacyRobots || [],
      legacyWaypoints || [],
      'root'
    );
    root.children.push(legacyResult.group.id);

    // Legacy objects를 unified hierarchy에 병합
    objects.set(legacyResult.group.id, legacyResult.group);
    legacyResult.objects.forEach((obj, id) => {
      objects.set(id, obj);
    });

    // Legacy의 기본 확장 노드 추가
    defaultExpandedNodes.push(
      'dynamic-elements',
      'robots-group',
      'waypoints-group',
      'paths-group'
    );
  }

  // 3. Scene Elements Group (Grid, Lighting, Axes)
  const sceneResult = syncSceneElementsToHierarchy(sceneData, 'root');
  root.children.push(sceneResult.group.id);
  objects.set(sceneResult.group.id, sceneResult.group);
  sceneResult.objects.forEach((obj, id) => {
    objects.set(id, obj);
  });

  // Scene Elements의 기본 확장 노드 추가
  defaultExpandedNodes.push('scene-elements', 'scene-lighting-group');

  return {
    version: staticData?.version || '1.0.0',
    name: staticData?.metadata.name || 'Unnamed Scene',
    description: staticData?.metadata?.description,
    createdAt: staticData?.metadata.created || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: staticData?.metadata.author,
    root,
    objects,
    selection: existingHierarchy?.selection || {
      primary: null,
      secondary: [],
    },
    viewSettings: {
      expandedNodes: defaultExpandedNodes,
      hiddenObjects: existingHierarchy?.viewSettings.hiddenObjects || [],
      lockedLayers: existingHierarchy?.viewSettings.lockedLayers || [],
    },
  };
}
