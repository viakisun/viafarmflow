/**
 * Scene Elements Hook
 * Scene Elements 상태 관리
 */

import { useState, useCallback } from 'react';
import type { SceneElementsData } from '../types/core/scene';
import { DEFAULT_SCENE_ELEMENTS } from '../types/core/scene';

export function useSceneElements(initialData?: Partial<SceneElementsData>) {
  const [sceneElements, setSceneElements] = useState<SceneElementsData>({
    ...DEFAULT_SCENE_ELEMENTS,
    ...initialData,
  });

  const updateSceneElements = useCallback((updates: Partial<SceneElementsData>) => {
    setSceneElements((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const toggleGrid = useCallback(() => {
    setSceneElements((prev) => ({
      ...prev,
      grid: {
        ...prev.grid,
        enabled: !prev.grid.enabled,
      },
    }));
  }, []);

  const toggleAxes = useCallback(() => {
    setSceneElements((prev) => ({
      ...prev,
      coordinateAxes: {
        ...prev.coordinateAxes,
        enabled: !prev.coordinateAxes.enabled,
      },
    }));
  }, []);

  const toggleLight = useCallback((type: 'ambient' | 'directional' | 'hemisphere') => {
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

  return {
    sceneElements,
    updateSceneElements,
    toggleGrid,
    toggleAxes,
    toggleLight,
  };
}
