import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor } from "../contexts";
import { MapDataLayout } from "../components/Layout/MapDataLayout";
import { Toolbar } from "../components/Toolbar/Toolbar";
import { StatusBar } from "../components/StatusBar/StatusBar";
import { SceneContainer } from "../components/SceneContainer";
import { NotificationSystem, useNotifications, notify } from "../components/Notifications";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useSimulation } from "../hooks/useSimulation";
import { useObjectInteractions } from "../hooks/useObjectInteractions";
import { loadStaticMapFromURL } from "../utils/jsonLoader";
import { mapService } from "../services/mapService";
import "../App.css";

export function EditorPage() {
  useKeyboardShortcuts();
  useSimulation();
  useObjectInteractions();
  const { notifications, removeNotification } = useNotifications();
  const { loadStaticMapData, staticMapData, setEditorMode } = useEditor();
  const { mapId } = useParams<{ mapId: string }>();
  const navigate = useNavigate();

  // Load map data based on mapId
  useEffect(() => {
    const loadMapData = async () => {
      if (!mapId) {
        navigate('/');
        return;
      }

      try {
        if (mapId === 'new') {
          // 새 맵 생성 모드
          notify.info('New Map', 'Draw the floor boundary to start');
          // 빈 맵 데이터 초기화는 EditorProvider의 기본값 사용
          // Floor 모드로 자동 전환
          setTimeout(() => setEditorMode('floor'), 100);
        } else if (mapId === 'demo') {
          // 샘플 맵 로드 (기존 로직)
          const staticMap = await loadStaticMapFromURL('/sample_greenhouse_map.json');
          loadStaticMapData(staticMap);
          console.log('✅ Demo map loaded:', staticMap);
        } else {
          // localStorage에서 맵 로드
          const mapData = await mapService.fetchStaticMap(mapId);
          if (mapData) {
            loadStaticMapData(mapData);
            console.log('✅ Map loaded from storage:', mapId);
          } else {
            notify.error('Map not found', `Map with ID ${mapId} does not exist`);
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Failed to load map:', error);
        notify.error('Load failed', error instanceof Error ? error.message : 'Unknown error');
        navigate('/');
      }
    };

    loadMapData();
  }, [mapId, loadStaticMapData, setEditorMode, navigate]);

  // Auto-save when staticMapData changes (except for 'new' and 'demo')
  useEffect(() => {
    if (!mapId || mapId === 'new' || mapId === 'demo' || !staticMapData) {
      return;
    }

    // Debounce auto-save
    const timer = setTimeout(() => {
      mapService.saveStaticMap(mapId, staticMapData).then(() => {
        console.log('💾 Auto-saved:', mapId);
      }).catch((error) => {
        console.error('Auto-save failed:', error);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [staticMapData, mapId]);

  return (
    <>
      <div className="app-container">
        <div className="app-header">
          <Toolbar />
        </div>
        <div className="app-body">
          <MapDataLayout>
            <SceneContainer />
          </MapDataLayout>
        </div>
        <div className="app-footer">
          <StatusBar />
        </div>
      </div>
      <NotificationSystem
        notifications={notifications}
        onClose={removeNotification}
      />
    </>
  );
}
