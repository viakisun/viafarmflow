import { FloatingPanel } from './FloatingPanel';
import { Icons } from '../Icons';
import { Badge } from '../UI';
import { useEditor } from '../../contexts';
import './InfoPanel.css';

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoPanel({ isOpen, onClose }: InfoPanelProps) {
  const { robots, waypoints, zones, config, staticMapData } = useEditor();

  // Use staticMapData if available, fallback to legacy config
  const dimensions = staticMapData?.greenhouse.dimensions || config?.dimensions;
  const bedConfig = config?.beds;

  if (!dimensions) {
    return null; // Don't render until data is loaded
  }

  const totalArea = dimensions.x * dimensions.z;
  const bedArea = bedConfig
    ? bedConfig.width * bedConfig.length * bedConfig.count
    : 0;
  const utilization = totalArea > 0 ? ((bedArea / totalArea) * 100).toFixed(1) : '0.0';

  const activeRobots = robots.filter(r => r.status === 'working').length;
  const idleRobots = robots.filter(r => r.status === 'idle').length;
  const errorRobots = robots.filter(r => r.status === 'moving').length;

  return (
    <FloatingPanel
      title="Greenhouse Overview"
      isOpen={isOpen}
      onClose={onClose}
      position="top-right"
      width="360px"
    >
      <div className="info-panel">
        {/* Greenhouse Statistics */}
        <section className="info-section">
          <h4 className="info-section-title">
            <Icons.home size={16} />
            Greenhouse
          </h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Dimensions</span>
              <span className="info-value">
                {dimensions.x}m × {dimensions.z}m
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Height</span>
              <span className="info-value">{dimensions.y}m</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Area</span>
              <span className="info-value">{totalArea.toLocaleString()}m²</span>
            </div>
            <div className="info-item">
              <span className="info-label">Bed Utilization</span>
              <span className="info-value">{utilization}%</span>
            </div>
          </div>
        </section>

        {/* Robot Status */}
        <section className="info-section">
          <h4 className="info-section-title">
            <Icons.robot size={16} />
            Robot Fleet
          </h4>
          <div className="info-stats">
            <div className="info-stat">
              <Badge variant="success">
                {activeRobots}
              </Badge>
              <span className="info-stat-label">Active</span>
            </div>
            <div className="info-stat">
              <Badge variant="warning">
                {idleRobots}
              </Badge>
              <span className="info-stat-label">Idle</span>
            </div>
            <div className="info-stat">
              <Badge variant="danger">
                {errorRobots}
              </Badge>
              <span className="info-stat-label">Error</span>
            </div>
          </div>
          <div className="info-progress">
            <div className="info-progress-bar">
              {robots.length > 0 && (
                <>
                  <div
                    className="info-progress-fill success"
                    style={{ width: `${(activeRobots / robots.length) * 100}%` }}
                  />
                  <div
                    className="info-progress-fill warning"
                    style={{
                      width: `${(idleRobots / robots.length) * 100}%`,
                      left: `${(activeRobots / robots.length) * 100}%`
                    }}
                  />
                  <div
                    className="info-progress-fill danger"
                    style={{
                      width: `${(errorRobots / robots.length) * 100}%`,
                      left: `${((activeRobots + idleRobots) / robots.length) * 100}%`
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </section>

        {/* Work Zones */}
        <section className="info-section">
          <h4 className="info-section-title">
            <Icons.zone size={16} />
            Work Zones
          </h4>
          <div className="info-list">
            {zones.length > 0 ? (
              zones.slice(0, 3).map(zone => (
                <div key={zone.id} className="info-list-item">
                  <div
                    className="info-zone-color"
                    style={{ background: zone.color || '#3b82f6' }}
                  />
                  <div className="info-list-content">
                    <span className="info-list-title">{zone.name}</span>
                    <span className="info-list-subtitle">
                      {zone.assignedRobotIds.length} robot{zone.assignedRobotIds.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="info-empty">No zones defined</div>
            )}
            {zones.length > 3 && (
              <div className="info-more">+{zones.length - 3} more zones</div>
            )}
          </div>
        </section>

        {/* Navigation Paths */}
        <section className="info-section">
          <h4 className="info-section-title">
            <Icons.path size={16} />
            Navigation
          </h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Waypoints</span>
              <span className="info-value">{waypoints.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Points</span>
              <span className="info-value">
                {waypoints.length}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Robots with Paths</span>
              <span className="info-value">
                {new Set(waypoints.map(w => w.robotId)).size}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Distance</span>
              <span className="info-value">
                {calculateTotalPathDistance(waypoints).toFixed(1)}m
              </span>
            </div>
          </div>
        </section>
      </div>
    </FloatingPanel>
  );
}

function calculateTotalPathDistance(waypoints: any[]): number {
  if (waypoints.length < 2) return 0;

  let distance = 0;
  for (let i = 1; i < waypoints.length; i++) {
    const dx = waypoints[i].position.x - waypoints[i - 1].position.x;
    const dz = waypoints[i].position.z - waypoints[i - 1].position.z;
    distance += Math.sqrt(dx * dx + dz * dz);
  }
  return distance;
}