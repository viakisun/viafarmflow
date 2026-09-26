/**
 * Storage Service
 * IndexedDB wrapper using Dexie for project persistence
 */

import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Project, ProjectListItem } from '../types/project';

export class ViaFarmFlowDatabase extends Dexie {
  projects!: Table<Project, string>;

  constructor() {
    super('ViaFarmFlowDB');

    this.version(1).stores({
      projects: 'id, name, metadata.createdAt, metadata.updatedAt, metadata.tags',
    });
  }
}

// Singleton instance
export const db = new ViaFarmFlowDatabase();

/**
 * Storage Service for project management
 */
export const storageService = {
  /**
   * Save a project to IndexedDB
   */
  async saveProject(project: Project): Promise<void> {
    await db.projects.put(project);
  },

  /**
   * Load a project by ID
   */
  async loadProject(projectId: string): Promise<Project | undefined> {
    return await db.projects.get(projectId);
  },

  /**
   * Delete a project by ID
   */
  async deleteProject(projectId: string): Promise<void> {
    await db.projects.delete(projectId);
  },

  /**
   * List all projects
   */
  async listProjects(): Promise<ProjectListItem[]> {
    const projects = await db.projects.toArray();
    return projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      thumbnail: p.thumbnail,
      createdAt: p.metadata.createdAt,
      updatedAt: p.metadata.updatedAt,
      tags: p.metadata.tags,
    }));
  },

  /**
   * Get recent projects (sorted by updatedAt)
   */
  async getRecentProjects(limit: number = 5): Promise<ProjectListItem[]> {
    const projects = await db.projects
      .orderBy('metadata.updatedAt')
      .reverse()
      .limit(limit)
      .toArray();

    return projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      thumbnail: p.thumbnail,
      createdAt: p.metadata.createdAt,
      updatedAt: p.metadata.updatedAt,
      tags: p.metadata.tags,
    }));
  },

  /**
   * Search projects by name or description
   */
  async searchProjects(query: string): Promise<ProjectListItem[]> {
    const lowerQuery = query.toLowerCase();
    const projects = await db.projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      )
      .toArray();

    return projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      thumbnail: p.thumbnail,
      createdAt: p.metadata.createdAt,
      updatedAt: p.metadata.updatedAt,
      tags: p.metadata.tags,
    }));
  },

  /**
   * Filter projects by tags
   */
  async filterProjectsByTags(tags: string[]): Promise<ProjectListItem[]> {
    const projects = await db.projects
      .filter((p) => tags.some((tag) => p.metadata.tags.includes(tag)))
      .toArray();

    return projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      thumbnail: p.thumbnail,
      createdAt: p.metadata.createdAt,
      updatedAt: p.metadata.updatedAt,
      tags: p.metadata.tags,
    }));
  },

  /**
   * Clear all projects (use with caution!)
   */
  async clearAllProjects(): Promise<void> {
    await db.projects.clear();
  },

  /**
   * Export database as JSON
   */
  async exportDatabase(): Promise<string> {
    const projects = await db.projects.toArray();
    return JSON.stringify(projects, null, 2);
  },

  /**
   * Import database from JSON
   */
  async importDatabase(jsonData: string): Promise<void> {
    const projects = JSON.parse(jsonData) as Project[];
    await db.projects.bulkPut(projects);
  },
};
