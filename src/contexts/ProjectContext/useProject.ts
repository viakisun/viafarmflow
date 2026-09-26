/**
 * useProject Hook
 * Hook to access ProjectContext
 */

import { useContext } from 'react';
import { ProjectContext } from './ProjectContextDefinition';
import type { ProjectContextType } from './ProjectContextDefinition';

export function useProject(): ProjectContextType {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}
