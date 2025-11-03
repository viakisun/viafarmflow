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
    color: 0x2a2a2a,
    metalness: 0.8,
    roughness: 0.2,
  },
  bed: {
    color: 0x3a5f3a,
    roughness: 0.7,
  },
  support: {
    color: 0x1a1a1a,
    metalness: 0.7,
    roughness: 0.3,
  },
  floor: {
    color: 0x1a1a1a,
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
  background: 0x0a0a0a,
  grid: {
    major: 0x222222,
    minor: 0x111111,
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
