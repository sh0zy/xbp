import { create } from 'zustand';
import type { AttendanceRecord } from '@/types';
import { attendanceRepo } from '@/repositories';
import { generateId } from '@/utils/id';

interface AttendanceState {
  records: AttendanceRecord[];
  load: () => void;
  add: (data: Omit<AttendanceRecord, 'id'>) => void;
  remove: (id: string) => void;
  getForCourse: (courseId: string) => AttendanceRecord[];
  getStats: (courseId: string) => { present: number; late: number; absent: number; official: number; total: number; rate: number };
  reset: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  records: [],
  load: () => set({ records: attendanceRepo.getAll() }),
  add: (data) => {
    const item: AttendanceRecord = { ...data, id: generateId() };
    const list = [...get().records, item];
    attendanceRepo.setAll(list);
    set({ records: list });
  },
  remove: (id) => {
    const list = get().records.filter((r) => r.id !== id);
    attendanceRepo.setAll(list);
    set({ records: list });
  },
  getForCourse: (courseId) => get().records.filter((r) => r.courseId === courseId),
  getStats: (courseId) => {
    const recs = get().records.filter((r) => r.courseId === courseId);
    const present = recs.filter((r) => r.status === 'present').length;
    const late = recs.filter((r) => r.status === 'late').length;
    const absent = recs.filter((r) => r.status === 'absent').length;
    const official = recs.filter((r) => r.status === 'official').length;
    const total = recs.length;
    const rate = total > 0 ? Math.round(((present + late + official) / total) * 100) : 100;
    return { present, late, absent, official, total, rate };
  },
  reset: () => { attendanceRepo.setAll([]); set({ records: [] }); },
}));
