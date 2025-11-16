import { useState } from 'react';
import { Scene } from './Scene';
import { Canvas2D } from './Canvas2D';
import { ViewToggle } from './ViewToggle';
import type { ViewMode } from './ViewToggle';
import { motion, AnimatePresence } from 'framer-motion';
import './SceneContainer.css';

export function SceneContainer() {
  const [viewMode, setViewMode] = useState<ViewMode>('3d');

  return (
    <div className="scene-container">
      <div className="scene-header">
        <ViewToggle onViewChange={setViewMode} defaultView={viewMode} />
      </div>

      <div className="scene-content">
        <AnimatePresence mode="wait">
          {viewMode === '3d' ? (
            <motion.div
              key="3d-view"
              className="view-3d"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Scene />
            </motion.div>
          ) : (
            <motion.div
              key="2d-view"
              className="view-2d"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Canvas2D />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating View Mode Indicator */}
      <div className="view-mode-indicator">
        <span className="view-mode-text">
          {viewMode === '3d' ? '3D Perspective' : '2D Floor Plan'}
        </span>
      </div>
    </div>
  );
}