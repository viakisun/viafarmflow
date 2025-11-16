import { useEffect, useRef, useState } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEditor } from '../contexts';

export type TransformMode = 'translate' | 'rotate' | 'scale';

interface TransformableObjectProps {
  children: React.ReactNode;
  objectId: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  enabled?: boolean;
  mode?: TransformMode;
  onTransform?: (position: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3) => void;
  constraints?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
    minZ?: number;
    maxZ?: number;
  };
}

export function TransformableObject({
  children,
  objectId,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  enabled = false,
  mode = 'translate',
  onTransform,
  constraints,
}: TransformableObjectProps) {
  const { camera, gl } = useThree();
  const transformRef = useRef<any>(null);
  const meshRef = useRef<THREE.Group>(null);
  const { selectedObject, updateObject } = useEditor();
  const [isDragging, setIsDragging] = useState(false);

  // Check if this object is selected
  const isSelected = selectedObject?.id === objectId && enabled;

  useEffect(() => {
    if (transformRef.current) {
      const controls = transformRef.current;

      const handleChange = () => {
        if (!meshRef.current || !isDragging) return;

        const mesh = meshRef.current;
        const newPosition = mesh.position.clone();
        const newRotation = mesh.rotation.clone();
        const newScale = mesh.scale.clone();

        // Apply constraints if provided
        if (constraints) {
          if (constraints.minX !== undefined) newPosition.x = Math.max(constraints.minX, newPosition.x);
          if (constraints.maxX !== undefined) newPosition.x = Math.min(constraints.maxX, newPosition.x);
          if (constraints.minY !== undefined) newPosition.y = Math.max(constraints.minY, newPosition.y);
          if (constraints.maxY !== undefined) newPosition.y = Math.min(constraints.maxY, newPosition.y);
          if (constraints.minZ !== undefined) newPosition.z = Math.max(constraints.minZ, newPosition.z);
          if (constraints.maxZ !== undefined) newPosition.z = Math.min(constraints.maxZ, newPosition.z);

          mesh.position.copy(newPosition);
        }

        // Callback for external handling
        if (onTransform) {
          onTransform(newPosition, newRotation, newScale);
        }

        // Update in context
        if (mode === 'translate') {
          updateObject(objectId, {
            position: { x: newPosition.x, y: newPosition.y, z: newPosition.z }
          } as any);
        } else if (mode === 'rotate') {
          // Convert Euler rotation to degrees for the rotation field
          const rotationDegrees = newRotation.y * (180 / Math.PI);
          updateObject(objectId, {
            rotation: rotationDegrees
          } as any);
        }
      };

      const handleMouseDown = () => {
        setIsDragging(true);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        handleChange();
      };

      controls.addEventListener('change', handleChange);
      controls.addEventListener('mouseDown', handleMouseDown);
      controls.addEventListener('mouseUp', handleMouseUp);

      return () => {
        controls.removeEventListener('change', handleChange);
        controls.removeEventListener('mouseDown', handleMouseDown);
        controls.removeEventListener('mouseUp', handleMouseUp);
      };
    }
  }, [objectId, mode, onTransform, constraints, updateObject, isDragging]);

  return (
    <>
      <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
        {children}
      </group>
      {isSelected && (
        <TransformControls
          ref={transformRef}
          object={meshRef.current}
          mode={mode}
          enabled={isSelected}
          showX={true}
          showY={mode === 'translate'}
          showZ={true}
          size={0.5}
        />
      )}
    </>
  );
}