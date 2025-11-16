import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { HierarchicalMapData } from '../../types/mapData';
import { Icons } from '../Icons';
import styles from './JsonEditor.module.css';

interface JsonEditorProps {
  mapData: HierarchicalMapData;
  onUpdateMapData: (data: HierarchicalMapData) => void;
  readOnly?: boolean;
}

export function JsonEditor({ mapData, onUpdateMapData, readOnly = false }: JsonEditorProps) {
  const [jsonString, setJsonString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isFormatted, setIsFormatted] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Convert Map to plain object for JSON serialization
  const mapDataToJson = useCallback((data: HierarchicalMapData) => {
    return JSON.stringify(
      {
        ...data,
        objects: Object.fromEntries(data.objects),
      },
      null,
      isFormatted ? 2 : 0
    );
  }, [isFormatted]);

  // Convert plain object back to Map structure
  const jsonToMapData = useCallback((jsonStr: string): HierarchicalMapData => {
    const parsed = JSON.parse(jsonStr);
    return {
      ...parsed,
      objects: new Map(Object.entries(parsed.objects)),
    };
  }, []);

  // Initialize JSON string from map data
  useEffect(() => {
    const json = mapDataToJson(mapData);
    setJsonString(json);
    setHasChanges(false);
    setError(null);
  }, [mapData, mapDataToJson]);

  // Handle text changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setJsonString(newValue);
    setHasChanges(true);

    // Validate JSON
    try {
      JSON.parse(newValue);
      setError(null);
    } catch (err) {
      setError(`Invalid JSON: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Apply changes
  const handleApply = useCallback(() => {
    try {
      const newData = jsonToMapData(jsonString);
      onUpdateMapData(newData);
      setHasChanges(false);
      setError(null);
    } catch (err) {
      setError(`Failed to apply changes: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [jsonString, jsonToMapData, onUpdateMapData]);

  // Reset to original
  const handleReset = useCallback(() => {
    const json = mapDataToJson(mapData);
    setJsonString(json);
    setHasChanges(false);
    setError(null);
  }, [mapData, mapDataToJson]);

  // Format JSON
  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonString(formatted);
      setIsFormatted(true);
      setError(null);
    } catch (err) {
      setError(`Cannot format invalid JSON`);
    }
  }, [jsonString]);

  // Minify JSON
  const handleMinify = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonString);
      const minified = JSON.stringify(parsed);
      setJsonString(minified);
      setIsFormatted(false);
      setError(null);
    } catch (err) {
      setError(`Cannot minify invalid JSON`);
    }
  }, [jsonString]);

  // Copy to clipboard
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(jsonString);
  }, [jsonString]);

  // Search functionality
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (!term) {
      setSearchResults([]);
      setCurrentSearchIndex(0);
      return;
    }

    const results: number[] = [];
    let index = jsonString.toLowerCase().indexOf(term.toLowerCase());
    while (index !== -1) {
      results.push(index);
      index = jsonString.toLowerCase().indexOf(term.toLowerCase(), index + 1);
    }

    setSearchResults(results);
    setCurrentSearchIndex(0);

    // Scroll to first result
    if (results.length > 0 && textareaRef.current) {
      const lines = jsonString.substring(0, results[0]).split('\n');
      const lineNumber = lines.length;
      textareaRef.current.scrollTop = (lineNumber - 1) * 20; // Approximate line height
    }
  }, [jsonString]);

  // Navigate search results
  const handleSearchNext = useCallback(() => {
    if (searchResults.length === 0) return;
    const nextIndex = (currentSearchIndex + 1) % searchResults.length;
    setCurrentSearchIndex(nextIndex);

    if (textareaRef.current) {
      const position = searchResults[nextIndex];
      const lines = jsonString.substring(0, position).split('\n');
      const lineNumber = lines.length;
      textareaRef.current.scrollTop = (lineNumber - 1) * 20;
    }
  }, [searchResults, currentSearchIndex, jsonString]);

  const handleSearchPrev = useCallback(() => {
    if (searchResults.length === 0) return;
    const prevIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1;
    setCurrentSearchIndex(prevIndex);

    if (textareaRef.current) {
      const position = searchResults[prevIndex];
      const lines = jsonString.substring(0, position).split('\n');
      const lineNumber = lines.length;
      textareaRef.current.scrollTop = (lineNumber - 1) * 20;
    }
  }, [searchResults, currentSearchIndex, jsonString]);

  // Line numbers
  const lineNumbers = useMemo(() => {
    const lines = jsonString.split('\n');
    return lines.map((_, i) => i + 1).join('\n');
  }, [jsonString]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>JSON Editor</h3>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <Icons.search size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
            {searchResults.length > 0 && (
              <div className={styles.searchInfo}>
                {currentSearchIndex + 1}/{searchResults.length}
              </div>
            )}
            <button
              className={styles.searchButton}
              onClick={handleSearchPrev}
              disabled={searchResults.length === 0}
            >
              <Icons.chevronUp size={14} />
            </button>
            <button
              className={styles.searchButton}
              onClick={handleSearchNext}
              disabled={searchResults.length === 0}
            >
              <Icons.chevronDown size={14} />
            </button>
          </div>

          <button
            className={styles.actionButton}
            onClick={handleFormat}
            title="Format JSON"
            disabled={readOnly}
          >
            <Icons.settings size={14} />
          </button>
          <button
            className={styles.actionButton}
            onClick={handleMinify}
            title="Minify JSON"
            disabled={readOnly}
          >
            <Icons.minimize size={14} />
          </button>
          <button
            className={styles.actionButton}
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            <Icons.duplicate size={14} />
          </button>
        </div>
      </div>

      <div className={styles.editorWrapper}>
        <div className={styles.lineNumbers}>
          <pre>{lineNumbers}</pre>
        </div>
        <div className={styles.editor}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={jsonString}
            onChange={handleChange}
            readOnly={readOnly}
            spellCheck={false}
            placeholder="Enter JSON data..."
          />
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <Icons.alertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {hasChanges && !readOnly && (
        <div className={styles.footer}>
          <div className={styles.status}>
            <span className={styles.changesIndicator}>
              <Icons.statusActive size={8} />
              Unsaved changes
            </span>
          </div>
          <div className={styles.actions}>
            <button className={styles.button} onClick={handleReset}>
              Reset
            </button>
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={handleApply}
              disabled={!!error}
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}