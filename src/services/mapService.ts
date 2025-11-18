/**
 * Map Service Interface
 * Static/Dynamic 데이터 분리를 위한 서비스 인터페이스
 *
 * - Static Map Data: Map Editor에서 편집, JSON 파일로 저장
 * - Dynamic Data: 서버에서 실시간으로 받아옴 (로봇 위치, 상태 등)
 */

import type { StaticMapData } from '../types/staticMapData';
import type { DynamicRobotData } from '../types/dynamicRobotData';
import type { SceneElementsData } from '../types/core/scene';

/**
 * Map Service 인터페이스
 */
export interface MapService {
  // ===== Static Map Operations =====
  /**
   * Static Map 데이터 가져오기 (JSON 파일)
   * @param mapId Map ID
   * @returns StaticMapData including sceneSettings
   */
  fetchStaticMap(mapId: string): Promise<StaticMapData>;

  /**
   * Static Map 데이터 저장 (JSON 파일)
   * @param mapId Map ID
   * @param data StaticMapData to save
   */
  saveStaticMap(mapId: string, data: StaticMapData): Promise<void>;

  /**
   * 사용 가능한 Map 목록 조회
   * @returns Map 목록 (id와 data)
   */
  listMaps(): Promise<Array<{ id: string; data: StaticMapData }>>;

  // ===== Dynamic Data Operations =====
  /**
   * Dynamic 데이터 가져오기 (서버 통신)
   * 로봇의 실시간 위치, 상태, 경로 등
   * @param mapId Map ID
   * @returns DynamicRobotData
   */
  fetchDynamicData(mapId: string): Promise<DynamicRobotData>;

  /**
   * Dynamic 데이터 실시간 구독
   * WebSocket 등을 통한 실시간 업데이트
   * @param mapId Map ID
   * @param callback 데이터 업데이트 콜백
   * @returns 구독 해제 함수
   */
  subscribeDynamicUpdates(
    mapId: string,
    callback: (data: DynamicRobotData) => void
  ): () => void;
}

/**
 * Mock Map Service
 * 로컬 데이터로 시뮬레이션
 */
export class MockMapService implements MapService {
  private staticMaps: Map<string, StaticMapData> = new Map();
  private dynamicData: Map<string, DynamicRobotData> = new Map();

  async fetchStaticMap(mapId: string): Promise<StaticMapData> {
    // 로컬 localStorage에서 읽기 또는 기본 데이터 반환
    const stored = localStorage.getItem(`viafarm-map-${mapId}`);
    if (stored) {
      return JSON.parse(stored);
    }

    // 기본 데이터 (없으면 생성)
    throw new Error(`Map not found: ${mapId}`);
  }

  async saveStaticMap(mapId: string, data: StaticMapData): Promise<void> {
    // 로컬 localStorage에 저장
    localStorage.setItem(`viafarm-map-${mapId}`, JSON.stringify(data));
    this.staticMaps.set(mapId, data);
  }

  async listMaps(): Promise<Array<{ id: string; data: StaticMapData }>> {
    // localStorage에서 모든 맵 목록 가져오기
    const maps: Array<{ id: string; data: StaticMapData }> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('viafarm-map-')) {
        const mapId = key.replace('viafarm-map-', '');
        const data = JSON.parse(localStorage.getItem(key)!) as StaticMapData;
        maps.push({
          id: mapId,
          data,
        });
      }
    }

    return maps;
  }

  async fetchDynamicData(mapId: string): Promise<DynamicRobotData> {
    // Mock: 서버에서 받아온 것처럼 시뮬레이션
    const mockData: DynamicRobotData = {
      robots: [],
      timestamp: new Date().toISOString(),
    };

    return mockData;
  }

  subscribeDynamicUpdates(
    mapId: string,
    callback: (data: DynamicRobotData) => void
  ): () => void {
    // Mock: 주기적으로 업데이트 시뮬레이션 (2초마다)
    const interval = setInterval(() => {
      const mockData: DynamicRobotData = {
        robots: [],
        timestamp: new Date().toISOString(),
      };
      callback(mockData);
    }, 2000);

    // 구독 해제 함수 반환
    return () => {
      clearInterval(interval);
    };
  }
}

/**
 * Default Map Service Instance
 * 현재는 Mock 사용, 향후 실제 서버 연결 시 교체
 */
export const mapService: MapService = new MockMapService();
