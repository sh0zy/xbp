import type { CustomStatus, LaterItem, ThemeId } from "../types";

const KEY = "laterflow-app-state-v1";

export type AppState = {
  items: LaterItem[];
  initialized: boolean;
  tutorialSeen: boolean;
  theme: ThemeId;
  customStatuses: CustomStatus[];
};

const EMPTY: AppState = {
  items: [],
  initialized: false,
  tutorialSeen: false,
  theme: "midnight",
  customStatuses: [],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return EMPTY;
    return {
      items: parsed.items,
      initialized: !!parsed.initialized,
      tutorialSeen: !!parsed.tutorialSeen,
      theme: (parsed.theme as ThemeId) ?? "midnight",
      customStatuses: Array.isArray(parsed.customStatuses) ? parsed.customStatuses : [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
