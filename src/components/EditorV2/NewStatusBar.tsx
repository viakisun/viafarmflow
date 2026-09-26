/**
 * NewStatusBar - Black & White Design
 * Bottom status bar showing editor state
 */

import { useEditor } from '../../contexts';
import styles from './NewStatusBar.module.css';

const MODE_LABELS: Record<string, string> = {
  view: '보기 모드',
  edit: '편집 모드',
  robot: '로봇 모드',
  path: '경로 모드',
  zone: '구역 모드',
};

export function NewStatusBar() {
  const { editorState, selectedRobot, selectedZone, robots, zones } = useEditor();

  const getSelectionText = () => {
    if (selectedRobot) {
      return `로봇: ${selectedRobot.name}`;
    }
    if (selectedZone) {
      return `구역: ${selectedZone.name}`;
    }
    return '선택 없음';
  };

  return (
    <div className={styles.statusBar}>
      <div className={styles.section}>
        <span className={styles.label}>모드:</span>
        <span className={styles.value}>{MODE_LABELS[editorState.mode]}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.label}>선택:</span>
        <span className={styles.value}>{getSelectionText()}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.value}>
          로봇 {robots.length}개 · 구역 {zones.length}개
        </span>
      </div>

      <div className={styles.spacer} />

      {editorState.isPlaying && (
        <div className={styles.section}>
          <div className={styles.playingIndicator} />
          <span className={styles.value}>시뮬레이션 실행 중</span>
        </div>
      )}
    </div>
  );
}
