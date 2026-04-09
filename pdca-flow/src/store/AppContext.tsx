import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type {
  Theme, PlanData, DoLog, CheckReview, ActItem, AppSettings,
} from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { storage } from '../lib/storage';
import { generateId } from '../lib/id';
import { today } from '../lib/date';

interface AppState {
  themes: Theme[];
  plans: PlanData[];
  doLogs: DoLog[];
  checks: CheckReview[];
  acts: ActItem[];
  settings: AppSettings;
}

interface AppContextValue extends AppState {
  addTheme: (t: Omit<Theme, 'id' | 'currentCycle' | 'createdAt' | 'updatedAt'>) => Theme;
  updateTheme: (t: Theme) => void;
  deleteTheme: (id: string) => void;
  savePlan: (p: Omit<PlanData, 'id' | 'createdAt'>) => void;
  addDoLog: (d: Omit<DoLog, 'id' | 'createdAt'>) => void;
  saveCheck: (c: Omit<CheckReview, 'id' | 'createdAt'>) => void;
  saveAct: (a: Omit<ActItem, 'id' | 'createdAt'>) => void;
  advanceCycle: (themeId: string) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  loadSampleData: () => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function load(): AppState {
  return {
    themes: storage.get<Theme[]>(storage.KEYS.THEMES, []),
    plans: storage.get<PlanData[]>(storage.KEYS.PLANS, []),
    doLogs: storage.get<DoLog[]>(storage.KEYS.DO_LOGS, []),
    checks: storage.get<CheckReview[]>(storage.KEYS.CHECKS, []),
    acts: storage.get<ActItem[]>(storage.KEYS.ACTS, []),
    settings: storage.get<AppSettings>(storage.KEYS.SETTINGS, DEFAULT_SETTINGS),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);

  const persist = useCallback((next: AppState) => {
    storage.set(storage.KEYS.THEMES, next.themes);
    storage.set(storage.KEYS.PLANS, next.plans);
    storage.set(storage.KEYS.DO_LOGS, next.doLogs);
    storage.set(storage.KEYS.CHECKS, next.checks);
    storage.set(storage.KEYS.ACTS, next.acts);
    storage.set(storage.KEYS.SETTINGS, next.settings);
    setState(next);
  }, []);

  const addTheme = useCallback((t: Omit<Theme, 'id' | 'currentCycle' | 'createdAt' | 'updatedAt'>) => {
    const theme: Theme = { ...t, id: generateId(), currentCycle: 1, createdAt: today(), updatedAt: today() };
    setState((prev) => {
      const next = { ...prev, themes: [...prev.themes, theme] };
      persist(next);
      return next;
    });
    return { ...t, id: generateId(), currentCycle: 1, createdAt: today(), updatedAt: today() } as Theme;
  }, [persist]);

  const updateTheme = useCallback((t: Theme) => {
    setState((prev) => {
      const next = { ...prev, themes: prev.themes.map((x) => (x.id === t.id ? { ...t, updatedAt: today() } : x)) };
      persist(next);
      return next;
    });
  }, [persist]);

  const deleteTheme = useCallback((id: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        themes: prev.themes.filter((x) => x.id !== id),
        plans: prev.plans.filter((x) => x.themeId !== id),
        doLogs: prev.doLogs.filter((x) => x.themeId !== id),
        checks: prev.checks.filter((x) => x.themeId !== id),
        acts: prev.acts.filter((x) => x.themeId !== id),
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const savePlan = useCallback((p: Omit<PlanData, 'id' | 'createdAt'>) => {
    setState((prev) => {
      const existing = prev.plans.find((x) => x.themeId === p.themeId && x.cycle === p.cycle);
      let plans: PlanData[];
      if (existing) {
        plans = prev.plans.map((x) => (x.id === existing.id ? { ...existing, ...p } : x));
      } else {
        plans = [...prev.plans, { ...p, id: generateId(), createdAt: today() }];
      }
      const next = { ...prev, plans };
      persist(next);
      return next;
    });
  }, [persist]);

  const addDoLog = useCallback((d: Omit<DoLog, 'id' | 'createdAt'>) => {
    setState((prev) => {
      const next = { ...prev, doLogs: [...prev.doLogs, { ...d, id: generateId(), createdAt: today() }] };
      persist(next);
      return next;
    });
  }, [persist]);

  const saveCheck = useCallback((c: Omit<CheckReview, 'id' | 'createdAt'>) => {
    setState((prev) => {
      const existing = prev.checks.find((x) => x.themeId === c.themeId && x.cycle === c.cycle);
      let checks: CheckReview[];
      if (existing) {
        checks = prev.checks.map((x) => (x.id === existing.id ? { ...existing, ...c } : x));
      } else {
        checks = [...prev.checks, { ...c, id: generateId(), createdAt: today() }];
      }
      const next = { ...prev, checks };
      persist(next);
      return next;
    });
  }, [persist]);

  const saveAct = useCallback((a: Omit<ActItem, 'id' | 'createdAt'>) => {
    setState((prev) => {
      const existing = prev.acts.find((x) => x.themeId === a.themeId && x.cycle === a.cycle);
      let acts: ActItem[];
      if (existing) {
        acts = prev.acts.map((x) => (x.id === existing.id ? { ...existing, ...a } : x));
      } else {
        acts = [...prev.acts, { ...a, id: generateId(), createdAt: today() }];
      }
      const next = { ...prev, acts };
      persist(next);
      return next;
    });
  }, [persist]);

  const advanceCycle = useCallback((themeId: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        themes: prev.themes.map((t) =>
          t.id === themeId ? { ...t, currentCycle: t.currentCycle + 1, updatedAt: today() } : t
        ),
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const updateSettings = useCallback((s: Partial<AppSettings>) => {
    setState((prev) => {
      const next = { ...prev, settings: { ...prev.settings, ...s } };
      persist(next);
      return next;
    });
  }, [persist]);

  const loadSampleData = useCallback(() => {
    const sampleTheme: Theme = {
      id: 'sample1',
      title: '毎日30分の英語学習',
      category: 'study',
      goal: 'TOEIC 800点を目指す',
      deadline: '2026-06-30',
      priority: 'high',
      status: 'active',
      currentCycle: 1,
      createdAt: '2026-04-01',
      updatedAt: '2026-04-09',
    };
    const samplePlan: PlanData = {
      id: 'splan1',
      themeId: 'sample1',
      cycle: 1,
      goal: 'TOEIC 800点',
      actions: '毎朝6時に30分、リスニングとリーディングを交互に行う',
      metrics: 'TOEIC模試スコア',
      startDate: '2026-04-01',
      deadline: '2026-06-30',
      targetValue: '800点',
      successCriteria: '模試で800点以上',
      createdAt: '2026-04-01',
    };
    const sampleDoLog: DoLog = {
      id: 'sdo1',
      themeId: 'sample1',
      cycle: 1,
      date: '2026-04-09',
      description: 'リスニングPart3を20問解いた',
      completed: true,
      memo: '集中できた',
      createdAt: '2026-04-09',
    };
    const next: AppState = {
      themes: [sampleTheme],
      plans: [samplePlan],
      doLogs: [sampleDoLog],
      checks: [],
      acts: [],
      settings: state.settings,
    };
    persist(next);
  }, [persist, state.settings]);

  const clearAllData = useCallback(() => {
    storage.clearAll();
    setState({ themes: [], plans: [], doLogs: [], checks: [], acts: [], settings: DEFAULT_SETTINGS });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      addTheme,
      updateTheme,
      deleteTheme,
      savePlan,
      addDoLog,
      saveCheck,
      saveAct,
      advanceCycle,
      updateSettings,
      loadSampleData,
      clearAllData,
    }),
    [state, addTheme, updateTheme, deleteTheme, savePlan, addDoLog, saveCheck, saveAct, advanceCycle, updateSettings, loadSampleData, clearAllData]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
