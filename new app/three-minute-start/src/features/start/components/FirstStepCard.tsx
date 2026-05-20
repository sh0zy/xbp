import { Card } from "../../../components/common/Card";
import { classNames } from "../../../lib/utils";

interface FirstStepCardProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  customValue: string;
  onCustomChange: (value: string) => void;
}

export function FirstStepCard({
  options,
  selected,
  onSelect,
  customValue,
  onCustomChange,
}: FirstStepCardProps) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-200">
        最初の1歩だけ決める
      </h3>
      <p className="mt-1 text-xs text-ink-400 dark:text-ink-400">
        小さいほどいい。「開くだけ」でも十分。
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={classNames(
                "rounded-full px-3 py-1.5 text-xs font-medium tap-highlight-none transition",
                active
                  ? "bg-brand-500 text-white shadow-soft"
                  : "bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-200 dark:hover:bg-ink-600",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <div className="mt-3">
        <label className="text-xs font-medium text-ink-500 dark:text-ink-400">
          自由入力
        </label>
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="例: 1行だけ書く"
          className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50 dark:focus:border-brand-500 dark:focus:ring-brand-700/40"
        />
      </div>
    </Card>
  );
}
