import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useEditor } from '../contexts/EditorContext';
import type { Vec3 } from '../types/staticMapData';

const CLOSE_THRESHOLD = 2; // Distance to first point to close polygon
const MIN_POINTS = 3; // Minimum points to form a valid polygon

export function FloorEditor() {
  const { editorState, staticMapData, updateStaticMapData } = useEditor();
  const { mode } = editorState;

  const [drawingPoints, setDrawingPoints] = useState<Vec3[]>([]);
  const [previewPoint, setPreviewPoint] = useState<Vec3 | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // ESC 키로 그리기 취소
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawingPoints([]);
        setPreviewPoint(null);
        setIsDrawing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // floor 모드가 아니면 렌더링하지 않음
  if (mode !== 'floor') return null;

  const handleClick = (e: THREE.Intersection) => {
    const point = e.point;
    const newPoint: Vec3 = {
      x: Math.round(point.x * 10) / 10, // 0.1m 단위로 스냅
      y: 0,
      z: Math.round(point.z * 10) / 10,
    };

    if (drawingPoints.length === 0) {
      // 첫 번째 점
      setDrawingPoints([newPoint]);
      setIsDrawing(true);
    } else {
      // 첫 번째 점 근처 클릭 시 폴리곤 닫기
      const firstPoint = drawingPoints[0];
      const distance = Math.sqrt(
        Math.pow(newPoint.x - firstPoint.x, 2) + Math.pow(newPoint.z - firstPoint.z, 2)
      );

      if (distance < CLOSE_THRESHOLD && drawingPoints.length >= MIN_POINTS) {
        // 폴리곤 완성
        completeFloorBoundary(drawingPoints);
        setDrawingPoints([]);
        setPreviewPoint(null);
        setIsDrawing(false);
      } else {
        // 점 추가
        setDrawingPoints([...drawingPoints, newPoint]);
      }
    }
  };

  const handlePointerMove = (e: THREE.Intersection) => {
    if (isDrawing) {
      const point = e.point;
      setPreviewPoint({
        x: Math.round(point.x * 10) / 10,
        y: 0,
        z: Math.round(point.z * 10) / 10,
      });
    }
  };

  const handlePointerLeave = () => {
    setPreviewPoint(null);
  };

  const completeFloorBoundary = (points: Vec3[]) => {
    if (!staticMapData) return;

    // StaticMapData 업데이트
    const updatedData = {
      ...staticMapData,
      greenhouse: {
        ...staticMapData.greenhouse,
        floorBoundaries: points,
      },
    };

    updateStaticMapData(updatedData);
  };

  // 그리드 클릭 가능한 평면 (매우 큰 크기)
  const gridSize = 1000;

  return (
    <group name="floor-editor">
      {/* 클릭 가능한 그라운드 평면 */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.01, 0]}
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          handlePointerMove(e);
        }}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[gridSize, gridSize]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 그려진 점들 */}
      {drawingPoints.map((point, index) => (
        <group key={index} position={[point.x, 0.1, point.z]}>
          {/* 점 마커 */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>

          {/* 첫 번째 점에는 완료 링 표시 */}
          {index === 0 && drawingPoints.length >= MIN_POINTS && (
            <mesh rotation-x={-Math.PI / 2}>
              <ringGeometry args={[CLOSE_THRESHOLD - 0.2, CLOSE_THRESHOLD, 32]} />
              <meshBasicMaterial color="#00ff00" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      ))}

      {/* 그려진 라인 */}
      {drawingPoints.length > 1 && (
        <Line
          points={drawingPoints.map((p) => [p.x, 0.1, p.z])}
          color="#00ff00"
          lineWidth={2}
        />
      )}

      {/* 미리보기 라인 (마지막 점 → 마우스 커서) */}
      {isDrawing && previewPoint && drawingPoints.length > 0 && (
        <Line
          points={[
            [drawingPoints[drawingPoints.length - 1].x, 0.1, drawingPoints[drawingPoints.length - 1].z],
            [previewPoint.x, 0.1, previewPoint.z],
          ]}
          color="#00ff00"
          lineWidth={1}
          dashed
          dashSize={0.5}
          gapSize={0.3}
        />
      )}

      {/* 미리보기 점 */}
      {isDrawing && previewPoint && (
        <mesh position={[previewPoint.x, 0.1, previewPoint.z]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
