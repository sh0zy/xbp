const STORAGE_KEYS = {
  THEMES: 'pdca_themes',
  PLANS: 'pdca_plans',
  DO_LOGS: 'pdca_do_logs',
  CHECKS: 'pdca_checks',
  ACTS: 'pdca_acts',
  SETTINGS: 'pdca_settings',
} as const;

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function remove(key: string): void {
  localStorage.removeItem(key);
}

export const storage = {
  KEYS: STORAGE_KEYS,
  get,
  set,
  remove,
  clearAll() {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
