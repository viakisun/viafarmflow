/**
 * Scene Elements → Hierarchy 동기화
 */

import type { SceneElementsData } from '../types/core/scene';
import type {
  GroupObject,
  GridObject,
  LightingObject,
  AxesObject,
  MapObject,
} from '../types/core/hierarchy';

export function syncSceneElementsToHierarchy(
  sceneData: SceneElementsData,
  parentId: string = 'root'
): {
  group: GroupObject;
  objects: Map<string, MapObject>;
} {
  const objects = new Map<string, MapObject>();
  const groupId = 'scene-elements';

  // Scene Elements Group
  const group: GroupObject = {
    id: groupId,
    type: 'group',
    groupType: 'scene',
    name: 'Scene Elements',
    parentId,
    children: [],
    visible: true,
    locked: false,
  };
  objects.set(groupId, group);

  // Grid Object
  if (sceneData.grid) {
    const gridId = 'scene-grid';
    const gridObj: GridObject = {
      id: gridId,
      type: 'grid',
      name: 'Grid',
      parentId: groupId,
      children: [],
      visible: sceneData.grid.enabled,
      locked: false,
      size: sceneData.grid.size,
      divisions: sceneData.grid.divisions,
    };
    group.children.push(gridId);
    objects.set(gridId, gridObj);
  }

  // Lighting Objects
  if (sceneData.lighting) {
    const lightingGroupId = 'scene-lighting-group';
    const lightingGroup: GroupObject = {
      id: lightingGroupId,
      type: 'group',
      groupType: 'scene',
      name: 'Lighting',
      parentId: groupId,
      children: [],
      visible: true,
      locked: false,
    };
    group.children.push(lightingGroupId);
    objects.set(lightingGroupId, lightingGroup);

    // Ambient Light
    const ambientId = 'scene-light-ambient';
    const ambientObj: LightingObject = {
      id: ambientId,
      type: 'lighting',
      lightType: 'ambient',
      name: 'Ambient Light',
      parentId: lightingGroupId,
      children: [],
      visible: sceneData.lighting.ambient.enabled,
      locked: false,
      color: sceneData.lighting.ambient.color,
      intensity: sceneData.lighting.ambient.intensity,
    };
    lightingGroup.children.push(ambientId);
    objects.set(ambientId, ambientObj);

    // Directional Light
    const directionalId = 'scene-light-directional';
    const directionalObj: LightingObject = {
      id: directionalId,
      type: 'lighting',
      lightType: 'directional',
      name: 'Directional Light',
      parentId: lightingGroupId,
      children: [],
      visible: sceneData.lighting.directional.enabled,
      locked: false,
      color: sceneData.lighting.directional.color,
      intensity: sceneData.lighting.directional.intensity,
    };
    lightingGroup.children.push(directionalId);
    objects.set(directionalId, directionalObj);

    // Hemisphere Light
    const hemisphereId = 'scene-light-hemisphere';
    const hemisphereObj: LightingObject = {
      id: hemisphereId,
      type: 'lighting',
      lightType: 'hemisphere',
      name: 'Hemisphere Light',
      parentId: lightingGroupId,
      children: [],
      visible: sceneData.lighting.hemisphere.enabled,
      locked: false,
      color: sceneData.lighting.hemisphere.skyColor,
      intensity: sceneData.lighting.hemisphere.intensity,
    };
    lightingGroup.children.push(hemisphereId);
    objects.set(hemisphereId, hemisphereObj);
  }

  // Coordinate Axes
  if (sceneData.coordinateAxes) {
    const axesId = 'scene-axes';
    const axesObj: AxesObject = {
      id: axesId,
      type: 'axes',
      name: 'Coordinate Axes',
      parentId: groupId,
      children: [],
      visible: sceneData.coordinateAxes.enabled,
      locked: false,
      length: sceneData.coordinateAxes.length,
    };
    group.children.push(axesId);
    objects.set(axesId, axesObj);
  }

  return { group, objects };
}
