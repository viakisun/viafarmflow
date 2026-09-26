/**
 * Project Service
 * Business logic for project CRUD operations
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  Project,
  ProjectListItem,
  CreateProjectParams,
  UpdateProjectParams,
  ProjectFilterOptions,
} from '../types/project';
import { storageService } from './storageService';
import { DEFAULT_GREENHOUSE_CONFIG } from '../constants/defaults';

/**
 * Create a new project
 */
export async function createProject(params: CreateProjectParams): Promise<Project> {
  const now = new Date().toISOString();

  const project: Project = {
    id: uuidv4(),
    name: params.name,
    description: params.description || '',
    thumbnail: '', // Will be generated later
    mapData: params.template?.mapData || {
      config: DEFAULT_GREENHOUSE_CONFIG,
      robots: [],
      waypoints: [],
      zones: [],
      version: '1.0.0',
      createdAt: now,
      updatedAt: now,
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
      author: params.author || 'Unknown',
      tags: [],
      version: '1.0.0',
    },
  };

  await storageService.saveProject(project);
  return project;
}

/**
 * Load a project by ID
 */
export async function loadProject(projectId: string): Promise<Project> {
  const project = await storageService.loadProject(projectId);
  if (!project) {
    throw new Error(`Project with ID ${projectId} not found`);
  }
  return project;
}

/**
 * Update an existing project
 */
export async function updateProject(
  projectId: string,
  params: UpdateProjectParams
): Promise<Project> {
  const project = await loadProject(projectId);

  const updatedProject: Project = {
    ...project,
    name: params.name ?? project.name,
    description: params.description ?? project.description,
    thumbnail: params.thumbnail ?? project.thumbnail,
    mapData: params.mapData ?? project.mapData,
    metadata: {
      ...project.metadata,
      updatedAt: new Date().toISOString(),
      tags: params.tags ?? project.metadata.tags,
    },
  };

  await storageService.saveProject(updatedProject);
  return updatedProject;
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
  await storageService.deleteProject(projectId);
}

/**
 * List all projects with optional filtering
 */
export async function listProjects(
  filter?: ProjectFilterOptions
): Promise<ProjectListItem[]> {
  let projects: ProjectListItem[];

  // Get base list
  if (filter?.tags && filter.tags.length > 0) {
    projects = await storageService.filterProjectsByTags(filter.tags);
  } else if (filter?.searchQuery) {
    projects = await storageService.searchProjects(filter.searchQuery);
  } else {
    projects = await storageService.listProjects();
  }

  // Sort
  if (filter?.sortBy) {
    projects.sort((a, b) => {
      const aValue = a[filter.sortBy as keyof ProjectListItem];
      const bValue = b[filter.sortBy as keyof ProjectListItem];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return filter.sortOrder === 'desc' ? -comparison : comparison;
      }

      return 0;
    });
  }

  return projects;
}

/**
 * Get recent projects
 */
export async function getRecentProjects(limit?: number): Promise<ProjectListItem[]> {
  return await storageService.getRecentProjects(limit);
}

/**
 * Duplicate a project
 */
export async function duplicateProject(projectId: string): Promise<Project> {
  const original = await loadProject(projectId);
  const now = new Date().toISOString();

  const duplicated: Project = {
    ...original,
    id: uuidv4(),
    name: `${original.name} (Copy)`,
    metadata: {
      ...original.metadata,
      createdAt: now,
      updatedAt: now,
    },
    mapData: {
      ...original.mapData,
      createdAt: now,
      updatedAt: now,
    },
  };

  await storageService.saveProject(duplicated);
  return duplicated;
}

/**
 * Export project as JSON
 */
export function exportProjectToJSON(project: Project): string {
  return JSON.stringify(project, null, 2);
}

/**
 * Import project from JSON
 */
export function importProjectFromJSON(jsonData: string): Project {
  try {
    const project = JSON.parse(jsonData) as Project;
    // Validate basic structure
    if (!project.id || !project.name || !project.mapData) {
      throw new Error('Invalid project structure');
    }
    return project;
  } catch (error) {
    throw new Error('Failed to parse project JSON: ' + error);
  }
}
