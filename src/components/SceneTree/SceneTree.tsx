import { useState, useCallback, useMemo, useEffect } from 'react';
import type { HierarchyObject, HierarchicalMapData, ObjectType } from '../../types/core/hierarchy';
import { Icons } from '../Icons';
import styles from './SceneTree.module.css';

interface SceneTreeProps {
  mapData: HierarchicalMapData;
  onSelectObject: (objectId: string | null) => void;
  onToggleVisibility: (objectId: string) => void;
  onToggleLock: (objectId: string) => void;
  onDeleteObject: (objectId: string) => void;
}

interface TreeNodeProps {
  object: HierarchyObject;
  mapData: HierarchicalMapData;
  expandedNodes: Set<string>;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  isSecondarySelected: boolean;
  onToggleExpand: (objectId: string) => void;
  onSelect: (objectId: string, event: React.MouseEvent) => void;
  onToggleVisibility: (objectId: string) => void;
  onToggleLock: (objectId: string) => void;
  onContextMenu: (objectId: string, event: React.MouseEvent) => void;
}

// Get icon for object type
function getObjectIcon(type: ObjectType) {
  const IconComponent = {
    root: Icons.home,
    group: Icons.zones,
    greenhouse: Icons.home,
    floor: Icons.cube,
    wall: Icons.cube,
    zone: Icons.zones,
    robot: Icons.robot,
    waypoint: Icons.paths,
    path: Icons.paths,
    bed: Icons.cube,
    sensor: Icons.monitor,
    grid: Icons.cube,
    lighting: Icons.monitor,
    axes: Icons.properties,
    infrastructure: Icons.cube,
  }[type];

  return IconComponent || Icons.cube;
}

// Get status color for objects
function getStatusColor(object: MapObject): string | undefined {
  if (object.type === 'robot') {
    const status = (object as any).status;
    switch (status) {
      case 'idle': return '#6b7280';
      case 'moving': return '#10b981';
      case 'working': return '#3b82f6';
      default: return undefined;
    }
  }
  if (object.type === 'zone') {
    return (object as any).color;
  }
  return undefined;
}

function TreeNode({
  object,
  mapData,
  expandedNodes,
  level,
  isExpanded,
  isSelected,
  isSecondarySelected,
  onToggleExpand,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onContextMenu,
}: TreeNodeProps) {
  const hasChildren = object.children && object.children.length > 0;
  const Icon = getObjectIcon(object.type);
  const statusColor = getStatusColor(object);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(object.id);
    }
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility(object.id);
  };

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLock(object.id);
  };

  return (
    <div className={styles.node}>
      <div
        className={`${styles.nodeContent} ${isSelected ? styles.selected : ''} ${
          isSecondarySelected ? styles.secondarySelected : ''
        }`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={(e) => onSelect(object.id, e)}
        onContextMenu={(e) => onContextMenu(object.id, e)}
      >
        <button
          className={`${styles.expandButton} ${!hasChildren ? styles.invisible : ''}`}
          onClick={handleToggleExpand}
        >
          {hasChildren && (
            isExpanded ? (
              <Icons.chevronDown className={styles.expandIcon} />
            ) : (
              <Icons.chevronRight className={styles.expandIcon} />
            )
          )}
        </button>

        <div className={styles.nodeIcon}>
          <Icon size={16} style={{ color: statusColor }} />
        </div>

        <span className={styles.nodeName}>{object.name}</span>

        <div className={styles.nodeActions}>
          <button
            className={`${styles.actionButton} ${!object.visible ? styles.hidden : ''}`}
            onClick={handleToggleVisibility}
            title={object.visible ? 'Hide' : 'Show'}
          >
            {object.visible ? <Icons.view size={14} /> : <Icons.view size={14} />}
          </button>

          <button
            className={`${styles.actionButton} ${object.locked ? styles.locked : ''}`}
            onClick={handleToggleLock}
            title={object.locked ? 'Unlock' : 'Lock'}
          >
            {object.locked ? <Icons.checkCircle size={14} /> : <Icons.statusIdle size={14} />}
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className={styles.children}>
          {object.children.map((childId) => {
            const child = mapData.objects.get(childId);
            if (!child) return null;

            return (
              <TreeNode
                key={child.id}
                object={child}
                mapData={mapData}
                expandedNodes={expandedNodes}
                level={level + 1}
                isExpanded={expandedNodes.has(child.id)}
                isSelected={mapData.selection.primary === child.id}
                isSecondarySelected={mapData.selection.secondary.includes(child.id)}
                onToggleExpand={onToggleExpand}
                onSelect={onSelect}
                onToggleVisibility={onToggleVisibility}
                onToggleLock={onToggleLock}
                onContextMenu={onContextMenu}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SceneTree({
  mapData,
  onSelectObject,
  onToggleVisibility,
  onToggleLock,
  onDeleteObject,
}: SceneTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(mapData.viewSettings.expandedNodes)
  );
  const [contextMenu, setContextMenu] = useState<{
    objectId: string;
    x: number;
    y: number;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // mapData.root가 변경될 때만 초기화 (새로운 맵이 로드된 경우)
  const mapDataRootId = mapData.root.id;
  useEffect(() => {
    setExpandedNodes(new Set(mapData.viewSettings.expandedNodes));
  }, [mapDataRootId]); // root ID가 변경되면 새 맵이 로드된 것

  const handleToggleExpand = useCallback((objectId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(objectId)) {
        next.delete(objectId);
      } else {
        next.add(objectId);
      }
      return next;
    });
  }, []);

  const handleSelect = useCallback(
    (objectId: string, event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) {
        // Multi-select with Ctrl/Cmd
        // This would need to be implemented in the context
      } else {
        onSelectObject(objectId);
      }
    },
    [onSelectObject]
  );

  const handleContextMenu = useCallback((objectId: string, event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      objectId,
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Filter objects based on search
  const filteredData = useMemo(() => {
    if (!searchTerm) return mapData;

    const searchLower = searchTerm.toLowerCase();
    const matchedIds = new Set<string>();

    // Find all matching objects and their ancestors
    mapData.objects.forEach((object) => {
      if (object.name.toLowerCase().includes(searchLower)) {
        matchedIds.add(object.id);
        // Add all ancestors
        let parent = object.parentId;
        while (parent) {
          matchedIds.add(parent);
          parent = mapData.objects.get(parent)?.parentId || null;
        }
      }
    });

    return {
      ...mapData,
      viewSettings: {
        ...mapData.viewSettings,
        expandedNodes: Array.from(matchedIds),
      },
    };
  }, [mapData, searchTerm]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <Icons.search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search objects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.headerButton}
            onClick={() => {
              setExpandedNodes(new Set(Array.from(mapData.objects.keys())));
            }}
            title="Expand All"
          >
            <Icons.chevronDown size={16} />
          </button>
          <button
            className={styles.headerButton}
            onClick={() => {
              setExpandedNodes(new Set());
            }}
            title="Collapse All"
          >
            <Icons.chevronRight size={16} />
          </button>
        </div>
      </div>

      <div className={styles.tree}>
        <TreeNode
          object={filteredData.root}
          mapData={filteredData}
          expandedNodes={expandedNodes}
          level={0}
          isExpanded={expandedNodes.has(filteredData.root.id)}
          isSelected={filteredData.selection.primary === filteredData.root.id}
          isSecondarySelected={filteredData.selection.secondary.includes(filteredData.root.id)}
          onToggleExpand={handleToggleExpand}
          onSelect={handleSelect}
          onToggleVisibility={onToggleVisibility}
          onToggleLock={onToggleLock}
          onContextMenu={handleContextMenu}
        />
      </div>

      {contextMenu && (
        <>
          <div
            className={styles.contextMenuOverlay}
            onClick={handleCloseContextMenu}
          />
          <div
            className={styles.contextMenu}
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            <button
              className={styles.contextMenuItem}
              onClick={() => {
                navigator.clipboard.writeText(contextMenu.objectId);
                handleCloseContextMenu();
              }}
            >
              <Icons.duplicate size={14} />
              Copy ID
            </button>
            <button
              className={styles.contextMenuItem}
              onClick={() => {
                // Duplicate object logic would go here
                handleCloseContextMenu();
              }}
            >
              <Icons.duplicate size={14} />
              Duplicate
            </button>
            <div className={styles.contextMenuDivider} />
            <button
              className={`${styles.contextMenuItem} ${styles.danger}`}
              onClick={() => {
                onDeleteObject(contextMenu.objectId);
                handleCloseContextMenu();
              }}
            >
              <Icons.delete size={14} />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}