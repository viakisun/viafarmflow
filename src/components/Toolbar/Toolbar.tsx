import { useEditor, type EditorMode } from "../../contexts";
import "./Toolbar.css";

const modeIcons: Record<EditorMode, string> = {
  view: "👁",
  edit: "✏️",
  robot: "🤖",
  path: "📍",
  zone: "🏭",
};

const modeLabels: Record<EditorMode, string> = {
  view: "보기",
  edit: "편집",
  robot: "로봇",
  path: "경로",
  zone: "구역",
};

export function Toolbar() {
  const { editorState, setEditorMode, toggleGrid, toggleDimensions, setPlaying, robots, zones } =
    useEditor();

  const { mode, isPlaying, showGrid, showDimensions } = editorState;

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
        <div className="toolbar-logo">🌱 ViaFarmFlow</div>
      </div>

      <div className="toolbar-section">
        <div className="toolbar-modes">
          {(Object.keys(modeIcons) as EditorMode[]).map((m) => (
            <button
              key={m}
              className={`toolbar-btn ${mode === m ? "active" : ""}`}
              onClick={() => handleModeChange(m)}
              title={modeLabels[m]}
              disabled={isPlaying}
            >
              <span className="toolbar-btn-icon">{modeIcons[m]}</span>
              <span className="toolbar-btn-label">{modeLabels[m]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <button
          className={`toolbar-btn ${showGrid ? "active" : ""}`}
          onClick={toggleGrid}
          title="그리드 표시"
        >
          <span className="toolbar-btn-icon">⊞</span>
        </button>
        <button
          className={`toolbar-btn ${showDimensions ? "active" : ""}`}
          onClick={toggleDimensions}
          title="치수 표시"
        >
          <span className="toolbar-btn-icon">📏</span>
        </button>
      </div>

      <div className="toolbar-section">
        <button
          className={`toolbar-btn play-btn ${isPlaying ? "playing" : ""}`}
          onClick={handlePlayToggle}
          title={isPlaying ? "정지" : "시뮬레이션 시작"}
        >
          <span className="toolbar-btn-icon">{isPlaying ? "⏸" : "▶"}</span>
          <span className="toolbar-btn-label">{isPlaying ? "정지" : "시뮬레이션"}</span>
        </button>
      </div>

      <div className="toolbar-section toolbar-stats">
        <div className="toolbar-stat">
          <span className="stat-label">로봇</span>
          <span className="stat-value">{robots.length}</span>
        </div>
        <div className="toolbar-stat">
          <span className="stat-label">구역</span>
          <span className="stat-value">{zones.length}</span>
        </div>
      </div>
    </div>
  );
}
