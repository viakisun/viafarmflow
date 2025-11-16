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
import { JsonRenderer3D } from "./JsonRenderer";
import { SceneRenderer } from "../renderers/SceneRenderer";
import { useEditor } from "../contexts";
import { COLORS } from "../constants/materials";
import { CAMERA_CONFIG } from "../constants/defaults";

export function Scene() {
  const { config, staticMapData, mapData, sceneElements } = useEditor();

  // mapData visibility와 sceneElements 동기화
  const gridVisible = mapData.objects.get('scene-grid')?.visible ?? sceneElements.grid.enabled;
  const axesVisible = mapData.objects.get('scene-axes')?.visible ?? sceneElements.coordinateAxes.enabled;
  const ambientVisible = mapData.objects.get('scene-light-ambient')?.visible ?? sceneElements.lighting.ambient.enabled;
  const directionalVisible = mapData.objects.get('scene-light-directional')?.visible ?? sceneElements.lighting.directional.enabled;
  const hemisphereVisible = mapData.objects.get('scene-light-hemisphere')?.visible ?? sceneElements.lighting.hemisphere.enabled;

  const syncedSceneElements = {
    ...sceneElements,
    grid: { ...sceneElements.grid, enabled: gridVisible },
    coordinateAxes: { ...sceneElements.coordinateAxes, enabled: axesVisible },
    lighting: {
      ...sceneElements.lighting,
      ambient: { ...sceneElements.lighting.ambient, enabled: ambientVisible },
      directional: { ...sceneElements.lighting.directional, enabled: directionalVisible },
      hemisphere: { ...sceneElements.lighting.hemisphere, enabled: hemisphereVisible },
    },
  };

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
      {/* Scene Elements (Grid, Lighting, Axes) */}
      <SceneRenderer sceneData={syncedSceneElements} />

      {/* JSON 기반 렌더링 (staticMapData가 있으면 사용) */}
      {staticMapData ? (
        <JsonRenderer3D staticMapData={staticMapData} mapData={mapData} />
      ) : config ? (
        <>
          {/* 레거시 렌더링 */}
          <Greenhouse dimensions={config.dimensions} />
          <HangingBeds config={config.beds} />
          <WorkZones />
        </>
      ) : null}

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
