/**
 * Scene Elements Manager
 * Grid, Lighting, Axes 등 시각화 보조 요소 관리
 */

import type {
  SceneElementsData,
  GridConfig,
  LightConfig,
  CoordinateAxesConfig,
} from '../types/core/scene';
import { DEFAULT_SCENE_ELEMENTS } from '../types/core/scene';

export class SceneElementsManager {
  private data: SceneElementsData;

  constructor(initialData?: Partial<SceneElementsData>) {
    this.data = {
      ...DEFAULT_SCENE_ELEMENTS,
      ...initialData,
    };
  }

  // Getters
  getData(): SceneElementsData {
    return this.data;
  }

  getGrid(): GridConfig {
    return this.data.grid;
  }

  getLighting(): LightConfig {
    return this.data.lighting;
  }

  getAxes(): CoordinateAxesConfig {
    return this.data.coordinateAxes;
  }

  // Grid Controls
  toggleGrid(): void {
    this.data.grid.enabled = !this.data.grid.enabled;
  }

  setGridEnabled(enabled: boolean): void {
    this.data.grid.enabled = enabled;
  }

  updateGrid(updates: Partial<GridConfig>): void {
    this.data.grid = { ...this.data.grid, ...updates };
  }

  // Lighting Controls
  toggleLight(type: 'ambient' | 'directional' | 'hemisphere'): void {
    this.data.lighting[type].enabled = !this.data.lighting[type].enabled;
  }

  setLightEnabled(type: 'ambient' | 'directional' | 'hemisphere', enabled: boolean): void {
    this.data.lighting[type].enabled = enabled;
  }

  updateLighting(updates: Partial<LightConfig>): void {
    this.data.lighting = { ...this.data.lighting, ...updates };
  }

  // Axes Controls
  toggleAxes(): void {
    this.data.coordinateAxes.enabled = !this.data.coordinateAxes.enabled;
  }

  setAxesEnabled(enabled: boolean): void {
    this.data.coordinateAxes.enabled = enabled;
  }

  updateAxes(updates: Partial<CoordinateAxesConfig>): void {
    this.data.coordinateAxes = { ...this.data.coordinateAxes, ...updates };
  }

  // Serialization
  toJSON(): SceneElementsData {
    return JSON.parse(JSON.stringify(this.data));
  }

  static fromJSON(json: Partial<SceneElementsData>): SceneElementsManager {
    return new SceneElementsManager(json);
  }
}
