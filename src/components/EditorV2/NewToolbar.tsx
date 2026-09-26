/**
 * NewToolbar - Black & White Design
 * Professional CAD-style toolbar for map editor
 */

import { useEditor } from '../../contexts';
import { useHistory } from '../../contexts/HistoryContext';
import { useProject } from '../../contexts/ProjectContext';
import { Button } from '../UI/Button';
import {
  ArrowLeft,
  Eye,
  Edit3,
  Bot,
  Route,
  Square,
  Undo2,
  Redo2,
  Grid3x3,
  Ruler,
  Play,
  Pause,
} from 'lucide-react';
import type { EditorMode } from '../../contexts/EditorContextDefinition';
import styles from './NewToolbar.module.css';

interface NewToolbarProps {
  onBackToProjects: () => void;
}

export function NewToolbar({ onBackToProjects }: NewToolbarProps) {
  const { editorState, setEditorMode, toggleGrid, toggleDimensions, setPlaying } = useEditor();
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { state: projectState } = useProject();

  const modes: Array<{ mode: EditorMode; icon: typeof Eye; label: string }> = [
    { mode: 'view', icon: Eye, label: '보기' },
    { mode: 'edit', icon: Edit3, label: '편집' },
    { mode: 'robot', icon: Bot, label: '로봇' },
    { mode: 'path', icon: Route, label: '경로' },
    { mode: 'zone', icon: Square, label: '구역' },
  ];

  return (
    <div className={styles.toolbar}>
      <div className={styles.leftSection}>
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          iconOnly
          onClick={onBackToProjects}
          title="프로젝트 목록으로"
        />

        <div className={styles.divider} />

        <div className={styles.projectName}>
          {projectState.currentProject?.name || 'Untitled Project'}
        </div>
      </div>

      <div className={styles.centerSection}>
        <div className={styles.modeGroup}>
          {modes.map(({ mode, icon, label }) => (
            <Button
              key={mode}
              variant={editorState.mode === mode ? 'primary' : 'ghost'}
              size="sm"
              icon={icon}
              onClick={() => setEditorMode(mode)}
              title={label}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.rightSection}>
        <Button
          variant="ghost"
          size="sm"
          icon={Undo2}
          iconOnly
          onClick={undo}
          disabled={!canUndo()}
          title="실행 취소 (Ctrl+Z)"
        />
        <Button
          variant="ghost"
          size="sm"
          icon={Redo2}
          iconOnly
          onClick={redo}
          disabled={!canRedo()}
          title="다시 실행 (Ctrl+Y)"
        />

        <div className={styles.divider} />

        <Button
          variant={editorState.showGrid ? 'primary' : 'ghost'}
          size="sm"
          icon={Grid3x3}
          iconOnly
          onClick={toggleGrid}
          title="그리드 표시"
        />
        <Button
          variant={editorState.showDimensions ? 'primary' : 'ghost'}
          size="sm"
          icon={Ruler}
          iconOnly
          onClick={toggleDimensions}
          title="치수 표시"
        />

        <div className={styles.divider} />

        <Button
          variant={editorState.isPlaying ? 'primary' : 'ghost'}
          size="sm"
          icon={editorState.isPlaying ? Pause : Play}
          onClick={() => setPlaying(!editorState.isPlaying)}
          title={editorState.isPlaying ? '시뮬레이션 정지' : '시뮬레이션 시작'}
        >
          {editorState.isPlaying ? '정지' : '시뮬레이션'}
        </Button>
      </div>
    </div>
  );
}
