import { create } from "zustand";
import type {
  ExecutionState,
  GeneratedPlan,
  HistoryEntry,
  PlanMode,
  ReviewLog,
  TaskTemplate,
  TodayDraft,
  UserSettings,
} from "../types";
import { defaultTemplatesByMode } from "../data/defaultTemplates";
import { generatePlan } from "../lib/planner";
import { loadState, saveState, clearState } from "../lib/storage";
import { uid } from "../lib/utils";
import { nowHhmm, todayDateString } from "../lib/time";

interface PersistedState {
  settings: UserSettings;
  templates: TaskTemplate[];
  todayDraft: TodayDraft | null;
  currentPlan: GeneratedPlan | null;
  executionState: ExecutionState;
  reviewLogs: ReviewLog[];
  history: HistoryEntry[];
}

interface AppStore extends PersistedState {
  completeOnboarding: (settings: Partial<UserSettings>) => void;
  updateSettings: (patch: Partial<UserSettings>) => void;
  createDraft: (mode?: PlanMode) => void;
  updateDraft: (patch: Partial<TodayDraft>) => void;
  setDraftTasks: (tasks: TaskTemplate[]) => void;
  addDraftTask: (task: Omit<TaskTemplate, "id">) => void;
  removeDraftTask: (id: string) => void;
  updateDraftTask: (id: string, patch: Partial<TaskTemplate>) => void;
  generateCurrentPlan: () => GeneratedPlan | null;
  duplicateYesterdayPlan: () => boolean;
  startExecution: () => void;
  completeCurrentTask: () => void;
  skipCurrentTask: () => void;
  extendCurrentTask: (min: number) => void;
  recalculatePlan: () => void;
  saveReview: (input: { feeling: 1 | 2 | 3 | 4 | 5; note?: string; actualBedtime?: string }) => void;
  resetAllData: () => void;
}

const initialSettings: UserSettings = {
  targetBedtime: "00:00",
  defaultMode: "normal",
  onboardingCompleted: false,
};

const initialExecution: ExecutionState = {
  planId: null,
  startedAt: null,
  currentIndex: 0,
  completedIds: [],
  skippedIds: [],
  extensionsMin: 0,
};

function initialState(): PersistedState {
  return {
    settings: initialSettings,
    templates: defaultTemplatesByMode.normal(),
    todayDraft: null,
    currentPlan: null,
    executionState: initialExecution,
    reviewLogs: [],
    history: [],
  };
}

function hydrate(): PersistedState {
  const saved = loadState<PersistedState>();
  if (!saved) return initialState();
  return {
    ...initialState(),
    ...saved,
    settings: { ...initialSettings, ...saved.settings },
    executionState: { ...initialExecution, ...(saved.executionState || {}) },
  };
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;
function schedulePersist(state: PersistedState) {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    const { settings, templates, todayDraft, currentPlan, executionState, reviewLogs, history } = state;
    saveState<PersistedState>({ settings, templates, todayDraft, currentPlan, executionState, reviewLogs, history });
  }, 120);
}

export const useAppStore = create<AppStore>((set, get) => {
  const base = hydrate();

  const persist = () => {
    const s = get();
    schedulePersist({
      settings: s.settings,
      templates: s.templates,
      todayDraft: s.todayDraft,
      currentPlan: s.currentPlan,
      executionState: s.executionState,
      reviewLogs: s.reviewLogs,
      history: s.history,
    });
  };

  return {
    ...base,

    completeOnboarding: (patch) => {
      set((s) => ({ settings: { ...s.settings, ...patch, onboardingCompleted: true } }));
      persist();
    },

    updateSettings: (patch) => {
      set((s) => ({ settings: { ...s.settings, ...patch } }));
      persist();
    },

    createDraft: (mode) => {
      const s = get();
      const m: PlanMode = mode || s.settings.defaultMode;
      set({
        todayDraft: {
          homeTime: nowHhmm(),
          bedtime: s.settings.targetBedtime,
          mode: m,
          tasks: defaultTemplatesByMode[m](),
        },
        currentPlan: null,
      });
      persist();
    },

    updateDraft: (patch) => {
      set((s) => ({ todayDraft: s.todayDraft ? { ...s.todayDraft, ...patch } : s.todayDraft }));
      persist();
    },

    setDraftTasks: (tasks) => {
      set((s) => ({ todayDraft: s.todayDraft ? { ...s.todayDraft, tasks } : s.todayDraft }));
      persist();
    },

    addDraftTask: (task) => {
      set((s) => {
        if (!s.todayDraft) return s;
        return {
          todayDraft: {
            ...s.todayDraft,
            tasks: [...s.todayDraft.tasks, { ...task, id: uid("task") }],
          },
        };
      });
      persist();
    },

    removeDraftTask: (id) => {
      set((s) => {
        if (!s.todayDraft) return s;
        return { todayDraft: { ...s.todayDraft, tasks: s.todayDraft.tasks.filter((t) => t.id !== id) } };
      });
      persist();
    },

    updateDraftTask: (id, patch) => {
      set((s) => {
        if (!s.todayDraft) return s;
        return {
          todayDraft: {
            ...s.todayDraft,
            tasks: s.todayDraft.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
          },
        };
      });
      persist();
    },

    generateCurrentPlan: () => {
      const draft = get().todayDraft;
      if (!draft) return null;
      const plan = generatePlan(draft);
      set({ currentPlan: plan });
      persist();
      return plan;
    },

    duplicateYesterdayPlan: () => {
      const history = get().history;
      if (history.length === 0) return false;
      const last = history[history.length - 1];
      const tasks: TaskTemplate[] = last.plan.tasks.map((t) => ({
        id: uid("task"),
        title: t.title,
        durationMin: t.durationMin,
        priority: t.priority,
        category: t.category,
      }));
      set({
        todayDraft: {
          homeTime: nowHhmm(),
          bedtime: get().settings.targetBedtime,
          mode: last.plan.mode,
          tasks,
        },
        currentPlan: null,
      });
      persist();
      return true;
    },

    startExecution: () => {
      const plan = get().currentPlan;
      if (!plan) return;
      const planId = uid("plan");
      set({
        executionState: {
          planId,
          startedAt: Date.now(),
          currentIndex: 0,
          completedIds: [],
          skippedIds: [],
          extensionsMin: 0,
        },
      });
      persist();
    },

    completeCurrentTask: () => {
      set((s) => {
        if (!s.currentPlan) return s;
        const idx = s.executionState.currentIndex;
        const task = s.currentPlan.tasks[idx];
        if (!task) return s;
        return {
          executionState: {
            ...s.executionState,
            completedIds: [...s.executionState.completedIds, task.id],
            currentIndex: idx + 1,
          },
        };
      });
      persist();
    },

    skipCurrentTask: () => {
      set((s) => {
        if (!s.currentPlan) return s;
        const idx = s.executionState.currentIndex;
        const task = s.currentPlan.tasks[idx];
        if (!task) return s;
        return {
          executionState: {
            ...s.executionState,
            skippedIds: [...s.executionState.skippedIds, task.id],
            currentIndex: idx + 1,
          },
        };
      });
      persist();
    },

    extendCurrentTask: (min) => {
      set((s) => ({
        executionState: { ...s.executionState, extensionsMin: s.executionState.extensionsMin + min },
      }));
      persist();
    },

    recalculatePlan: () => {
      const draft = get().todayDraft;
      if (!draft) return;
      const plan = generatePlan(draft);
      set({ currentPlan: plan });
      persist();
    },

    saveReview: ({ feeling, note, actualBedtime }) => {
      const s = get();
      if (!s.currentPlan) return;
      const planId = s.executionState.planId || uid("plan");
      const log: ReviewLog = {
        id: uid("review"),
        date: todayDateString(),
        planId,
        mode: s.currentPlan.mode,
        completedCount: s.executionState.completedIds.length,
        totalCount: s.currentPlan.tasks.length,
        actualBedtime,
        targetBedtime: s.todayDraft?.bedtime || s.settings.targetBedtime,
        feeling,
        note,
        createdAt: Date.now(),
      };
      const entry: HistoryEntry = {
        id: uid("hist"),
        date: log.date,
        plan: s.currentPlan,
        review: log,
      };
      set({
        reviewLogs: [...s.reviewLogs, log],
        history: [...s.history, entry],
        executionState: initialExecution,
        currentPlan: null,
        todayDraft: null,
      });
      persist();
    },

    resetAllData: () => {
      clearState();
      set(initialState());
    },
  };
});
