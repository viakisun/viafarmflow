import type { GreenhouseData } from '../../types/staticMapData';
import { Greenhouse } from '../Greenhouse';

interface GreenhouseFromJsonProps {
  greenhouseData: GreenhouseData;
}

export function GreenhouseFromJson({ greenhouseData }: GreenhouseFromJsonProps) {
  const { dimensions } = greenhouseData;

  return (
    <group
      position={[
        greenhouseData.position.x,
        greenhouseData.position.y,
        greenhouseData.position.z
      ]}
      rotation={[
        greenhouseData.rotation.x,
        greenhouseData.rotation.y,
        greenhouseData.rotation.z
      ]}
    >
      <Greenhouse
        dimensions={{
          width: dimensions.x,
          height: dimensions.y,
          length: dimensions.z
        }}
      />
    </group>
  );
}
