/**
 * HistoryContext Implementation
 * Manages undo/redo history using Command Pattern
 */

import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  HistoryContext,
} from './HistoryContextDefinition';
import type {
  HistoryContextType,
  HistoryState,
} from './HistoryContextDefinition';
import type { ICommand } from './commands';

interface HistoryProviderProps {
  children: ReactNode;
  maxHistorySize?: number;
}

export function HistoryProvider({
  children,
  maxHistorySize = 50,
}: HistoryProviderProps) {
  const [state, setState] = useState<HistoryState>({
    history: [],
    currentIndex: -1,
    maxHistorySize,
  });

  /**
   * Execute a command and add it to history
   */
  const execute = useCallback((command: ICommand) => {
    if (!command.canExecute()) {
      return;
    }

    // Execute the command
    command.execute();

    setState((prev) => {
      // Remove any commands after current index (when undoing then executing new command)
      const newHistory = prev.history.slice(0, prev.currentIndex + 1);

      // Add new command
      newHistory.push(command);

      // Limit history size
      const trimmedHistory =
        newHistory.length > prev.maxHistorySize
          ? newHistory.slice(newHistory.length - prev.maxHistorySize)
          : newHistory;

      return {
        ...prev,
        history: trimmedHistory,
        currentIndex: trimmedHistory.length - 1,
      };
    });
  }, []);

  /**
   * Undo the last command
   */
  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex < 0) {
        return prev;
      }

      const command = prev.history[prev.currentIndex];
      command.undo();

      return {
        ...prev,
        currentIndex: prev.currentIndex - 1,
      };
    });
  }, []);

  /**
   * Redo the next command
   */
  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex >= prev.history.length - 1) {
        return prev;
      }

      const nextIndex = prev.currentIndex + 1;
      const command = prev.history[nextIndex];
      command.redo();

      return {
        ...prev,
        currentIndex: nextIndex,
      };
    });
  }, []);

  /**
   * Clear all history
   */
  const clear = useCallback(() => {
    setState((prev) => ({
      ...prev,
      history: [],
      currentIndex: -1,
    }));
  }, []);

  /**
   * Check if undo is available
   */
  const canUndo = useCallback((): boolean => {
    return state.currentIndex >= 0;
  }, [state.currentIndex]);

  /**
   * Check if redo is available
   */
  const canRedo = useCallback((): boolean => {
    return state.currentIndex < state.history.length - 1;
  }, [state.currentIndex, state.history.length]);

  /**
   * Get the command that will be undone
   */
  const getUndoCommand = useCallback((): ICommand | null => {
    if (!canUndo()) {
      return null;
    }
    return state.history[state.currentIndex];
  }, [state.history, state.currentIndex, canUndo]);

  /**
   * Get the command that will be redone
   */
  const getRedoCommand = useCallback((): ICommand | null => {
    if (!canRedo()) {
      return null;
    }
    return state.history[state.currentIndex + 1];
  }, [state.history, state.currentIndex, canRedo]);

  const value: HistoryContextType = {
    state,
    execute,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
    getUndoCommand,
    getRedoCommand,
  };

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}
