import { create } from "zustand";
import {
  clearAppState,
  createDefaultState,
  createSampleState,
  loadAppState,
  saveAppState,
} from "../lib/storage";
import type {
  AppSettings,
  NotificationSchedule,
  PersistedAppState,
  StartSession,
  TaskTemplate,
} from "../types/app";
import { generateId } from "../lib/utils";

interface CompleteSessionInput {
  status: StartSession["status"];
  endedAt: number;
  extraDurationSec?: number;
  continued?: boolean;
  note?: string | null;
}

interface AppStoreState {
  templates: TaskTemplate[];
  sessions: StartSession[];
  settings: AppSettings;
  notificationSchedules: NotificationSchedule[];
  hydrated: boolean;
  hydrate: () => void;
  startSession: (
    input: Omit<
      StartSession,
      "id" | "endedAt" | "extraDurationSec" | "status" | "continued" | "note"
    >,
  ) => string;
  finishSession: (id: string, input: CompleteSessionInput) => void;
  removeSession: (id: string) => void;
  addTemplate: (
    input: Omit<TaskTemplate, "id" | "sortOrder" | "isDefault">,
  ) => string;
  removeTemplate: (id: string) => void;
  addNotificationSchedule: (
    input: Omit<NotificationSchedule, "id">,
  ) => string;
  updateNotificationSchedule: (
    id: string,
    patch: Partial<Omit<NotificationSchedule, "id">>,
  ) => void;
  removeNotificationSchedule: (id: string) => void;
  setThemeMode: (mode: AppSettings["themeMode"]) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  markOnboardingCompleted: () => void;
  loadSampleData: () => void;
  resetAll: () => void;
}

function persist(state: AppStoreState): void {
  const payload: PersistedAppState = {
    version: 1,
    templates: state.templates,
    sessions: state.sessions,
    settings: state.settings,
    notificationSchedules: state.notificationSchedules,
  };
  saveAppState(payload);
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  templates: [],
  sessions: [],
  settings: {
    themeMode: "system",
    notificationsEnabled: false,
    hapticsEnabled: true,
    onboardingCompleted: false,
  },
  notificationSchedules: [],
  hydrated: false,
  hydrate: () => {
    const loaded = loadAppState();
    set({
      templates: loaded.templates,
      sessions: loaded.sessions,
      settings: loaded.settings,
      notificationSchedules: loaded.notificationSchedules ?? [],
      hydrated: true,
    });
  },
  startSession: (input) => {
    const id = generateId("ses");
    const session: StartSession = {
      id,
      taskLabel: input.taskLabel,
      templateId: input.templateId,
      chosenFirstStep: input.chosenFirstStep,
      startedAt: input.startedAt,
      baseDurationSec: input.baseDurationSec,
      endedAt: null,
      extraDurationSec: 0,
      status: "running",
      continued: false,
      note: null,
    };
    set((state) => {
      const next = { ...state, sessions: [session, ...state.sessions] };
      persist(next);
      return next;
    });
    return id;
  },
  finishSession: (id, input) => {
    set((state) => {
      const sessions = state.sessions.map((s) =>
        s.id === id
          ? {
              ...s,
              status: input.status,
              endedAt: input.endedAt,
              extraDurationSec:
                typeof input.extraDurationSec === "number"
                  ? input.extraDurationSec
                  : s.extraDurationSec,
              continued:
                typeof input.continued === "boolean"
                  ? input.continued
                  : s.continued,
              note: input.note ?? s.note,
            }
          : s,
      );
      const next = { ...state, sessions };
      persist(next);
      return next;
    });
  },
  removeSession: (id) => {
    set((state) => {
      const next = {
        ...state,
        sessions: state.sessions.filter((s) => s.id !== id),
      };
      persist(next);
      return next;
    });
  },
  addTemplate: (input) => {
    const id = generateId("tpl-user");
    set((state) => {
      const maxOrder = state.templates.reduce(
        (m, t) => Math.max(m, t.sortOrder ?? 0),
        0,
      );
      const tpl: TaskTemplate = {
        id,
        title: input.title,
        icon: input.icon,
        firstStepOptions: input.firstStepOptions,
        colorKey: input.colorKey,
        sortOrder: maxOrder + 1,
        isDefault: false,
      };
      const next = { ...state, templates: [...state.templates, tpl] };
      persist(next);
      return next;
    });
    return id;
  },
  removeTemplate: (id) => {
    set((state) => {
      const target = state.templates.find((t) => t.id === id);
      if (!target || target.isDefault) return state;
      const next = {
        ...state,
        templates: state.templates.filter((t) => t.id !== id),
      };
      persist(next);
      return next;
    });
  },
  addNotificationSchedule: (input) => {
    const id = generateId("noti");
    const schedule: NotificationSchedule = {
      id,
      hour: input.hour,
      minute: input.minute,
      enabled: input.enabled,
      label: input.label,
    };
    set((state) => {
      const next = {
        ...state,
        notificationSchedules: [...state.notificationSchedules, schedule].sort(
          (a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute),
        ),
      };
      persist(next);
      return next;
    });
    return id;
  },
  updateNotificationSchedule: (id, patch) => {
    set((state) => {
      const next = {
        ...state,
        notificationSchedules: state.notificationSchedules
          .map((n) => (n.id === id ? { ...n, ...patch } : n))
          .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute)),
      };
      persist(next);
      return next;
    });
  },
  removeNotificationSchedule: (id) => {
    set((state) => {
      const next = {
        ...state,
        notificationSchedules: state.notificationSchedules.filter(
          (n) => n.id !== id,
        ),
      };
      persist(next);
      return next;
    });
  },
  setThemeMode: (mode) => {
    set((state) => {
      const next = {
        ...state,
        settings: { ...state.settings, themeMode: mode },
      };
      persist(next);
      return next;
    });
  },
  setNotificationsEnabled: (enabled) => {
    set((state) => {
      const next = {
        ...state,
        settings: { ...state.settings, notificationsEnabled: enabled },
      };
      persist(next);
      return next;
    });
  },
  setHapticsEnabled: (enabled) => {
    set((state) => {
      const next = {
        ...state,
        settings: { ...state.settings, hapticsEnabled: enabled },
      };
      persist(next);
      return next;
    });
  },
  markOnboardingCompleted: () => {
    set((state) => {
      const next = {
        ...state,
        settings: { ...state.settings, onboardingCompleted: true },
      };
      persist(next);
      return next;
    });
  },
  loadSampleData: () => {
    const sample = createSampleState();
    set({
      templates: sample.templates,
      sessions: sample.sessions,
      notificationSchedules: sample.notificationSchedules,
      settings: { ...get().settings },
    });
    persist({
      ...get(),
      templates: sample.templates,
      sessions: sample.sessions,
      notificationSchedules: sample.notificationSchedules,
    } as AppStoreState);
  },
  resetAll: () => {
    clearAppState();
    const fresh = createDefaultState();
    set({
      templates: fresh.templates,
      sessions: fresh.sessions,
      settings: fresh.settings,
      notificationSchedules: fresh.notificationSchedules,
    });
    persist({
      ...get(),
      templates: fresh.templates,
      sessions: fresh.sessions,
      settings: fresh.settings,
      notificationSchedules: fresh.notificationSchedules,
    } as AppStoreState);
  },
}));
