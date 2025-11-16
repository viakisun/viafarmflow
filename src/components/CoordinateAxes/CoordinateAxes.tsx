import { useMemo } from 'react';
import * as THREE from 'three';

interface CoordinateAxesProps {
  visible?: boolean;
  length?: number;
}

/**
 * 무한대처럼 보이는 좌표축 컴포넌트
 * X축: 빨강, Y축: 초록, Z축: 파랑
 */
export function CoordinateAxes({ visible = true, length = 1000 }: CoordinateAxesProps) {
  const axesGeometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    // X축 (빨강)
    positions.push(-length, 0, 0, length, 0, 0);
    colors.push(1, 0, 0, 1, 0, 0);

    // Y축 (초록)
    positions.push(0, -length, 0, 0, length, 0);
    colors.push(0, 1, 0, 0, 1, 0);

    // Z축 (파랑)
    positions.push(0, 0, -length, 0, 0, length);
    colors.push(0, 0, 1, 0, 0, 1);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return geometry;
  }, [length]);

  if (!visible) return null;

  return (
    <group name="coordinate-axes">
      <lineSegments geometry={axesGeometry}>
        <lineBasicMaterial vertexColors linewidth={2} />
      </lineSegments>
    </group>
  );
}
