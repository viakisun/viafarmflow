/**
 * 기본 타입 정의
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Metadata {
  id: string;
  name: string;
  created: string;
  modified: string;
  author: string;
}

export interface BaseObject {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  metadata?: Record<string, any>;
}
