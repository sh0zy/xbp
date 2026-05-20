import { PrimaryButton } from "../../../components/common/PrimaryButton";

interface SessionResultSheetProps {
  taskLabel: string;
  firstStep: string;
  onStopHere: () => void;
  onExtend3Min: () => void;
  onContinueOpen: () => void;
}

export function SessionResultSheet({
  taskLabel,
  firstStep,
  onStopHere,
  onExtend3Min,
  onContinueOpen,
}: SessionResultSheetProps) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-ink-100 dark:bg-ink-800 dark:ring-ink-700">
      <div className="text-center">
        <div className="text-4xl">🎉</div>
        <h2 className="mt-1 text-lg font-bold text-ink-800 dark:text-ink-100">
          3分、始められたね
        </h2>
        <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
          始めた時点で十分。続けるかは自分で選んでOK。
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-ink-50 p-3 text-sm dark:bg-ink-900">
        <div className="text-[11px] text-ink-400 dark:text-ink-400">
          作業
        </div>
        <div className="font-semibold text-ink-800 dark:text-ink-50">
          {taskLabel || "（無題の作業）"}
        </div>
        <div className="mt-2 text-[11px] text-ink-400 dark:text-ink-400">
          最初の1歩
        </div>
        <div className="text-ink-700 dark:text-ink-200">{firstStep}</div>
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <PrimaryButton fullWidth size="lg" onClick={onContinueOpen}>
          このまま続ける
        </PrimaryButton>
        <PrimaryButton
          fullWidth
          variant="secondary"
          size="lg"
          onClick={onExtend3Min}
        >
          もう3分だけ続ける
        </PrimaryButton>
        <PrimaryButton
          fullWidth
          variant="ghost"
          size="md"
          onClick={onStopHere}
        >
          ここで終わる
        </PrimaryButton>
      </div>
    </div>
  );
}
