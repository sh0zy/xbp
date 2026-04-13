import type { GeneratedPlan, PlanMode, PlanTask, TaskTemplate, TimelineSlot } from "../types";
import { availableWindowMinutes, hhmmToMinutes } from "./time";

interface PlannerInput {
  homeTime: string;
  bedtime: string;
  mode: PlanMode;
  tasks: TaskTemplate[];
}

function adjustDurations(tasks: TaskTemplate[], mode: PlanMode): TaskTemplate[] {
  if (mode === "tired") {
    return tasks.map((t) => ({
      ...t,
      durationMin: Math.max(3, Math.round(t.durationMin * 0.85)),
    }));
  }
  if (mode === "shortest") {
    return tasks
      .filter((t) => t.priority === "must")
      .map((t) => ({ ...t, durationMin: Math.max(3, Math.round(t.durationMin * 0.8)) }));
  }
  return tasks;
}

export function generatePlan(input: PlannerInput): GeneratedPlan {
  const homeMin = hhmmToMinutes(input.homeTime);
  const bedtimeMin = hhmmToMinutes(input.bedtime);
  const availableMin = availableWindowMinutes(homeMin, bedtimeMin);

  const adjusted = adjustDurations(input.tasks, input.mode);

  // sort: must first (preserve order), then want
  const musts = adjusted.filter((t) => t.priority === "must");
  const wants = adjusted.filter((t) => t.priority === "want");

  const mustTotal = musts.reduce((s, t) => s + t.durationMin, 0);
  const wantTotal = wants.reduce((s, t) => s + t.durationMin, 0);
  const totalNeededMin = mustTotal + wantTotal;

  const suggestedDrops: PlanTask[] = [];
  const deferredCandidates: PlanTask[] = [];

  // include tasks greedily
  let used = 0;
  const included: PlanTask[] = [];

  for (const t of musts) {
    if (used + t.durationMin <= availableMin) {
      included.push({ ...t });
      used += t.durationMin;
    } else {
      included.push({ ...t, locked: true });
      used += t.durationMin;
    }
  }

  const sortedWants = [...wants].sort((a, b) => a.durationMin - b.durationMin);
  for (const t of sortedWants) {
    if (used + t.durationMin <= availableMin) {
      included.push({ ...t });
      used += t.durationMin;
    } else {
      deferredCandidates.push({ ...t });
    }
  }

  const overflowMinutes = Math.max(0, used - availableMin);
  const spareMinutes = Math.max(0, availableMin - used);

  if (overflowMinutes > 0) {
    // suggest dropping heaviest want tasks that are included
    const includedWants = included.filter((t) => t.priority === "want");
    const bySize = [...includedWants].sort((a, b) => b.durationMin - a.durationMin);
    let removed = 0;
    for (const t of bySize) {
      if (removed >= overflowMinutes) break;
      suggestedDrops.push(t);
      removed += t.durationMin;
    }
  }

  const timeline: TimelineSlot[] = [];
  let cursor = homeMin;
  for (const task of included) {
    timeline.push({
      task,
      startMin: cursor,
      endMin: cursor + task.durationMin,
    });
    cursor += task.durationMin;
  }

  return {
    mode: input.mode,
    bedtimeMin,
    homeMin,
    tasks: included,
    timeline,
    totalNeededMin,
    availableMin,
    overflowMinutes,
    spareMinutes,
    suggestedDrops,
    deferredCandidates,
  };
}

