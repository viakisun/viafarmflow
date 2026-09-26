/**
 * PropertiesPanel - Greenhouse Configuration Panel
 */

import { useEditor } from '../../../contexts';
import { Input } from '../../UI/Input';
import styles from './PropertiesPanel.module.css';

export function PropertiesPanel() {
  const { config, updateConfig } = useEditor();

  const handleDimensionChange = (key: 'length' | 'width' | 'height', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateConfig({
        dimensions: {
          ...config.dimensions,
          [key]: numValue,
        },
      });
    }
  };

  const handleBedChange = (key: keyof typeof config.beds, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateConfig({
        beds: {
          ...config.beds,
          [key]: numValue,
        },
      });
    }
  };

  const handleGridOriginChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateConfig({
        grid: {
          ...config.grid,
          origin: {
            ...config.grid.origin,
            [axis]: numValue,
          },
        },
      });
    }
  };

  const handleGridSizeChange = (axis: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateConfig({
        grid: {
          ...config.grid,
          size: {
            ...config.grid.size,
            [axis]: numValue,
          },
        },
      });
    }
  };

  const handleGridCellSizeChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateConfig({
        grid: {
          ...config.grid,
          cellSize: numValue,
        },
      });
    }
  };

  // 계산된 값들
  const totalArea = config.dimensions.length * config.dimensions.width;
  const totalBedLength = config.beds.length * config.beds.count;
  const totalVolume = totalArea * config.dimensions.height;

  return (
    <div className={styles.panel}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>그리드 설정</h3>

        <div className={styles.field}>
          <label className={styles.label}>원점 X</label>
          <Input
            type="number"
            value={config.grid.origin.x}
            onChange={(e) => handleGridOriginChange('x', e.target.value)}
            step={1}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>원점 Y</label>
          <Input
            type="number"
            value={config.grid.origin.y}
            onChange={(e) => handleGridOriginChange('y', e.target.value)}
            step={1}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>원점 Z</label>
          <Input
            type="number"
            value={config.grid.origin.z}
            onChange={(e) => handleGridOriginChange('z', e.target.value)}
            step={1}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>크기 X (m)</label>
          <Input
            type="number"
            value={config.grid.size.x}
            onChange={(e) => handleGridSizeChange('x', e.target.value)}
            min={1}
            step={10}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>크기 Y (m)</label>
          <Input
            type="number"
            value={config.grid.size.y}
            onChange={(e) => handleGridSizeChange('y', e.target.value)}
            min={1}
            step={10}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>격자 크기 (m)</label>
          <Input
            type="number"
            value={config.grid.cellSize}
            onChange={(e) => handleGridCellSizeChange(e.target.value)}
            min={1}
            step={1}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>온실 치수</h3>

        <div className={styles.field}>
          <label className={styles.label}>길이 (Y축)</label>
          <Input
            type="number"
            value={config.dimensions.length}
            onChange={(e) => handleDimensionChange('length', e.target.value)}
            min={1}
            step={0.1}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>폭 (X축)</label>
          <Input
            type="number"
            value={config.dimensions.width}
            onChange={(e) => handleDimensionChange('width', e.target.value)}
            min={1}
            step={0.1}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>높이 (Z축)</label>
          <Input
            type="number"
            value={config.dimensions.height}
            onChange={(e) => handleDimensionChange('height', e.target.value)}
            min={1}
            step={0.1}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>행잉 베드 설정</h3>

        <div className={styles.field}>
          <label className={styles.label}>베드 개수</label>
          <Input
            type="number"
            value={config.beds.count}
            onChange={(e) => handleBedChange('count', e.target.value)}
            min={1}
            step={1}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>베드 길이</label>
          <Input
            type="number"
            value={config.beds.length}
            onChange={(e) => handleBedChange('length', e.target.value)}
            min={0.1}
            step={0.1}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>베드 간격</label>
          <Input
            type="number"
            value={config.beds.spacing}
            onChange={(e) => handleBedChange('spacing', e.target.value)}
            min={0.1}
            step={0.1}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>지면 높이</label>
          <Input
            type="number"
            value={config.beds.heightFromGround}
            onChange={(e) => handleBedChange('heightFromGround', e.target.value)}
            min={0}
            step={0.1}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>정보</h3>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>총 면적</span>
            <span className={styles.infoValue}>{totalArea.toLocaleString()} m²</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>총 베드 길이</span>
            <span className={styles.infoValue}>{totalBedLength.toLocaleString()} m</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>체적</span>
            <span className={styles.infoValue}>{totalVolume.toLocaleString()} m³</span>
          </div>
        </div>
      </section>
    </div>
  );
}
