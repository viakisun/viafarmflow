/**
 * ProjectContext Implementation
 * Manages project state and operations
 */

import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  ProjectContext,
} from './ProjectContextDefinition';
import type {
  ProjectContextType,
  ProjectState,
} from './ProjectContextDefinition';
import type {
  Project,
  ProjectListItem,
  CreateProjectParams,
  UpdateProjectParams,
  ProjectFilterOptions,
} from '../../types/project';
import * as projectService from '../../services/projectService';

interface ProjectProviderProps {
  children: ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [state, setState] = useState<ProjectState>({
    currentProject: null,
    recentProjects: [],
    isLoading: false,
    error: null,
  });

  const [originalProject, setOriginalProject] = useState<Project | null>(null);

  // Create new project
  const createProject = useCallback(async (params: CreateProjectParams): Promise<Project> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const project = await projectService.createProject(params);
      setState((prev) => ({
        ...prev,
        currentProject: project,
        isLoading: false,
      }));
      setOriginalProject(project);
      return project;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create project',
      }));
      throw error;
    }
  }, []);

  // Load project
  const loadProject = useCallback(async (projectId: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const project = await projectService.loadProject(projectId);
      setState((prev) => ({
        ...prev,
        currentProject: project,
        isLoading: false,
      }));
      setOriginalProject(project);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load project',
      }));
      throw error;
    }
  }, []);

  // Save current project
  const saveProject = useCallback(async (): Promise<void> => {
    if (!state.currentProject) {
      throw new Error('No project to save');
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const updated = await projectService.updateProject(state.currentProject.id, {
        mapData: state.currentProject.mapData,
        thumbnail: state.currentProject.thumbnail,
      });
      setState((prev) => ({
        ...prev,
        currentProject: updated,
        isLoading: false,
      }));
      setOriginalProject(updated);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to save project',
      }));
      throw error;
    }
  }, [state.currentProject]);

  // Save as new project
  const saveProjectAs = useCallback(
    async (name: string): Promise<void> => {
      if (!state.currentProject) {
        throw new Error('No project to save');
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const newProject = await projectService.createProject({
          name,
          description: state.currentProject.description,
          author: state.currentProject.metadata.author,
        });

        const updated = await projectService.updateProject(newProject.id, {
          mapData: state.currentProject.mapData,
          tags: state.currentProject.metadata.tags,
        });

        setState((prev) => ({
          ...prev,
          currentProject: updated,
          isLoading: false,
        }));
        setOriginalProject(updated);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to save project as',
        }));
        throw error;
      }
    },
    [state.currentProject]
  );

  // Update project metadata
  const updateProject = useCallback(
    async (params: UpdateProjectParams): Promise<void> => {
      if (!state.currentProject) {
        throw new Error('No project to update');
      }

      console.log('[ProjectContext] updateProject called', {
        timestamp: new Date().toISOString(),
        projectId: state.currentProject.id,
        hasMapData: !!params.mapData,
        stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n'),
      });

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const updated = await projectService.updateProject(state.currentProject.id, params);

        console.log('[ProjectContext] updateProject - setting new state', {
          timestamp: new Date().toISOString(),
          oldProjectRef: state.currentProject,
          newProjectRef: updated,
          sameReference: state.currentProject === updated,
        });

        setState((prev) => ({
          ...prev,
          currentProject: updated,
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to update project',
        }));
        throw error;
      }
    },
    [state.currentProject]
  );

  // Delete project
  const deleteProject = useCallback(async (projectId: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await projectService.deleteProject(projectId);
      setState((prev) => ({
        ...prev,
        currentProject: prev.currentProject?.id === projectId ? null : prev.currentProject,
        isLoading: false,
      }));
      if (state.currentProject?.id === projectId) {
        setOriginalProject(null);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete project',
      }));
      throw error;
    }
  }, [state.currentProject]);

  // Close current project
  const closeProject = useCallback(() => {
    setState((prev) => ({ ...prev, currentProject: null }));
    setOriginalProject(null);
  }, []);

  // List projects
  const listProjects = useCallback(
    async (filter?: ProjectFilterOptions): Promise<ProjectListItem[]> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const projects = await projectService.listProjects(filter);
        setState((prev) => ({ ...prev, isLoading: false }));
        return projects;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to list projects',
        }));
        return [];
      }
    },
    []
  );

  // Get recent projects
  const getRecentProjects = useCallback(async (): Promise<ProjectListItem[]> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const projects = await projectService.getRecentProjects();
      setState((prev) => ({
        ...prev,
        recentProjects: projects,
        isLoading: false,
      }));
      return projects;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get recent projects',
      }));
      return [];
    }
  }, []);

  // Duplicate project
  const duplicateProject = useCallback(async (projectId: string): Promise<Project> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const project = await projectService.duplicateProject(projectId);
      setState((prev) => ({ ...prev, isLoading: false }));
      return project;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to duplicate project',
      }));
      throw error;
    }
  }, []);

  // Check for unsaved changes
  const hasUnsavedChanges = useCallback((): boolean => {
    if (!state.currentProject || !originalProject) {
      return false;
    }

    return (
      JSON.stringify(state.currentProject.mapData) !==
      JSON.stringify(originalProject.mapData)
    );
  }, [state.currentProject, originalProject]);

  // Generate thumbnail (placeholder - will be implemented with screenshot service)
  const generateThumbnail = useCallback(async (): Promise<string> => {
    // TODO: Implement with screenshotService
    // For now, return empty string
    return '';
  }, []);

  const value: ProjectContextType = {
    state,
    createProject,
    loadProject,
    saveProject,
    saveProjectAs,
    updateProject,
    deleteProject,
    closeProject,
    listProjects,
    getRecentProjects,
    duplicateProject,
    hasUnsavedChanges,
    generateThumbnail,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
