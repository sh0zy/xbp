import { Preferences } from '@capacitor/preferences';
import {
  DEFAULT_SETTINGS,
  isAppSettings,
  isNote,
  type AppSettings,
  type Note,
} from '@/features/notes/types/note';

const NOTES_KEY = 'noteframe.notes.v1';
const SETTINGS_KEY = 'noteframe.settings.v1';
const SEEDED_KEY = 'noteframe.seeded.v1';

function parseJson<T>(value: string | null, isExpected: (candidate: unknown) => candidate is T, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return isExpected(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function isNoteArray(value: unknown): value is Note[] {
  return Array.isArray(value) && value.every((candidate) => isNote(candidate));
}

export async function loadNotes(): Promise<Note[]> {
  const { value } = await Preferences.get({ key: NOTES_KEY });
  return parseJson(value, isNoteArray, []);
}

export async function saveNotes(notes: Note[]): Promise<void> {
  await Preferences.set({
    key: NOTES_KEY,
    value: JSON.stringify(notes),
  });
}

export async function loadSettings(): Promise<AppSettings> {
  const [{ value: settingsValue }, { value: seededValue }] = await Promise.all([
    Preferences.get({ key: SETTINGS_KEY }),
    Preferences.get({ key: SEEDED_KEY }),
  ]);

  const parsedSettings = parseJson(settingsValue, isAppSettings, DEFAULT_SETTINGS);
  const seededFlag = seededValue === 'true';

  return {
    ...parsedSettings,
    hasSeededDemo: parsedSettings.hasSeededDemo || seededFlag,
  };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await Promise.all([
    Preferences.set({
      key: SETTINGS_KEY,
      value: JSON.stringify(settings),
    }),
    Preferences.set({
      key: SEEDED_KEY,
      value: settings.hasSeededDemo ? 'true' : 'false',
    }),
  ]);
}

export async function clearStorage(): Promise<void> {
  await Promise.all([
    Preferences.remove({ key: NOTES_KEY }),
    Preferences.remove({ key: SETTINGS_KEY }),
    Preferences.remove({ key: SEEDED_KEY }),
  ]);
}
