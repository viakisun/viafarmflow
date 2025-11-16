import type { StaticMapData } from '../types/staticMapData';
import type { DynamicRobotData } from '../types/dynamicRobotData';
import { validateStaticMapData, validateDynamicRobotData } from './mapDataConverter';

/**
 * JSON 파일에서 정적 맵 데이터 로드
 */
export async function loadStaticMapFromJSON(file: File): Promise<StaticMapData> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!validateStaticMapData(data)) {
    throw new Error('Invalid static map data format');
  }

  return data;
}

/**
 * URL에서 정적 맵 데이터 로드
 */
export async function loadStaticMapFromURL(url: string): Promise<StaticMapData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch static map data: ${response.statusText}`);
  }

  const data = await response.json();

  if (!validateStaticMapData(data)) {
    throw new Error('Invalid static map data format');
  }

  return data;
}

/**
 * JSON 파일에서 동적 로봇 데이터 로드
 */
export async function loadDynamicRobotFromJSON(file: File): Promise<DynamicRobotData> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!validateDynamicRobotData(data)) {
    throw new Error('Invalid dynamic robot data format');
  }

  return data;
}

/**
 * URL에서 동적 로봇 데이터 로드
 */
export async function loadDynamicRobotFromURL(url: string): Promise<DynamicRobotData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch dynamic robot data: ${response.statusText}`);
  }

  const data = await response.json();

  if (!validateDynamicRobotData(data)) {
    throw new Error('Invalid dynamic robot data format');
  }

  return data;
}

/**
 * 정적 맵 데이터를 JSON 파일로 다운로드
 */
export function downloadStaticMapJSON(data: StaticMapData, filename?: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${data.metadata.name}_${data.version}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * 동적 로봇 데이터를 JSON 파일로 다운로드
 */
export function downloadDynamicRobotJSON(data: DynamicRobotData, filename?: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `robot_data_${data.timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * 파일 선택 다이얼로그 트리거 (정적 맵)
 */
export function triggerStaticMapImport(callback: (data: StaticMapData) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const data = await loadStaticMapFromJSON(file);
      callback(data);
    } catch (error) {
      console.error('Failed to load static map:', error);
      alert('정적 맵 데이터 로드 실패: ' + (error as Error).message);
    }
  };

  input.click();
}

/**
 * 파일 선택 다이얼로그 트리거 (동적 로봇)
 */
export function triggerDynamicRobotImport(callback: (data: DynamicRobotData) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const data = await loadDynamicRobotFromJSON(file);
      callback(data);
    } catch (error) {
      console.error('Failed to load dynamic robot data:', error);
      alert('로봇 데이터 로드 실패: ' + (error as Error).message);
    }
  };

  input.click();
}
