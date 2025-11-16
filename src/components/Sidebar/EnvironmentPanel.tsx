import { useState } from 'react';
import { Icons } from '../Icons';
import { Badge } from '../UI';

interface EnvironmentSettings {
  temperature: {
    current: number;
    target: number;
    unit: 'C' | 'F';
  };
  humidity: {
    current: number;
    target: number;
  };
  lighting: {
    intensity: number;
    mode: 'natural' | 'artificial' | 'mixed';
  };
  co2: {
    level: number;
    target: number;
  };
  ventilation: {
    enabled: boolean;
    fanSpeed: number;
    mode: 'auto' | 'manual';
  };
}

export function EnvironmentPanel() {
  const [settings, setSettings] = useState<EnvironmentSettings>({
    temperature: { current: 22, target: 24, unit: 'C' },
    humidity: { current: 65, target: 70 },
    lighting: { intensity: 75, mode: 'mixed' },
    co2: { level: 420, target: 400 },
    ventilation: { enabled: true, fanSpeed: 50, mode: 'auto' }
  });

  const updateTemperature = (target: number) => {
    setSettings(prev => ({
      ...prev,
      temperature: { ...prev.temperature, target }
    }));
  };

  const updateHumidity = (target: number) => {
    setSettings(prev => ({
      ...prev,
      humidity: { ...prev.humidity, target }
    }));
  };

  const updateLighting = (intensity: number) => {
    setSettings(prev => ({
      ...prev,
      lighting: { ...prev.lighting, intensity }
    }));
  };

  const updateCO2 = (target: number) => {
    setSettings(prev => ({
      ...prev,
      co2: { ...prev.co2, target }
    }));
  };

  const updateFanSpeed = (fanSpeed: number) => {
    setSettings(prev => ({
      ...prev,
      ventilation: { ...prev.ventilation, fanSpeed }
    }));
  };

  const toggleVentilation = () => {
    setSettings(prev => ({
      ...prev,
      ventilation: { ...prev.ventilation, enabled: !prev.ventilation.enabled }
    }));
  };

  return (
    <div className="environment-panel">
      {/* Temperature Control */}
      <div className="environment-control">
        <div className="control-header">
          <Icons.temperature size={16} />
          <span className="control-label">Temperature</span>
          <Badge variant="primary">
            {settings.temperature.current}°{settings.temperature.unit}
          </Badge>
        </div>
        <div className="control-body">
          <input
            type="range"
            min="10"
            max="35"
            value={settings.temperature.target}
            onChange={(e) => updateTemperature(Number(e.target.value))}
            className="input-range"
          />
          <div className="control-value">
            Target: {settings.temperature.target}°{settings.temperature.unit}
          </div>
        </div>
      </div>

      {/* Humidity Control */}
      <div className="environment-control">
        <div className="control-header">
          <Icons.humidity size={16} />
          <span className="control-label">Humidity</span>
          <Badge variant="primary">{settings.humidity.current}%</Badge>
        </div>
        <div className="control-body">
          <input
            type="range"
            min="30"
            max="90"
            value={settings.humidity.target}
            onChange={(e) => updateHumidity(Number(e.target.value))}
            className="input-range"
          />
          <div className="control-value">Target: {settings.humidity.target}%</div>
        </div>
      </div>

      {/* Lighting Control */}
      <div className="environment-control">
        <div className="control-header">
          <Icons.light size={16} />
          <span className="control-label">Lighting</span>
          <Badge variant="primary">{settings.lighting.intensity}%</Badge>
        </div>
        <div className="control-body">
          <input
            type="range"
            min="0"
            max="100"
            value={settings.lighting.intensity}
            onChange={(e) => updateLighting(Number(e.target.value))}
            className="input-range"
          />
          <select className="select" value={settings.lighting.mode}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              lighting: { ...prev.lighting, mode: e.target.value as 'natural' | 'artificial' | 'mixed' }
            }))}>
            <option value="natural">Natural</option>
            <option value="artificial">Artificial</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* CO2 Level */}
      <div className="environment-control">
        <div className="control-header">
          <Icons.co2 size={16} />
          <span className="control-label">CO2 Level</span>
          <Badge variant={settings.co2.level > 500 ? "warning" : "success"}>
            {settings.co2.level} ppm
          </Badge>
        </div>
        <div className="control-body">
          <input
            type="range"
            min="300"
            max="1000"
            value={settings.co2.target}
            onChange={(e) => updateCO2(Number(e.target.value))}
            className="input-range"
          />
          <div className="control-value">Target: {settings.co2.target} ppm</div>
        </div>
      </div>

      {/* Ventilation Control */}
      <div className="environment-control">
        <div className="control-header">
          <Icons.ventilation size={16} />
          <span className="control-label">Ventilation</span>
          <Badge variant={settings.ventilation.enabled ? "success" : "default"}>
            {settings.ventilation.enabled ? "ON" : "OFF"}
          </Badge>
        </div>
        <div className="control-body">
          <button
            className={`btn btn-sm ${settings.ventilation.enabled ? 'btn-primary' : 'btn-secondary'}`}
            onClick={toggleVentilation}
          >
            {settings.ventilation.enabled ? "Enabled" : "Disabled"}
          </button>
          {settings.ventilation.enabled && (
            <>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.ventilation.fanSpeed}
                onChange={(e) => updateFanSpeed(Number(e.target.value))}
                className="input-range"
              />
              <div className="control-value">Fan Speed: {settings.ventilation.fanSpeed}%</div>
              <select className="select" value={settings.ventilation.mode}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  ventilation: { ...prev.ventilation, mode: e.target.value as 'auto' | 'manual' }
                }))}>
                <option value="auto">Auto</option>
                <option value="manual">Manual</option>
              </select>
            </>
          )}
        </div>
      </div>

      <style>{`
        .environment-panel {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .environment-control {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .control-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
        }

        .control-label {
          flex: 1;
        }

        .control-body {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          padding-left: var(--spacing-2xl);
        }

        .control-value {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
        }

        .input-range {
          width: 100%;
          height: 4px;
          background: var(--color-bg-elevated);
          border-radius: var(--radius-full);
          outline: none;
          -webkit-appearance: none;
        }

        .input-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: var(--color-accent-primary);
          border-radius: 50%;
          cursor: pointer;
        }

        .input-range::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: var(--color-accent-primary);
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}