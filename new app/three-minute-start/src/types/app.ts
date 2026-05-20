export type ThemeMode = "light" | "dark" | "system";

export type ColorKey =
  | "blue"
  | "violet"
  | "pink"
  | "teal"
  | "amber"
  | "lime"
  | "rose"
  | "slate";

export interface TaskTemplate {
  id: string;
  title: string;
  icon: string;
  firstStepOptions: string[];
  colorKey: ColorKey;
  sortOrder: number;
  isDefault: boolean;
}

export type SessionStatus =
  | "idle"
  | "running"
  | "completed_3min"
  | "stopped_early"
  | "extended"
  | "continued_open";

export interface StartSession {
  id: string;
  taskLabel: string;
  templateId: string | null;
  chosenFirstStep: string;
  startedAt: number;
  endedAt: number | null;
  baseDurationSec: number;
  extraDurationSec: number;
  status: SessionStatus;
  continued: boolean;
  note: string | null;
}

export interface AppSettings {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  hapticsEnabled: boolean;
  onboardingCompleted: boolean;
}

export interface NotificationSchedule {
  id: string;
  hour: number;
  minute: number;
  enabled: boolean;
  label?: string;
}

export interface PersistedAppState {
  version: number;
  templates: TaskTemplate[];
  sessions: StartSession[];
  settings: AppSettings;
  notificationSchedules: NotificationSchedule[];
}
