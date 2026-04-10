import { create } from 'zustand';
import type { CourseReview } from '@/types';
import { reviewRepo } from '@/repositories';
import { seedReviews } from '@/data/seed';
import { generateId } from '@/utils/id';
import { NG_WORDS } from '@/lib/constants';

interface ReviewState {
  reviews: CourseReview[];
  load: () => void;
  add: (data: Omit<CourseReview, 'id' | 'createdAt' | 'reportCount' | 'isHidden'>) => string | null;
  report: (id: string) => void;
  getForCourse: (courseId: string) => CourseReview[];
  getAverages: (courseId: string) => Record<string, number> | null;
  reset: () => void;
}

function containsNgWord(text: string): boolean {
  return NG_WORDS.some((w) => text.includes(w));
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  load: () => {
    let reviews = reviewRepo.getAll();
    if (reviews.length === 0) {
      reviews = seedReviews;
      reviewRepo.setAll(reviews);
    }
    set({ reviews });
  },
  add: (data) => {
    if (containsNgWord(data.shortComment)) return 'NG_WORD';
    const item: CourseReview = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString().slice(0, 10),
      reportCount: 0,
      isHidden: false,
    };
    const list = [...get().reviews, item];
    reviewRepo.setAll(list);
    set({ reviews: list });
    return null;
  },
  report: (id) => {
    const list = get().reviews.map((r) => {
      if (r.id !== id) return r;
      const reportCount = r.reportCount + 1;
      return { ...r, reportCount, isHidden: reportCount >= 3 };
    });
    reviewRepo.setAll(list);
    set({ reviews: list });
  },
  getForCourse: (courseId) =>
    get().reviews.filter((r) => r.courseId === courseId && !r.isHidden),
  getAverages: (courseId) => {
    const recs = get().reviews.filter((r) => r.courseId === courseId && !r.isHidden);
    if (recs.length === 0) return null;
    const n = recs.length;
    return {
      workload: +(recs.reduce((s, r) => s + r.workloadScore, 0) / n).toFixed(1),
      exam: +(recs.reduce((s, r) => s + r.examScore, 0) / n).toFixed(1),
      attendance: +(recs.reduce((s, r) => s + r.attendanceStrictnessScore, 0) / n).toFixed(1),
      clarity: +(recs.reduce((s, r) => s + r.clarityScore, 0) / n).toFixed(1),
      ease: +(recs.reduce((s, r) => s + r.easeScore, 0) / n).toFixed(1),
      satisfaction: +(recs.reduce((s, r) => s + r.satisfactionScore, 0) / n).toFixed(1),
    };
  },
  reset: () => { reviewRepo.setAll(seedReviews); set({ reviews: seedReviews }); },
}));
