/**
 * ObjectsPanel - Scene Objects Visibility Control Panel
 */

import { useEditor } from '../../../contexts';
import styles from './PropertiesPanel.module.css';

export function ObjectsPanel() {
  const { editorState, updateVisibility } = useEditor();
  const { visibility } = editorState;

  const handleToggle = (path: string[], value: boolean) => {
    if (path.length === 1) {
      // Top-level boolean
      updateVisibility({ [path[0]]: value } as any);
    } else if (path.length === 2) {
      // Nested property
      const [parent, child] = path;
      const currentParent = visibility[parent as keyof typeof visibility] as any;
      updateVisibility({
        [parent]: {
          ...currentParent,
          [child]: value,
        },
      } as any);
    }
  };

  return (
    <div className={styles.panel}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>장면 오브젝트</h3>

        {/* XY Plane */}
        <div className={styles.field}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={visibility.xyPlane}
              onChange={(e) => handleToggle(['xyPlane'], e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            XY 평면 (그리드)
          </label>
        </div>

        {/* XYZ Axes */}
        <div className={styles.field}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={visibility.axes}
              onChange={(e) => handleToggle(['axes'], e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            XYZ 좌표축
          </label>
        </div>
      </section>

      {/* Greenhouse */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <label>
            <input
              type="checkbox"
              checked={visibility.greenhouse.enabled}
              onChange={(e) => handleToggle(['greenhouse', 'enabled'], e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            온실
          </label>
        </h3>

        {visibility.greenhouse.enabled && (
          <div style={{ paddingLeft: '20px' }}>
            <div className={styles.field}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={visibility.greenhouse.floor}
                  onChange={(e) => handleToggle(['greenhouse', 'floor'], e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                바닥
              </label>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={visibility.greenhouse.walls}
                  onChange={(e) => handleToggle(['greenhouse', 'walls'], e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                벽
              </label>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={visibility.greenhouse.roof}
                  onChange={(e) => handleToggle(['greenhouse', 'roof'], e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                지붕
              </label>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={visibility.greenhouse.columns}
                  onChange={(e) => handleToggle(['greenhouse', 'columns'], e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                기둥
              </label>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={visibility.greenhouse.frame}
                  onChange={(e) => handleToggle(['greenhouse', 'frame'], e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                프레임
              </label>
            </div>
          </div>
        )}
      </section>

      {/* Beds */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <label>
            <input
              type="checkbox"
              checked={visibility.beds.enabled}
              onChange={(e) => handleToggle(['beds', 'enabled'], e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            베드
          </label>
        </h3>

        {visibility.beds.enabled && (
          <div style={{ paddingLeft: '20px' }}>
            <div className={styles.field}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={visibility.beds.platforms}
                  onChange={(e) => handleToggle(['beds', 'platforms'], e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                플랫폼
              </label>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={visibility.beds.cables}
                  onChange={(e) => handleToggle(['beds', 'cables'], e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                케이블
              </label>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={visibility.beds.plants}
                  onChange={(e) => handleToggle(['beds', 'plants'], e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                식물
              </label>
            </div>
          </div>
        )}
      </section>

      {/* Robots */}
      <section className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={visibility.robots}
              onChange={(e) => handleToggle(['robots'], e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            로봇
          </label>
        </div>
      </section>

      {/* Paths */}
      <section className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={visibility.paths}
              onChange={(e) => handleToggle(['paths'], e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            경로
          </label>
        </div>
      </section>

      {/* Zones */}
      <section className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={visibility.zones}
              onChange={(e) => handleToggle(['zones'], e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            구역
          </label>
        </div>
      </section>

      {/* Global Options */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>전역 옵션</h3>

        <div className={styles.field}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={visibility.labels}
              onChange={(e) => handleToggle(['labels'], e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            라벨 표시
          </label>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={visibility.shadows}
              onChange={(e) => handleToggle(['shadows'], e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            그림자 표시
          </label>
        </div>
      </section>
    </div>
  );
}
