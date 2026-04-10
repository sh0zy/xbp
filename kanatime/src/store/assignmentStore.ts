import { create } from 'zustand';
import type { Assignment } from '@/types';
import { assignmentRepo } from '@/repositories';
import { generateId } from '@/utils/id';

interface AssignmentState {
  assignments: Assignment[];
  load: () => void;
  add: (data: Omit<Assignment, 'id' | 'status'>) => void;
  toggleStatus: (id: string) => void;
  remove: (id: string) => void;
  getForCourse: (courseId: string) => Assignment[];
  reset: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  load: () => set({ assignments: assignmentRepo.getAll() }),
  add: (data) => {
    const item: Assignment = { ...data, id: generateId(), status: 'todo' };
    const list = [...get().assignments, item];
    assignmentRepo.setAll(list);
    set({ assignments: list });
  },
  toggleStatus: (id) => {
    const list = get().assignments.map((a) =>
      a.id === id ? { ...a, status: (a.status === 'todo' ? 'done' : 'todo') as Assignment['status'] } : a
    );
    assignmentRepo.setAll(list);
    set({ assignments: list });
  },
  remove: (id) => {
    const list = get().assignments.filter((a) => a.id !== id);
    assignmentRepo.setAll(list);
    set({ assignments: list });
  },
  getForCourse: (courseId) => get().assignments.filter((a) => a.courseId === courseId),
  reset: () => { assignmentRepo.setAll([]); set({ assignments: [] }); },
}));
