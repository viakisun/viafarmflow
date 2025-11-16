import { useState, useCallback, useEffect } from 'react';
import type { MapObject } from '../../types/mapData';
import { Icons } from '../Icons';
import styles from './PropertiesPanel.module.css';

interface PropertiesPanelProps {
  selectedObject: MapObject | null;
  onUpdateObject: (objectId: string, updates: Partial<MapObject>) => void;
  onClose?: () => void;
}

interface PropertyFieldProps {
  label: string;
  value: any;
  type?: 'text' | 'number' | 'color' | 'select' | 'boolean' | 'position';
  options?: { value: string; label: string }[];
  onChange: (value: any) => void;
  disabled?: boolean;
}

function PropertyField({
  label,
  value,
  type = 'text',
  options,
  onChange,
  disabled = false,
}: PropertyFieldProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const newValue = type === 'number'
        ? parseFloat(e.target.value)
        : type === 'boolean'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
      onChange(newValue);
    },
    [type, onChange]
  );

  if (type === 'boolean') {
    return (
      <div className={styles.field}>
        <label className={styles.fieldLabel}>
          <input
            type="checkbox"
            checked={value}
            onChange={handleChange}
            disabled={disabled}
            className={styles.checkbox}
          />
          {label}
        </label>
      </div>
    );
  }

  if (type === 'position') {
    return (
      <div className={styles.field}>
        <label className={styles.fieldLabel}>{label}</label>
        <div className={styles.positionInputs}>
          <div className={styles.positionField}>
            <span>X</span>
            <input
              type="number"
              value={value?.x || 0}
              onChange={(e) => onChange({ ...value, x: parseFloat(e.target.value) })}
              disabled={disabled}
              className={styles.positionInput}
              step="0.1"
            />
          </div>
          <div className={styles.positionField}>
            <span>Y</span>
            <input
              type="number"
              value={value?.y || 0}
              onChange={(e) => onChange({ ...value, y: parseFloat(e.target.value) })}
              disabled={disabled}
              className={styles.positionInput}
              step="0.1"
            />
          </div>
          <div className={styles.positionField}>
            <span>Z</span>
            <input
              type="number"
              value={value?.z || 0}
              onChange={(e) => onChange({ ...value, z: parseFloat(e.target.value) })}
              disabled={disabled}
              className={styles.positionInput}
              step="0.1"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {type === 'select' && options ? (
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={styles.select}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'color' ? (
        <div className={styles.colorField}>
          <input
            type="color"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={styles.colorInput}
          />
          <input
            type="text"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={styles.colorText}
            placeholder="#000000"
          />
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={styles.input}
          step={type === 'number' ? '0.1' : undefined}
        />
      )}
    </div>
  );
}

export function PropertiesPanel({
  selectedObject,
  onUpdateObject,
  onClose,
}: PropertiesPanelProps) {
  const [localObject, setLocalObject] = useState<MapObject | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (selectedObject) {
      setLocalObject(JSON.parse(JSON.stringify(selectedObject)));
      setHasChanges(false);
    } else {
      setLocalObject(null);
    }
  }, [selectedObject]);

  const handleFieldChange = useCallback((field: string, value: any) => {
    if (!localObject) return;

    const updatedObject = { ...localObject };

    // Handle nested properties
    if (field.includes('.')) {
      const parts = field.split('.');
      let current: any = updatedObject;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
    } else {
      (updatedObject as any)[field] = value;
    }

    setLocalObject(updatedObject);
    setHasChanges(true);
  }, [localObject]);

  const handleApply = useCallback(() => {
    if (localObject && hasChanges) {
      onUpdateObject(localObject.id, localObject);
      setHasChanges(false);
    }
  }, [localObject, hasChanges, onUpdateObject]);

  const handleReset = useCallback(() => {
    if (selectedObject) {
      setLocalObject(JSON.parse(JSON.stringify(selectedObject)));
      setHasChanges(false);
    }
  }, [selectedObject]);

  if (!localObject) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <Icons.properties size={48} className={styles.emptyIcon} />
          <p>Select an object to view its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h3 className={styles.title}>Properties</h3>
          <span className={styles.objectType}>{localObject.type}</span>
        </div>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            <Icons.close size={16} />
          </button>
        )}
      </div>

      <div className={styles.content}>
        {/* Basic Properties */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Basic</h4>

          <PropertyField
            label="ID"
            value={localObject.id}
            onChange={() => {}}
            disabled
          />

          <PropertyField
            label="Name"
            value={localObject.name}
            onChange={(v) => handleFieldChange('name', v)}
          />

          <PropertyField
            label="Visible"
            value={localObject.visible}
            type="boolean"
            onChange={(v) => handleFieldChange('visible', v)}
          />

          <PropertyField
            label="Locked"
            value={localObject.locked}
            type="boolean"
            onChange={(v) => handleFieldChange('locked', v)}
          />
        </div>

        {/* Type-specific properties */}
        {localObject.type === 'robot' && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Robot Settings</h4>

            <PropertyField
              label="Position"
              value={(localObject as any).position}
              type="position"
              onChange={(v) => handleFieldChange('position', v)}
              disabled={localObject.locked}
            />

            <PropertyField
              label="Rotation"
              value={(localObject as any).rotation}
              type="number"
              onChange={(v) => handleFieldChange('rotation', v)}
              disabled={localObject.locked}
            />

            <PropertyField
              label="Status"
              value={(localObject as any).status}
              type="select"
              options={[
                { value: 'idle', label: 'Idle' },
                { value: 'moving', label: 'Moving' },
                { value: 'working', label: 'Working' },
              ]}
              onChange={(v) => handleFieldChange('status', v)}
            />

            <PropertyField
              label="Model"
              value={(localObject as any).model}
              onChange={(v) => handleFieldChange('model', v)}
            />
          </div>
        )}

        {localObject.type === 'zone' && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Zone Settings</h4>

            <PropertyField
              label="Color"
              value={(localObject as any).color}
              type="color"
              onChange={(v) => handleFieldChange('color', v)}
            />

            <PropertyField
              label="Points"
              value={`${(localObject as any).points?.length || 0} vertices`}
              onChange={() => {}}
              disabled
            />

            <PropertyField
              label="Assigned Robots"
              value={`${(localObject as any).assignedRobotIds?.length || 0} robots`}
              onChange={() => {}}
              disabled
            />
          </div>
        )}

        {localObject.type === 'waypoint' && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Waypoint Settings</h4>

            <PropertyField
              label="Position"
              value={(localObject as any).position}
              type="position"
              onChange={(v) => handleFieldChange('position', v)}
              disabled={localObject.locked}
            />

            <PropertyField
              label="Order"
              value={(localObject as any).order}
              type="number"
              onChange={(v) => handleFieldChange('order', v)}
            />

            <PropertyField
              label="Wait Time (s)"
              value={(localObject as any).waitTime || 0}
              type="number"
              onChange={(v) => handleFieldChange('waitTime', v)}
            />

            <PropertyField
              label="Action"
              value={(localObject as any).action || ''}
              onChange={(v) => handleFieldChange('action', v)}
            />
          </div>
        )}

        {localObject.type === 'grid' && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Grid Settings</h4>

            <PropertyField
              label="가로 크기 (sizeX)"
              value={(localObject as any).sizeX}
              type="number"
              onChange={(v) => handleFieldChange('sizeX', v)}
              disabled={localObject.locked}
            />

            <PropertyField
              label="세로 크기 (sizeZ)"
              value={(localObject as any).sizeZ}
              type="number"
              onChange={(v) => handleFieldChange('sizeZ', v)}
              disabled={localObject.locked}
            />

            <PropertyField
              label="가로 분할 (divisionsX)"
              value={(localObject as any).divisionsX}
              type="number"
              onChange={(v) => handleFieldChange('divisionsX', v)}
              disabled={localObject.locked}
            />

            <PropertyField
              label="세로 분할 (divisionsZ)"
              value={(localObject as any).divisionsZ}
              type="number"
              onChange={(v) => handleFieldChange('divisionsZ', v)}
              disabled={localObject.locked}
            />

            <PropertyField
              label="페이드 거리"
              value={(localObject as any).fadeDistance}
              type="number"
              onChange={(v) => handleFieldChange('fadeDistance', v)}
              disabled={localObject.locked}
            />

            <PropertyField
              label="페이드 강도"
              value={(localObject as any).fadeStrength}
              type="number"
              onChange={(v) => handleFieldChange('fadeStrength', v)}
              disabled={localObject.locked}
            />
          </div>
        )}

        {localObject.type === 'sensor' && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Sensor Settings</h4>

            <PropertyField
              label="Position"
              value={(localObject as any).position}
              type="position"
              onChange={(v) => handleFieldChange('position', v)}
              disabled={localObject.locked}
            />

            <PropertyField
              label="Type"
              value={(localObject as any).sensorType}
              type="select"
              options={[
                { value: 'temperature', label: 'Temperature' },
                { value: 'humidity', label: 'Humidity' },
                { value: 'light', label: 'Light' },
                { value: 'ph', label: 'pH' },
                { value: 'moisture', label: 'Moisture' },
              ]}
              onChange={(v) => handleFieldChange('sensorType', v)}
            />

            <PropertyField
              label="Value"
              value={(localObject as any).value}
              type="number"
              onChange={(v) => handleFieldChange('value', v)}
            />

            <PropertyField
              label="Unit"
              value={(localObject as any).unit}
              onChange={(v) => handleFieldChange('unit', v)}
            />
          </div>
        )}

        {localObject.type === 'greenhouse' && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Greenhouse Dimensions</h4>

            <PropertyField
              label="Width (m)"
              value={(localObject as any).config?.dimensions?.width}
              type="number"
              onChange={(v) => handleFieldChange('config.dimensions.width', v)}
            />

            <PropertyField
              label="Height (m)"
              value={(localObject as any).config?.dimensions?.height}
              type="number"
              onChange={(v) => handleFieldChange('config.dimensions.height', v)}
            />

            <PropertyField
              label="Length (m)"
              value={(localObject as any).config?.dimensions?.length}
              type="number"
              onChange={(v) => handleFieldChange('config.dimensions.length', v)}
            />
          </div>
        )}

        {/* Metadata section */}
        {localObject.metadata && Object.keys(localObject.metadata).length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Metadata</h4>
            {Object.entries(localObject.metadata).map(([key, value]) => (
              <PropertyField
                key={key}
                label={key}
                value={String(value)}
                onChange={(v) => handleFieldChange(`metadata.${key}`, v)}
              />
            ))}
          </div>
        )}
      </div>

      {hasChanges && (
        <div className={styles.footer}>
          <button className={styles.button} onClick={handleReset}>
            Reset
          </button>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleApply}>
            Apply Changes
          </button>
        </div>
      )}
    </div>
  );
}