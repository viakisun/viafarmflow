/**
 * Input Component
 * Professional text input with label, error, and icon support
 */

import type { InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: LucideIcon;
  suffix?: LucideIcon;
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  prefix,
  suffix,
  inputSize = 'md',
  fullWidth = true,
  required,
  className,
  ...props
}: InputProps) {
  const wrapperClasses = [
    styles.wrapper,
    styles[inputSize],
    error && styles.error,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [
    styles.input,
    prefix && styles.hasPrefix,
    suffix && styles.hasSuffix,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = inputSize === 'sm' ? 14 : inputSize === 'lg' ? 18 : 16;

  return (
    <div className={wrapperClasses} style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputContainer}>
        {prefix && (
          <span className={styles.prefix}>
            <Icon icon={prefix} size={iconSize} />
          </span>
        )}
        <input
          className={inputClasses}
          required={required}
          {...props}
        />
        {suffix && (
          <span className={styles.suffix}>
            <Icon icon={suffix} size={iconSize} />
          </span>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
}
