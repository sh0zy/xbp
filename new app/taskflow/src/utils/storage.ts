import type { AppState } from "../types";

export const STORAGE_KEY = "taskflow-app-state-v1";

const initialState: AppState = {
  tasks: [],
  reviewNotes: [],
  selectedFocusTaskId: undefined,
  settings: {
    appVersion: "1.0.0",
  },
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      reviewNotes: Array.isArray(parsed.reviewNotes) ? parsed.reviewNotes : [],
      selectedFocusTaskId: parsed.selectedFocusTaskId,
      settings: {
        appVersion: parsed.settings?.appVersion ?? "1.0.0",
      },
    };
  } catch {
    return initialState;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
