import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { Greenhouse } from "./Greenhouse";
import { HangingBeds } from "./HangingBeds";
import { Robots } from "./Robot/Robots";
import { Waypoints } from "./Waypoint/Waypoints";
import { WorkZones } from "./Zone/WorkZones";
import { InteractiveFloor } from "./InteractiveFloor";
import { PathEditor } from "./PathEditor";
import { ZoneEditor } from "./Zone/ZoneEditor";
import { useEditor } from "../contexts";
import { COLORS } from "../constants/materials";
import { CAMERA_CONFIG, LIGHTING_CONFIG, GRID_CONFIG } from "../constants/defaults";

export function Scene() {
  const { config, editorState } = useEditor();
  const { showGrid } = editorState;

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
        background: `#${COLORS.background.toString(16).padStart(6, "0")}`,
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

      {/* 그리드 */}
      {showGrid && (
        <Grid
          args={[GRID_CONFIG.size, GRID_CONFIG.divisions]}
          cellColor={COLORS.grid.minor}
          sectionColor={COLORS.grid.major}
          fadeDistance={300}
          fadeStrength={1}
        />
      )}

      {/* 온실 구조 */}
      <Greenhouse dimensions={config.dimensions} />

      {/* 행잉 베드 */}
      <HangingBeds config={config.beds} />

      {/* 작업 영역 */}
      <WorkZones />

      {/* 로봇들 */}
      <Robots />

      {/* 웨이포인트와 경로 */}
      <Waypoints />

      {/* 인터랙티브 바닥 (로봇 추가용) */}
      <InteractiveFloor />

      {/* 경로 편집기 */}
      <PathEditor />

      {/* 구역 편집기 */}
      <ZoneEditor />

      {/* 카메라 컨트롤 */}
      <OrbitControls
        minDistance={CAMERA_CONFIG.controls.minDistance}
        maxDistance={CAMERA_CONFIG.controls.maxDistance}
        enableDamping={CAMERA_CONFIG.controls.enableDamping}
        dampingFactor={CAMERA_CONFIG.controls.dampingFactor}
        target={[0, 2, 0]}
      />
    </Canvas>
  );
}
