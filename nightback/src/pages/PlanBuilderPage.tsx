import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Minus } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import PageHeader from "../components/common/PageHeader";
import type { PlanMode } from "../types";

export default function PlanBuilderPage() {
  const nav = useNavigate();
  const draft = useAppStore((s) => s.todayDraft);
  const createDraft = useAppStore((s) => s.createDraft);
  const updateDraft = useAppStore((s) => s.updateDraft);
  const addDraftTask = useAppStore((s) => s.addDraftTask);
  const removeDraftTask = useAppStore((s) => s.removeDraftTask);
  const updateDraftTask = useAppStore((s) => s.updateDraftTask);
  const generate = useAppStore((s) => s.generateCurrentPlan);

  const [newTitle, setNewTitle] = useState("");
  const [newDur, setNewDur] = useState(15);

  useEffect(() => {
    if (!draft) createDraft();
  }, [draft, createDraft]);

  if (!draft) return null;

  const total = draft.tasks.reduce((s, t) => s + t.durationMin, 0);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addDraftTask({ title: newTitle.trim(), durationMin: newDur, priority: "must" });
    setNewTitle("");
    setNewDur(15);
  };

  const onGenerate = () => {
    const p = generate();
    if (p) nav("/plan/result");
  };

  return (
    <div className="page-shell">
      <PageHeader title="今夜の計画" subtitle="時間とタスクを決める" back />

      <div className="section-card mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-base">帰宅</label>
            <input
              type="time"
              className="input-base"
              value={draft.homeTime}
              onChange={(e) => updateDraft({ homeTime: e.target.value })}
            />
          </div>
          <div>
            <label className="label-base">就寝</label>
            <input
              type="time"
              className="input-base"
              value={draft.bedtime}
              onChange={(e) => updateDraft({ bedtime: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="label-base">モード</label>
          <div className="grid grid-cols-3 gap-2">
            {(["normal", "shortest", "tired"] as PlanMode[]).map((m) => (
              <button
                key={m}
                onClick={() => updateDraft({ mode: m })}
                className={`py-2 rounded-xl text-sm border transition ${
                  draft.mode === m
                    ? "border-accent/70 bg-accent/10 text-accent"
                    : "border-ink-500/60 bg-ink-600 text-slate-300"
                }`}
              >
                {m === "normal" ? "ふつう" : m === "shortest" ? "最短" : "疲労"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="h2">タスク</h2>
          <span className="muted-text">合計 {total}分</span>
        </div>
        <ul className="space-y-2">
          {draft.tasks.map((t) => (
            <li key={t.id} className="flex items-center gap-2 bg-ink-800 rounded-xl p-2.5">
              <input
                className="flex-1 bg-transparent focus:outline-none text-sm"
                value={t.title}
                onChange={(e) => updateDraftTask(t.id, { title: e.target.value })}
              />
              <div className="flex items-center bg-ink-700 rounded-lg">
                <button
                  onClick={() => updateDraftTask(t.id, { durationMin: Math.max(1, t.durationMin - 5) })}
                  className="px-2 py-1.5"
                >
                  <Minus size={14} />
                </button>
                <span className="text-xs w-10 text-center">{t.durationMin}分</span>
                <button
                  onClick={() => updateDraftTask(t.id, { durationMin: t.durationMin + 5 })}
                  className="px-2 py-1.5"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() =>
                  updateDraftTask(t.id, { priority: t.priority === "must" ? "want" : "must" })
                }
                className={`text-[10px] px-2 py-1 rounded-full border ${
                  t.priority === "must"
                    ? "border-accent/60 text-accent bg-accent/10"
                    : "border-ink-400 text-slate-400"
                }`}
              >
                {t.priority === "must" ? "絶対" : "できれば"}
              </button>
              <button onClick={() => removeDraftTask(t.id)} className="text-slate-500">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex gap-2">
          <input
            className="input-base flex-1 py-2.5 text-sm"
            placeholder="タスクを追加"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="number"
            className="input-base w-20 py-2.5 text-sm text-center"
            value={newDur}
            min={1}
            onChange={(e) => setNewDur(parseInt(e.target.value) || 1)}
          />
          <button onClick={handleAdd} className="secondary-button w-auto px-4 py-2.5">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button onClick={onGenerate} className="primary-button">
        逆算してプランを作る
      </button>
    </div>
  );
}
