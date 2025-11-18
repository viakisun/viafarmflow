import type { StaticMapData } from '../../types/staticMapData';
import type { HierarchicalMapData } from '../../types/mapData';
import { GreenhouseFromJson } from './GreenhouseFromJson';
import { BedsFromJson } from './BedsFromJson';
import { ZonesFromJson } from './ZonesFromJson';

interface JsonRenderer3DProps {
  staticMapData: StaticMapData;
  mapData: HierarchicalMapData;
  onBedClick?: (bedId: string) => void;
  onZoneClick?: (zoneId: string) => void;
  selectedBedId?: string;
  selectedZoneId?: string;
}

/**
 * JSON 데이터를 읽어서 3D 씬을 렌더링하는 메인 컴포넌트
 * 데이터 변경 시 자동으로 리렌더됨
 */
export function JsonRenderer3D({
  staticMapData,
  mapData,
  onBedClick,
  onZoneClick,
  selectedBedId,
  selectedZoneId
}: JsonRenderer3DProps) {
  // mapData에서 visibility 정보 추출
  const greenhouseVisible = mapData.objects.get('greenhouse-main')?.visible ?? true;
  const bedsGroupVisible = mapData.objects.get('beds-group')?.visible ?? true;
  const zonesGroupVisible = mapData.objects.get('zones-group')?.visible ?? true;

  return (
    <group name="json-renderer-3d">
      {/* 온실 구조 */}
      {greenhouseVisible && (
        <GreenhouseFromJson greenhouseData={staticMapData.greenhouse} />
      )}

      {/* 베드 배치 */}
      {bedsGroupVisible && (
        <BedsFromJson
          bedsData={staticMapData.beds}
          mapData={mapData}
          onBedClick={onBedClick}
          selectedBedId={selectedBedId}
        />
      )}

      {/* 작업 구역 */}
      {zonesGroupVisible && (
        <ZonesFromJson
          zones={staticMapData.zones}
          mapData={mapData}
          onZoneClick={onZoneClick}
          selectedZoneId={selectedZoneId}
        />
      )}

      {/* 인프라 (추후 구현) */}
      {/* <InfrastructureFromJson infrastructure={staticMapData.infrastructure} /> */}

      {/* 좌표축은 SceneRenderer에서 렌더링 (중복 제거) */}
    </group>
  );
}
