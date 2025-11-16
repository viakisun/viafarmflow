/**
 * Lighting Renderer
 * 3D 조명 시각화
 */

import type { LightConfig } from '../../types/core/scene';

interface LightingRendererProps {
  config: LightConfig;
}

export function LightingRenderer({ config }: LightingRendererProps) {
  return (
    <group name="lighting">
      {/* Ambient Light */}
      {config.ambient.enabled && (
        <ambientLight
          color={config.ambient.color}
          intensity={config.ambient.intensity}
        />
      )}

      {/* Directional Light */}
      {config.directional.enabled && (
        <directionalLight
          color={config.directional.color}
          intensity={config.directional.intensity}
          position={[
            config.directional.position.x,
            config.directional.position.y,
            config.directional.position.z,
          ]}
          castShadow={config.directional.castShadow}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
          shadow-camera-near={0.1}
          shadow-camera-far={200}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
      )}

      {/* Hemisphere Light */}
      {config.hemisphere.enabled && (
        <hemisphereLight
          color={config.hemisphere.skyColor}
          groundColor={config.hemisphere.groundColor}
          intensity={config.hemisphere.intensity}
        />
      )}
    </group>
  );
}
