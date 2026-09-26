/**
 * ProjectCard Component
 * Card displaying project information in the project list
 */

import type { ProjectListItem } from '../../types/project';
import { Grid3x3, Copy, Trash2 } from 'lucide-react';
import { Icon } from '../UI/Icon';
import { Tooltip } from '../UI/Tooltip';
import styles from './ProjectCard.module.css';

export interface ProjectCardProps {
  project: ProjectListItem;
  onClick: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({
  project,
  onClick,
  onDuplicate,
  onDelete,
}: ProjectCardProps) {
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div
        className={styles.thumbnail}
        style={
          project.thumbnail
            ? { backgroundImage: `url(${project.thumbnail})` }
            : undefined
        }
      >
        {!project.thumbnail && (
          <div className={styles.thumbnailPlaceholder}>
            <Icon icon={Grid3x3} size={48} />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{project.name}</h3>
          <div className={styles.actions}>
            {onDuplicate && (
              <Tooltip content="Duplicate">
                <button
                  className={styles.actionButton}
                  onClick={handleDuplicate}
                  aria-label="Duplicate project"
                >
                  <Icon icon={Copy} size={16} />
                </button>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip content="Delete">
                <button
                  className={`${styles.actionButton} ${styles.danger}`}
                  onClick={handleDelete}
                  aria-label="Delete project"
                >
                  <Icon icon={Trash2} size={16} />
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        {project.description && (
          <p className={styles.description}>{project.description}</p>
        )}

        <div className={styles.footer}>
          <span className={styles.date}>{formatDate(project.updatedAt)}</span>
          {project.tags.length > 0 && (
            <div className={styles.tags}>
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
