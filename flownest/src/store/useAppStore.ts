import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  AppSettings,
  DailyLog,
  RoutineMode,
  RoutineTemplate,
  SessionState,
  TaskItem,
} from '../types';
import { STORAGE_KEYS, storage } from '../lib/storage';
import { buildSeedTemplates } from '../data/seed';
import { uid } from '../lib/id';

const defaultSettings: AppSettings = {
  theme: 'dark',
  notificationsEnabled: false,
};

const loadInitialTemplates = (): RoutineTemplate[] => {
  const stored = storage.get<RoutineTemplate[] | null>(STORAGE_KEYS.templates, null);
  if (stored && stored.length) return stored;
  const seed = buildSeedTemplates();
  storage.set(STORAGE_KEYS.templates, seed);
  return seed;
};

export interface AppStore {
  templates: RoutineTemplate[];
  settings: AppSettings;
  logs: DailyLog[];
  session: SessionState | null;
  defaultMorning: RoutineTemplate | undefined;
  defaultNight: RoutineTemplate | undefined;

  templatesByMode: (mode: RoutineMode) => RoutineTemplate[];
  getTemplate: (id: string) => RoutineTemplate | undefined;
  upsertTemplate: (tpl: RoutineTemplate) => void;
  deleteTemplate: (id: string) => void;
  setDefaultTemplate: (id: string) => void;
  createEmptyTemplate: (mode: RoutineMode) => RoutineTemplate;

  startSession: (templateId: string) => SessionState | null;
  updateSession: (updater: (s: SessionState) => SessionState) => void;
  endSession: () => void;

  appendLog: (log: DailyLog) => void;
  clearAllData: () => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
}

export const useAppStore = (): AppStore => {
  const [templates, setTemplates] = useState<RoutineTemplate[]>(() => loadInitialTemplates());
  const [settings, setSettings] = useState<AppSettings>(() =>
    storage.get<AppSettings>(STORAGE_KEYS.settings, defaultSettings),
  );
  const [logs, setLogs] = useState<DailyLog[]>(() =>
    storage.get<DailyLog[]>(STORAGE_KEYS.logs, []),
  );
  const [session, setSession] = useState<SessionState | null>(() =>
    storage.get<SessionState | null>(STORAGE_KEYS.session, null),
  );

  useEffect(() => storage.set(STORAGE_KEYS.templates, templates), [templates]);
  useEffect(() => storage.set(STORAGE_KEYS.settings, settings), [settings]);
  useEffect(() => storage.set(STORAGE_KEYS.logs, logs), [logs]);
  useEffect(() => storage.set(STORAGE_KEYS.session, session), [session]);

  const templatesByMode = useCallback(
    (mode: RoutineMode) => templates.filter((t) => t.mode === mode),
    [templates],
  );
  const getTemplate = useCallback(
    (id: string) => templates.find((t) => t.id === id),
    [templates],
  );

  const defaultMorning = useMemo(
    () =>
      templates.find((t) => t.mode === 'morning' && t.isDefault) ??
      templates.find((t) => t.mode === 'morning'),
    [templates],
  );
  const defaultNight = useMemo(
    () =>
      templates.find((t) => t.mode === 'night' && t.isDefault) ??
      templates.find((t) => t.mode === 'night'),
    [templates],
  );

  const upsertTemplate = useCallback((tpl: RoutineTemplate) => {
    setTemplates((prev) => {
      const idx = prev.findIndex((p) => p.id === tpl.id);
      const next = [...prev];
      const withTs = { ...tpl, updatedAt: Date.now() };
      if (idx >= 0) next[idx] = withTs;
      else next.push(withTs);
      return next;
    });
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setDefaultTemplate = useCallback((id: string) => {
    setTemplates((prev) => {
      const target = prev.find((p) => p.id === id);
      if (!target) return prev;
      return prev.map((p) =>
        p.mode === target.mode ? { ...p, isDefault: p.id === id } : p,
      );
    });
  }, []);

  const createEmptyTemplate = useCallback((mode: RoutineMode): RoutineTemplate => {
    const now = Date.now();
    const blankTask: TaskItem = {
      id: uid(),
      title: '新しいタスク',
      durationMinutes: 10,
      skippable: false,
      order: 0,
    };
    return {
      id: uid(),
      mode,
      name: mode === 'morning' ? '新しい朝ルート' : '新しい夜プラン',
      targetTime: mode === 'morning' ? '08:30' : '23:30',
      tasks: [blankTask],
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    };
  }, []);

  const startSession = useCallback(
    (templateId: string): SessionState | null => {
      const tpl = templates.find((t) => t.id === templateId);
      if (!tpl) return null;
      const next: SessionState = {
        id: uid(),
        templateId,
        mode: tpl.mode,
        startedAt: Date.now(),
        targetTime: tpl.targetTime,
        tasks: tpl.tasks
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((t, i) => ({
            taskId: t.id,
            status: i === 0 ? 'active' : 'pending',
            extendedMinutes: 0,
          })),
      };
      setSession(next);
      return next;
    },
    [templates],
  );

  const updateSession = useCallback((updater: (s: SessionState) => SessionState) => {
    setSession((prev) => (prev ? updater(prev) : prev));
  }, []);

  const endSession = useCallback(() => setSession(null), []);

  const appendLog = useCallback((log: DailyLog) => {
    setLogs((prev) => [log, ...prev].slice(0, 60));
  }, []);

  const clearAllData = useCallback(() => {
    storage.remove(STORAGE_KEYS.templates);
    storage.remove(STORAGE_KEYS.logs);
    storage.remove(STORAGE_KEYS.session);
    storage.remove(STORAGE_KEYS.settings);
    setTemplates(buildSeedTemplates());
    setLogs([]);
    setSession(null);
    setSettings(defaultSettings);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [],
  );

  return {
    templates,
    settings,
    logs,
    session,
    defaultMorning,
    defaultNight,
    templatesByMode,
    getTemplate,
    upsertTemplate,
    deleteTemplate,
    setDefaultTemplate,
    createEmptyTemplate,
    startSession,
    updateSession,
    endSession,
    appendLog,
    clearAllData,
    updateSettings,
  };
};
