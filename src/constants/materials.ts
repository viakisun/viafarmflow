export const MATERIALS = {
  glass: {
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 0.3,
  },
  frame: {
    color: 0xe0e0e0,  // 밝은 회색 (흰색에 가까움)
    metalness: 0.3,
    roughness: 0.5,
  },
  bed: {
    color: 0x3a5f3a,
    roughness: 0.7,
  },
  support: {
    color: 0xcccccc,  // 밝은 회색
    metalness: 0.3,
    roughness: 0.5,
  },
  floor: {
    color: 0xf5f5f5,  // 거의 흰색 (약간 회색빛)
    roughness: 0.8,
  },
  cable: {
    color: 0x333333,
    metalness: 0.9,
    roughness: 0.1,
  },
  plant: {
    color: 0x2d5016,
    roughness: 0.9,
  },
} as const;

export const COLORS = {
  background: 0xffffff,  // 이미 Scene.tsx에서 흰색으로 변경됨
  grid: {
    major: 0xcccccc,  // 밝은 회색 (주요 그리드선)
    minor: 0xe8e8e8,  // 더 밝은 회색 (보조 그리드선)
  },
  dimension: 0xffaa00,
  robot: {
    default: 0x3366ff,
    selected: 0xff6633,
    idle: 0x33cc33,
    moving: 0x3366ff,
    working: 0xff9933,
  },
  zone: {
    default: 0x6666ff,
    selected: 0xff66ff,
  },
} as const;

export const FRAME_THICKNESS = 0.3;
export const ROOF_ANGLE = Math.PI / 12; // 15도
