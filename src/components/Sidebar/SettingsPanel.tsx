import { useState } from "react";
import { useEditor } from "../../contexts";
import type { MapData } from "../../types/greenhouse";

export function SettingsPanel() {
  const { config, robots, waypoints, zones, loadMapData, resetAll } = useEditor();
  const [exportFilename, setExportFilename] = useState("greenhouse-map");

  const handleExport = () => {
    const mapData: MapData = {
      config,
      robots,
      waypoints,
      zones,
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(mapData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", `${exportFilename}.json`);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const mapData = JSON.parse(e.target?.result as string) as MapData;
          loadMapData(mapData);
          alert("맵 데이터를 불러왔습니다.");
        } catch {
          alert("파일을 읽는 중 오류가 발생했습니다.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm("모든 설정을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      resetAll();
    }
  };

  return (
    <div className="settings-panel">
      <div className="panel-section">
        <h3 className="panel-title">데이터 내보내기</h3>
        <div className="panel-group">
          <input
            type="text"
            className="panel-input"
            style={{ width: "100%", textAlign: "left", marginBottom: "8px" }}
            placeholder="파일 이름"
            value={exportFilename}
            onChange={(e) => setExportFilename(e.target.value)}
          />
          <button className="panel-button" onClick={handleExport}>
            JSON으로 내보내기
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title">데이터 가져오기</h3>
        <div className="panel-group">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
            id="import-file"
          />
          <label
            htmlFor="import-file"
            className="panel-button"
            style={{ display: "block", textAlign: "center" }}
          >
            JSON 파일 선택
          </label>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title">통계</h3>
        <div className="panel-group">
          <div className="panel-row">
            <span className="panel-label">온실 면적</span>
            <span className="panel-value">
              {(config.dimensions.length * config.dimensions.width).toLocaleString()} m²
            </span>
          </div>
          <div className="panel-row">
            <span className="panel-label">베드 수</span>
            <span className="panel-value">{config.beds.count}개</span>
          </div>
          <div className="panel-row">
            <span className="panel-label">로봇 수</span>
            <span className="panel-value">{robots.length}대</span>
          </div>
          <div className="panel-row">
            <span className="panel-label">구역 수</span>
            <span className="panel-value">{zones.length}개</span>
          </div>
          <div className="panel-row">
            <span className="panel-label">웨이포인트</span>
            <span className="panel-value">{waypoints.length}개</span>
          </div>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title">시스템</h3>
        <div className="panel-group">
          <div className="panel-row">
            <span className="panel-label">버전</span>
            <span className="panel-value">1.0.0</span>
          </div>
          <div className="panel-row">
            <span className="panel-label">렌더러</span>
            <span className="panel-value">Three.js r181</span>
          </div>
          <button className="panel-button danger" onClick={handleReset}>
            설정 초기화
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title">도움말</h3>
        <div className="panel-group">
          <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>
            <p style={{ marginBottom: "8px" }}>
              <strong>마우스 컨트롤</strong>
              <br />
              • 좌클릭 드래그: 회전
              <br />
              • 휠: 줌 인/아웃
              <br />• 우클릭 드래그: 이동
            </p>
            <p style={{ marginBottom: "8px" }}>
              <strong>단축키</strong>
              <br />
              • V: 보기 모드
              <br />
              • E: 편집 모드
              <br />
              • R: 로봇 모드
              <br />
              • P: 경로 모드
              <br />• Z: 구역 모드
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
