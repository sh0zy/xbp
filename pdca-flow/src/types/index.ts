export type Priority = 'low' | 'medium' | 'high';
export type ThemeStatus = 'active' | 'paused' | 'completed' | 'archived';
export type Category = 'study' | 'health' | 'work' | 'habit' | 'finance' | 'life' | 'other';

export interface Theme {
  id: string;
  title: string;
  category: Category;
  goal: string;
  deadline: string;
  priority: Priority;
  status: ThemeStatus;
  currentCycle: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanData {
  id: string;
  themeId: string;
  cycle: number;
  goal: string;
  actions: string;
  metrics: string;
  startDate: string;
  deadline: string;
  targetValue: string;
  successCriteria: string;
  createdAt: string;
}

export interface DoLog {
  id: string;
  themeId: string;
  cycle: number;
  date: string;
  description: string;
  completed: boolean;
  memo: string;
  createdAt: string;
}

export interface CheckReview {
  id: string;
  themeId: string;
  cycle: number;
  goodPoints: string;
  badPoints: string;
  resultValue: string;
  causeAnalysis: string;
  achievementRate: number;
  createdAt: string;
}

export interface ActItem {
  id: string;
  themeId: string;
  cycle: number;
  improvement: string;
  carryOver: string;
  actionItems: string;
  createdAt: string;
}

export interface CycleHistory {
  cycle: number;
  themeId: string;
  plan?: PlanData;
  doLogs: DoLog[];
  check?: CheckReview;
  act?: ActItem;
  completedAt?: string;
}

export interface AppSettings {
  accentColor: string;
  darkMode: boolean;
}

export interface Entitlements {
  maxThemes: number;
  advancedAnalytics: boolean;
  exportEnabled: boolean;
  detailedStats: boolean;
  templateSave: boolean;
  weeklyReport: boolean;
  advancedFilter: boolean;
  extendedThemes: boolean;
}

export interface FeatureFlags {
  proEnabled: boolean;
}

export const FREE_ENTITLEMENTS: Entitlements = {
  maxThemes: 5,
  advancedAnalytics: false,
  exportEnabled: false,
  detailedStats: false,
  templateSave: false,
  weeklyReport: false,
  advancedFilter: false,
  extendedThemes: false,
};

export const DEFAULT_SETTINGS: AppSettings = {
  accentColor: '#3b82f6',
  darkMode: true,
};

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'study', label: '勉強' },
  { value: 'health', label: '健康' },
  { value: 'work', label: '仕事' },
  { value: 'habit', label: '習慣' },
  { value: 'finance', label: 'お金' },
  { value: 'life', label: '生活' },
  { value: 'other', label: 'その他' },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  study: '勉強',
  health: '健康',
  work: '仕事',
  habit: '習慣',
  finance: 'お金',
  life: '生活',
  other: 'その他',
};

export const STATUS_LABELS: Record<ThemeStatus, string> = {
  active: '進行中',
  paused: '一時停止',
  completed: '完了',
  archived: 'アーカイブ',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高',
};
