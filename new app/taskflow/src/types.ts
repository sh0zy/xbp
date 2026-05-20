export type TaskCategory = "大学" | "就活" | "勉強" | "アプリ開発" | "生活" | "その他";

export type TaskPriority = "高" | "中" | "低";

export type TaskStatus = "未着手" | "進行中" | "完了";

export type PlanningSource = "前日" | "当日" | "通常";

export type Task = {
  id: string;
  title: string;
  memo: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  estimatedMinutes: 5 | 15 | 30 | 60;
  isToday: boolean;
  planningSource: PlanningSource;
  plannedForDate: string;
  createdAt: string;
  completedAt?: string;
};

export type ReviewNote = {
  id: string;
  date: string;
  memo: string;
  tomorrowTopTask: string;
  createdAt: string;
};

export type AppState = {
  tasks: Task[];
  reviewNotes: ReviewNote[];
  selectedFocusTaskId?: string;
  settings: {
    appVersion: string;
  };
};

export type ScreenName = "home" | "tasks" | "focus" | "review" | "settings";

export const TASK_CATEGORIES: TaskCategory[] = ["大学", "就活", "勉強", "アプリ開発", "生活", "その他"];
export const TASK_PRIORITIES: TaskPriority[] = ["高", "中", "低"];
export const TASK_STATUSES: TaskStatus[] = ["未着手", "進行中", "完了"];
export const ESTIMATED_MINUTES: Array<5 | 15 | 30 | 60> = [5, 15, 30, 60];
