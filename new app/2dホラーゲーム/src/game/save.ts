import { DEFAULT_AUDIO_SETTINGS, INITIAL_MAP_ID, INITIAL_POSITION, SAVE_VERSION, STORAGE_PREFIX, MAX_SAVE_SLOTS } from './constants';
import { logs, importantLogIds } from './logs';
import { maps } from './maps';
import type { AudioSettings, SaveData, SaveSlotSummary } from './types';
import { readJson, removeKey, writeJson } from '../utils/storage';

const globalAudioKey = `${STORAGE_PREFIX}:audio`;
const endingsKey = `${STORAGE_PREFIX}:clearedEndings`;

export function slotKey(slot: number): string {
  return `${STORAGE_PREFIX}:slot:${slot}`;
}

export function readAudioSettings(): AudioSettings {
  return readJson<AudioSettings>(globalAudioKey, DEFAULT_AUDIO_SETTINGS);
}

export function writeAudioSettings(settings: AudioSettings): boolean {
  return writeJson(globalAudioKey, settings);
}

export function readClearedEndings(): string[] {
  return readJson<string[]>(endingsKey, []);
}

export function writeClearedEndings(endings: string[]): boolean {
  return writeJson(endingsKey, Array.from(new Set(endings)));
}

export function createInitialSave(slot: number): SaveData {
  const now = new Date().toISOString();
  return {
    version: SAVE_VERSION,
    slot,
    createdAt: now,
    updatedAt: now,
    playTimeSeconds: 0,
    currentChapter: 'prologue',
    currentMapId: INITIAL_MAP_ID,
    playerPosition: INITIAL_POSITION,
    direction: 'down',
    collectedLogs: [],
    logDiscoveredAt: {},
    readLogs: [],
    inventory: [],
    itemObtainedAt: {},
    solvedPuzzles: [],
    choices: {},
    endingFlags: {},
    clearedEndings: readClearedEndings(),
    hintLevels: {},
    discoveredDialogues: [],
    checkpoint: {
      mapId: INITIAL_MAP_ID,
      position: INITIAL_POSITION,
    },
    audioSettings: readAudioSettings(),
  };
}

export function loadSlot(slot: number): SaveData | null {
  const data = readJson<SaveData | null>(slotKey(slot), null);
  if (!data || data.version !== SAVE_VERSION) {
    return null;
  }
  return {
    ...data,
    logDiscoveredAt: data.logDiscoveredAt ?? {},
    itemObtainedAt: data.itemObtainedAt ?? {},
    audioSettings: { ...DEFAULT_AUDIO_SETTINGS, ...readAudioSettings(), ...data.audioSettings },
    clearedEndings: Array.from(new Set([...readClearedEndings(), ...(data.clearedEndings ?? [])])),
  };
}

export function saveSlot(data: SaveData): boolean {
  const updated: SaveData = {
    ...data,
    updatedAt: new Date().toISOString(),
    audioSettings: readAudioSettings(),
    clearedEndings: Array.from(new Set([...readClearedEndings(), ...data.clearedEndings])),
  };
  return writeJson(slotKey(data.slot), updated);
}

export function deleteSlot(slot: number): boolean {
  return removeKey(slotKey(slot));
}

export function getSlotSummaries(): SaveSlotSummary[] {
  return Array.from({ length: MAX_SAVE_SLOTS }, (_, index) => {
    const slot = index + 1;
    const data = loadSlot(slot);
    if (!data) {
      return { slot, isEmpty: true };
    }
    const map = maps[data.currentMapId];
    const importantCount = data.collectedLogs.filter((id) => importantLogIds.includes(id)).length;
    return {
      slot,
      isEmpty: false,
      chapter: data.currentChapter,
      mapName: map?.name ?? data.currentMapId,
      updatedAt: data.updatedAt,
      playTimeSeconds: data.playTimeSeconds,
      logCount: data.collectedLogs.filter((id) => logs[id]).length,
      importantCount,
      label: data.slotLabel,
      clearedEndings: data.clearedEndings,
    };
  });
}

export function updateSlotAfterEnding(data: SaveData, endingId: string): SaveData {
  const cleared = Array.from(new Set([...data.clearedEndings, endingId]));
  writeClearedEndings(cleared);
  const slotLabel = endingId === 'endingB' ? '042' : data.slotLabel;
  const next = { ...data, clearedEndings: cleared, slotLabel };
  saveSlot(next);
  return next;
}
