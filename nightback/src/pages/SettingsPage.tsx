import { useAppStore } from "../store/useAppStore";
import PageHeader from "../components/common/PageHeader";
import BottomNav from "../components/common/BottomNav";
import type { PlanMode } from "../types";

export default function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const update = useAppStore((s) => s.updateSettings);
  const reset = useAppStore((s) => s.resetAllData);

  return (
    <div className="page-shell">
      <PageHeader title="設定" subtitle="基本の動きを決める" />

      <div className="section-card mb-4">
        <label className="label-base">基本の就寝時刻</label>
        <input
          type="time"
          className="input-base"
          value={settings.targetBedtime}
          onChange={(e) => update({ targetBedtime: e.target.value })}
        />
      </div>

      <div className="section-card mb-4">
        <label className="label-base">標準モード</label>
        <div className="grid grid-cols-3 gap-2">
          {(["normal", "shortest", "tired"] as PlanMode[]).map((m) => (
            <button
              key={m}
              onClick={() => update({ defaultMode: m })}
              className={`py-2 rounded-xl text-sm border transition ${
                settings.defaultMode === m
                  ? "border-accent/70 bg-accent/10 text-accent"
                  : "border-ink-500/60 bg-ink-600 text-slate-300"
              }`}
            >
              {m === "normal" ? "ふつう" : m === "shortest" ? "最短" : "疲労"}
            </button>
          ))}
        </div>
      </div>

      <div className="section-card mb-4">
        <div className="font-semibold mb-2">アプリについて</div>
        <p className="muted-text text-sm">NightBack v0.1.0</p>
        <p className="muted-text text-sm">帰宅〜就寝の行動を逆算して整えるアプリ</p>
      </div>

      <button
        onClick={() => {
          if (confirm("全てのデータを消去します。よろしいですか？")) reset();
        }}
        className="secondary-button text-warn"
      >
        すべてのデータを削除
      </button>

      <BottomNav />
    </div>
  );
}
