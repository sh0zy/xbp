import type { PlanMode, TaskTemplate } from "../types";
import { uid } from "../lib/utils";

const mk = (title: string, durationMin: number, priority: "must" | "want", category?: string): TaskTemplate => ({
  id: uid("tpl"),
  title,
  durationMin,
  priority,
  category,
});

export const defaultTemplatesByMode: Record<PlanMode, () => TaskTemplate[]> = {
  normal: () => [
    mk("夕食", 30, "must", "meal"),
    mk("風呂", 25, "must", "care"),
    mk("歯磨き", 5, "must", "care"),
    mk("明日の準備", 10, "must", "prep"),
    mk("勉強", 45, "want", "study"),
    mk("洗濯", 15, "want", "chore"),
  ],
  shortest: () => [
    mk("風呂", 20, "must", "care"),
    mk("歯磨き", 5, "must", "care"),
    mk("明日の準備", 10, "must", "prep"),
    mk("ベッド準備", 5, "must", "prep"),
  ],
  tired: () => [
    mk("食事", 20, "must", "meal"),
    mk("風呂", 20, "must", "care"),
    mk("歯磨き", 5, "must", "care"),
    mk("明日の準備", 7, "must", "prep"),
    mk("軽い片付け", 5, "want", "chore"),
  ],
};

export const defaultTemplateLibrary: TaskTemplate[] = defaultTemplatesByMode.normal();
