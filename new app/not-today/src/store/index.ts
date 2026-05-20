import { create } from 'zustand'
import type { AppState, WantItem, AppSettings, UserProfile, ItemDecision, WaitPreset } from '../types'
import { getWaitHours } from '../types'
import { loadState, saveState, clearState, generateId, generateSampleItems } from '../utils/storage'

interface NewItemInput {
  name: string
  price: number
  category: WantItem['category']
  reason: string
  source: WantItem['source']
  imageUrl?: string
  note?: string
}

interface AppStore extends AppState {
  addItem: (input: NewItemInput) => WantItem
  decideItem: (id: string, decision: Exclude<ItemDecision, 'waiting'>, note?: string) => void
  deleteItem: (id: string) => void
  updateSettings: (settings: Partial<AppSettings>) => void
  updateUserProfile: (profile: Partial<UserProfile>) => void
  completeOnboarding: (name: string) => void
  loadSampleData: () => void
  clearAllData: () => void
}

const initialState = loadState()

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,

  addItem: (input: NewItemInput): WantItem => {
    const { settings } = get()
    const waitHours = getWaitHours(settings.defaultWaitPreset, settings.defaultWaitHours)
    const item: WantItem = {
      id: generateId(),
      name: input.name,
      price: input.price,
      category: input.category,
      reason: input.reason,
      source: input.source,
      imageUrl: input.imageUrl ?? '',
      addedAt: Date.now(),
      waitUntil: Date.now() + waitHours * 3600000,
      decision: 'waiting',
      decidedAt: null,
      note: input.note ?? '',
    }
    set((state) => {
      const newState = { ...state, items: [item, ...state.items] }
      saveState(newState)
      return newState
    })
    return item
  },

  decideItem: (id: string, decision: Exclude<ItemDecision, 'waiting'>, note?: string): void => {
    set((state) => {
      const newState = {
        ...state,
        items: state.items.map((i) =>
          i.id === id
            ? { ...i, decision, decidedAt: Date.now(), note: note ?? i.note }
            : i,
        ),
      }
      saveState(newState)
      return newState
    })
  },

  deleteItem: (id: string): void => {
    set((state) => {
      const newState = { ...state, items: state.items.filter((i) => i.id !== id) }
      saveState(newState)
      return newState
    })
  },

  updateSettings: (settings: Partial<AppSettings>): void => {
    set((state) => {
      const newState = { ...state, settings: { ...state.settings, ...settings } }
      saveState(newState)
      return newState
    })
  },

  updateUserProfile: (profile: Partial<UserProfile>): void => {
    set((state) => {
      const newState = { ...state, userProfile: { ...state.userProfile, ...profile } }
      saveState(newState)
      return newState
    })
  },

  completeOnboarding: (name: string): void => {
    set((state) => {
      const newState = {
        ...state,
        userProfile: { ...state.userProfile, name, onboardingDone: true },
      }
      saveState(newState)
      return newState
    })
  },

  loadSampleData: (): void => {
    const samples = generateSampleItems()
    set((state) => {
      const newState = {
        ...state,
        items: [...samples, ...state.items],
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

// ── WaitPreset を export (設定画面用) ──
export type { WaitPreset }
