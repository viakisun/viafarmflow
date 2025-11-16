import { useMemo } from 'react';
import type { BedsData } from '../../types/staticMapData';
import type { HierarchicalMapData } from '../../types/mapData';
import { HangingBed } from '../HangingBed';
import { generateBedInstances } from '../../utils/bedLayoutGenerator';

interface BedsFromJsonProps {
  bedsData: BedsData;
  mapData: HierarchicalMapData;
  onBedClick?: (bedId: string) => void;
  selectedBedId?: string;
}

export function BedsFromJson({ bedsData, mapData, onBedClick, selectedBedId }: BedsFromJsonProps) {
  // 베드 인스턴스 계산: instances가 있으면 사용, 없으면 layout에서 자동 생성
  const bedInstances = useMemo(() => {
    if (bedsData.instances && bedsData.instances.length > 0) {
      return bedsData.instances;
    }

    // layout 설정에서 자동 생성
    return generateBedInstances(bedsData.specification, bedsData.layout);
  }, [bedsData]);

  return (
    <group name="beds-from-json">
      {bedInstances.map((bed) => {
        // mapData에서 해당 베드의 visibility 확인
        const bedVisible = mapData.objects.get(bed.id)?.visible ?? true;

        if (!bedVisible) return null;

        return (
          <group
            key={bed.id}
            position={[bed.position.x, bed.position.y, bed.position.z]}
            rotation={[bed.rotation.x, bed.rotation.y, bed.rotation.z]}
            onClick={(e) => {
              e.stopPropagation();
              onBedClick?.(bed.id);
            }}
          >
            <HangingBed
              length={bed.dimensions.length}
              width={bed.dimensions.width}
              height={bed.dimensions.height}
            />

            {/* 선택된 베드 표시 */}
            {selectedBedId === bed.id && (
              <mesh position={[0, bed.dimensions.height / 2 + 0.1, 0]}>
                <boxGeometry args={[
                  bed.dimensions.width + 0.2,
                  0.05,
                  bed.dimensions.length + 0.2
                ]} />
                <meshBasicMaterial color="#00ffaa" transparent opacity={0.3} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
