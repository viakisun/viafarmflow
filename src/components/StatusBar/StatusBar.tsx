import { useState, useEffect } from "react";
import { useEditor } from "../../contexts";
import "./StatusBar.css";

export function StatusBar() {
  const { editorState, robots, zones, config } = useEditor();
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const updateFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(updateFPS);
    };

    const rafId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const modeText = {
    view: "보기 모드",
    edit: "편집 모드",
    robot: "로봇 배치",
    path: "경로 편집",
    zone: "구역 설정",
  };

  return (
    <div className="statusbar">
      <div className="statusbar-section">
        <span className="statusbar-label">모드:</span>
        <span className="statusbar-value">{modeText[editorState.mode]}</span>
      </div>

      <div className="statusbar-divider" />

      <div className="statusbar-section">
        <span className="statusbar-label">로봇:</span>
        <span className="statusbar-value">{robots.length}</span>
      </div>

      <div className="statusbar-section">
        <span className="statusbar-label">구역:</span>
        <span className="statusbar-value">{zones.length}</span>
      </div>

      <div className="statusbar-divider" />

      <div className="statusbar-section">
        <span className="statusbar-label">온실:</span>
        <span className="statusbar-value">
          {config.dimensions.width}×{config.dimensions.length}×{config.dimensions.height}m
        </span>
      </div>

      <div className="statusbar-spacer" />

      <div className="statusbar-section">
        <span className="statusbar-label">FPS:</span>
        <span className="statusbar-value">{fps}</span>
      </div>

      {editorState.isPlaying && (
        <div className="statusbar-section statusbar-playing">
          <span className="statusbar-indicator">●</span>
          시뮬레이션 실행 중
        </div>
      )}
    </div>
  );
}
