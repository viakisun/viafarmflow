import { useState } from "react";
import { useEditor } from "../../contexts";

export function PathsPanel() {
  const { robots, waypoints, selectedRobot, selectRobot, deleteWaypoint, updateWaypoint } =
    useEditor();

  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(null);

  // 선택된 로봇의 웨이포인트
  const robotWaypoints = selectedRobot
    ? waypoints.filter((wp) => wp.robotId === selectedRobot.id).sort((a, b) => a.order - b.order)
    : [];

  const handleClearPath = () => {
    if (selectedRobot && confirm("이 로봇의 모든 경로를 삭제하시겠습니까?")) {
      robotWaypoints.forEach((wp) => deleteWaypoint(wp.id));
    }
  };

  const handleDeleteWaypoint = (waypointId: string) => {
    deleteWaypoint(waypointId);

    // 순서 재정렬
    if (selectedRobot) {
      const remaining = waypoints
        .filter((wp) => wp.robotId === selectedRobot.id && wp.id !== waypointId)
        .sort((a, b) => a.order - b.order);

      remaining.forEach((wp, index) => {
        updateWaypoint(wp.id, { order: index + 1 });
      });
    }
  };

  const handleMoveUp = (waypointId: string, currentOrder: number) => {
    if (currentOrder <= 1) return;

    const prevWaypoint = robotWaypoints.find((wp) => wp.order === currentOrder - 1);
    if (prevWaypoint) {
      updateWaypoint(waypointId, { order: currentOrder - 1 });
      updateWaypoint(prevWaypoint.id, { order: currentOrder });
    }
  };

  const handleMoveDown = (waypointId: string, currentOrder: number) => {
    if (currentOrder >= robotWaypoints.length) return;

    const nextWaypoint = robotWaypoints.find((wp) => wp.order === currentOrder + 1);
    if (nextWaypoint) {
      updateWaypoint(waypointId, { order: currentOrder + 1 });
      updateWaypoint(nextWaypoint.id, { order: currentOrder });
    }
  };

  return (
    <div className="paths-panel">
      <div className="panel-section">
        <h3 className="panel-title">로봇 선택</h3>
        {robots.length === 0 ? (
          <div className="panel-empty">로봇이 없습니다</div>
        ) : (
          <div className="panel-list">
            {robots.map((robot) => {
              const pathCount = waypoints.filter((wp) => wp.robotId === robot.id).length;
              return (
                <div
                  key={robot.id}
                  className={`panel-list-item ${selectedRobot?.id === robot.id ? "selected" : ""}`}
                  onClick={() => selectRobot(robot.id)}
                >
                  <div>
                    <div className="panel-list-item-name">{robot.name}</div>
                    <div className="panel-list-item-info">경로점 {pathCount}개</div>
                  </div>
                  <div style={{ fontSize: "20px" }}>🤖</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedRobot && (
        <>
          <div className="panel-section">
            <h3 className="panel-title">경로 편집</h3>
            <div className="panel-group">
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  marginBottom: "12px",
                }}
              >
                💡 경로 모드에서 바닥을 클릭하여 웨이포인트를 추가하세요
              </div>
              {robotWaypoints.length === 0 ? (
                <div
                  style={{
                    color: "#666",
                    fontSize: "13px",
                    textAlign: "center",
                    padding: "12px",
                  }}
                >
                  경로가 없습니다
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {robotWaypoints.map((wp) => (
                    <div
                      key={wp.id}
                      className={`panel-list-item ${
                        selectedWaypointId === wp.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedWaypointId(wp.id)}
                      style={{ padding: "8px" }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: "500" }}>포인트 {wp.order}</div>
                        <div style={{ fontSize: "11px", color: "#666" }}>
                          X:{wp.position.x.toFixed(1)}, Z:
                          {wp.position.z.toFixed(1)}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveUp(wp.id, wp.order);
                          }}
                          disabled={wp.order === 1}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: wp.order === 1 ? "not-allowed" : "pointer",
                            opacity: wp.order === 1 ? 0.3 : 1,
                            fontSize: "16px",
                          }}
                        >
                          ⬆
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveDown(wp.id, wp.order);
                          }}
                          disabled={wp.order === robotWaypoints.length}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: wp.order === robotWaypoints.length ? "not-allowed" : "pointer",
                            opacity: wp.order === robotWaypoints.length ? 0.3 : 1,
                            fontSize: "16px",
                          }}
                        >
                          ⬇
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWaypoint(wp.id);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "#ef4444",
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel-section">
            <h3 className="panel-title">경로 정보</h3>
            <div className="panel-group">
              <div className="panel-row">
                <span className="panel-label">총 웨이포인트</span>
                <span className="panel-value">{robotWaypoints.length}개</span>
              </div>
              {robotWaypoints.length > 1 && (
                <div className="panel-row">
                  <span className="panel-label">예상 거리</span>
                  <span className="panel-value">
                    {robotWaypoints
                      .reduce((total, wp, index) => {
                        if (index === 0) return 0;
                        const prev = robotWaypoints[index - 1];
                        const dx = wp.position.x - prev.position.x;
                        const dz = wp.position.z - prev.position.z;
                        return total + Math.sqrt(dx * dx + dz * dz);
                      }, 0)
                      .toFixed(1)}
                    m
                  </span>
                </div>
              )}
            </div>

            {robotWaypoints.length > 0 && (
              <button className="panel-button danger" onClick={handleClearPath}>
                경로 초기화
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
