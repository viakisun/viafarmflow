/**
 * ProjectListLayout Component
 * Main screen for viewing and selecting projects
 */

import { useState, useEffect } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { ProjectCard } from './ProjectCard';
import { NewProjectDialog } from '../Dialogs/NewProjectDialog';
import { Dialog } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Plus, Search, FolderOpen } from 'lucide-react';
import type { ProjectListItem } from '../../types/project';
import styles from './ProjectListLayout.module.css';

export interface ProjectListLayoutProps {
  onProjectSelect: (projectId: string) => void;
}

export function ProjectListLayout({ onProjectSelect }: ProjectListLayoutProps) {
  const { createProject, listProjects, getRecentProjects, duplicateProject, deleteProject } = useProject();
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [recentProjects, setRecentProjects] = useState<ProjectListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
    loadRecentProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const result = await listProjects({
        searchQuery: searchQuery || undefined,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      });
      setProjects(result);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentProjects = async () => {
    const result = await getRecentProjects();
    setRecentProjects(result);
  };

  const handleCreateProject = async (name: string, description: string, _templateId: string) => {
    const project = await createProject({
      name,
      description,
      author: 'User', // TODO: Get from user context
    });
    onProjectSelect(project.id);
  };

  const handleDuplicate = async (projectId: string) => {
    await duplicateProject(projectId);
    await loadProjects();
    await loadRecentProjects();
  };

  const handleDelete = async (projectId: string) => {
    await deleteProject(projectId);
    setDeleteConfirm(null);
    await loadProjects();
    await loadRecentProjects();
  };

  const handleSearch = () => {
    loadProjects();
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>ViaFarmFlow</h1>
        <p className={styles.subtitle}>
          Professional 3D Greenhouse Map Editor
        </p>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            prefix={Search}
          />
        </div>
        <div className={styles.actions}>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsNewProjectOpen(true)}
          >
            New Project
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Projects</h2>
            </div>
            <div className={styles.projectGrid}>
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectSelect(project.id)}
                  onDuplicate={() => handleDuplicate(project.id)}
                  onDelete={() => setDeleteConfirm(project.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Projects */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {searchQuery ? 'Search Results' : 'All Projects'}
            </h2>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <FolderOpen size={64} strokeWidth={1} />
              </div>
              <h3 className={styles.emptyTitle}>
                {searchQuery ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className={styles.emptyText}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Create your first project to get started'}
              </p>
              {!searchQuery && (
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setIsNewProjectOpen(true)}
                >
                  Create Project
                </Button>
              )}
            </div>
          ) : (
            <div className={styles.projectGrid}>
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectSelect(project.id)}
                  onDuplicate={() => handleDuplicate(project.id)}
                  onDelete={() => setDeleteConfirm(project.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <NewProjectDialog
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onConfirm={handleCreateProject}
      />

      {deleteConfirm && (
        <Dialog
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      )}
    </div>
  );
}
