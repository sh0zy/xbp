export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  faculty: string;
  department: string;
  campus: string;
  term: string;
  dayOfWeek: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat
  period: number; // 1-7
  credits: number;
  category: string;
  /** 共通教養 / 学部専門 などの大区分。未設定は既存カテゴリから推定 */
  categoryGroup?: CategoryGroup;
  /** 履修可能学年 (例: [1,2] 1-2年生が履修可能) 未設定は全学年扱い */
  availableGrades?: number[];
  /** 楽単スコア 0-100 (100 ほど履修しやすい)。未設定時は評価方法から推定 */
  easyScore?: number;
  /** 楽単判定の根拠タグ */
  easyReason?: string[];
  room?: string;
  syllabusUrl?: string;
  evaluation?: EvaluationMethod;
  sourceType: 'seed' | 'manual' | 'public_link';
  updatedAt: string;
}

export type CategoryGroup = 'common' | 'faculty' | 'language' | 'other';

export const CATEGORY_GROUP_LABELS: Record<CategoryGroup, string> = {
  common: '共通教養科目',
  faculty: '学部専門科目',
  language: '外国語科目',
  other: 'その他',
};

/** 既存 category 値から categoryGroup を推定 (後方互換) */
export function inferCategoryGroup(category: string): CategoryGroup {
  if (category === '共通教養' || category === '教養') return 'common';
  if (category === '外国語') return 'language';
  if (['必修', '選択必修', '選択', '専門基礎', '専門'].includes(category)) return 'faculty';
  return 'other';
}

export interface EvaluationMethod {
  exam: number;       // テスト %
  report: number;     // レポート %
  attendance: number;  // 出席 %
  other: number;       // その他 %
}

export interface TimetableEntry {
  id: string;
  courseId: string;
  /** どの時間割セットに属するか (未指定は 'default') */
  timetableId?: string;
  customColor?: string;
  memo?: string;
  isPinned: boolean;
}

/** 時間割セット (複数時間割対応) */
export interface TimetableSet {
  id: string;
  name: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  type: 'report' | 'test' | 'quiz' | 'other';
  status: 'todo' | 'done';
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  status: 'present' | 'late' | 'absent' | 'official';
}

export interface CourseReview {
  id: string;
  courseId: string;
  workloadScore: number;
  examScore: number;
  attendanceStrictnessScore: number;
  clarityScore: number;
  easeScore: number;
  satisfactionScore: number;
  shortComment: string;
  createdAt: string;
  reportCount: number;
  isHidden: boolean;
}

export interface CreditSummary {
  targetCredits: number;
  completedCredits: number;
  inProgressCredits: number;
  plannedCredits: number;
}

export interface UserSettings {
  theme: 'dark' | 'system';
  notificationsEnabled: boolean;
  showUnofficialBanner: boolean;
  onboardingCompleted: boolean;
}

export const DAY_LABELS = ['月', '火', '水', '木', '金', '土'] as const;

export const PERIOD_TIMES: Record<number, { start: string; end: string }> = {
  1: { start: '9:00', end: '10:30' },
  2: { start: '10:40', end: '12:10' },
  3: { start: '13:10', end: '14:40' },
  4: { start: '14:50', end: '16:20' },
  5: { start: '16:30', end: '18:00' },
  6: { start: '18:10', end: '19:40' },
  7: { start: '19:50', end: '21:20' },
};

export const COURSE_COLORS = [
  '#5b8af5', '#8b6cf5', '#4ade80', '#fb923c',
  '#f87171', '#22d3ee', '#a78bfa', '#fbbf24',
  '#34d399', '#f472b6', '#60a5fa', '#c084fc',
] as const;

export const FACULTIES = [
  '法学部', '経済学部', '経営学部', '外国語学部',
  '国際日本学部', '人間科学部', '理学部', '工学部',
  '建築学部', '化学生命学部', '情報学部',
] as const;

export const CAMPUSES = ['横浜', 'みなとみらい', '湘南ひらつか'] as const;

export const CATEGORIES = [
  '必修', '選択必修', '選択', '教養', '共通教養',
  '外国語', '専門基礎', '専門',
] as const;

export const GRADES = [1, 2, 3, 4] as const;

/** 共通教養科目の主要開講キャンパス */
export const COMMON_CAMPUS_OPTIONS = ['横浜', 'みなとみらい'] as const;

/** 楽単判定の根拠タグ (表示用) */
export const EASY_REASON_TAGS = {
  no_exam: 'テストなし',
  exam_light: 'テスト軽め',
  report_based: 'レポート中心',
  attendance_based: '出席重視',
  few_quiz: '小テスト少なめ',
  clear_criteria: '評価基準が明確',
} as const;

export type EasyReasonKey = keyof typeof EASY_REASON_TAGS;

/** Course から楽単スコア 0-100 を推定 */
export function computeEasyScore(course: Course): number {
  if (course.easyScore !== undefined) return course.easyScore;
  const ev = course.evaluation;
  if (!ev) return 50;
  // テストが少ない + 出席/レポートで稼げるほど高スコア
  const examPenalty = ev.exam * 0.7;
  const reportBonus = ev.report * 0.4;
  const attBonus = ev.attendance * 0.5;
  return Math.max(0, Math.min(100, 60 - examPenalty + reportBonus + attBonus));
}

/** Course から楽単根拠タグを推定 */
export function computeEasyReasons(course: Course): EasyReasonKey[] {
  if (course.easyReason && course.easyReason.length > 0) {
    return course.easyReason.filter((r): r is EasyReasonKey => r in EASY_REASON_TAGS);
  }
  const ev = course.evaluation;
  if (!ev) return [];
  const reasons: EasyReasonKey[] = [];
  if (ev.exam === 0) reasons.push('no_exam');
  else if (ev.exam <= 30) reasons.push('exam_light');
  if (ev.report >= 40) reasons.push('report_based');
  if (ev.attendance >= 30) reasons.push('attendance_based');
  return reasons;
}

/** 神奈川大学ウェブステーション (公式) */
export const KANAGAWA_OFFICIAL_LINKS = {
  webStation: 'https://wwwkj.kanagawa-u.ac.jp/',
  topPage: 'https://www.kanagawa-u.ac.jp/',
  syllabus: 'https://syllabus.kanagawa-u.ac.jp/',
} as const;
