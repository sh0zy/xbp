import { LocalStorageRepository } from './storage';
import { STORAGE_KEYS } from '@/lib/constants';
import type {
  Course, TimetableEntry, Assignment,
  AttendanceRecord, CourseReview, CreditSummary, UserSettings,
} from '@/types';

export const courseRepo = new LocalStorageRepository<Course>(STORAGE_KEYS.COURSES);
export const timetableRepo = new LocalStorageRepository<TimetableEntry>(STORAGE_KEYS.TIMETABLE);
export const assignmentRepo = new LocalStorageRepository<Assignment>(STORAGE_KEYS.ASSIGNMENTS);
export const attendanceRepo = new LocalStorageRepository<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE);
export const reviewRepo = new LocalStorageRepository<CourseReview>(STORAGE_KEYS.REVIEWS);
export const creditRepo = new LocalStorageRepository<CreditSummary>(STORAGE_KEYS.CREDITS);
export const settingsRepo = new LocalStorageRepository<UserSettings>(STORAGE_KEYS.SETTINGS);
