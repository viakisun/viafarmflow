/**
 * useHistory Hook
 * Hook to access HistoryContext
 */

import { useContext } from 'react';
import { HistoryContext } from './HistoryContextDefinition';
import type { HistoryContextType } from './HistoryContextDefinition';

export function useHistory(): HistoryContextType {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
}
