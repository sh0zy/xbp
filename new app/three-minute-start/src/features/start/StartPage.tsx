import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageContainer } from "../../components/common/PageContainer";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { Card } from "../../components/common/Card";
import { TimerRing } from "./components/TimerRing";
import { FirstStepCard } from "./components/FirstStepCard";
import { SessionResultSheet } from "./components/SessionResultSheet";
import { TemplateEditorSheet } from "../templates/components/TemplateEditorSheet";
import { useAppStore } from "../../store/useAppStore";
import { COLOR_BG, classNames } from "../../lib/utils";
import type { TaskTemplate } from "../../types/app";

const BASE_DURATION = 180;

type Phase = "setup" | "running" | "done";

export function StartPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const templates = useAppStore((s) => s.templates);
  const startSession = useAppStore((s) => s.startSession);
  const finishSession = useAppStore((s) => s.finishSession);
  const addTemplate = useAppStore((s) => s.addTemplate);
  const [editorOpen, setEditorOpen] = useState(false);

  const initialTemplateId = searchParams.get("templateId");

  const [phase, setPhase] = useState<Phase>("setup");
  const [taskLabel, setTaskLabel] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    initialTemplateId,
  );
  const [firstStep, setFirstStep] = useState("");
  const [customFirstStep, setCustomFirstStep] = useState("");
  const [remaining, setRemaining] = useState(BASE_DURATION);
  const [totalDuration, setTotalDuration] = useState(BASE_DURATION);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [extraSec, setExtraSec] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const endAtRef = useRef<number | null>(null);

  const selectedTemplate: TaskTemplate | undefined = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) ?? undefined,
    [templates, selectedTemplateId],
  );

  const stepOptions = selectedTemplate?.firstStepOptions ?? [
    "開くだけ",
    "1行だけ書く",
    "1分だけ眺める",
    "今ある場所を片付ける",
  ];

  useEffect(() => {
    if (selectedTemplate && !taskLabel) {
      setTaskLabel(selectedTemplate.title);
    }
    if (selectedTemplate && !firstStep) {
      setFirstStep(selectedTemplate.firstStepOptions[0] ?? "");
    }
  }, [selectedTemplate, taskLabel, firstStep]);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  function startTimer(durationSec: number) {
    const now = Date.now();
    endAtRef.current = now + durationSec * 1000;
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
    }
    setRemaining(durationSec);
    intervalRef.current = window.setInterval(() => {
      if (endAtRef.current === null) return;
      const r = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
      setRemaining(r);
      if (r <= 0) {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setPhase("done");
      }
    }, 250) as unknown as number;
  }

  function handleStart() {
    const stepValue = customFirstStep.trim() || firstStep || stepOptions[0];
    const labelValue = taskLabel.trim() || selectedTemplate?.title || "今やる作業";
    const id = startSession({
      taskLabel: labelValue,
      templateId: selectedTemplateId,
      chosenFirstStep: stepValue,
      startedAt: Date.now(),
      baseDurationSec: BASE_DURATION,
    });
    setSessionId(id);
    setTotalDuration(BASE_DURATION);
    setExtraSec(0);
    setPhase("running");
    startTimer(BASE_DURATION);
  }

  function handleStopEarly() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (sessionId) {
      finishSession(sessionId, {
        status: "stopped_early",
        endedAt: Date.now(),
        extraDurationSec: extraSec,
        continued: false,
      });
    }
    resetSetup();
  }

  function handleStopHere() {
    if (sessionId) {
      finishSession(sessionId, {
        status: extraSec > 0 ? "extended" : "completed_3min",
        endedAt: Date.now(),
        extraDurationSec: extraSec,
        continued: false,
      });
    }
    resetSetup();
  }

  function handleExtend3Min() {
    setTotalDuration(BASE_DURATION);
    setExtraSec((v) => v + BASE_DURATION);
    setPhase("running");
    startTimer(BASE_DURATION);
  }

  function handleContinueOpen() {
    if (sessionId) {
      finishSession(sessionId, {
        status: "continued_open",
        endedAt: Date.now(),
        extraDurationSec: extraSec,
        continued: true,
      });
    }
    resetSetup();
    navigate("/");
  }

  function resetSetup() {
    setPhase("setup");
    setSessionId(null);
    setRemaining(BASE_DURATION);
    setTotalDuration(BASE_DURATION);
    setExtraSec(0);
  }

  function pickTemplate(id: string | null) {
    setSelectedTemplateId(id);
    if (id) {
      const t = templates.find((tp) => tp.id === id);
      if (t) {
        setTaskLabel(t.title);
        setFirstStep(t.firstStepOptions[0] ?? "");
        setCustomFirstStep("");
      }
    }
    if (id) {
      setSearchParams({ templateId: id });
    } else {
      setSearchParams({});
    }
  }

  return (
    <PageContainer>
      {phase === "setup" && (
        <div className="flex flex-col gap-4">
          <Card>
            <label className="text-xs font-medium text-ink-500 dark:text-ink-400">
              何を始める？
            </label>
            <input
              type="text"
              value={taskLabel}
              onChange={(e) => setTaskLabel(e.target.value)}
              placeholder="例: レポート、片付け、メール返信..."
              className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-base outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50 dark:focus:border-brand-500 dark:focus:ring-brand-700/40"
            />
            <div className="mt-3">
              <p className="text-xs font-medium text-ink-500 dark:text-ink-400">
                テンプレを選ぶ（任意）
              </p>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => pickTemplate(null)}
                  className={classNames(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                    !selectedTemplateId
                      ? "bg-brand-500 text-white"
                      : "bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-200",
                  )}
                >
                  なし
                </button>
                {templates.map((t) => {
                  const active = t.id === selectedTemplateId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => pickTemplate(t.id)}
                      className={classNames(
                        "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                        active
                          ? "bg-brand-500 text-white shadow-soft"
                          : COLOR_BG[t.colorKey],
                      )}
                    >
                      <span className="mr-1">{t.icon}</span>
                      {t.title}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setEditorOpen(true)}
                  className="shrink-0 rounded-full border-2 border-dashed border-ink-300 px-3 py-1.5 text-xs font-medium text-ink-500 hover:border-brand-400 hover:text-brand-600 dark:border-ink-600 dark:text-ink-300 dark:hover:border-brand-500 dark:hover:text-brand-300"
                >
                  ＋ 追加
                </button>
              </div>
            </div>
          </Card>

          <FirstStepCard
            options={stepOptions}
            selected={firstStep}
            onSelect={(v) => {
              setFirstStep(v);
              setCustomFirstStep("");
            }}
            customValue={customFirstStep}
            onCustomChange={setCustomFirstStep}
          />

          <PrimaryButton size="xl" fullWidth onClick={handleStart}>
            ▶ 3分だけ始める
          </PrimaryButton>
          <p className="text-center text-xs text-ink-400 dark:text-ink-400">
            続けられたらラッキー、続かなくてもOK。
          </p>
        </div>
      )}

      {phase === "running" && (
        <div className="flex flex-col items-center gap-5">
          <div className="text-center">
            <p className="text-xs text-ink-400 dark:text-ink-400">
              いま取り組んでいるのは
            </p>
            <h2 className="mt-1 text-lg font-bold text-ink-800 dark:text-ink-100">
              {taskLabel || "今やる作業"}
            </h2>
            <p className="mt-1 text-xs text-brand-600 dark:text-brand-300">
              最初の1歩: {customFirstStep.trim() || firstStep}
            </p>
          </div>
          <TimerRing
            totalSec={totalDuration}
            remainingSec={remaining}
            label={extraSec > 0 ? "おかわり中" : "あと少し"}
          />
          <Card padded={false} className="w-full px-4 py-3">
            <p className="text-center text-xs text-ink-500 dark:text-ink-400">
              スマホは置いて、最初の1歩だけやってみよう。
            </p>
          </Card>
          <PrimaryButton
            fullWidth
            variant="ghost"
            size="lg"
            onClick={handleStopEarly}
          >
            やめる
          </PrimaryButton>
        </div>
      )}

      {phase === "done" && (
        <SessionResultSheet
          taskLabel={taskLabel}
          firstStep={customFirstStep.trim() || firstStep}
          onStopHere={handleStopHere}
          onExtend3Min={handleExtend3Min}
          onContinueOpen={handleContinueOpen}
        />
      )}

      <TemplateEditorSheet
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onCreate={(input) => {
          const id = addTemplate(input);
          pickTemplate(id);
        }}
      />
    </PageContainer>
  );
}
