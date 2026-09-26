/**
 * Tooltip Component
 * Simple hover tooltip with black background
 */

import { useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
  delay?: number;
}

export function Tooltip({
  content,
  position = 'top',
  children,
  delay = 200,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleMouseEnter = () => {
    const id = window.setTimeout(() => setVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setVisible(false);
  };

  return (
    <div
      className={styles.tooltip}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        className={`${styles.content} ${styles[position]} ${visible ? styles.visible : ''}`}
      >
        {content}
        <div className={styles.arrow} />
      </div>
    </div>
  );
}
