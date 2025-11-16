import { useState } from 'react';
import { Icons } from '../Icons';
import './ViewToggle.css';

export type ViewMode = '2d' | '3d';

interface ViewToggleProps {
  onViewChange: (mode: ViewMode) => void;
  defaultView?: ViewMode;
}

export function ViewToggle({ onViewChange, defaultView = '3d' }: ViewToggleProps) {
  const [currentView, setCurrentView] = useState<ViewMode>(defaultView);

  const handleViewChange = (mode: ViewMode) => {
    setCurrentView(mode);
    onViewChange(mode);
  };

  return (
    <div className="view-toggle">
      <button
        className={`view-toggle-btn ${currentView === '2d' ? 'active' : ''}`}
        onClick={() => handleViewChange('2d')}
        title="2D Floor Plan View"
      >
        <Icons.grid size={20} />
        <span>2D</span>
      </button>
      <button
        className={`view-toggle-btn ${currentView === '3d' ? 'active' : ''}`}
        onClick={() => handleViewChange('3d')}
        title="3D Perspective View"
      >
        <Icons.cube size={20} />
        <span>3D</span>
      </button>
      <div
        className="view-toggle-indicator"
        style={{
          transform: `translateX(${currentView === '2d' ? '0' : '100%'})`
        }}
      />
    </div>
  );
}