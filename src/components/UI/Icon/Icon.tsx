/**
 * Icon Component
 * Wrapper for Lucide React icons with consistent sizing and styling
 */

import type { LucideIcon, LucideProps } from 'lucide-react';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
  size?: number | string;
}

export function Icon({ icon: IconComponent, size = 16, ...props }: IconProps) {
  return <IconComponent size={size} strokeWidth={1.5} {...props} />;
}
