import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  loading?: boolean;
}

export function IconButton({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  tooltip,
  className = '',
  ...props
}: IconButtonProps) {
  const classes = ['btn-icon', className].filter(Boolean).join(' ');

  return (
    <Button
      variant={variant}
      size={size}
      icon={Icon}
      className={classes}
      title={tooltip}
      aria-label={tooltip}
      {...props}
    />
  );
}