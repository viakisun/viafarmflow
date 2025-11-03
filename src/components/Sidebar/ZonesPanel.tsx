import { useState } from "react";
import { useEditor } from "../../contexts";
import type { WorkZone } from "../../types/greenhouse";

const zoneColors = [
  "#3366ff",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export function ZonesPanel() {
  const { zones, selectedZone, selectZone, addZone, updateZone, deleteZone, robots } = useEditor();

  const [newZoneName, setNewZoneName] = useState("");
  const [selectedColor, setSelectedColor] = useState(zoneColors[0]);

  const handleAddZone = () => {
    if (newZoneName.trim()) {
      const newZone: WorkZone = {
        id: `zone-${Date.now()}`,
        name: newZoneName.trim(),
        color: selectedColor,
        points: [],
        assignedRobotIds: [],
      };
      addZone(newZone);
      setNewZoneName("");
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedZone) {
      updateZone(selectedZone.id, { color });
    }
  };

  const handleRobotAssignment = (robotId: string, assigned: boolean) => {
    if (selectedZone) {
      const newAssignments = assigned
        ? [...selectedZone.assignedRobotIds, robotId]
        : selectedZone.assignedRobotIds.filter((id) => id !== robotId);
      updateZone(selectedZone.id, { assignedRobotIds: newAssignments });
    }
  };

  return (
    <div className="zones-panel">
      <div className="panel-section">
        <h3 className="panel-title">구역 추가</h3>
        <div className="panel-group">
          <input
            type="text"
            className="panel-input"
            style={{ width: "100%", textAlign: "left", marginBottom: "8px" }}
            placeholder="구역 이름"
            value={newZoneName}
            onChange={(e) => setNewZoneName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddZone()}
          />
          <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
            {zoneColors.map((color) => (
              <button
                key={color}
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: color,
                  border: selectedColor === color ? "2px solid #fff" : "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
          <button className="panel-button" onClick={handleAddZone} disabled={!newZoneName.trim()}>
            구역 추가
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title">구역 목록</h3>
        {zones.length === 0 ? (
          <div className="panel-empty">구역이 없습니다</div>
        ) : (
          <div className="panel-list">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`panel-list-item ${selectedZone?.id === zone.id ? "selected" : ""}`}
                onClick={() => selectZone(zone.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: zone.color,
                      borderRadius: "2px",
                    }}
                  />
                  <div>
                    <div className="panel-list-item-name">{zone.name}</div>
                    <div className="panel-list-item-info">
                      로봇 {zone.assignedRobotIds.length}대
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedZone && (
        <>
          <div className="panel-section">
            <h3 className="panel-title">구역 색상</h3>
            <div className="panel-group">
              <div style={{ display: "flex", gap: "4px" }}>
                {zoneColors.map((color) => (
                  <button
                    key={color}
                    style={{
                      width: "28px",
                      height: "28px",
                      backgroundColor: color,
                      border: selectedZone.color === color ? "2px solid #fff" : "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="panel-section">
            <h3 className="panel-title">로봇 할당</h3>
            <div className="panel-group">
              {robots.length === 0 ? (
                <div style={{ color: "#666", fontSize: "13px" }}>로봇이 없습니다</div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {robots.map((robot) => (
                    <label
                      key={robot.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        fontSize: "13px",
                        padding: "4px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedZone.assignedRobotIds.includes(robot.id)}
                        onChange={(e) => handleRobotAssignment(robot.id, e.target.checked)}
                      />
                      {robot.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel-section">
            <h3 className="panel-title">구역 정보</h3>
            <div className="panel-group">
              <div className="panel-row">
                <span className="panel-label">포인트 수</span>
                <span className="panel-value">{selectedZone.points.length}</span>
              </div>
              <div className="panel-row">
                <span className="panel-label">할당된 로봇</span>
                <span className="panel-value">{selectedZone.assignedRobotIds.length}대</span>
              </div>
            </div>
          </div>

          <button className="panel-button danger" onClick={() => deleteZone(selectedZone.id)}>
            구역 삭제
          </button>
        </>
      )}
    </div>
  );
}
