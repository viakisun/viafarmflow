/**
 * Card Component
 * Simple container with border
 */

import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'outlined' | 'filled';
  padding?: 'compact' | 'default' | 'comfortable';
  interactive?: boolean;
  selected?: boolean;
}

export function Card({
  children,
  variant = 'outlined',
  padding = 'default',
  interactive = false,
  selected = false,
  className,
  ...props
}: CardProps) {
  const classNames = [
    styles.card,
    styles[variant],
    padding !== 'default' && styles[padding],
    interactive && styles.interactive,
    selected && styles.selected,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}
