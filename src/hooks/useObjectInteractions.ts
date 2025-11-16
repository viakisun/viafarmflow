import { useEffect, useCallback } from 'react';
import { useEditor } from '../contexts';
import { notify } from '../components/Notifications';

export function useObjectInteractions() {
  const {
    selectedObject,
    deleteObject,
    toggleObjectVisibility,
    toggleObjectLock,
    setTransformMode,
    editorState,
  } = useEditor();

  const { transformMode } = editorState;

  // Delete selected object with confirmation
  const handleDelete = useCallback(() => {
    if (!selectedObject) return;

    // Don't delete the root greenhouse
    if (selectedObject.type === 'greenhouse') {
      notify.warning('Cannot delete greenhouse', 'The root greenhouse cannot be deleted');
      return;
    }

    // Check if object is locked
    if (selectedObject.locked) {
      notify.warning('Object is locked', 'Unlock the object before deleting');
      return;
    }

    // Show confirmation
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${selectedObject.name}"?\n\n` +
      `Type: ${selectedObject.type}\n` +
      `ID: ${selectedObject.id}\n` +
      (selectedObject.children?.length > 0
        ? `\nThis will also delete ${selectedObject.children.length} child object(s)!`
        : '')
    );

    if (confirmDelete) {
      deleteObject(selectedObject.id);
      notify.success('Object deleted', `${selectedObject.name} has been deleted`);
    }
  }, [selectedObject, deleteObject]);

  // Toggle visibility
  const handleToggleVisibility = useCallback(() => {
    if (!selectedObject) return;
    toggleObjectVisibility(selectedObject.id);
    notify.info(
      selectedObject.visible ? 'Object hidden' : 'Object shown',
      `${selectedObject.name} is now ${selectedObject.visible ? 'hidden' : 'visible'}`
    );
  }, [selectedObject, toggleObjectVisibility]);

  // Toggle lock
  const handleToggleLock = useCallback(() => {
    if (!selectedObject) return;
    toggleObjectLock(selectedObject.id);
    notify.info(
      selectedObject.locked ? 'Object unlocked' : 'Object locked',
      `${selectedObject.name} is now ${selectedObject.locked ? 'unlocked' : 'locked'}`
    );
  }, [selectedObject, toggleObjectLock]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'delete':
        case 'backspace':
          if (e.shiftKey || e.metaKey || e.ctrlKey) {
            return; // Prevent accidental deletions with modifiers
          }
          e.preventDefault();
          handleDelete();
          break;

        case 'h':
          if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            handleToggleVisibility();
          }
          break;

        case 'l':
          if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            handleToggleLock();
          }
          break;

        case 'g':
          if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setTransformMode('translate');
            notify.info('Transform Mode', 'Translate (Move) mode activated');
          }
          break;

        case 'r':
          if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setTransformMode('rotate');
            notify.info('Transform Mode', 'Rotate mode activated');
          }
          break;

        case 's':
          if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setTransformMode('scale');
            notify.info('Transform Mode', 'Scale mode activated');
          }
          break;

        case 'escape':
          // Cancel transform or deselect
          e.preventDefault();
          // Optionally deselect object
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handleDelete,
    handleToggleVisibility,
    handleToggleLock,
    setTransformMode
  ]);

  return {
    handleDelete,
    handleToggleVisibility,
    handleToggleLock,
    transformMode,
  };
}