/**
 * PathsPanel - Waypoint and Path Management Panel
 */

import { useState } from 'react';
import { useEditor } from '../../../contexts';
import { Button } from '../../UI/Button';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import type { Waypoint } from '../../../types/greenhouse';
import styles from './PathsPanel.module.css';

export function PathsPanel() {
  const { waypoints, selectedRobot, addWaypoint, deleteWaypoint, updateWaypoint } = useEditor();
  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(null);

  // Filter waypoints for selected robot
  const robotWaypoints = selectedRobot
    ? waypoints
        .filter((wp) => wp.robotId === selectedRobot.id)
        .sort((a, b) => a.order - b.order)
    : [];

  const selectedWaypoint = robotWaypoints.find((wp) => wp.id === selectedWaypointId);

  const handleAddWaypoint = () => {
    if (!selectedRobot) return;

    const newWaypoint: Waypoint = {
      id: `waypoint-${Date.now()}`,
      robotId: selectedRobot.id,
      position: { x: 0, y: 0, z: 0 },
      order: robotWaypoints.length + 1,
    };

    addWaypoint(newWaypoint);
    setSelectedWaypointId(newWaypoint.id);
  };

  const handleDeleteWaypoint = (waypointId: string) => {
    if (confirm('이 웨이포인트를 삭제하시겠습니까?')) {
      deleteWaypoint(waypointId);
      if (selectedWaypointId === waypointId) {
        setSelectedWaypointId(null);
      }
    }
  };

  const handleMoveUp = (waypoint: Waypoint) => {
    if (waypoint.order <= 1) return;

    const prevWaypoint = robotWaypoints.find((wp) => wp.order === waypoint.order - 1);
    if (prevWaypoint) {
      updateWaypoint(waypoint.id, { order: waypoint.order - 1 });
      updateWaypoint(prevWaypoint.id, { order: prevWaypoint.order + 1 });
    }
  };

  const handleMoveDown = (waypoint: Waypoint) => {
    if (waypoint.order >= robotWaypoints.length) return;

    const nextWaypoint = robotWaypoints.find((wp) => wp.order === waypoint.order + 1);
    if (nextWaypoint) {
      updateWaypoint(waypoint.id, { order: waypoint.order + 1 });
      updateWaypoint(nextWaypoint.id, { order: nextWaypoint.order - 1 });
    }
  };

  // Calculate total path length
  const totalPathLength = robotWaypoints.reduce((total, wp, index) => {
    if (index === 0) return 0;
    const prev = robotWaypoints[index - 1];
    const dx = wp.position.x - prev.position.x;
    const dz = wp.position.z - prev.position.z;
    return total + Math.sqrt(dx * dx + dz * dz);
  }, 0);

  if (!selectedRobot) {
    return (
      <div className={styles.panel}>
        <div className={styles.emptyState}>
          <p>로봇을 먼저 선택해주세요</p>
          <p className={styles.hint}>로봇 탭에서 로봇을 선택하거나 추가하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>경로 ({selectedRobot.name})</h3>
        <Button
          variant="ghost"
          size="sm"
          icon={Plus}
          onClick={handleAddWaypoint}
        >
          추가
        </Button>
      </div>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>웨이포인트</span>
          <span className={styles.infoValue}>{robotWaypoints.length}개</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>총 경로 길이</span>
          <span className={styles.infoValue}>{totalPathLength.toFixed(1)} m</span>
        </div>
      </div>

      <div className={styles.list}>
        {robotWaypoints.length === 0 ? (
          <div className={styles.empty}>웨이포인트가 없습니다</div>
        ) : (
          robotWaypoints.map((waypoint, index) => (
            <div
              key={waypoint.id}
              className={`${styles.waypointItem} ${selectedWaypointId === waypoint.id ? styles.selected : ''}`}
              onClick={() => setSelectedWaypointId(waypoint.id)}
            >
              <div className={styles.waypointInfo}>
                <div className={styles.waypointOrder}>{waypoint.order}</div>
                <div className={styles.waypointDetails}>
                  <div className={styles.waypointPosition}>
                    X: {waypoint.position.x.toFixed(1)}, Z: {waypoint.position.z.toFixed(1)}
                  </div>
                  {index > 0 && (
                    <div className={styles.waypointDistance}>
                      {(() => {
                        const prev = robotWaypoints[index - 1];
                        const dx = waypoint.position.x - prev.position.x;
                        const dz = waypoint.position.z - prev.position.z;
                        const distance = Math.sqrt(dx * dx + dz * dz);
                        return `${distance.toFixed(1)}m`;
                      })()}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.waypointActions}>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={MoveUp}
                  iconOnly
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveUp(waypoint);
                  }}
                  disabled={waypoint.order === 1}
                  title="위로 이동"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={MoveDown}
                  iconOnly
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveDown(waypoint);
                  }}
                  disabled={waypoint.order === robotWaypoints.length}
                  title="아래로 이동"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  iconOnly
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWaypoint(waypoint.id);
                  }}
                  title="삭제"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {selectedWaypoint && (
        <div className={styles.properties}>
          <h4 className={styles.propertiesTitle}>선택된 웨이포인트</h4>

          <div className={styles.field}>
            <label className={styles.label}>순서</label>
            <div className={styles.infoText}>{selectedWaypoint.order}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>위치</label>
            <div className={styles.positionInfo}>
              <span>X: {selectedWaypoint.position.x.toFixed(2)}m</span>
              <span>Y: {selectedWaypoint.position.y.toFixed(2)}m</span>
              <span>Z: {selectedWaypoint.position.z.toFixed(2)}m</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
