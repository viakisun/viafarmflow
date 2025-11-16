/**
 * Grid Renderer
 * 3D 그리드 시각화
 */

import { Grid } from '@react-three/drei';
import type { GridConfig } from '../../types/core/scene';

interface GridRendererProps {
  config: GridConfig;
  minorColor?: string;
  majorColor?: string;
}

export function GridRenderer({
  config,
  minorColor = '#888888',
  majorColor = '#444444',
}: GridRendererProps) {
  if (!config.enabled) return null;

  return (
    <Grid
      args={[config.size, config.divisions]}
      cellColor={minorColor}
      sectionColor={majorColor}
      fadeDistance={config.fadeDistance}
      fadeStrength={config.fadeStrength}
    />
  );
}
