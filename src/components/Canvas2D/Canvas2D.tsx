import { useRef, useEffect, useState, useCallback } from 'react';
import type { WheelEvent, MouseEvent } from 'react';
import { useEditor } from '../../contexts';
import type { Robot, WorkZone } from '../../types/greenhouse';
import './Canvas2D.css';

interface ViewState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export function Canvas2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    config,
    robots,
    waypoints,
    zones,
    editorState,
    selectRobot
  } = useEditor();

  const { mode, selectedRobotId, selectedZoneId } = editorState;

  const [viewState, setViewState] = useState<ViewState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0
  });

  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<{ type: string; id: string } | null>(null);

  // Convert world coordinates to canvas coordinates
  const worldToCanvas = useCallback((worldX: number, worldZ: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Scale factor: map greenhouse dimensions to canvas
    const scaleX = (canvas.width * 0.8) / config.dimensions.width;
    const scaleZ = (canvas.height * 0.8) / config.dimensions.length;
    const baseScale = Math.min(scaleX, scaleZ);

    const x = centerX + (worldX * baseScale * viewState.scale) + viewState.offsetX;
    const y = centerY - (worldZ * baseScale * viewState.scale) + viewState.offsetY;

    return { x, y };
  }, [config.dimensions, viewState]);

  // Convert canvas coordinates to world coordinates
  const canvasToWorld = useCallback((canvasX: number, canvasY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, z: 0 };

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const scaleX = (canvas.width * 0.8) / config.dimensions.width;
    const scaleZ = (canvas.height * 0.8) / config.dimensions.length;
    const baseScale = Math.min(scaleX, scaleZ);

    const worldX = (canvasX - centerX - viewState.offsetX) / (baseScale * viewState.scale);
    const worldZ = -(canvasY - centerY - viewState.offsetY) / (baseScale * viewState.scale);

    return { x: worldX, z: worldZ };
  }, [config.dimensions, viewState]);

  // Draw the 2D scene
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Draw grid
    drawGrid(ctx);

    // Draw greenhouse outline
    drawGreenhouse(ctx);

    // Draw hanging beds
    drawHangingBeds(ctx);

    // Draw zones
    zones.forEach(zone => drawZone(ctx, zone));

    // Draw waypoints and paths
    drawWaypoints(ctx);

    // Draw robots
    robots.forEach(robot => drawRobot(ctx, robot));

    // Draw hover highlight
    if (hoveredItem) {
      drawHoverHighlight(ctx);
    }

    // Restore context state
    ctx.restore();
  }, [config, robots, waypoints, zones, selectedRobotId, selectedZoneId, viewState, hoveredItem, worldToCanvas]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    const gridSize = 10; // 10 meter grid
    const startX = -config.dimensions.width / 2;
    const endX = config.dimensions.width / 2;
    const startZ = -config.dimensions.length / 2;
    const endZ = config.dimensions.length / 2;

    for (let x = startX; x <= endX; x += gridSize) {
      const start = worldToCanvas(x, startZ);
      const end = worldToCanvas(x, endZ);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }

    for (let z = startZ; z <= endZ; z += gridSize) {
      const start = worldToCanvas(startX, z);
      const end = worldToCanvas(endX, z);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  };

  const drawGreenhouse = (ctx: CanvasRenderingContext2D) => {
    const halfWidth = config.dimensions.width / 2;
    const halfLength = config.dimensions.length / 2;

    const topLeft = worldToCanvas(-halfWidth, halfLength);
    const topRight = worldToCanvas(halfWidth, halfLength);
    const bottomRight = worldToCanvas(halfWidth, -halfLength);
    const bottomLeft = worldToCanvas(-halfWidth, -halfLength);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(topLeft.x, topLeft.y);
    ctx.lineTo(topRight.x, topRight.y);
    ctx.lineTo(bottomRight.x, bottomRight.y);
    ctx.lineTo(bottomLeft.x, bottomLeft.y);
    ctx.closePath();
    ctx.stroke();

    // Draw entrance
    const entranceWidth = 4;
    const entranceStart = worldToCanvas(-entranceWidth / 2, -halfLength);
    const entranceEnd = worldToCanvas(entranceWidth / 2, -halfLength);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(entranceStart.x, entranceStart.y);
    ctx.lineTo(entranceEnd.x, entranceEnd.y);
    ctx.stroke();
  };

  const drawHangingBeds = (ctx: CanvasRenderingContext2D) => {
    const { beds } = config;
    if (!beds) return;

    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.lineWidth = 1;

    const bedWidth = beds.width;
    const spacing = beds.spacing;
    const totalBedWidth = bedWidth * beds.count + spacing * (beds.count - 1);
    const startX = -totalBedWidth / 2;

    for (let i = 0; i < beds.count; i++) {
      const x = startX + i * (bedWidth + spacing);
      const topLeft = worldToCanvas(x, beds.length / 2);
      const bottomRight = worldToCanvas(x + bedWidth, -beds.length / 2);

      ctx.fillRect(
        topLeft.x,
        topLeft.y,
        bottomRight.x - topLeft.x,
        bottomRight.y - topLeft.y
      );
      ctx.strokeRect(
        topLeft.x,
        topLeft.y,
        bottomRight.x - topLeft.x,
        bottomRight.y - topLeft.y
      );
    }
  };

  const drawZone = (ctx: CanvasRenderingContext2D, zone: WorkZone) => {
    if (zone.points.length < 3) return;

    const isSelected = selectedZoneId === zone.id;
    const color = zone.color || '#3b82f6';

    ctx.fillStyle = isSelected
      ? `${color}33`  // More opaque when selected
      : `${color}1a`;  // Semi-transparent
    ctx.strokeStyle = isSelected ? color : `${color}aa`;
    ctx.lineWidth = isSelected ? 2 : 1;

    ctx.beginPath();
    zone.points.forEach((point, index) => {
      const canvasPoint = worldToCanvas(point.x, point.z);
      if (index === 0) {
        ctx.moveTo(canvasPoint.x, canvasPoint.y);
      } else {
        ctx.lineTo(canvasPoint.x, canvasPoint.y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw zone label
    const centerX = zone.points.reduce((sum, p) => sum + p.x, 0) / zone.points.length;
    const centerZ = zone.points.reduce((sum, p) => sum + p.z, 0) / zone.points.length;
    const center = worldToCanvas(centerX, centerZ);

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(zone.name, center.x, center.y);
  };

  const drawWaypoints = (ctx: CanvasRenderingContext2D) => {
    if (waypoints.length === 0) return;

    // Draw paths
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    waypoints.forEach((waypoint, index) => {
      const point = worldToCanvas(waypoint.position.x, waypoint.position.z);
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw waypoint markers
    waypoints.forEach((waypoint, index) => {
      const point = worldToCanvas(waypoint.position.x, waypoint.position.z);

      ctx.fillStyle = '#fbbf24'; // All waypoints are transit color for now
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw waypoint number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), point.x, point.y);
    });
  };

  const drawRobot = (ctx: CanvasRenderingContext2D, robot: Robot) => {
    const pos = worldToCanvas(robot.position.x, robot.position.z);
    const isSelected = selectedRobotId === robot.id;
    const size = isSelected ? 12 : 10;

    // Robot body
    ctx.fillStyle = robot.status === 'working' ? '#10b981' :
                    robot.status === 'idle' ? '#fbbf24' : '#ef4444';
    ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = isSelected ? 3 : 2;

    // Draw robot as a rounded square
    const halfSize = size / 2;
    ctx.beginPath();
    ctx.roundRect(pos.x - halfSize, pos.y - halfSize, size, size, 2);
    ctx.fill();
    ctx.stroke();

    // Draw direction indicator
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(-robot.rotation); // Negative because Y is flipped in canvas

    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(-3, -size * 0.3);
    ctx.lineTo(3, -size * 0.3);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();

    // Draw robot name
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(robot.name, pos.x, pos.y + size + 10);
  };

  const drawHoverHighlight = (ctx: CanvasRenderingContext2D) => {
    if (!hoveredItem) return;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);

    if (hoveredItem.type === 'robot') {
      const robot = robots.find(r => r.id === hoveredItem.id);
      if (robot) {
        const pos = worldToCanvas(robot.position.x, robot.position.z);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.setLineDash([]);
  };

  // Handle mouse wheel for zoom
  const handleWheel = (e: WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setViewState(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(5, prev.scale * delta))
    }));
  };

  // Handle mouse events for panning and selection
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const worldPos = canvasToWorld(x, y);

    // Check for robot selection
    if (mode === 'robot') {
      const clickedRobot = robots.find(robot => {
        const distance = Math.sqrt(
          Math.pow(robot.position.x - worldPos.x, 2) +
          Math.pow(robot.position.z - worldPos.z, 2)
        );
        return distance < 2; // Within 2 meters
      });

      if (clickedRobot) {
        selectRobot(clickedRobot.id);
        return;
      }
    }

    // Start panning
    if (e.button === 0) { // Left click
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const worldPos = canvasToWorld(x, y);

    // Check for hover
    const hoveredRobot = robots.find(robot => {
      const distance = Math.sqrt(
        Math.pow(robot.position.x - worldPos.x, 2) +
        Math.pow(robot.position.z - worldPos.z, 2)
      );
      return distance < 2;
    });

    if (hoveredRobot) {
      setHoveredItem({ type: 'robot', id: hoveredRobot.id });
    } else {
      setHoveredItem(null);
    }

    // Handle panning
    if (isPanning) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;

      setViewState(prev => ({
        ...prev,
        offsetX: prev.offsetX + dx,
        offsetY: prev.offsetY + dy
      }));

      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
    setHoveredItem(null);
  };

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        draw();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [draw]);

  // Redraw when data changes
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="canvas-2d-container">
      <canvas
        ref={canvasRef}
        className="canvas-2d"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <div className="canvas-2d-controls">
        <div className="zoom-controls">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setViewState(prev => ({ ...prev, scale: Math.min(5, prev.scale * 1.2) }))}
          >
            +
          </button>
          <span className="zoom-level">{Math.round(viewState.scale * 100)}%</span>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setViewState(prev => ({ ...prev, scale: Math.max(0.1, prev.scale * 0.8) }))}
          >
            -
          </button>
        </div>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => setViewState({ scale: 1, offsetX: 0, offsetY: 0 })}
        >
          Reset View
        </button>
      </div>
    </div>
  );
}