/**
 * CustomGrid - Custom Grid Helper Component
 * Three.js GridHelper를 직접 사용하여 정확한 격자를 표시
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

interface CustomGridProps {
  size: number;      // 전체 그리드 크기 (m)
  divisions: number; // 격자 분할 수
  colorCenterLine?: number;
  colorGrid?: number;
}

export function CustomGrid({
  size,
  divisions,
  colorCenterLine = 0x444444,
  colorGrid = 0x888888
}: CustomGridProps) {
  const { scene } = useThree();
  const gridRef = useRef<THREE.GridHelper | null>(null);

  useEffect(() => {
    // GridHelper 생성
    // GridHelper(size, divisions, colorCenterLine, colorGrid)
    const gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);

    // XY 평면에 그리드를 표시하기 위해 90도 회전
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(0, 0, 0);

    // Scene에 추가
    scene.add(gridHelper);
    gridRef.current = gridHelper;

    // Cleanup
    return () => {
      if (gridRef.current) {
        scene.remove(gridRef.current);
        gridRef.current.geometry.dispose();
        (gridRef.current.material as THREE.Material).dispose();
      }
    };
  }, [scene, size, divisions, colorCenterLine, colorGrid]);

  return null;
}
