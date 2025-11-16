import { useRef, useEffect } from 'react';
import { Box3, Vector3, BufferGeometry, LineBasicMaterial, EdgesGeometry, BoxGeometry } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SelectionOutlineProps {
  target: React.MutableRefObject<THREE.Object3D | undefined>;
  color?: string;
  linewidth?: number;
  animate?: boolean;
}

export function SelectionOutline({
  target,
  color = '#00ff00',
  linewidth = 2,
  animate = true
}: SelectionOutlineProps) {
  const outlineRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<LineBasicMaterial>(null);
  const geometryRef = useRef<BufferGeometry | null>(null);
  const timeRef = useRef(0);

  // Update outline geometry when target changes
  useEffect(() => {
    if (!target.current || !outlineRef.current) return;

    // Calculate bounding box
    const box = new Box3();
    box.setFromObject(target.current);

    // Create box geometry from bounds
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Create edges geometry for outline
    const boxGeometry = new BoxGeometry(size.x, size.y, size.z);
    const edgesGeometry = new EdgesGeometry(boxGeometry);

    // Clean up old geometry
    if (geometryRef.current) {
      geometryRef.current.dispose();
    }

    geometryRef.current = edgesGeometry;
    outlineRef.current.geometry = edgesGeometry;
    outlineRef.current.position.copy(center);
  }, [target.current]);

  // Animate the outline
  useFrame((state, delta) => {
    if (!animate || !materialRef.current) return;

    timeRef.current += delta;
    const opacity = 0.5 + Math.sin(timeRef.current * 3) * 0.3;
    materialRef.current.opacity = opacity;
  });

  if (!target.current) return null;

  return (
    <lineSegments ref={outlineRef} renderOrder={1000}>
      <lineBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.8}
        depthTest={false}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// Hover outline component with different style
export function HoverOutline({
  target,
  color = '#ffff00',
  linewidth = 1
}: SelectionOutlineProps) {
  return (
    <SelectionOutline
      target={target}
      color={color}
      linewidth={linewidth}
      animate={false}
    />
  );
}