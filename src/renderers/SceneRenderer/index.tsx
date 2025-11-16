/**
 * Scene Elements Renderer
 * Grid, Lighting, Axes 통합 렌더러
 */

import type { SceneElementsData } from '../../types/core/scene';
import { GridRenderer } from './GridRenderer';
import { LightingRenderer } from './LightingRenderer';
import { AxesRenderer } from './AxesRenderer';

interface SceneRendererProps {
  sceneData: SceneElementsData;
}

export function SceneRenderer({ sceneData }: SceneRendererProps) {
  return (
    <>
      {/* Lighting - 항상 먼저 렌더링 */}
      <LightingRenderer config={sceneData.lighting} />

      {/* Grid */}
      <GridRenderer config={sceneData.grid} />

      {/* Coordinate Axes */}
      <AxesRenderer config={sceneData.coordinateAxes} />
    </>
  );
}

export { GridRenderer, LightingRenderer, AxesRenderer };
