import type { AudioSettings } from './types';

export const TILE_SIZE = 32;
export const SAVE_VERSION = 1;
export const MAX_SAVE_SLOTS = 3;
export const STORAGE_PREFIX = 'campus2358';

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  enabled: true,
  bgmVolume: 0.45,
  seVolume: 0.65,
  noiseEnabled: true,
  textSpeed: 'normal',
};

export const COLOR_VARS = {
  bgDeep: '#05050F',
  bgSurface: '#0C0C1A',
  bgOverlay: '#12121F',
  textPrimary: '#E8E6DF',
  textSecondary: '#9A98A0',
  textMuted: '#55535C',
  accentBlue: '#2D4A6B',
  accentGlow: '#3A5F8A',
  danger: '#6B1F1F',
  dangerBright: '#C0392B',
  border: '#1E1E2E',
  borderActive: '#2D4A6B',
  logPaper: '#0F0F1C',
  logInk: '#B8B4A8',
} as const;

export const INITIAL_MAP_ID = 'gate';
export const INITIAL_POSITION = { x: 5, y: 8 };

export const IMPORTANT_LOG_TARGET = 8;
export const LOG_TARGET = 20;

export const FINAL_CORRECT_NAME = '榊ユウ';
