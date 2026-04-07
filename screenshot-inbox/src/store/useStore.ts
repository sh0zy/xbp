import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScreenshotItem, AppSettings, TabId, ItemStatus, Category, Reminder } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppStore {
  items: ScreenshotItem[];
  settings: AppSettings;
  activeTab: TabId;
  processingCount: number;

  // Navigation
  setActiveTab: (tab: TabId) => void;

  // Items
  addItem: (item: ScreenshotItem) => void;
  addItems: (items: ScreenshotItem[]) => void;
  updateItem: (id: string, updates: Partial<ScreenshotItem>) => void;
  deleteItem: (id: string) => void;
  setStatus: (id: string, status: ItemStatus) => void;
  setCategory: (id: string, category: Category) => void;
  toggleFavorite: (id: string) => void;
  addReminder: (id: string, date: string, note: string) => void;
  completeReminder: (itemId: string, reminderId: string) => void;
  archiveItem: (id: string) => void;
  completeItem: (id: string) => void;

  // Processing
  setProcessingCount: (count: number) => void;

  // Settings
  completeOnboarding: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Data management
  loadSampleData: (items: ScreenshotItem[]) => void;
  clearAllData: () => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      items: [],
      settings: {
        onboardingComplete: false,
        defaultReminderHours: 24,
        autoClassify: true,
        showSampleData: false,
      },
      activeTab: 'home',
      processingCount: 0,

      setActiveTab: (tab) => set({ activeTab: tab }),

      addItem: (item) => set((state) => ({
        items: [item, ...state.items],
      })),

      addItems: (items) => set((state) => ({
        items: [...items, ...state.items],
      })),

      updateItem: (id, updates) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      })),

      deleteItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      setStatus: (id, status) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, status } : item
        ),
      })),

      setCategory: (id, category) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, category } : item
        ),
      })),

      toggleFavorite: (id) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        ),
      })),

      addReminder: (id, date, note) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                reminders: [
                  ...item.reminders,
                  { id: uuidv4(), date, note, completed: false } as Reminder,
                ],
              }
            : item
        ),
      })),

      completeReminder: (itemId, reminderId) => set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                reminders: item.reminders.map((r) =>
                  r.id === reminderId ? { ...r, completed: true } : r
                ),
              }
            : item
        ),
      })),

      archiveItem: (id) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? { ...item, status: 'archived' as ItemStatus, archivedAt: new Date().toISOString() }
            : item
        ),
      })),

      completeItem: (id) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? { ...item, status: 'completed' as ItemStatus, completedAt: new Date().toISOString() }
            : item
        ),
      })),

      setProcessingCount: (count) => set({ processingCount: count }),

      completeOnboarding: () => set((state) => ({
        settings: { ...state.settings, onboardingComplete: true },
      })),

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates },
      })),

      loadSampleData: (items) => set((state) => ({
        items: [...items, ...state.items],
        settings: { ...state.settings, showSampleData: true },
      })),

      clearAllData: () => set({
        items: [],
        settings: {
          onboardingComplete: false,
          defaultReminderHours: 24,
          autoClassify: true,
          showSampleData: false,
        },
      }),
    }),
    {
      name: 'screenshot-inbox-storage',
    }
  )
);
