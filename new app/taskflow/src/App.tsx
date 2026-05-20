import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { Home } from "./screens/Home";
import { Tasks } from "./screens/Tasks";
import { Focus } from "./screens/Focus";
import { Review } from "./screens/Review";
import { Settings } from "./screens/Settings";
import type { AppState, ReviewNote, ScreenName, Task } from "./types";
import { clearState, genId, loadState, saveState } from "./utils/storage";
import { buildSampleTasks } from "./utils/sample";
import { getTodayDateString, nowIso } from "./utils/date";

export type AppApi = {
  state: AppState;
  addTask: (task: Task) => void;
  addManyTasks: (tasks: Task[]) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  setInProgress: (id: string) => void;
  setTodo: (id: string) => void;
  toggleToday: (id: string) => void;
  setFocus: (id?: string) => void;
  addReviewNote: (memo: string, tomorrowTopTask: string) => void;
  resetAll: () => void;
  loadSample: () => void;
  goto: (s: ScreenName) => void;
  reviewIntent: ReviewIntent | null;
  setReviewIntent: (i: ReviewIntent | null) => void;
};

export type ReviewIntent = "tomorrow-form" | "three-template" | null;

export function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [screen, setScreen] = useState<ScreenName>("home");
  const [reviewIntent, setReviewIntent] = useState<ReviewIntent>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Auto-promote prior days' tasks: keep them visible based on planned date logic.
  // Today calculation is recomputed per render via getTodayDateString.

  const api: AppApi = useMemo(
    () => ({
      state,
      addTask: (task) => setState((s) => ({ ...s, tasks: [task, ...s.tasks] })),
      addManyTasks: (tasks) => setState((s) => ({ ...s, tasks: [...tasks, ...s.tasks] })),
      updateTask: (id, patch) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      deleteTask: (id) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.filter((t) => t.id !== id),
          selectedFocusTaskId: s.selectedFocusTaskId === id ? undefined : s.selectedFocusTaskId,
        })),
      completeTask: (id) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: "完了", completedAt: nowIso() } : t
          ),
        })),
      setInProgress: (id) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: "進行中", completedAt: undefined } : t
          ),
        })),
      setTodo: (id) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: "未着手", completedAt: undefined } : t
          ),
        })),
      toggleToday: (id) => {
        const today = getTodayDateString();
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) => {
            if (t.id !== id) return t;
            const next = !t.isToday;
            return {
              ...t,
              isToday: next,
              plannedForDate: next ? today : t.plannedForDate,
            };
          }),
        }));
      },
      setFocus: (id) => setState((s) => ({ ...s, selectedFocusTaskId: id })),
      addReviewNote: (memo, tomorrowTopTask) => {
        const note: ReviewNote = {
          id: genId(),
          date: getTodayDateString(),
          memo: memo.trim(),
          tomorrowTopTask: tomorrowTopTask.trim(),
          createdAt: nowIso(),
        };
        setState((s) => ({ ...s, reviewNotes: [note, ...s.reviewNotes] }));
      },
      resetAll: () => {
        clearState();
        setState({
          tasks: [],
          reviewNotes: [],
          selectedFocusTaskId: undefined,
          settings: { appVersion: "1.0.0" },
        });
      },
      loadSample: () => {
        const sample = buildSampleTasks();
        setState((s) => ({ ...s, tasks: [...sample, ...s.tasks] }));
      },
      goto: (s) => setScreen(s),
      reviewIntent,
      setReviewIntent,
    }),
    [state, reviewIntent]
  );

  return (
    <div className="app-bg min-h-screen">
      <main className="mx-auto max-w-md pb-32 safe-pt">
        {screen === "home" && <Home api={api} />}
        {screen === "tasks" && <Tasks api={api} />}
        {screen === "focus" && <Focus api={api} />}
        {screen === "review" && <Review api={api} />}
        {screen === "settings" && <Settings api={api} />}
      </main>
      <BottomNav current={screen} onChange={setScreen} />
    </div>
  );
}
