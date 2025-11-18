import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, type EditorMode } from "../../contexts";
import { Icons } from "../Icons";
import { IconButton } from "../UI";
import { InfoPanel } from "../FloatingPanel";
import { notify } from "../Notifications";
import { exportMapData, triggerFileImport, importMapData, generateFilename } from "../../utils/fileIO";
import "./Toolbar.css";

const modeIcons: Record<EditorMode, typeof Icons[keyof typeof Icons]> = {
  view: Icons.view,
  edit: Icons.edit,
  robot: Icons.robot,
  path: Icons.path,
  zone: Icons.zone,
  floor: Icons.floor,
};

const modeLabels: Record<EditorMode, string> = {
  view: "View",
  edit: "Edit",
  robot: "Robot",
  path: "Path",
  zone: "Zone",
  floor: "Floor",
};

export function Toolbar() {
  const navigate = useNavigate();
  const { mapId } = useParams<{ mapId: string }>();

  const {
    editorState,
    setEditorMode,
    setTransformMode,
    selectedObject,
    toggleGrid,
    toggleDimensions,
    setPlaying,
    robots,
    zones,
    mapData,
    updateMapData,
    staticMapData,
    loadStaticMapData,
    sceneElements,
    updateSceneElements
  } = useEditor();

  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const { mode, isPlaying, showGrid, showDimensions, transformMode } = editorState;

  const handleBackToMaps = () => {
    navigate('/');
  };

  const handleImport = () => {
    triggerFileImport(async (file) => {
      try {
        const staticData = await importMapData(file);

        // Load StaticMapData (will auto-sync to HierarchicalMapData and restore sceneSettings)
        loadStaticMapData(staticData);

        notify.success('Import successful', `Loaded map: ${staticData.metadata.name}`);
      } catch (error) {
        notify.error('Import failed', error instanceof Error ? error.message : 'Unknown error');
      }
    });
  };

  const handleExport = () => {
    if (!staticMapData) {
      notify.error('Export failed', 'No map data to export');
      return;
    }

    const filename = generateFilename();
    exportMapData(staticMapData, sceneElements, filename);
    notify.success('Export successful', `Map saved as ${filename}`);
  };

  const handleModeChange = (newMode: EditorMode) => {
    if (isPlaying) {
      setPlaying(false);
    }
    setEditorMode(newMode);
  };

  const handlePlayToggle = () => {
    setPlaying(!isPlaying);
    if (!isPlaying) {
      setEditorMode("view");
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <IconButton
          icon={Icons.chevronLeft}
          variant="ghost"
          onClick={handleBackToMaps}
          tooltip="Back to Maps"
          size="sm"
        />
        <div className="toolbar-logo">
          <Icons.activity size={20} className="logo-icon" />
          <span>ViaFarmFlow</span>
          {staticMapData && (
            <span className="toolbar-map-name"> - {staticMapData.metadata.name}</span>
          )}
        </div>
      </div>

      <div className="toolbar-section">
        <div className="toolbar-modes">
          {(Object.keys(modeIcons) as EditorMode[]).map((m) => {
            const Icon = modeIcons[m];
            return (
              <button
                key={m}
                className={`toolbar-btn ${mode === m ? "active" : ""}`}
                onClick={() => handleModeChange(m)}
                title={modeLabels[m]}
                disabled={isPlaying}
              >
                <Icon size={18} />
                <span className="toolbar-btn-label">{modeLabels[m]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transform Mode Controls - Show when in edit mode and object is selected */}
      {mode === "edit" && selectedObject && (
        <div className="toolbar-section">
          <div className="toolbar-divider" />
          <IconButton
            icon={Icons.move}
            variant={transformMode === "translate" ? "primary" : "ghost"}
            onClick={() => setTransformMode("translate")}
            tooltip="Move (G)"
            size="sm"
            disabled={isPlaying}
          />
          <IconButton
            icon={Icons.rotate}
            variant={transformMode === "rotate" ? "primary" : "ghost"}
            onClick={() => setTransformMode("rotate")}
            tooltip="Rotate (R)"
            size="sm"
            disabled={isPlaying}
          />
          <IconButton
            icon={Icons.scale}
            variant={transformMode === "scale" ? "primary" : "ghost"}
            onClick={() => setTransformMode("scale")}
            tooltip="Scale (S)"
            size="sm"
            disabled={isPlaying}
          />
          <div className="toolbar-divider" />
        </div>
      )}

      <div className="toolbar-section">
        <IconButton
          icon={Icons.grid}
          variant={showGrid ? "primary" : "ghost"}
          onClick={toggleGrid}
          tooltip="Toggle Grid"
          size="sm"
        />
        <IconButton
          icon={Icons.dimensions}
          variant={showDimensions ? "primary" : "ghost"}
          onClick={toggleDimensions}
          tooltip="Toggle Dimensions"
          size="sm"
        />
        <IconButton
          icon={Icons.info}
          variant={showInfoPanel ? "primary" : "ghost"}
          onClick={() => setShowInfoPanel(!showInfoPanel)}
          tooltip="Greenhouse Overview"
          size="sm"
        />
      </div>

      <div className="toolbar-section">
        <IconButton
          icon={Icons.import}
          variant="ghost"
          onClick={handleImport}
          tooltip="Import Map"
          size="sm"
        />
        <IconButton
          icon={Icons.export}
          variant="ghost"
          onClick={handleExport}
          tooltip="Export Map"
          size="sm"
        />
        <div className="toolbar-divider" />
        <button
          className={`toolbar-btn play-btn ${isPlaying ? "playing" : ""}`}
          onClick={handlePlayToggle}
          title={isPlaying ? "Pause" : "Play Simulation"}
        >
          {isPlaying ? <Icons.pause size={18} /> : <Icons.play size={18} />}
          <span className="toolbar-btn-label">{isPlaying ? "Pause" : "Simulate"}</span>
        </button>
      </div>

      <div className="toolbar-section toolbar-stats">
        <div className="toolbar-stat">
          <Icons.robot size={14} className="stat-icon" />
          <span className="stat-label">Robots</span>
          <span className="stat-value">{robots.length}</span>
        </div>
        <div className="toolbar-stat">
          <Icons.zone size={14} className="stat-icon" />
          <span className="stat-label">Zones</span>
          <span className="stat-value">{zones.length}</span>
        </div>
      </div>

      {/* Floating Info Panel */}
      <InfoPanel
        isOpen={showInfoPanel}
        onClose={() => setShowInfoPanel(false)}
      />
    </div>
  );
}
