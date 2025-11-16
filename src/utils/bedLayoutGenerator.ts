import type { BedLayout, BedInstance, BedSpecification, Vec3 } from '../types/staticMapData';

/**
 * 베드 레이아웃 설정에서 개별 베드 인스턴스를 자동 생성
 */
export function generateBedInstances(
  specification: BedSpecification,
  layout: BedLayout
): BedInstance[] {
  const instances: BedInstance[] = [];

  const { startPosition, count, spacing, direction, rows, rowSpacing } = layout;
  const { width, height, defaultLength } = specification;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < count; col++) {
      const bedId = `bed-${row + 1}-${col + 1}`;

      // 위치 계산
      let position: Vec3;

      if (direction === 'x') {
        // X 방향으로 배열
        position = {
          x: startPosition.x + col * (width + spacing),
          y: startPosition.y,
          z: startPosition.z + row * rowSpacing
        };
      } else {
        // Z 방향으로 배열
        position = {
          x: startPosition.x + row * rowSpacing,
          y: startPosition.y,
          z: startPosition.z + col * (width + spacing)
        };
      }

      instances.push({
        id: bedId,
        position,
        dimensions: {
          width,
          height,
          length: defaultLength
        },
        rotation: { x: 0, y: 0, z: 0 }
      });
    }
  }

  return instances;
}

/**
 * 베드 인스턴스 배열에서 특정 베드 업데이트
 */
export function updateBedInstance(
  instances: BedInstance[],
  bedId: string,
  updates: Partial<BedInstance>
): BedInstance[] {
  return instances.map(bed =>
    bed.id === bedId ? { ...bed, ...updates } : bed
  );
}

/**
 * 베드 추가
 */
export function addBedInstance(
  instances: BedInstance[],
  newBed: BedInstance
): BedInstance[] {
  return [...instances, newBed];
}

/**
 * 베드 삭제
 */
export function removeBedInstance(
  instances: BedInstance[],
  bedId: string
): BedInstance[] {
  return instances.filter(bed => bed.id !== bedId);
}

/**
 * 베드 위치 업데이트
 */
export function updateBedPosition(
  instances: BedInstance[],
  bedId: string,
  position: Vec3
): BedInstance[] {
  return updateBedInstance(instances, bedId, { position });
}

/**
 * 베드 크기 업데이트
 */
export function updateBedDimensions(
  instances: BedInstance[],
  bedId: string,
  dimensions: { width: number; height: number; length: number }
): BedInstance[] {
  return updateBedInstance(instances, bedId, { dimensions });
}

/**
 * 베드들을 그리드에 정렬
 */
export function alignBedsToGrid(
  instances: BedInstance[],
  gridSize: number = 0.5
): BedInstance[] {
  return instances.map(bed => ({
    ...bed,
    position: {
      x: Math.round(bed.position.x / gridSize) * gridSize,
      y: Math.round(bed.position.y / gridSize) * gridSize,
      z: Math.round(bed.position.z / gridSize) * gridSize
    }
  }));
}

/**
 * 선택된 베드들을 균등하게 분배 (X축)
 */
export function distributeBedsX(
  instances: BedInstance[],
  selectedIds: string[]
): BedInstance[] {
  const selectedBeds = instances.filter(bed => selectedIds.includes(bed.id));
  if (selectedBeds.length < 2) return instances;

  // X 좌표로 정렬
  const sorted = [...selectedBeds].sort((a, b) => a.position.x - b.position.x);
  const minX = sorted[0].position.x;
  const maxX = sorted[sorted.length - 1].position.x;
  const spacing = (maxX - minX) / (sorted.length - 1);

  const updatedPositions = new Map<string, Vec3>();
  sorted.forEach((bed, index) => {
    updatedPositions.set(bed.id, {
      ...bed.position,
      x: minX + index * spacing
    });
  });

  return instances.map(bed =>
    updatedPositions.has(bed.id)
      ? { ...bed, position: updatedPositions.get(bed.id)! }
      : bed
  );
}

/**
 * 선택된 베드들을 균등하게 분배 (Z축)
 */
export function distributeBedsZ(
  instances: BedInstance[],
  selectedIds: string[]
): BedInstance[] {
  const selectedBeds = instances.filter(bed => selectedIds.includes(bed.id));
  if (selectedBeds.length < 2) return instances;

  // Z 좌표로 정렬
  const sorted = [...selectedBeds].sort((a, b) => a.position.z - b.position.z);
  const minZ = sorted[0].position.z;
  const maxZ = sorted[sorted.length - 1].position.z;
  const spacing = (maxZ - minZ) / (sorted.length - 1);

  const updatedPositions = new Map<string, Vec3>();
  sorted.forEach((bed, index) => {
    updatedPositions.set(bed.id, {
      ...bed.position,
      z: minZ + index * spacing
    });
  });

  return instances.map(bed =>
    updatedPositions.has(bed.id)
      ? { ...bed, position: updatedPositions.get(bed.id)! }
      : bed
  );
}
