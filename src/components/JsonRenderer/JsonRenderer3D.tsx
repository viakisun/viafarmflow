import type { StaticMapData } from '../../types/staticMapData';
import type { HierarchicalMapData } from '../../types/mapData';
import { GreenhouseFromJson } from './GreenhouseFromJson';
import { BedsFromJson } from './BedsFromJson';
import { ZonesFromJson } from './ZonesFromJson';
import { SensorsFromJson } from './SensorsFromJson';
import { CoordinateAxes } from '../CoordinateAxes';

interface JsonRenderer3DProps {
  staticMapData: StaticMapData;
  mapData: HierarchicalMapData;
  onBedClick?: (bedId: string) => void;
  onZoneClick?: (zoneId: string) => void;
  onSensorClick?: (sensorId: string) => void;
  selectedBedId?: string;
  selectedZoneId?: string;
  selectedSensorId?: string;
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
  onSensorClick,
  selectedBedId,
  selectedZoneId,
  selectedSensorId
}: JsonRenderer3DProps) {
  // mapData에서 visibility 정보 추출
  const greenhouseVisible = mapData.objects.get('greenhouse-main')?.visible ?? true;
  const bedsGroupVisible = mapData.objects.get('beds-group')?.visible ?? true;
  const zonesGroupVisible = mapData.objects.get('zones-group')?.visible ?? true;
  const sensorsGroupVisible = mapData.objects.get('sensors-group')?.visible ?? true;

  // Coordinate Axes 정보 추출
  const axesObj = mapData.objects.get('coordinate-axes');
  const axesVisible = axesObj?.visible ?? false;
  const axesLength = axesObj && 'length' in axesObj ? axesObj.length : 1000;

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

      {/* 센서 */}
      {sensorsGroupVisible && (
        <SensorsFromJson
          sensors={staticMapData.sensors}
          mapData={mapData}
          onSensorClick={onSensorClick}
          selectedSensorId={selectedSensorId}
        />
      )}

      {/* 인프라 (추후 구현) */}
      {/* <InfrastructureFromJson infrastructure={staticMapData.infrastructure} /> */}

      {/* 좌표축 */}
      <CoordinateAxes visible={axesVisible} length={axesLength} />
    </group>
  );
}
