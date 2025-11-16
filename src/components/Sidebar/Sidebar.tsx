import { useEditor } from "../../contexts";
import { PropertiesPanel } from "./PropertiesPanel";
import { RobotsPanel } from "./RobotsPanel";
import { PathsPanel } from "./PathsPanel";
import { ZonesPanel } from "./ZonesPanel";
import { EnvironmentPanel } from "./EnvironmentPanel";
import { SettingsPanel } from "./SettingsPanel";
import { CollapsibleSection } from "../UI";
import { Icons } from "../Icons";
import "./Sidebar.css";

export function Sidebar() {
  const { robots, zones, waypoints } = useEditor();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          <Icons.menu size={18} />
          <span>Controls</span>
        </h2>
      </div>

      <div className="sidebar-content">
        <CollapsibleSection
          title="Properties"
          icon={Icons.properties}
          defaultOpen={true}
        >
          <PropertiesPanel />
        </CollapsibleSection>

        <CollapsibleSection
          title="Robots"
          icon={Icons.robot}
          badge={robots.length}
          badgeVariant={robots.length > 0 ? "primary" : "default"}
          defaultOpen={true}
        >
          <RobotsPanel />
        </CollapsibleSection>

        <CollapsibleSection
          title="Paths"
          icon={Icons.paths}
          badge={waypoints.length}
          badgeVariant={waypoints.length > 0 ? "primary" : "default"}
        >
          <PathsPanel />
        </CollapsibleSection>

        <CollapsibleSection
          title="Zones"
          icon={Icons.zones}
          badge={zones.length}
          badgeVariant={zones.length > 0 ? "primary" : "default"}
        >
          <ZonesPanel />
        </CollapsibleSection>

        <CollapsibleSection
          title="Environmental Controls"
          icon={Icons.environment}
          defaultOpen={false}
        >
          <EnvironmentPanel />
        </CollapsibleSection>

        <CollapsibleSection
          title="Settings"
          icon={Icons.settings}
          defaultOpen={false}
        >
          <SettingsPanel />
        </CollapsibleSection>
      </div>
    </div>
  );
}
