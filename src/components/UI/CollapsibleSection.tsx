import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './Badge';

interface CollapsibleSectionProps {
  title: string;
  icon?: LucideIcon;
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
  onToggle?: (isOpen: boolean) => void;
}

export function CollapsibleSection({
  title,
  icon: Icon,
  badge,
  badgeVariant = 'default',
  defaultOpen = true,
  className = '',
  children,
  onToggle
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const storageKey = `collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`;

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setIsOpen(saved === 'true');
    }
  }, [storageKey]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem(storageKey, String(newState));
    onToggle?.(newState);
  };

  return (
    <div className={`collapsible-section ${className}`}>
      <button
        className="collapsible-header"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <div className="collapsible-header-content">
          <span className="collapsible-chevron">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          {Icon && <Icon size={16} className="collapsible-icon" />}
          <span className="collapsible-title">{title}</span>
          {badge !== undefined && (
            <Badge variant={badgeVariant}>{badge}</Badge>
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="collapsible-content"
          >
            <div className="collapsible-body">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}