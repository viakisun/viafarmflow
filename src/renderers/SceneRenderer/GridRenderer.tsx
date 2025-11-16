/**
 * Grid Renderer
 * 3D 그리드 시각화
 *
 * TODO: Grid 실시간 업데이트 문제 해결 필요
 * - Properties Panel에서 grid 설정 변경 시 3D 뷰에 즉시 반영되지 않음
 * - onChange 이벤트가 발생하지 않거나, React 상태 업데이트가 GridRenderer까지 전달되지 않음
 * - 조사 필요: updateSceneElements -> sceneElements state -> Scene.tsx -> GridRenderer props 흐름 확인
 */

import { Grid } from '@react-three/drei';
import type { GridConfig } from '../../types/core/scene';

interface GridRendererProps {
  config: GridConfig;
  minorColor?: string;
  majorColor?: string;
}

export function GridRenderer({
  config,
  minorColor = '#888888',
  majorColor = '#444444',
}: GridRendererProps) {
  if (!config.enabled) return null;

  // 그리드 파라미터 변경 시 재마운트를 강제하기 위한 key
  // key가 변경되면 React가 기존 컴포넌트를 제거하고 새로 생성함
  const gridKey = `grid-${config.sizeX}-${config.sizeZ}-${config.divisionsX}-${config.divisionsZ}`;

  return (
    <group key={gridKey}>
      <Grid
        args={[config.sizeX, config.sizeZ, config.divisionsX, config.divisionsZ]}
        cellColor={minorColor}
        sectionColor={majorColor}
        fadeDistance={config.fadeDistance}
        fadeStrength={config.fadeStrength}
      />
    </group>
  );
}
