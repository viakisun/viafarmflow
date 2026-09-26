/**
 * RobotsPanel - Robot Management Panel
 */

import { useState } from 'react';
import { useEditor } from '../../../contexts';
import { Button } from '../../UI/Button';
import { Input } from '../../UI/Input';
import { Plus, Trash2 } from 'lucide-react';
import type { Robot } from '../../../types/greenhouse';
import styles from './RobotsPanel.module.css';

export function RobotsPanel() {
  const { robots, selectedRobot, addRobot, updateRobot, deleteRobot, selectRobot } = useEditor();
  const [isAdding, setIsAdding] = useState(false);
  const [newRobotName, setNewRobotName] = useState('');

  const handleAddRobot = () => {
    if (!newRobotName.trim()) return;

    const newRobot: Robot = {
      id: `robot-${Date.now()}`,
      name: newRobotName,
      position: { x: 0, y: 0, z: 0 },
      rotation: 0,
      type: 'default',
      status: 'idle',
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    };

    addRobot(newRobot);
    setNewRobotName('');
    setIsAdding(false);
  };

  const handleDeleteRobot = (robotId: string) => {
    if (confirm('이 로봇을 삭제하시겠습니까?')) {
      deleteRobot(robotId);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>로봇</h3>
        <Button
          variant="ghost"
          size="sm"
          icon={Plus}
          onClick={() => setIsAdding(true)}
        >
          추가
        </Button>
      </div>

      {isAdding && (
        <div className={styles.addForm}>
          <Input
            placeholder="로봇 이름"
            value={newRobotName}
            onChange={(e) => setNewRobotName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddRobot()}
            autoFocus
          />
          <div className={styles.addActions}>
            <Button size="sm" onClick={handleAddRobot}>
              추가
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewRobotName('');
              }}
            >
              취소
            </Button>
          </div>
        </div>
      )}

      <div className={styles.list}>
        {robots.length === 0 ? (
          <div className={styles.empty}>로봇이 없습니다</div>
        ) : (
          robots.map((robot) => (
            <div
              key={robot.id}
              className={`${styles.robotItem} ${selectedRobot?.id === robot.id ? styles.selected : ''}`}
              onClick={() => selectRobot(robot.id)}
            >
              <div className={styles.robotInfo}>
                <div
                  className={styles.robotColor}
                  style={{ backgroundColor: robot.color }}
                />
                <div className={styles.robotDetails}>
                  <div className={styles.robotName}>{robot.name}</div>
                  <div className={styles.robotMeta}>
                    {robot.status} · ({robot.position.x.toFixed(1)}, {robot.position.y.toFixed(1)})
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                iconOnly
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRobot(robot.id);
                }}
              />
            </div>
          ))
        )}
      </div>

      {selectedRobot && (
        <div className={styles.properties}>
          <h4 className={styles.propertiesTitle}>선택된 로봇</h4>

          <div className={styles.field}>
            <label className={styles.label}>이름</label>
            <Input
              value={selectedRobot.name}
              onChange={(e) => updateRobot(selectedRobot.id, { name: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>위치 X</label>
            <Input
              type="number"
              value={selectedRobot.position.x}
              onChange={(e) =>
                updateRobot(selectedRobot.id, {
                  position: {
                    ...selectedRobot.position,
                    x: parseFloat(e.target.value) || 0,
                  },
                })
              }
              step={0.1}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>위치 Z</label>
            <Input
              type="number"
              value={selectedRobot.position.z}
              onChange={(e) =>
                updateRobot(selectedRobot.id, {
                  position: {
                    ...selectedRobot.position,
                    z: parseFloat(e.target.value) || 0,
                  },
                })
              }
              step={0.1}
            />
          </div>
        </div>
      )}
    </div>
  );
}
