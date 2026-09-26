/**
 * NewSidebar - Black & White Design
 * Tab-based sidebar with panels
 */

import { useState } from 'react';
import { PropertiesPanel } from './Panels/PropertiesPanel';
import { RobotsPanel } from './Panels/RobotsPanel';
import { PathsPanel } from './Panels/PathsPanel';
import { ZonesPanel } from './Panels/ZonesPanel';
import { ObjectsPanel } from './Panels/ObjectsPanel';
import { FileText, Bot, Route, Square, Eye } from 'lucide-react';
import styles from './NewSidebar.module.css';

type SidebarTab = 'properties' | 'robots' | 'paths' | 'zones' | 'objects';

const TABS: Array<{ id: SidebarTab; icon: typeof FileText; label: string }> = [
  { id: 'properties', icon: FileText, label: '속성' },
  { id: 'robots', icon: Bot, label: '로봇' },
  { id: 'paths', icon: Route, label: '경로' },
  { id: 'zones', icon: Square, label: '구역' },
  { id: 'objects', icon: Eye, label: '오브젝트' },
];

export function NewSidebar() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('properties');

  return (
    <div className={styles.sidebar}>
      <div className={styles.tabs}>
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`${styles.tab} ${activeTab === id ? styles.active : ''}`}
            onClick={() => setActiveTab(id)}
            title={label}
          >
            <Icon size={18} />
            <span className={styles.tabLabel}>{label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === 'properties' && <PropertiesPanel />}
        {activeTab === 'robots' && <RobotsPanel />}
        {activeTab === 'paths' && <PathsPanel />}
        {activeTab === 'zones' && <ZonesPanel />}
        {activeTab === 'objects' && <ObjectsPanel />}
      </div>
    </div>
  );
}
