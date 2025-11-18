import { mapService } from '../services/mapService';
import { loadStaticMapFromURL } from './jsonLoader';

/**
 * 샘플 맵을 localStorage에 초기화
 * 첫 실행 시 demo 맵 자동 생성
 */
export async function initializeSampleMap() {
  const demoMapId = 'demo';

  try {
    // demo 맵이 이미 존재하는지 확인
    try {
      await mapService.fetchStaticMap(demoMapId);
      console.log('✅ Demo map already exists');
      return;
    } catch {
      // demo 맵이 없으면 생성
    }

    // 샘플 JSON 파일 로드
    const staticMap = await loadStaticMapFromURL('/sample_greenhouse_map.json');

    // metadata 업데이트
    staticMap.metadata = {
      ...staticMap.metadata,
      id: demoMapId,
      name: 'Demo Greenhouse',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };

    // localStorage에 저장
    await mapService.saveStaticMap(demoMapId, staticMap);
    console.log('✅ Demo map initialized');
  } catch (error) {
    console.error('Failed to initialize demo map:', error);
  }
}
