import { useEditor } from "../../contexts";

export function PropertiesPanel() {
  const { config, updateConfig, selectedObject, mapData, sceneElements, updateSceneElements } = useEditor();
  const { dimensions, beds } = config;

  // selectedObject is already the object itself, not an ID
  const selected = selectedObject;

  const handleDimensionChange = (key: keyof typeof dimensions, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateConfig({
        dimensions: { ...dimensions, [key]: numValue },
      });
    }
  };

  const handleBedChange = (key: keyof typeof beds, value: string) => {
    const numValue = key === "count" ? parseInt(value) : parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateConfig({
        beds: { ...beds, [key]: numValue },
      });
    }
  };

  // Render Grid properties if Grid is selected
  if (selected?.type === 'grid') {
    return (
      <div className="properties-panel">
        <div className="panel-section">
          <h3 className="panel-title">Grid</h3>
          <div className="panel-group">
            <div className="panel-row">
              <span className="panel-label">ID</span>
              <span className="panel-value">{selected.id}</span>
            </div>
            <div className="panel-row">
              <span className="panel-label">Name</span>
              <span className="panel-value">{selected.name}</span>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <h3 className="panel-title">Grid Settings</h3>
          <div className="panel-group">
            <div className="panel-row">
              <label className="panel-label">가로 크기 (sizeX)</label>
              <input
                type="number"
                className="panel-input"
                style={{ width: "80px", textAlign: "right" }}
                value={sceneElements.grid.sizeX}
                onChange={(e) => {
                  const sizeX = Number(e.target.value);
                  updateSceneElements({
                    ...sceneElements,
                    grid: { ...sceneElements.grid, sizeX },
                  });
                }}
                min={10}
                max={1000}
                step={10}
              />
            </div>
            <div className="panel-row">
              <label className="panel-label">세로 크기 (sizeZ)</label>
              <input
                type="number"
                className="panel-input"
                style={{ width: "80px", textAlign: "right" }}
                value={sceneElements.grid.sizeZ}
                onChange={(e) => {
                  const sizeZ = Number(e.target.value);
                  updateSceneElements({
                    ...sceneElements,
                    grid: { ...sceneElements.grid, sizeZ },
                  });
                }}
                min={10}
                max={1000}
                step={10}
              />
            </div>
            <div className="panel-row">
              <label className="panel-label">가로 분할 (divisionsX)</label>
              <input
                type="number"
                className="panel-input"
                style={{ width: "80px", textAlign: "right" }}
                value={sceneElements.grid.divisionsX}
                onChange={(e) => {
                  const divisionsX = Number(e.target.value);
                  updateSceneElements({
                    ...sceneElements,
                    grid: { ...sceneElements.grid, divisionsX },
                  });
                }}
                min={5}
                max={200}
                step={5}
              />
            </div>
            <div className="panel-row">
              <label className="panel-label">세로 분할 (divisionsZ)</label>
              <input
                type="number"
                className="panel-input"
                style={{ width: "80px", textAlign: "right" }}
                value={sceneElements.grid.divisionsZ}
                onChange={(e) => {
                  const divisionsZ = Number(e.target.value);
                  updateSceneElements({
                    ...sceneElements,
                    grid: { ...sceneElements.grid, divisionsZ },
                  });
                }}
                min={5}
                max={200}
                step={5}
              />
            </div>
            <div className="panel-row">
              <label className="panel-label">페이드 거리</label>
              <input
                type="number"
                className="panel-input"
                style={{ width: "80px", textAlign: "right" }}
                value={sceneElements.grid.fadeDistance}
                onChange={(e) => {
                  const fadeDistance = Number(e.target.value);
                  updateSceneElements({
                    ...sceneElements,
                    grid: { ...sceneElements.grid, fadeDistance },
                  });
                }}
                min={100}
                max={1000}
                step={50}
              />
            </div>
            <div className="panel-row">
              <label className="panel-label">페이드 강도</label>
              <input
                type="number"
                className="panel-input"
                style={{ width: "80px", textAlign: "right" }}
                value={sceneElements.grid.fadeStrength}
                onChange={(e) => {
                  const fadeStrength = Number(e.target.value);
                  updateSceneElements({
                    ...sceneElements,
                    grid: { ...sceneElements.grid, fadeStrength },
                  });
                }}
                min={0}
                max={2}
                step={0.1}
              />
            </div>
          </div>
        </div>

        <div className="panel-section">
          <h3 className="panel-title">Info</h3>
          <div className="panel-group">
            <div className="panel-row">
              <span className="panel-label">Cell Size (가로×세로)</span>
              <span className="panel-value">
                {(sceneElements.grid.sizeX / sceneElements.grid.divisionsX).toFixed(2)} × {(sceneElements.grid.sizeZ / sceneElements.grid.divisionsZ).toFixed(2)} m
              </span>
            </div>
            <div className="panel-row">
              <span className="panel-label">Total Cells</span>
              <span className="panel-value">
                {sceneElements.grid.divisionsX * sceneElements.grid.divisionsZ}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Show Greenhouse properties
  return (
    <div className="properties-panel">
      <div className="panel-section">
        <h3 className="panel-title">온실 치수</h3>
        <div className="panel-group">
          <div className="panel-row">
            <label className="panel-label">길이 (Z축)</label>
            <input
              type="number"
              className="panel-input"
              value={dimensions.length}
              onChange={(e) => handleDimensionChange("length", e.target.value)}
              min="10"
              max="500"
              step="10"
            />
          </div>
          <div className="panel-row">
            <label className="panel-label">폭 (X축)</label>
            <input
              type="number"
              className="panel-input"
              value={dimensions.width}
              onChange={(e) => handleDimensionChange("width", e.target.value)}
              min="10"
              max="200"
              step="5"
            />
          </div>
          <div className="panel-row">
            <label className="panel-label">높이 (Y축)</label>
            <input
              type="number"
              className="panel-input"
              value={dimensions.height}
              onChange={(e) => handleDimensionChange("height", e.target.value)}
              min="3"
              max="20"
              step="1"
            />
          </div>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title">행잉 베드 설정</h3>
        <div className="panel-group">
          <div className="panel-row">
            <label className="panel-label">베드 개수</label>
            <input
              type="number"
              className="panel-input"
              value={beds.count}
              onChange={(e) => handleBedChange("count", e.target.value)}
              min="1"
              max="50"
              step="1"
            />
          </div>
          <div className="panel-row">
            <label className="panel-label">베드 길이</label>
            <input
              type="number"
              className="panel-input"
              value={beds.length}
              onChange={(e) => handleBedChange("length", e.target.value)}
              min="5"
              max="50"
              step="5"
            />
          </div>
          <div className="panel-row">
            <label className="panel-label">베드 간격</label>
            <input
              type="number"
              className="panel-input"
              value={beds.spacing}
              onChange={(e) => handleBedChange("spacing", e.target.value)}
              min="1"
              max="10"
              step="0.5"
            />
          </div>
          <div className="panel-row">
            <label className="panel-label">지면 높이</label>
            <input
              type="number"
              className="panel-input"
              value={beds.heightFromGround}
              onChange={(e) => handleBedChange("heightFromGround", e.target.value)}
              min="1"
              max="10"
              step="0.5"
            />
          </div>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title">정보</h3>
        <div className="panel-group">
          <div className="panel-row">
            <span className="panel-label">총 면적</span>
            <span className="panel-value">
              {(dimensions.length * dimensions.width).toLocaleString()} m²
            </span>
          </div>
          <div className="panel-row">
            <span className="panel-label">총 베드 길이</span>
            <span className="panel-value">{(beds.length * beds.count).toLocaleString()} m</span>
          </div>
          <div className="panel-row">
            <span className="panel-label">체적</span>
            <span className="panel-value">
              {(dimensions.length * dimensions.width * dimensions.height).toLocaleString()} m³
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
