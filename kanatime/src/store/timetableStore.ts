import { create } from 'zustand';
import type { TimetableEntry } from '@/types';
import { timetableRepo } from '@/repositories';
import { generateId } from '@/utils/id';

interface TimetableState {
  entries: TimetableEntry[];
  load: () => void;
  addEntry: (courseId: string, color?: string) => void;
  removeEntry: (courseId: string) => void;
  updateMemo: (courseId: string, memo: string) => void;
  isInTimetable: (courseId: string) => boolean;
  reset: () => void;
}

export const useTimetableStore = create<TimetableState>((set, get) => ({
  entries: [],
  load: () => {
    set({ entries: timetableRepo.getAll() });
  },
  addEntry: (courseId, color) => {
    if (get().entries.some((e) => e.courseId === courseId)) return;
    const entry: TimetableEntry = {
      id: generateId(),
      courseId,
      customColor: color,
      memo: '',
      isPinned: false,
    };
    const entries = [...get().entries, entry];
    timetableRepo.setAll(entries);
    set({ entries });
  },
  removeEntry: (courseId) => {
    const entries = get().entries.filter((e) => e.courseId !== courseId);
    timetableRepo.setAll(entries);
    set({ entries });
  },
  updateMemo: (courseId, memo) => {
    const entries = get().entries.map((e) =>
      e.courseId === courseId ? { ...e, memo } : e
    );
    timetableRepo.setAll(entries);
    set({ entries });
  },
  isInTimetable: (courseId) => get().entries.some((e) => e.courseId === courseId),
  reset: () => {
    timetableRepo.setAll([]);
    set({ entries: [] });
  },
}));
