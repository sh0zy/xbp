// ローカル保存ユーティリティ
import type { RpgSave, CpuStreakState, EquipmentId, CpuLevel, EquipmentPreset } from '../types';

const KEY = 'keshibato:v1';

export interface SaveData {
  tutorialDone: boolean;
  winCount: number;
  loseCount: number;
  unlocks: string[]; // stage/equip id
  missionsProgress: Record<string, number>;
  volume: number;
  vibration: boolean;
  /** RPGモードの進行。存在しなければ新規扱い。 */
  rpg?: RpgSave;
  /** RPG以外の通常CPU戦で記録するCPU連勝。モード毎に分ける。 */
  cpuStreak?: {
    solo: CpuStreakState;
    challenge: CpuStreakState;
  };
  /** 通常CPU戦のグローバルCPUレベル。未設定なら normal。 */
  cpuLevel?: CpuLevel;
  /** 装備お気に入り */
  equipFavorites?: EquipmentId[];
  /** 最近使った装備(最大10, 新しいほど先頭) */
  equipRecents?: EquipmentId[];
  /** 装備プリセット */
  equipPresets?: EquipmentPreset[];
  /** ステージお気に入り */
  stageFavorites?: string[];
  /** 最近遊んだステージ */
  stageRecents?: string[];
}

export const DEFAULT_RPG_SAVE: RpgSave = {
  currentStage: 1,
  maxUnlockedStage: 1,
  defeatedBosses: [],
  medals: [],
  medalUnlockedAt: {},
  bossClearCount: 0,
  selectedDifficulty: 'normal',
  totalWins: 0,
  totalLosses: 0,
  saveVersion: 1,
};

export const DEFAULT_CPU_STREAK: CpuStreakState = { current: 0, max: 0 };

export const DEFAULT_SAVE: SaveData = {
  tutorialDone: false,
  winCount: 0,
  loseCount: 0,
  unlocks: [
    // ステージ
    'desk_normal', 'desk_narrow', 'desk_obstacle',
    // 初期解放装備 (easy中心+一部normal)
    'none', 'triangle', 'pencil', 'eraserBig',
    'notebook', 'eraserCover', 'chalk', 'binder', 'looseLeaf', 'tape',
  ],
  missionsProgress: {},
  volume: 0.6,
  vibration: true,
  cpuStreak: {
    solo: { ...DEFAULT_CPU_STREAK },
    challenge: { ...DEFAULT_CPU_STREAK },
  },
  cpuLevel: 'normal',
  equipFavorites: [],
  equipRecents: [],
  equipPresets: [],
  stageFavorites: [],
  stageRecents: [],
};

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    const unlocks = Array.from(new Set([...(parsed.unlocks ?? []), ...DEFAULT_SAVE.unlocks]));
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      unlocks,
      cpuStreak: {
        solo: { ...DEFAULT_CPU_STREAK, ...(parsed.cpuStreak?.solo ?? {}) },
        challenge: { ...DEFAULT_CPU_STREAK, ...(parsed.cpuStreak?.challenge ?? {}) },
      },
      cpuLevel: parsed.cpuLevel ?? 'normal',
      equipFavorites: parsed.equipFavorites ?? [],
      equipRecents: parsed.equipRecents ?? [],
      equipPresets: parsed.equipPresets ?? [],
      stageFavorites: parsed.stageFavorites ?? [],
      stageRecents: parsed.stageRecents ?? [],
      rpg: parsed.rpg ? { ...DEFAULT_RPG_SAVE, ...parsed.rpg } : undefined,
    };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

export function saveSave(data: SaveData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}
