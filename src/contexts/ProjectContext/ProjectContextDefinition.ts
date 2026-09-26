/**
 * ProjectContext Type Definitions
 * Context interface for project management
 */

import { createContext } from 'react';
import type {
  Project,
  ProjectListItem,
  CreateProjectParams,
  UpdateProjectParams,
  ProjectFilterOptions,
} from '../../types/project';

export interface ProjectState {
  currentProject: Project | null;
  recentProjects: ProjectListItem[];
  isLoading: boolean;
  error: string | null;
}

export interface ProjectContextType {
  // State
  state: ProjectState;

  // Project CRUD operations
  createProject: (params: CreateProjectParams) => Promise<Project>;
  loadProject: (projectId: string) => Promise<void>;
  saveProject: () => Promise<void>;
  saveProjectAs: (name: string) => Promise<void>;
  updateProject: (params: UpdateProjectParams) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  closeProject: () => void;

  // Project list operations
  listProjects: (filter?: ProjectFilterOptions) => Promise<ProjectListItem[]>;
  getRecentProjects: () => Promise<ProjectListItem[]>;
  duplicateProject: (projectId: string) => Promise<Project>;

  // Utility
  hasUnsavedChanges: () => boolean;
  generateThumbnail: () => Promise<string>;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);
