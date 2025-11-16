import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  className = ''
}: BadgeProps) {
  const classes = ['badge', `badge-${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}