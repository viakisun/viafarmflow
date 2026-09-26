/**
 * NewProjectDialog Component
 * Dialog for creating a new project
 */

import { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Grid3x3, Box, Maximize } from 'lucide-react';
import { Icon } from '../UI/Icon';
import styles from './NewProjectDialog.module.css';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: typeof Grid3x3;
}

const TEMPLATES: Template[] = [
  {
    id: 'empty',
    name: 'Empty',
    description: 'Start with an empty greenhouse',
    icon: Grid3x3,
  },
  {
    id: 'small',
    name: 'Small',
    description: 'Small greenhouse (20m x 40m)',
    icon: Box,
  },
  {
    id: 'large',
    name: 'Large',
    description: 'Large greenhouse (50m x 100m)',
    icon: Maximize,
  },
];

export interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, description: string, templateId: string) => void;
}

export function NewProjectDialog({
  isOpen,
  onClose,
  onConfirm,
}: NewProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('empty');
  const [nameError, setNameError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Project name is required');
      return;
    }

    onConfirm(name, description, selectedTemplate);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedTemplate('empty');
    setNameError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Project"
      size="md"
      footer={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Project
          </Button>
        </>
      }
    >
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className={styles.inputGroup}>
          <Input
            label="Project Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError('');
            }}
            placeholder="My Greenhouse Project"
            required
            error={nameError}
            autoFocus
          />

          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: 'var(--space-2)',
              color: 'var(--color-text-primary)',
            }}
          >
            Template
          </label>
          <div className={styles.templates}>
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                className={`${styles.template} ${
                  selectedTemplate === template.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className={styles.templateIcon}>
                  <Icon icon={template.icon} size={32} />
                </div>
                <span className={styles.templateName}>{template.name}</span>
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}
