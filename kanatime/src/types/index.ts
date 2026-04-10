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
  room?: string;
  syllabusUrl?: string;
  evaluation?: EvaluationMethod;
  sourceType: 'seed' | 'manual' | 'public_link';
  updatedAt: string;
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
  customColor?: string;
  memo?: string;
  isPinned: boolean;
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
