// Thin wrapper around localStorage so we can swap to Capacitor Preferences later.
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* noop */
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  },
};

export const STORAGE_KEYS = {
  templates: 'flownest.templates.v1',
  settings: 'flownest.settings.v1',
  logs: 'flownest.logs.v1',
  session: 'flownest.session.v1',
} as const;
