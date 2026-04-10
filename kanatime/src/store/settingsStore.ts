import { create } from 'zustand';
import type { UserSettings } from '@/types';
import { settingsRepo } from '@/repositories';

const defaultSettings: UserSettings = {
  theme: 'dark',
  notificationsEnabled: true,
  showUnofficialBanner: true,
  onboardingCompleted: false,
};

interface SettingsState {
  settings: UserSettings;
  load: () => void;
  update: (patch: Partial<UserSettings>) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  load: () => {
    const saved = settingsRepo.getSingle();
    set({ settings: saved ?? defaultSettings });
  },
  update: (patch) => {
    const settings = { ...get().settings, ...patch };
    settingsRepo.setSingle(settings);
    set({ settings });
  },
  reset: () => {
    settingsRepo.setSingle(defaultSettings);
    set({ settings: defaultSettings });
  },
}));
