import { useMemo } from 'react';
import { Shape, ExtrudeGeometry } from 'three';
import type { Zone } from '../../types/staticMapData';
import type { HierarchicalMapData } from '../../types/mapData';

interface ZonesFromJsonProps {
  zones: Zone[];
  mapData: HierarchicalMapData;
  onZoneClick?: (zoneId: string) => void;
  selectedZoneId?: string;
}

export function ZonesFromJson({ zones, mapData, onZoneClick, selectedZoneId }: ZonesFromJsonProps) {
  return (
    <group name="zones-from-json">
      {zones.map((zone) => {
        // mapData에서 해당 zone의 visibility 확인
        const zoneVisible = mapData.objects.get(zone.id)?.visible ?? true;

        if (!zoneVisible) return null;

        return (
          <ZoneMesh
            key={zone.id}
            zone={zone}
            isSelected={selectedZoneId === zone.id}
            onClick={() => onZoneClick?.(zone.id)}
          />
        );
      })}
    </group>
  );
}

interface ZoneMeshProps {
  zone: Zone;
  isSelected: boolean;
  onClick: () => void;
}

function ZoneMesh({ zone, isSelected, onClick }: ZoneMeshProps) {
  const geometry = useMemo(() => {
    if (zone.boundaries.length < 3) return null;

    // 2D 폴리곤 shape 생성
    const shape = new Shape();
    const first = zone.boundaries[0];
    shape.moveTo(first.x, first.z);

    for (let i = 1; i < zone.boundaries.length; i++) {
      const point = zone.boundaries[i];
      shape.lineTo(point.x, point.z);
    }
    shape.lineTo(first.x, first.z); // 닫기

    // 높이 방향으로 extrude
    const extrudeSettings = {
      steps: 1,
      depth: zone.height,
      bevelEnabled: false
    };

    return new ExtrudeGeometry(shape, extrudeSettings);
  }, [zone.boundaries, zone.height]);

  if (!geometry) return null;

  // Y 위치는 boundaries의 평균 y 값
  const avgY = zone.boundaries.reduce((sum, p) => sum + p.y, 0) / zone.boundaries.length;

  return (
    <mesh
      geometry={geometry}
      position={[0, avgY, 0]}
      rotation={[-Math.PI / 2, 0, 0]} // XZ 평면으로 회전
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <meshStandardMaterial
        color={zone.color}
        transparent
        opacity={isSelected ? zone.opacity + 0.2 : zone.opacity}
        side={2} // DoubleSide
      />
    </mesh>
  );
}
