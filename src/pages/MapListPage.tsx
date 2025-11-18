import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mapService } from '../services/mapService';
import { initializeSampleMap } from '../utils/initializeSampleMap';
import type { StaticMapData } from '../types/staticMapData';
import { Icons } from '../components/Icons';
import { DEFAULT_SCENE_ELEMENTS } from '../types/core/scene';
import './MapListPage.css';

interface MapMetadata {
  id: string;
  data: StaticMapData;
}

export function MapListPage() {
  const [maps, setMaps] = useState<MapMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initializeAndLoadMaps();
  }, []);

  const initializeAndLoadMaps = async () => {
    // 샘플 맵 초기화
    await initializeSampleMap();
    // 맵 목록 로드
    await loadMaps();
  };

  const loadMaps = async () => {
    try {
      const mapList = await mapService.listMaps();
      setMaps(mapList);
    } catch (error) {
      console.error('Failed to load maps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMap = (mapId: string) => {
    navigate(`/editor/${mapId}`);
  };

  const handleCreateMap = () => {
    setShowCreateDialog(true);
  };

  const handleDeleteMap = async (mapId: string, mapName: string) => {
    if (!confirm(`Delete map "${mapName}"?`)) return;

    try {
      localStorage.removeItem(`viafarm-map-${mapId}`);
      await loadMaps();
    } catch (error) {
      console.error('Failed to delete map:', error);
    }
  };

  const handleNewMapSubmit = (name: string, description: string) => {
    // 새 맵 ID 생성
    const newMapId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 기본 맵 데이터 생성 (완전히 비어있는 상태)
    const newMapData: StaticMapData = {
      version: '1.0',
      metadata: {
        id: newMapId,
        name,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        author: 'User',
      },
      greenhouse: {
        floorBoundaries: [],
        wallHeight: 8,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        dimensions: { x: 40, y: 8, z: 100 },
      },
      beds: {
        specification: {
          width: 1.2,
          height: 0.3,
          defaultLength: 5,
        },
        layout: {
          type: 'custom',
          startPosition: { x: 0, y: 0, z: 0 },
          count: 0,
          spacing: 0,
          direction: 'z',
          rows: 0,
          rowSpacing: 0,
        },
        instances: [],
      },
      zones: [],
      sceneSettings: DEFAULT_SCENE_ELEMENTS,
    };

    // localStorage에 저장
    mapService.saveStaticMap(newMapId, newMapData);

    // 에디터로 이동 (Floor 모드로 시작)
    navigate(`/editor/${newMapId}`);
  };

  if (loading) {
    return (
      <div className="map-list-page loading">
        <div className="loading-spinner">Loading maps...</div>
      </div>
    );
  }

  return (
    <div className="map-list-page">
      <header className="map-list-header">
        <div className="header-content">
          <div className="header-title">
            <Icons.activity size={32} className="logo-icon" />
            <h1>ViaFarmFlow</h1>
          </div>
          <button className="btn-primary" onClick={handleCreateMap}>
            <Icons.add size={20} />
            <span>New Map</span>
          </button>
        </div>
      </header>

      <main className="map-list-content">
        {maps.length === 0 ? (
          <div className="empty-state">
            <Icons.home size={64} className="empty-icon" />
            <h2>No maps yet</h2>
            <p>Create your first greenhouse map to get started</p>
            <button className="btn-primary" onClick={handleCreateMap}>
              <Icons.add size={20} />
              <span>Create Map</span>
            </button>
          </div>
        ) : (
          <div className="map-grid">
            {maps.map((map) => (
              <div key={map.id} className="map-card">
                <div className="map-card-preview">
                  <Icons.home size={48} />
                </div>
                <div className="map-card-content">
                  <h3 className="map-card-title">{map.data.metadata.name}</h3>
                  <div className="map-card-stats">
                    <div className="stat">
                      <Icons.robot size={16} />
                      <span>0 Robots</span>
                    </div>
                    <div className="stat">
                      <Icons.zone size={16} />
                      <span>{map.data.zones.length} Zones</span>
                    </div>
                  </div>
                  <div className="map-card-date">
                    Modified: {new Date(map.data.metadata.modified).toLocaleDateString()}
                  </div>
                </div>
                <div className="map-card-actions">
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => handleOpenMap(map.id)}
                  >
                    <Icons.edit size={16} />
                    <span>Open</span>
                  </button>
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => handleDeleteMap(map.id, map.data.metadata.name)}
                  >
                    <Icons.delete size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreateDialog && (
        <CreateMapDialog
          onClose={() => setShowCreateDialog(false)}
          onSubmit={handleNewMapSubmit}
        />
      )}
    </div>
  );
}

interface CreateMapDialogProps {
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

function CreateMapDialog({ onClose, onSubmit }: CreateMapDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim());
      onClose();
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Create New Map</h2>
          <button className="dialog-close" onClick={onClose}>
            <Icons.close size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <div className="form-group">
              <label htmlFor="map-name">Map Name *</label>
              <input
                id="map-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Greenhouse"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="map-description">Description</label>
              <textarea
                id="map-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={3}
              />
            </div>
            <div className="form-hint">
              <Icons.info size={16} />
              <span>You'll start by drawing the floor boundary</span>
            </div>
          </div>
          <div className="dialog-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!name.trim()}>
              Create & Start Drawing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
