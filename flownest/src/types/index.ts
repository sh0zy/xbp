export type RoutineMode = 'morning' | 'night';

export interface TaskItem {
  id: string;
  title: string;
  durationMinutes: number;
  notes?: string;
  skippable: boolean;
  order: number;
}

export interface RoutineTemplate {
  id: string;
  mode: RoutineMode;
  name: string;
  /** "HH:mm" — morning: 出発時刻 / night: 就寝予定時刻 */
  targetTime: string;
  tasks: TaskItem[];
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SessionTaskState {
  taskId: string;
  status: 'pending' | 'active' | 'done' | 'skipped';
  actualDurationMinutes?: number;
  extendedMinutes: number;
}

export interface SessionState {
  id: string;
  templateId: string;
  mode: RoutineMode;
  startedAt: number;
  targetTime: string;
  tasks: SessionTaskState[];
  finishedAt?: number;
}

export interface DailyLog {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  mode: RoutineMode;
  templateId: string;
  templateName: string;
  success: boolean;
  targetTime: string;
  finishedAt: number;
  delayMinutes: number;
  completedTaskCount: number;
  skippedTaskCount: number;
}

export interface AppSettings {
  defaultMorningTemplateId?: string;
  defaultNightTemplateId?: string;
  theme: 'auto' | 'dark';
  notificationsEnabled: boolean;
}
