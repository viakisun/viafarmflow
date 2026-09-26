/**
 * Project Type Definitions
 * Multi-project management system types
 */

import type { MapData } from './greenhouse';

export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail: string; // base64 encoded image (black & white top-down view)
  mapData: MapData;
  metadata: ProjectMetadata;
}

export interface ProjectMetadata {
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  author: string;
  tags: string[];
  version: string; // Project format version
}

export interface ProjectListItem {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  mapData: MapData;
  tags: string[];
}

// Project creation parameters
export interface CreateProjectParams {
  name: string;
  description?: string;
  template?: ProjectTemplate;
  author?: string;
}

// Project update parameters
export interface UpdateProjectParams {
  name?: string;
  description?: string;
  tags?: string[];
  mapData?: MapData;
  thumbnail?: string;
}

// Project filter/sort options
export interface ProjectFilterOptions {
  tags?: string[];
  searchQuery?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}
