// File I/O utilities for importing and exporting map data
import type { HierarchicalMapData } from '../types/mapData';

/**
 * Export map data as JSON file
 */
export function exportMapData(mapData: HierarchicalMapData, filename: string = 'map-data.json') {
  // Convert Map to plain object for JSON serialization
  const exportData = {
    ...mapData,
    objects: Object.fromEntries(mapData.objects),
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Import map data from JSON file
 */
export function importMapData(file: File): Promise<HierarchicalMapData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const parsed = JSON.parse(jsonString);

        // Convert plain object back to Map
        const mapData: HierarchicalMapData = {
          ...parsed,
          objects: new Map(Object.entries(parsed.objects)),
        };

        // Validate the structure
        if (!mapData.version || !mapData.root || !mapData.objects) {
          throw new Error('Invalid map data structure');
        }

        resolve(mapData);
      } catch (error) {
        reject(new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Create a file input element for importing
 */
export function createFileInput(accept: string = '.json'): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.style.display = 'none';
  return input;
}

/**
 * Trigger file import dialog
 */
export function triggerFileImport(onFileSelected: (file: File) => void, accept: string = '.json') {
  const input = createFileInput(accept);

  input.addEventListener('change', (event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
    // Clean up
    document.body.removeChild(input);
  });

  document.body.appendChild(input);
  input.click();
}

/**
 * Generate a filename with timestamp
 */
export function generateFilename(prefix: string = 'viafarm-map'): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}-${timestamp}.json`;
}