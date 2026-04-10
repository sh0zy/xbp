import { create } from 'zustand';
import type { Course } from '@/types';
import { courseRepo } from '@/repositories';
import { seedCourses } from '@/data/seed';

interface CourseState {
  courses: Course[];
  load: () => void;
  addCourse: (course: Course) => void;
  removeCourse: (id: string) => void;
  getCourse: (id: string) => Course | undefined;
  resetToSeed: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  load: () => {
    let courses = courseRepo.getAll();
    if (courses.length === 0) {
      courses = seedCourses;
      courseRepo.setAll(courses);
    }
    set({ courses });
  },
  addCourse: (course) => {
    const courses = [...get().courses, course];
    courseRepo.setAll(courses);
    set({ courses });
  },
  removeCourse: (id) => {
    const courses = get().courses.filter((c) => c.id !== id);
    courseRepo.setAll(courses);
    set({ courses });
  },
  getCourse: (id) => get().courses.find((c) => c.id === id),
  resetToSeed: () => {
    courseRepo.setAll(seedCourses);
    set({ courses: seedCourses });
  },
}));
