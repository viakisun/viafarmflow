/**
 * Button Component
 * Professional black & white button with Lucide icons
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  iconOnly = false,
  fullWidth = false,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    iconOnly && styles.iconOnly,
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {icon && iconPosition === 'left' && !iconOnly && (
        <Icon icon={icon} size={iconSize} />
      )}
      {iconOnly && icon ? (
        <Icon icon={icon} size={iconSize} />
      ) : (
        children
      )}
      {icon && iconPosition === 'right' && !iconOnly && (
        <Icon icon={icon} size={iconSize} />
      )}
    </button>
  );
}
