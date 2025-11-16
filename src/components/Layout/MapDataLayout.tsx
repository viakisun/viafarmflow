import { useState } from 'react';
import { useEditor } from '../../contexts';
import { SceneTree } from '../SceneTree/SceneTree';
import { PropertiesPanel } from '../PropertiesPanel/PropertiesPanel';
import { JsonEditor } from '../JsonEditor/JsonEditor';
import { Icons } from '../Icons';
import styles from './MapDataLayout.module.css';

interface MapDataLayoutProps {
  children: React.ReactNode; // The 3D scene
}

type RightPanelMode = 'properties' | 'json';

export function MapDataLayout({ children }: MapDataLayoutProps) {
  const {
    mapData,
    selectedObject,
    selectObject,
    updateObject,
    deleteObject,
    toggleObjectVisibility,
    toggleObjectLock,
    updateMapData,
  } = useEditor();

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('properties');

  return (
    <div className={styles.container}>
      {/* Left Panel - Scene Tree */}
      <div className={`${styles.leftPanel} ${!leftPanelOpen ? styles.collapsed : ''}`}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>
            <Icons.zones size={16} />
            Scene Hierarchy
          </h3>
          <button
            className={styles.collapseButton}
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            title={leftPanelOpen ? 'Collapse panel' : 'Expand panel'}
          >
            {leftPanelOpen ? <Icons.chevronLeft size={16} /> : <Icons.chevronRight size={16} />}
          </button>
        </div>
        {leftPanelOpen && (
          <div className={styles.panelContent}>
            <SceneTree
              mapData={mapData}
              onSelectObject={selectObject}
              onToggleVisibility={toggleObjectVisibility}
              onToggleLock={toggleObjectLock}
              onDeleteObject={deleteObject}
            />
          </div>
        )}
      </div>

      {/* Center - 3D Scene */}
      <div className={styles.viewport}>
        {children}
      </div>

      {/* Right Panel - Properties/JSON */}
      <div className={`${styles.rightPanel} ${!rightPanelOpen ? styles.collapsed : ''}`}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTabs}>
            <button
              className={`${styles.tabButton} ${rightPanelMode === 'properties' ? styles.active : ''}`}
              onClick={() => setRightPanelMode('properties')}
            >
              <Icons.properties size={14} />
              Properties
            </button>
            <button
              className={`${styles.tabButton} ${rightPanelMode === 'json' ? styles.active : ''}`}
              onClick={() => setRightPanelMode('json')}
            >
              <Icons.data size={14} />
              JSON
            </button>
          </div>
          <button
            className={styles.collapseButton}
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            title={rightPanelOpen ? 'Collapse panel' : 'Expand panel'}
          >
            {rightPanelOpen ? <Icons.chevronRight size={16} /> : <Icons.chevronLeft size={16} />}
          </button>
        </div>
        {rightPanelOpen && (
          <div className={styles.panelContent}>
            {rightPanelMode === 'properties' ? (
              <PropertiesPanel
                selectedObject={selectedObject || null}
                onUpdateObject={updateObject}
              />
            ) : (
              <JsonEditor
                mapData={mapData}
                onUpdateMapData={updateMapData}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}