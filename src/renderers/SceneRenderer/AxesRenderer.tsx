/**
 * Coordinate Axes Renderer
 * X, Y, Z 축 시각화
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import type { CoordinateAxesConfig } from '../../types/core/scene';

interface AxesRendererProps {
  config: CoordinateAxesConfig;
}

export function AxesRenderer({ config }: AxesRendererProps) {
  const geometry = useMemo(() => {
    if (!config.enabled) return null;

    const positions: number[] = [];
    const colors: number[] = [];
    const { length } = config;

    // X축 (빨강)
    positions.push(-length, 0, 0, length, 0, 0);
    colors.push(1, 0, 0, 1, 0, 0);

    // Y축 (초록)
    positions.push(0, -length, 0, 0, length, 0);
    colors.push(0, 1, 0, 0, 1, 0);

    // Z축 (파랑)
    positions.push(0, 0, -length, 0, 0, length);
    colors.push(0, 0, 1, 0, 0, 1);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return geom;
  }, [config.enabled, config.length]);

  if (!config.enabled || !geometry) return null;

  return (
    <lineSegments geometry={geometry} name="coordinate-axes">
      <lineBasicMaterial vertexColors linewidth={2} />
    </lineSegments>
  );
}
