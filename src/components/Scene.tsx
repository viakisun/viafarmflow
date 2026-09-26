import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Greenhouse } from "./Greenhouse";
import { HangingBeds } from "./HangingBeds";
import { Robots } from "./Robot/Robots";
import { Waypoints } from "./Waypoint/Waypoints";
import { WorkZones } from "./Zone/WorkZones";
import { InteractiveFloor } from "./InteractiveFloor";
import { PathEditor } from "./PathEditor";
import { ZoneEditor } from "./Zone/ZoneEditor";
import { CustomGrid } from "./CustomGrid";
import { useEditor } from "../contexts";
import { COLORS } from "../constants/materials";
import { CAMERA_CONFIG, LIGHTING_CONFIG, GRID_CONFIG } from "../constants/defaults";

/**
 * Scene Component - 3D 뷰포트
 *
 * 좌표계:
 * - X축: 좌우 (Width)
 * - Y축: 전후 (Length/Depth)
 * - Z축: 높이 (Height)
 * - 바닥/그리드: XY 평면 (Z=0)
 */

export function Scene() {
  const { config, editorState } = useEditor();
  const { showGrid, visibility } = editorState;

  // Debug: Grid 설정 확인
  const gridSize = Math.max(config.grid.size.x, config.grid.size.y);
  const gridDivisions = gridSize / config.grid.cellSize;
  console.log('[Scene] Grid Config:', {
    sizeX: config.grid.size.x,
    sizeY: config.grid.size.y,
    cellSize: config.grid.cellSize,
    calculatedSize: gridSize,
    calculatedDivisions: gridDivisions,
  });

  return (
    <Canvas
      camera={{
        fov: CAMERA_CONFIG.fov,
        near: CAMERA_CONFIG.near,
        far: CAMERA_CONFIG.far,
        position: [
          CAMERA_CONFIG.initialPosition.x,
          CAMERA_CONFIG.initialPosition.y,
          CAMERA_CONFIG.initialPosition.z,
        ],
      }}
      shadows
      style={{
        background: "#ffffff",
      }}
    >
      {/* 조명 */}
      <ambientLight
        color={LIGHTING_CONFIG.ambient.color}
        intensity={LIGHTING_CONFIG.ambient.intensity}
      />
      <directionalLight
        color={LIGHTING_CONFIG.directional.color}
        intensity={LIGHTING_CONFIG.directional.intensity}
        position={[
          LIGHTING_CONFIG.directional.position.x,
          LIGHTING_CONFIG.directional.position.y,
          LIGHTING_CONFIG.directional.position.z,
        ]}
        castShadow
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-camera-near={0.1}
        shadow-camera-far={200}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight
        color={LIGHTING_CONFIG.hemisphere.skyColor}
        groundColor={LIGHTING_CONFIG.hemisphere.groundColor}
        intensity={LIGHTING_CONFIG.hemisphere.intensity}
      />

      {/* 그리드 (XY 평면, Z=0) - X축으로 90도 회전하여 XY 평면에 배치 */}
      {showGrid && visibility.xyPlane && (
        <CustomGrid
          size={gridSize}
          divisions={gridDivisions}
          colorCenterLine={0x444444}
          colorGrid={0x888888}
        />
      )}

      {/* XYZ 좌표축 */}
      {visibility.axes && (
        <group position={[0, 0, 0]}>
          {/* 원점 구체 */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>

          {/* X축 라인 (빨강) - 좌우 방향: -100 ~ +100 */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 200, 8]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
          </mesh>
          {/* X축 화살표 (양쪽) */}
          <group position={[100, 0, 0]}>
            <mesh rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.5, 2, 8]} />
              <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
            </mesh>
          </group>
          <group position={[-100, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.5, 2, 8]} />
              <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
            </mesh>
          </group>

          {/* Y축 라인 (초록) - 전후 방향: -100 ~ +100 */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 200, 8]} />
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.3} />
          </mesh>
          {/* Y축 화살표 (양쪽) */}
          <group position={[0, 100, 0]}>
            <mesh rotation={[0, 0, 0]}>
              <coneGeometry args={[0.5, 2, 8]} />
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
            </mesh>
          </group>
          <group position={[0, -100, 0]}>
            <mesh rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.5, 2, 8]} />
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
            </mesh>
          </group>

          {/* Z축 라인 (파랑) - 수직 방향: -100 ~ +100 */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 200, 8]} />
            <meshStandardMaterial color="#0000ff" emissive="#0000ff" emissiveIntensity={0.3} />
          </mesh>
          {/* Z축 화살표 (양쪽) */}
          <group position={[0, 0, 100]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.5, 2, 8]} />
              <meshStandardMaterial color="#0000ff" emissive="#0000ff" emissiveIntensity={0.5} />
            </mesh>
          </group>
          <group position={[0, 0, -100]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.5, 2, 8]} />
              <meshStandardMaterial color="#0000ff" emissive="#0000ff" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </group>
      )}

      {/* 온실 구조 - 위치: (0,0) ~ (width, length) */}
      {visibility.greenhouse.enabled && (
        <Greenhouse
          dimensions={config.dimensions}
          visibility={visibility.greenhouse}
        />
      )}

      {/* 행잉 베드 */}
      {visibility.beds.enabled && (
        <HangingBeds config={config.beds} visibility={visibility.beds} />
      )}

      {/* 작업 영역 */}
      {visibility.zones && <WorkZones />}

      {/* 로봇들 */}
      {visibility.robots && <Robots />}

      {/* 웨이포인트와 경로 */}
      {visibility.paths && <Waypoints />}

      {/* 인터랙티브 바닥 (로봇 추가용) */}
      <InteractiveFloor />

      {/* 경로 편집기 */}
      <PathEditor />

      {/* 구역 편집기 */}
      <ZoneEditor />

      {/* 카메라 컨트롤 - 온실 중심을 바라봄 */}
      <OrbitControls
        makeDefault
        minDistance={CAMERA_CONFIG.controls.minDistance}
        maxDistance={CAMERA_CONFIG.controls.maxDistance}
        enableDamping={CAMERA_CONFIG.controls.enableDamping}
        dampingFactor={CAMERA_CONFIG.controls.dampingFactor}
        target={[config.dimensions.width / 2, config.dimensions.length / 2, config.dimensions.height / 2]}
      />
    </Canvas>
  );
}
