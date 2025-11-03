import { useEditor } from "../../contexts";
import { WorkZone } from "./WorkZone";

export function WorkZones() {
  const { zones, selectedZone, selectZone, editorState } = useEditor();
  const { mode } = editorState;

  // 구역 모드나 보기 모드에서만 표시
  if (mode !== "zone" && mode !== "view" && mode !== "edit") {
    return null;
  }

  const handleZoneClick = (zoneId: string) => {
    if (mode === "zone" || mode === "edit") {
      selectZone(zoneId);
    }
  };

  return (
    <group name="work-zones">
      {zones.map((zone) => (
        <WorkZone
          key={zone.id}
          zone={zone}
          isSelected={selectedZone?.id === zone.id}
          opacity={mode === "zone" ? 0.4 : 0.2}
          height={0.05}
          onClick={() => handleZoneClick(zone.id)}
        />
      ))}
    </group>
  );
}
