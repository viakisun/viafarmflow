import { useMemo } from 'react';
import { Box, Sphere, Cone, Cylinder } from '@react-three/drei';
import type { Sensor } from '../../types/staticMapData';
import type { HierarchicalMapData } from '../../types/mapData';
import { COLORS } from '../../constants/materials';

interface SensorsFromJsonProps {
  sensors: Sensor[];
  mapData: HierarchicalMapData;
  onSensorClick?: (sensorId: string) => void;
  selectedSensorId?: string;
}

export function SensorsFromJson({ sensors, mapData, onSensorClick, selectedSensorId }: SensorsFromJsonProps) {
  return (
    <group name="sensors-from-json">
      {sensors.map((sensor) => {
        // mapData에서 해당 sensor의 visibility 확인
        const sensorVisible = mapData.objects.get(sensor.id)?.visible ?? true;

        if (!sensorVisible) return null;

        return (
          <SensorMesh
            key={sensor.id}
            sensor={sensor}
            isSelected={selectedSensorId === sensor.id}
            onClick={() => onSensorClick?.(sensor.id)}
          />
        );
      })}
    </group>
  );
}

interface SensorMeshProps {
  sensor: Sensor;
  isSelected: boolean;
  onClick: () => void;
}

function SensorMesh({ sensor, isSelected, onClick }: SensorMeshProps) {
  const sensorColor = useMemo(() => {
    switch (sensor.type) {
      case 'camera':
        return 0x3366ff;
      case 'temperature':
        return 0xff6666;
      case 'humidity':
        return 0x66ccff;
      case 'co2':
        return 0x66ff66;
      case 'light':
        return 0xffff66;
      default:
        return 0x888888;
    }
  }, [sensor.type]);

  return (
    <group
      position={[sensor.position.x, sensor.position.y, sensor.position.z]}
      rotation={sensor.orientation?.rotation ? [
        (sensor.orientation.rotation.x * Math.PI) / 180,
        (sensor.orientation.rotation.y * Math.PI) / 180,
        (sensor.orientation.rotation.z * Math.PI) / 180
      ] : [0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* 센서 본체 */}
      {sensor.type === 'camera' ? (
        // 카메라 모양
        <group>
          <Box args={[0.2, 0.15, 0.25]}>
            <meshStandardMaterial color={sensorColor} metalness={0.7} roughness={0.3} />
          </Box>
          {/* 렌즈 */}
          <Cylinder args={[0.06, 0.06, 0.05, 16]} position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={0x222222} metalness={0.9} roughness={0.1} />
          </Cylinder>
          {/* 시야각 표시 */}
          {sensor.orientation?.fov && (
            <mesh position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[
                Math.tan((sensor.orientation.fov * Math.PI) / 360) * (sensor.orientation.range || 10),
                sensor.orientation.range || 10,
                16,
                1,
                true
              ]} />
              <meshBasicMaterial
                color={sensorColor}
                transparent
                opacity={0.1}
                wireframe
              />
            </mesh>
          )}
        </group>
      ) : (
        // 일반 센서 (구형)
        <Sphere args={[0.1, 16, 16]}>
          <meshStandardMaterial
            color={sensorColor}
            emissive={sensorColor}
            emissiveIntensity={isSelected ? 0.5 : 0.2}
          />
        </Sphere>
      )}

      {/* 감지 범위 표시 */}
      {sensor.range && sensor.type !== 'camera' && (
        <Sphere args={[sensor.range, 16, 16]}>
          <meshBasicMaterial
            color={sensorColor}
            transparent
            opacity={isSelected ? 0.15 : 0.05}
            wireframe
          />
        </Sphere>
      )}

      {/* 선택 표시 */}
      {isSelected && (
        <Sphere args={[0.15, 16, 16]}>
          <meshBasicMaterial
            color="#00ffaa"
            transparent
            opacity={0.3}
          />
        </Sphere>
      )}
    </group>
  );
}
