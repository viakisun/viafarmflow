import { useEffect } from "react";
import { EditorProvider, useEditor } from "./contexts";
import { MapDataLayout } from "./components/Layout/MapDataLayout";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { StatusBar } from "./components/StatusBar/StatusBar";
import { SceneContainer } from "./components/SceneContainer";
import { NotificationSystem, useNotifications, notify } from "./components/Notifications";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useSimulation } from "./hooks/useSimulation";
import { useObjectInteractions } from "./hooks/useObjectInteractions";
import { loadStaticMapFromURL, loadDynamicRobotFromURL } from "./utils/jsonLoader";
import "./App.css";

function EditorApp() {
  useKeyboardShortcuts();
  useSimulation();
  useObjectInteractions();
  const { notifications, removeNotification } = useNotifications();
  const { loadStaticMapData, loadDynamicRobotData } = useEditor();

  // Load sample JSON data on startup
  useEffect(() => {
    const loadSampleData = async () => {
      try {
        // 정적 맵 데이터 로드
        const staticMap = await loadStaticMapFromURL('/sample_greenhouse_map.json');
        loadStaticMapData(staticMap);
        console.log('✅ Static map data loaded:', staticMap);

        // 동적 로봇 데이터 로드
        const robotData = await loadDynamicRobotFromURL('/sample_robot_data.json');
        loadDynamicRobotData(robotData);
        console.log('✅ Dynamic robot data loaded:', robotData);
      } catch (error) {
        console.error('Failed to load sample data:', error);
      }
    };

    loadSampleData();
  }, [loadStaticMapData, loadDynamicRobotData]);

  // Show welcome notification on first load
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('welcomeShown');
    if (!hasShownWelcome) {
      notify.success('Welcome to ViaFarmFlow', 'Your 3D greenhouse management system is ready');
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, []);

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

function App() {
  return (
    <EditorProvider>
      <EditorApp />
    </EditorProvider>
  );
}

export default App;
