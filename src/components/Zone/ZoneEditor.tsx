import { useState, useEffect, useMemo } from "react";
import { Vector3 } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import { useEditor } from "../../contexts";
import type { WorkZone, RobotPosition } from "../../types/greenhouse";

export function ZoneEditor() {
  const { editorState, addZone, config } = useEditor();
  const { mode } = editorState;
  const [drawingPoints, setDrawingPoints] = useState<RobotPosition[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewPoint, setPreviewPoint] = useState<Vector3 | null>(null);

  // ESC 키로 그리기 취소
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawing) {
        setIsDrawing(false);
        setDrawingPoints([]);
        setPreviewPoint(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawing]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (mode !== "zone") return;

    event.stopPropagation();
    const point = event.point;

    // 온실 경계 내에 있는지 확인
    const bounds = {
      x: config.dimensions.width / 2,
      z: config.dimensions.length / 2,
    };

    if (Math.abs(point.x) <= bounds.x && Math.abs(point.z) <= bounds.z) {
      const newPoint: RobotPosition = {
        x: point.x,
        y: 0,
        z: point.z,
      };

      if (!isDrawing) {
        // 그리기 시작
        setIsDrawing(true);
        setDrawingPoints([newPoint]);
      } else {
        // 포인트 추가
        const updatedPoints = [...drawingPoints, newPoint];

        // 첫 번째 점 근처를 클릭하면 폐곡선 완성
        if (drawingPoints.length >= 3) {
          const firstPoint = drawingPoints[0];
          const distance = Math.sqrt(
            Math.pow(point.x - firstPoint.x, 2) + Math.pow(point.z - firstPoint.z, 2),
          );

          if (distance < 2) {
            // 구역 생성
            const newZone: WorkZone = {
              id: `zone-${Date.now()}`,
              name: `구역 ${Date.now() % 1000}`,
              color: "#" + Math.floor(Math.random() * 16777215).toString(16),
              points: drawingPoints,
              assignedRobotIds: [],
            };

            addZone(newZone);
            setIsDrawing(false);
            setDrawingPoints([]);
            setPreviewPoint(null);
            return;
          }
        }

        setDrawingPoints(updatedPoints);
      }
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (mode !== "zone") {
      setPreviewPoint(null);
      return;
    }

    event.stopPropagation();
    const point = event.point;

    const bounds = {
      x: config.dimensions.width / 2,
      z: config.dimensions.length / 2,
    };

    if (Math.abs(point.x) <= bounds.x && Math.abs(point.z) <= bounds.z) {
      setPreviewPoint(new Vector3(point.x, 0.1, point.z));
    } else {
      setPreviewPoint(null);
    }
  };

  const handlePointerLeave = () => {
    setPreviewPoint(null);
  };

  // 그리기 중인 라인 포인트
  const linePoints = useMemo(() => {
    const points = drawingPoints.map((p) => new Vector3(p.x, 0.1, p.z));
    if (previewPoint && isDrawing) {
      points.push(previewPoint);
    }
    return points;
  }, [drawingPoints, previewPoint, isDrawing]);

  if (mode !== "zone") {
    return null;
  }

  return (
    <>
      {/* 클릭 가능한 바닥 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[config.dimensions.width, config.dimensions.length]} />
        <meshBasicMaterial color={0xff6600} transparent opacity={0.05} visible={mode === "zone"} />
      </mesh>

      {/* 그리기 중인 라인 */}
      {isDrawing && linePoints.length > 1 && (
        <Line
          points={linePoints}
          color="#ff6600"
          lineWidth={3}
          dashed
          dashScale={50}
          dashSize={1}
          gapSize={0.5}
        />
      )}

      {/* 그리기 포인트들 */}
      {drawingPoints.map((point, index) => (
        <group key={index} position={[point.x, 0.1, point.z]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={index === 0 ? "#00ff00" : "#ff6600"}
              emissive={index === 0 ? "#00ff00" : "#ff6600"}
              emissiveIntensity={0.5}
            />
          </mesh>
          {index === 0 && drawingPoints.length >= 3 && (
            <mesh position={[0, 1, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.5, 0.1, 8, 16]} />
              <meshBasicMaterial color="#00ff00" />
            </mesh>
          )}
        </group>
      ))}

      {/* 프리뷰 포인트 */}
      {previewPoint && !isDrawing && (
        <mesh position={previewPoint}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color="#ff6600" opacity={0.5} transparent />
        </mesh>
      )}

      {/* 도움말 */}
      {isDrawing && (
        <group position={[0, 5, -20]}>
          <Text
            fontSize={0.8}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            클릭으로 포인트 추가 | 첫 점 근처 클릭으로 완성 | ESC로 취소
          </Text>
        </group>
      )}
    </>
  );
}
