import type { AppState, AppSettings, FocusSession, UserProfile } from '../types'

const STORAGE_KEY = 'focus_recipe_data'

const defaultUserProfile: UserProfile = {
  name: '',
  goalSessions: 5,
  onboardingDone: false,
  createdAt: Date.now(),
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  notificationsEnabled: false,
  reminderTime: null,
}

export const defaultAppState: AppState = {
  sessions: [],
  activeSession: null,
  userProfile: defaultUserProfile,
  settings: defaultSettings,
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultAppState
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      sessions: parsed.sessions ?? [],
      activeSession: parsed.activeSession ?? null,
      userProfile: { ...defaultUserProfile, ...(parsed.userProfile ?? {}) },
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
    }
  } catch {
    return defaultAppState
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or disabled
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function generateSampleSessions(): FocusSession[] {
  const now = Date.now()
  const day = 86400000

  const sessions: FocusSession[] = [
    {
      id: generateId(),
      startedAt: now - day * 6 + 8 * 3600000,
      endedAt: now - day * 6 + 8 * 3600000 + 90 * 60000,
      plannedDuration: 90,
      actualDuration: 90,
      taskType: 'study',
      location: 'library',
      noiseLevel: 'quiet',
      sleepState: 'good',
      motivationLevel: 4,
      phoneRisk: 'low',
      focusScore: 5,
      phoneDistractionScore: 1,
      interrupted: false,
      completedAsPlanned: true,
      note: '図書館は集中できた',
      repeatWanted: true,
    },
    {
      id: generateId(),
      startedAt: now - day * 5 + 21 * 3600000,
      endedAt: now - day * 5 + 21 * 3600000 + 60 * 60000,
      plannedDuration: 60,
      actualDuration: 45,
      taskType: 'study',
      location: 'home_desk',
      noiseLevel: 'silent',
      sleepState: 'tired',
      motivationLevel: 2,
      phoneRisk: 'high',
      focusScore: 2,
      phoneDistractionScore: 4,
      interrupted: true,
      completedAsPlanned: false,
      note: '眠くて集中できなかった',
      repeatWanted: false,
    },
    {
      id: generateId(),
      startedAt: now - day * 4 + 9 * 3600000,
      endedAt: now - day * 4 + 9 * 3600000 + 120 * 60000,
      plannedDuration: 120,
      actualDuration: 120,
      taskType: 'study',
      location: 'cafe',
      noiseLevel: 'ambient',
      sleepState: 'great',
      motivationLevel: 5,
      phoneRisk: 'low',
      focusScore: 5,
      phoneDistractionScore: 1,
      interrupted: false,
      completedAsPlanned: true,
      note: 'カフェの環境音が良かった',
      repeatWanted: true,
    },
    {
      id: generateId(),
      startedAt: now - day * 3 + 7 * 3600000,
      endedAt: now - day * 3 + 7 * 3600000 + 60 * 60000,
      plannedDuration: 60,
      actualDuration: 60,
      taskType: 'reading',
      location: 'home_desk',
      noiseLevel: 'music',
      sleepState: 'good',
      motivationLevel: 3,
      phoneRisk: 'medium',
      focusScore: 3,
      phoneDistractionScore: 2,
      interrupted: false,
      completedAsPlanned: true,
      note: '',
      repeatWanted: true,
    },
    {
      id: generateId(),
      startedAt: now - day * 2 + 8 * 3600000,
      endedAt: now - day * 2 + 8 * 3600000 + 90 * 60000,
      plannedDuration: 90,
      actualDuration: 90,
      taskType: 'study',
      location: 'library',
      noiseLevel: 'quiet',
      sleepState: 'good',
      motivationLevel: 4,
      phoneRisk: 'low',
      focusScore: 4,
      phoneDistractionScore: 1,
      interrupted: false,
      completedAsPlanned: true,
      note: '図書館は安定',
      repeatWanted: true,
    },
    {
      id: generateId(),
      startedAt: now - day * 1 + 20 * 3600000,
      endedAt: now - day * 1 + 20 * 3600000 + 45 * 60000,
      plannedDuration: 60,
      actualDuration: 45,
      taskType: 'study',
      location: 'home_desk',
      noiseLevel: 'noise_cancel',
      sleepState: 'normal',
      motivationLevel: 3,
      phoneRisk: 'medium',
      focusScore: 3,
      phoneDistractionScore: 3,
      interrupted: false,
      completedAsPlanned: false,
      note: 'ノイキャンで少しマシ',
      repeatWanted: false,
    },
    {
      id: generateId(),
      startedAt: now - 3 * 3600000,
      endedAt: now - 3 * 3600000 + 90 * 60000,
      plannedDuration: 90,
      actualDuration: 90,
      taskType: 'study',
      location: 'cafe',
      noiseLevel: 'ambient',
      sleepState: 'good',
      motivationLevel: 4,
      phoneRisk: 'low',
      focusScore: 5,
      phoneDistractionScore: 1,
      interrupted: false,
      completedAsPlanned: true,
      note: 'カフェ朝は最高',
      repeatWanted: true,
    },
  ]

  return sessions
}
