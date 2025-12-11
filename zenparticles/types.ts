export enum ShapeType {
  SPHERE = 'Sphere',
  HEART = 'Heart',
  FLOWER = 'Flower',
  SATURN = 'Saturn',
  BUDDHA = 'Buddha',
  FIREWORKS = 'Fireworks',
}

export enum ParticleStyle {
  GLOW = 'Glow',
  DIGITAL = 'Digital',
  CYBER = 'Cyber',
  MAGIC = 'Magic',
}

export interface HandTrackingResult {
  tension: number; // 0.0 (Open) to 1.0 (Fist)
  isDetected: boolean;
}

export interface ParticleConfig {
  color: string;
  shape: ShapeType;
  style: ParticleStyle;
}

export const TRAIL_LENGTH = 5;
export const PARTICLE_COUNT = 3000; // Base particles, total will be * TRAIL_LENGTH