import { useEditor, type PanelTab } from "../../contexts";
import { PropertiesPanel } from "./PropertiesPanel";
import { RobotsPanel } from "./RobotsPanel";
import { PathsPanel } from "./PathsPanel";
import { ZonesPanel } from "./ZonesPanel";
import { SettingsPanel } from "./SettingsPanel";
import "./Sidebar.css";

const tabIcons: Record<PanelTab, string> = {
  properties: "📊",
  robots: "🤖",
  paths: "📍",
  zones: "🏭",
  settings: "⚙️",
};

const tabLabels: Record<PanelTab, string> = {
  properties: "속성",
  robots: "로봇",
  paths: "경로",
  zones: "구역",
  settings: "설정",
};

export function Sidebar() {
  const { editorState, setActivePanel } = useEditor();
  const { activePanel } = editorState;

  const renderPanel = () => {
    switch (activePanel) {
      case "properties":
        return <PropertiesPanel />;
      case "robots":
        return <RobotsPanel />;
      case "paths":
        return <PathsPanel />;
      case "zones":
        return <ZonesPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        {(Object.keys(tabIcons) as PanelTab[]).map((tab) => (
          <button
            key={tab}
            className={`sidebar-tab ${activePanel === tab ? "active" : ""}`}
            onClick={() => setActivePanel(tab)}
            title={tabLabels[tab]}
          >
            <span className="sidebar-tab-icon">{tabIcons[tab]}</span>
            <span className="sidebar-tab-label">{tabLabels[tab]}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-content">{renderPanel()}</div>
    </div>
  );
}
