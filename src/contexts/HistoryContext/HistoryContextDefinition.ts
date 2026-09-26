/**
 * HistoryContext Type Definitions
 * Context interface for undo/redo system
 */

import { createContext } from 'react';
import type { ICommand } from './commands';

export interface HistoryState {
  history: ICommand[];
  currentIndex: number;
  maxHistorySize: number;
}

export interface HistoryContextType {
  // State
  state: HistoryState;

  // Execute a command and add it to history
  execute: (command: ICommand) => void;

  // Undo the last command
  undo: () => void;

  // Redo the next command
  redo: () => void;

  // Clear all history
  clear: () => void;

  // Check if undo is available
  canUndo: () => boolean;

  // Check if redo is available
  canRedo: () => boolean;

  // Get the command that will be undone
  getUndoCommand: () => ICommand | null;

  // Get the command that will be redone
  getRedoCommand: () => ICommand | null;
}

export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);
