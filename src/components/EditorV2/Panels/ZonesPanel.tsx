/**
 * ZonesPanel - Work Zone Management Panel
 */

import { useState } from 'react';
import { useEditor } from '../../../contexts';
import { Button } from '../../UI/Button';
import { Input } from '../../UI/Input';
import { Plus, Trash2 } from 'lucide-react';
import type { WorkZone } from '../../../types/greenhouse';
import styles from './ZonesPanel.module.css';

export function ZonesPanel() {
  const { zones, selectedZone, addZone, updateZone, deleteZone, selectZone } = useEditor();
  const [isAdding, setIsAdding] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');

  const handleAddZone = () => {
    if (!newZoneName.trim()) return;

    const newZone: WorkZone = {
      id: `zone-${Date.now()}`,
      name: newZoneName,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      points: [],
      assignedRobotIds: [],
    };

    addZone(newZone);
    setNewZoneName('');
    setIsAdding(false);
  };

  const handleDeleteZone = (zoneId: string) => {
    if (confirm('이 구역을 삭제하시겠습니까?')) {
      deleteZone(zoneId);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>작업 구역</h3>
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
            placeholder="구역 이름"
            value={newZoneName}
            onChange={(e) => setNewZoneName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddZone()}
            autoFocus
          />
          <div className={styles.addActions}>
            <Button size="sm" onClick={handleAddZone}>
              추가
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewZoneName('');
              }}
            >
              취소
            </Button>
          </div>
        </div>
      )}

      <div className={styles.list}>
        {zones.length === 0 ? (
          <div className={styles.empty}>작업 구역이 없습니다</div>
        ) : (
          zones.map((zone) => (
            <div
              key={zone.id}
              className={`${styles.zoneItem} ${selectedZone?.id === zone.id ? styles.selected : ''}`}
              onClick={() => selectZone(zone.id)}
            >
              <div className={styles.zoneInfo}>
                <div
                  className={styles.zoneColor}
                  style={{ backgroundColor: zone.color }}
                />
                <div className={styles.zoneDetails}>
                  <div className={styles.zoneName}>{zone.name}</div>
                  <div className={styles.zoneMeta}>
                    {zone.points.length}개 포인트 · {zone.assignedRobotIds.length}개 로봇
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
                  handleDeleteZone(zone.id);
                }}
              />
            </div>
          ))
        )}
      </div>

      {selectedZone && (
        <div className={styles.properties}>
          <h4 className={styles.propertiesTitle}>선택된 구역</h4>

          <div className={styles.field}>
            <label className={styles.label}>이름</label>
            <Input
              value={selectedZone.name}
              onChange={(e) => updateZone(selectedZone.id, { name: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>색상</label>
            <Input
              type="color"
              value={selectedZone.color}
              onChange={(e) => updateZone(selectedZone.id, { color: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>할당된 로봇</label>
            <div className={styles.infoText}>
              {selectedZone.assignedRobotIds.length}개
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
