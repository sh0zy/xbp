import { create } from 'zustand'
import type { AppState, FocusSession, FocusEnvironment, SessionReview, AppSettings, UserProfile } from '../types'
import { loadState, saveState, clearState, generateId, generateSampleSessions } from '../utils/storage'

interface AppStore extends AppState {
  startSession: (env: FocusEnvironment) => FocusSession
  endSession: (review: SessionReview) => void
  abandonSession: () => void
  updateSettings: (settings: Partial<AppSettings>) => void
  updateUserProfile: (profile: Partial<UserProfile>) => void
  completeOnboarding: (name: string, goal: number) => void
  loadSampleData: () => void
  clearAllData: () => void
}

const initialState = loadState()

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,

  startSession: (env: FocusEnvironment): FocusSession => {
    const session: FocusSession = {
      id: generateId(),
      startedAt: Date.now(),
      endedAt: null,
      plannedDuration: env.plannedDuration,
      actualDuration: null,
      taskType: env.taskType,
      location: env.location,
      noiseLevel: env.noiseLevel,
      sleepState: env.sleepState,
      motivationLevel: env.motivationLevel,
      phoneRisk: env.phoneRisk,
      focusScore: null,
      phoneDistractionScore: null,
      interrupted: null,
      completedAsPlanned: null,
      note: '',
      repeatWanted: null,
    }
    set((state) => {
      const newState = { ...state, activeSession: session }
      saveState(newState)
      return newState
    })
    return session
  },

  endSession: (review: SessionReview): void => {
    const { activeSession } = get()
    if (!activeSession) return
    const endedAt = Date.now()
    const actualDuration = Math.round((endedAt - activeSession.startedAt) / 60000)
    const completed: FocusSession = {
      ...activeSession,
      endedAt,
      actualDuration,
      focusScore: review.focusScore,
      phoneDistractionScore: review.phoneDistractionScore,
      interrupted: review.interrupted,
      completedAsPlanned: review.completedAsPlanned,
      note: review.note,
      repeatWanted: review.repeatWanted,
    }
    set((state) => {
      const newState = {
        ...state,
        sessions: [...state.sessions, completed],
        activeSession: null,
      }
      saveState(newState)
      return newState
    })
  },

  abandonSession: (): void => {
    set((state) => {
      const newState = { ...state, activeSession: null }
      saveState(newState)
      return newState
    })
  },

  updateSettings: (settings: Partial<AppSettings>): void => {
    set((state) => {
      const newState = {
        ...state,
        settings: { ...state.settings, ...settings },
      }
      saveState(newState)
      return newState
    })
  },

  updateUserProfile: (profile: Partial<UserProfile>): void => {
    set((state) => {
      const newState = {
        ...state,
        userProfile: { ...state.userProfile, ...profile },
      }
      saveState(newState)
      return newState
    })
  },

  completeOnboarding: (name: string, goal: number): void => {
    set((state) => {
      const newState = {
        ...state,
        userProfile: {
          ...state.userProfile,
          name,
          goalSessions: goal,
          onboardingDone: true,
        },
      }
      saveState(newState)
      return newState
    })
  },

  loadSampleData: (): void => {
    const samples = generateSampleSessions()
    set((state) => {
      const newState = {
        ...state,
        sessions: [...samples, ...state.sessions],
        userProfile: { ...state.userProfile, onboardingDone: true },
      }
      saveState(newState)
      return newState
    })
  },

  clearAllData: (): void => {
    clearState()
    const fresh = loadState()
    set({ ...fresh })
  },
}))
