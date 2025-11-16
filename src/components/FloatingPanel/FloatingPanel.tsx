import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../Icons';
import './FloatingPanel.css';

export interface FloatingPanelProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  width?: string;
  height?: string;
  draggable?: boolean;
}

export function FloatingPanel({
  title,
  children,
  isOpen,
  onClose,
  position = 'center',
  width = '400px',
  height = 'auto',
  draggable = true
}: FloatingPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Calculate initial position based on position prop
  useEffect(() => {
    if (position === 'center') {
      setPanelPosition({ x: 0, y: 0 });
    } else {
      const offset = 20;
      let x = 0;
      let y = 0;

      if (position.includes('left')) x = -window.innerWidth / 2 + 200 + offset;
      if (position.includes('right')) x = window.innerWidth / 2 - 200 - offset;
      if (position.includes('top')) y = -window.innerHeight / 2 + 100 + offset;
      if (position.includes('bottom')) y = window.innerHeight / 2 - 200 - offset;

      setPanelPosition({ x, y });
    }
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable) return;

    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPanelPosition({
        x: e.clientX - window.innerWidth / 2 - dragOffset.x,
        y: e.clientY - window.innerHeight / 2 - dragOffset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="floating-panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            className={`floating-panel ${isDragging ? 'dragging' : ''}`}
            style={{
              width,
              height,
              transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`
            }}
            initial={{
              opacity: 0,
              scale: 0.9,
              filter: 'blur(10px)'
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)'
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              filter: 'blur(10px)'
            }}
            transition={{
              duration: 0.2,
              ease: 'easeOut'
            }}
          >
            <div
              className="floating-panel-header"
              onMouseDown={handleMouseDown}
            >
              <h3 className="floating-panel-title">{title}</h3>
              <button
                className="floating-panel-close"
                onClick={onClose}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Icons.close size={16} />
              </button>
            </div>
            <div className="floating-panel-content">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}