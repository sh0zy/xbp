export type Priority = "must" | "want";
export type PlanMode = "normal" | "shortest" | "tired";

export interface TaskTemplate {
  id: string;
  title: string;
  durationMin: number;
  priority: Priority;
  category?: string;
}

export interface PlanTask extends TaskTemplate {
  locked?: boolean;
  dropped?: boolean;
}

export interface TimelineSlot {
  task: PlanTask;
  startMin: number;
  endMin: number;
}

export interface GeneratedPlan {
  mode: PlanMode;
  bedtimeMin: number;
  homeMin: number;
  tasks: PlanTask[];
  timeline: TimelineSlot[];
  totalNeededMin: number;
  availableMin: number;
  overflowMinutes: number;
  spareMinutes: number;
  suggestedDrops: PlanTask[];
  deferredCandidates: PlanTask[];
}

export interface ExecutionState {
  planId: string | null;
  startedAt: number | null;
  currentIndex: number;
  completedIds: string[];
  skippedIds: string[];
  extensionsMin: number;
}

export interface ReviewLog {
  id: string;
  date: string;
  planId: string;
  mode: PlanMode;
  completedCount: number;
  totalCount: number;
  actualBedtime?: string;
  targetBedtime: string;
  feeling: 1 | 2 | 3 | 4 | 5;
  note?: string;
  createdAt: number;
}

export interface HistoryEntry {
  id: string;
  date: string;
  plan: GeneratedPlan;
  review?: ReviewLog;
}

export interface UserSettings {
  targetBedtime: string;
  defaultMode: PlanMode;
  onboardingCompleted: boolean;
  name?: string;
}

export interface TodayDraft {
  homeTime: string;
  bedtime: string;
  mode: PlanMode;
  tasks: TaskTemplate[];
}
