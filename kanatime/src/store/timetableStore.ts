import { create } from 'zustand';
import type { TimetableEntry, TimetableSet } from '@/types';
import { timetableRepo } from '@/repositories';
import { generateId } from '@/utils/id';

const DEFAULT_TIMETABLE_ID = 'default';
const DEFAULT_TIMETABLE_NAME = 'マイ時間割';

const SETS_KEY = 'kanatime-timetable-sets';
const ACTIVE_KEY = 'kanatime-timetable-active';

function loadSets(): TimetableSet[] {
  try {
    const raw = localStorage.getItem(SETS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TimetableSet[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* noop */ }
  return [{ id: DEFAULT_TIMETABLE_ID, name: DEFAULT_TIMETABLE_NAME, createdAt: new Date().toISOString() }];
}

function saveSets(sets: TimetableSet[]) {
  localStorage.setItem(SETS_KEY, JSON.stringify(sets));
}

function loadActiveId(sets: TimetableSet[]): string {
  const saved = localStorage.getItem(ACTIVE_KEY);
  if (saved && sets.some((s) => s.id === saved)) return saved;
  return sets[0].id;
}

function saveActiveId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

interface TimetableState {
  /** アクティブな時間割に含まれるエントリ (後方互換) */
  entries: TimetableEntry[];
  /** 全時間割の全エントリ (内部管理用) */
  allEntries: TimetableEntry[];
  sets: TimetableSet[];
  activeId: string;
  load: () => void;
  addEntry: (courseId: string, color?: string) => void;
  removeEntry: (courseId: string) => void;
  updateMemo: (courseId: string, memo: string) => void;
  updateColor: (courseId: string, color: string) => void;
  isInTimetable: (courseId: string) => boolean;
  reset: () => void;
  // 複数時間割
  createSet: (name: string) => string;
  renameSet: (id: string, name: string) => void;
  deleteSet: (id: string) => void;
  duplicateSet: (id: string, newName: string) => string;
  setActive: (id: string) => void;
}

function entriesFor(all: TimetableEntry[], activeId: string): TimetableEntry[] {
  return all.filter((e) => (e.timetableId ?? DEFAULT_TIMETABLE_ID) === activeId);
}

export const useTimetableStore = create<TimetableState>((set, get) => ({
  entries: [],
  allEntries: [],
  sets: [],
  activeId: DEFAULT_TIMETABLE_ID,
  load: () => {
    const sets = loadSets();
    const activeId = loadActiveId(sets);
    // 旧データ: timetableId 無しの entry は 'default' セットに所属扱い
    const all = timetableRepo.getAll().map((e) => ({
      ...e,
      timetableId: e.timetableId ?? DEFAULT_TIMETABLE_ID,
    }));
    timetableRepo.setAll(all);
    saveSets(sets);
    set({ sets, activeId, allEntries: all, entries: entriesFor(all, activeId) });
  },
  addEntry: (courseId, color) => {
    const { allEntries, activeId } = get();
    if (allEntries.some((e) => e.timetableId === activeId && e.courseId === courseId)) return;
    const entry: TimetableEntry = {
      id: generateId(),
      courseId,
      timetableId: activeId,
      customColor: color,
      memo: '',
      isPinned: false,
    };
    const all = [...allEntries, entry];
    timetableRepo.setAll(all);
    set({ allEntries: all, entries: entriesFor(all, activeId) });
  },
  removeEntry: (courseId) => {
    const { allEntries, activeId } = get();
    const all = allEntries.filter((e) => !(e.timetableId === activeId && e.courseId === courseId));
    timetableRepo.setAll(all);
    set({ allEntries: all, entries: entriesFor(all, activeId) });
  },
  updateMemo: (courseId, memo) => {
    const { allEntries, activeId } = get();
    const all = allEntries.map((e) =>
      e.timetableId === activeId && e.courseId === courseId ? { ...e, memo } : e
    );
    timetableRepo.setAll(all);
    set({ allEntries: all, entries: entriesFor(all, activeId) });
  },
  updateColor: (courseId, color) => {
    const { allEntries, activeId } = get();
    const all = allEntries.map((e) =>
      e.timetableId === activeId && e.courseId === courseId ? { ...e, customColor: color } : e
    );
    timetableRepo.setAll(all);
    set({ allEntries: all, entries: entriesFor(all, activeId) });
  },
  isInTimetable: (courseId) => {
    const { allEntries, activeId } = get();
    return allEntries.some((e) => e.timetableId === activeId && e.courseId === courseId);
  },
  reset: () => {
    const sets: TimetableSet[] = [{ id: DEFAULT_TIMETABLE_ID, name: DEFAULT_TIMETABLE_NAME, createdAt: new Date().toISOString() }];
    timetableRepo.setAll([]);
    saveSets(sets);
    saveActiveId(DEFAULT_TIMETABLE_ID);
    set({ allEntries: [], entries: [], sets, activeId: DEFAULT_TIMETABLE_ID });
  },
  createSet: (name) => {
    const id = generateId();
    const newSet: TimetableSet = { id, name, createdAt: new Date().toISOString() };
    const sets = [...get().sets, newSet];
    saveSets(sets);
    saveActiveId(id);
    const all = get().allEntries;
    set({ sets, activeId: id, entries: entriesFor(all, id) });
    return id;
  },
  renameSet: (id, name) => {
    const sets = get().sets.map((s) => (s.id === id ? { ...s, name } : s));
    saveSets(sets);
    set({ sets });
  },
  deleteSet: (id) => {
    let sets = get().sets.filter((s) => s.id !== id);
    if (sets.length === 0) {
      sets = [{ id: DEFAULT_TIMETABLE_ID, name: DEFAULT_TIMETABLE_NAME, createdAt: new Date().toISOString() }];
    }
    const all = get().allEntries.filter((e) => e.timetableId !== id);
    const activeId = get().activeId === id ? sets[0].id : get().activeId;
    timetableRepo.setAll(all);
    saveSets(sets);
    saveActiveId(activeId);
    set({ sets, activeId, allEntries: all, entries: entriesFor(all, activeId) });
  },
  duplicateSet: (id, newName) => {
    const newId = generateId();
    const newSet: TimetableSet = { id: newId, name: newName, createdAt: new Date().toISOString() };
    const sets = [...get().sets, newSet];
    const srcEntries = get().allEntries.filter((e) => e.timetableId === id);
    const dupEntries: TimetableEntry[] = srcEntries.map((e) => ({
      ...e,
      id: generateId(),
      timetableId: newId,
    }));
    const all = [...get().allEntries, ...dupEntries];
    timetableRepo.setAll(all);
    saveSets(sets);
    saveActiveId(newId);
    set({ sets, activeId: newId, allEntries: all, entries: entriesFor(all, newId) });
    return newId;
  },
  setActive: (id) => {
    saveActiveId(id);
    const all = get().allEntries;
    set({ activeId: id, entries: entriesFor(all, id) });
  },
}));
