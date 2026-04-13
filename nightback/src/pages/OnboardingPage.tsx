import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Clock3, Sparkles } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import type { PlanMode } from "../types";

const steps = ["welcome", "bedtime", "mode"] as const;

export default function OnboardingPage() {
  const nav = useNavigate();
  const complete = useAppStore((s) => s.completeOnboarding);
  const [stepIndex, setStepIndex] = useState(0);
  const [bedtime, setBedtime] = useState("00:00");
  const [mode, setMode] = useState<PlanMode>("normal");

  const step = steps[stepIndex];

  const next = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    else {
      complete({ targetBedtime: bedtime, defaultMode: mode });
      nav("/home", { replace: true });
    }
  };

  return (
    <div className="page-shell">
      <div className="flex-1 flex flex-col justify-center">
        {step === "welcome" && (
          <div className="space-y-5 text-center">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-accent/20 items-center justify-center mx-auto">
              <Moon className="text-accent" />
            </div>
            <h1 className="h1">NightBack へようこそ</h1>
            <p className="muted-text">
              寝る時間から逆算して<br />今夜やることを組み立てるアプリです。
            </p>
          </div>
        )}
        {step === "bedtime" && (
          <div className="space-y-5">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-accent/20 items-center justify-center">
              <Clock3 className="text-accent" />
            </div>
            <h2 className="h1">何時に寝たい？</h2>
            <p className="muted-text">基本の就寝時刻を決めておきます。あとで変えられます。</p>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="input-base text-2xl text-center"
            />
          </div>
        )}
        {step === "mode" && (
          <div className="space-y-5">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-accent/20 items-center justify-center">
              <Sparkles className="text-accent" />
            </div>
            <h2 className="h1">普段のモードは？</h2>
            <div className="grid gap-3">
              {([
                { id: "normal", label: "ふつう", desc: "夕食・風呂・勉強など" },
                { id: "shortest", label: "最短", desc: "寝るための最小限だけ" },
                { id: "tired", label: "疲労", desc: "短めに詰める" },
              ] as { id: PlanMode; label: string; desc: string }[]).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`section-card text-left transition ${
                    mode === m.id ? "border-accent/70" : ""
                  }`}
                >
                  <div className="font-semibold">{m.label}</div>
                  <div className="muted-text">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <button onClick={next} className="primary-button">
          {stepIndex < steps.length - 1 ? "次へ" : "はじめる"}
        </button>
        <div className="flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === stepIndex ? "w-6 bg-accent" : "w-1.5 bg-ink-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
