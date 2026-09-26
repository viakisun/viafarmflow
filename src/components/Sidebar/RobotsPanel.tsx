import { useState } from "react";
import { useEditor } from "../../contexts";
import type { Robot } from "../../types/greenhouse";

export function RobotsPanel() {
  const { robots, selectedRobot, selectRobot, addRobot, updateRobot, deleteRobot } = useEditor();

  const [newRobotName, setNewRobotName] = useState("");

  const handleAddRobot = () => {
    if (newRobotName.trim()) {
      const newRobot: Robot = {
        id: `robot-${Date.now()}`,
        name: newRobotName.trim(),
        position: { x: 0, y: 0.5, z: 0 },
        rotation: 0,
        type: "default",
        status: "idle",
        color: "#3366ff",
      };
      addRobot(newRobot);
      setNewRobotName("");
    }
  };

  const handlePositionChange = (axis: "x" | "y" | "z", value: string) => {
    if (selectedRobot) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        updateRobot(selectedRobot.id, {
          position: { ...selectedRobot.position, [axis]: numValue },
        });
      }
    }
  };

  const handleRotationChange = (value: string) => {
    if (selectedRobot) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        updateRobot(selectedRobot.id, {
          rotation: (numValue * Math.PI) / 180, // Convert degrees to radians
        });
      }
    }
  };

  const handleStatusChange = (status: Robot["status"]) => {
    if (selectedRobot) {
      updateRobot(selectedRobot.id, { status });
    }
  };

  return (
    <div className="robots-panel">
      <div className="panel-section">
        <h3 className="panel-title">로봇 추가</h3>
        <div className="panel-group">
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              className="panel-input"
              style={{ flex: 1, textAlign: "left" }}
              placeholder="로봇 이름"
              value={newRobotName}
              onChange={(e) => setNewRobotName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddRobot()}
            />
            <button
              className="panel-button"
              style={{ width: "auto", marginTop: 0 }}
              onClick={handleAddRobot}
              disabled={!newRobotName.trim()}
            >
              추가
            </button>
          </div>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title">로봇 목록</h3>
        {robots.length === 0 ? (
          <div className="panel-empty">로봇이 없습니다</div>
        ) : (
          <div className="panel-list">
            {robots.map((robot) => (
              <div
                key={robot.id}
                className={`panel-list-item ${selectedRobot?.id === robot.id ? "selected" : ""}`}
                onClick={() => selectRobot(robot.id)}
              >
                <div>
                  <div className="panel-list-item-name">{robot.name}</div>
                  <div className="panel-list-item-info">
                    {robot.status === "idle" && "대기 중"}
                    {robot.status === "moving" && "이동 중"}
                    {robot.status === "working" && "작업 중"}
                  </div>
                </div>
                <div style={{ fontSize: "20px" }}>🤖</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRobot && (
        <>
          <div className="panel-section">
            <h3 className="panel-title">위치</h3>
            <div className="panel-group">
              <div className="panel-row">
                <label className="panel-label">X (좌우)</label>
                <input
                  type="number"
                  className="panel-input"
                  value={selectedRobot.position.x.toFixed(1)}
                  onChange={(e) => handlePositionChange("x", e.target.value)}
                  step="0.5"
                />
              </div>
              <div className="panel-row">
                <label className="panel-label">Y (전후)</label>
                <input
                  type="number"
                  className="panel-input"
                  value={selectedRobot.position.y.toFixed(1)}
                  onChange={(e) => handlePositionChange("y", e.target.value)}
                  step="0.5"
                />
              </div>
              <div className="panel-row">
                <label className="panel-label">Z (높이)</label>
                <input
                  type="number"
                  className="panel-input"
                  value={selectedRobot.position.z.toFixed(1)}
                  onChange={(e) => handlePositionChange("z", e.target.value)}
                  step="0.5"
                />
              </div>
              <div className="panel-row">
                <label className="panel-label">회전 (도)</label>
                <input
                  type="number"
                  className="panel-input"
                  value={((selectedRobot.rotation * 180) / Math.PI).toFixed(0)}
                  onChange={(e) => handleRotationChange(e.target.value)}
                  step="15"
                />
              </div>
            </div>
          </div>

          <div className="panel-section">
            <h3 className="panel-title">상태</h3>
            <div className="panel-group">
              <select
                className="panel-input"
                style={{ width: "100%", textAlign: "left" }}
                value={selectedRobot.status}
                onChange={(e) => handleStatusChange(e.target.value as Robot["status"])}
              >
                <option value="idle">대기 중</option>
                <option value="moving">이동 중</option>
                <option value="working">작업 중</option>
              </select>
            </div>
          </div>

          <button className="panel-button danger" onClick={() => deleteRobot(selectedRobot.id)}>
            로봇 삭제
          </button>
        </>
      )}
    </div>
  );
}
