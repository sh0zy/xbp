import type {
  AppSettings,
  NotificationSchedule,
  PersistedAppState,
  StartSession,
  TaskTemplate,
} from "../types/app";
import { DEFAULT_TEMPLATES } from "./templates";

export const STORAGE_KEY = "three-minute-start-app-state-v1";
export const STATE_VERSION = 1;

const DEFAULT_SETTINGS: AppSettings = {
  themeMode: "system",
  notificationsEnabled: false,
  hapticsEnabled: true,
  onboardingCompleted: false,
};

export function createDefaultState(): PersistedAppState {
  return {
    version: STATE_VERSION,
    templates: DEFAULT_TEMPLATES.map((t) => ({ ...t })),
    sessions: [],
    settings: { ...DEFAULT_SETTINGS },
    notificationSchedules: [],
  };
}

export function createSampleState(): PersistedAppState {
  const base = createDefaultState();
  const now = Date.now();
  const sample: StartSession[] = [
    {
      id: "sample-1",
      taskLabel: "数学のレポート",
      templateId: "tpl-report",
      chosenFirstStep: "ファイルを開くだけ",
      startedAt: now - 1000 * 60 * 60 * 4,
      endedAt: now - 1000 * 60 * 60 * 4 + 1000 * 60 * 12,
      baseDurationSec: 180,
      extraDurationSec: 540,
      status: "continued_open",
      continued: true,
      note: null,
    },
    {
      id: "sample-2",
      taskLabel: "メール返信",
      templateId: "tpl-reply",
      chosenFirstStep: "受信箱を開くだけ",
      startedAt: now - 1000 * 60 * 60 * 28,
      endedAt: now - 1000 * 60 * 60 * 28 + 1000 * 180,
      baseDurationSec: 180,
      extraDurationSec: 0,
      status: "completed_3min",
      continued: false,
      note: null,
    },
    {
      id: "sample-3",
      taskLabel: "部屋の片付け",
      templateId: "tpl-tidy",
      chosenFirstStep: "机の上を1つだけ片付ける",
      startedAt: now - 1000 * 60 * 60 * 50,
      endedAt: now - 1000 * 60 * 60 * 50 + 1000 * 90,
      baseDurationSec: 180,
      extraDurationSec: 0,
      status: "stopped_early",
      continued: false,
      note: null,
    },
  ];
  base.sessions = sample;
  base.notificationSchedules = [
    { id: "sample-noti-1", hour: 9, minute: 0, enabled: true },
    { id: "sample-noti-2", hour: 21, minute: 0, enabled: true },
  ];
  return base;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function safeParse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function normalize(raw: unknown): PersistedAppState {
  const fallback = createDefaultState();
  if (!isObject(raw)) return fallback;

  const version = typeof raw.version === "number" ? raw.version : STATE_VERSION;
  const templates = Array.isArray(raw.templates)
    ? (raw.templates.filter((t) => isObject(t)) as unknown as TaskTemplate[])
    : fallback.templates;
  const sessions = Array.isArray(raw.sessions)
    ? (raw.sessions.filter((s) => isObject(s)) as unknown as StartSession[])
    : [];
  const settingsRaw = isObject(raw.settings) ? raw.settings : {};
  const settings: AppSettings = {
    themeMode:
      settingsRaw.themeMode === "light" ||
      settingsRaw.themeMode === "dark" ||
      settingsRaw.themeMode === "system"
        ? settingsRaw.themeMode
        : DEFAULT_SETTINGS.themeMode,
    notificationsEnabled:
      typeof settingsRaw.notificationsEnabled === "boolean"
        ? settingsRaw.notificationsEnabled
        : DEFAULT_SETTINGS.notificationsEnabled,
    hapticsEnabled:
      typeof settingsRaw.hapticsEnabled === "boolean"
        ? settingsRaw.hapticsEnabled
        : DEFAULT_SETTINGS.hapticsEnabled,
    onboardingCompleted:
      typeof settingsRaw.onboardingCompleted === "boolean"
        ? settingsRaw.onboardingCompleted
        : DEFAULT_SETTINGS.onboardingCompleted,
  };

  const fallbackTemplateIds = new Set(fallback.templates.map((t) => t.id));
  const finalTemplates = templates.length === 0 ? fallback.templates : templates;
  for (const def of fallback.templates) {
    if (!finalTemplates.find((t) => t.id === def.id)) {
      finalTemplates.push(def);
    }
  }
  finalTemplates.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  void fallbackTemplateIds;

  const notificationSchedules: NotificationSchedule[] = Array.isArray(
    raw.notificationSchedules,
  )
    ? raw.notificationSchedules
        .filter((n): n is Record<string, unknown> => isObject(n))
        .map((n) => ({
          id: typeof n.id === "string" ? n.id : `noti-${Math.random()}`,
          hour:
            typeof n.hour === "number" && n.hour >= 0 && n.hour <= 23
              ? Math.floor(n.hour)
              : 9,
          minute:
            typeof n.minute === "number" && n.minute >= 0 && n.minute <= 59
              ? Math.floor(n.minute)
              : 0,
          enabled: typeof n.enabled === "boolean" ? n.enabled : true,
          label: typeof n.label === "string" ? n.label : undefined,
        }))
    : [];

  return {
    version,
    templates: finalTemplates,
    sessions,
    settings,
    notificationSchedules,
  };
}

export function loadAppState(): PersistedAppState {
  if (typeof window === "undefined" || !window.localStorage) {
    return createDefaultState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = safeParse(raw);
    return normalize(parsed);
  } catch {
    return createDefaultState();
  }
}

export function saveAppState(state: PersistedAppState): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors silently
  }
}

export function clearAppState(): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
