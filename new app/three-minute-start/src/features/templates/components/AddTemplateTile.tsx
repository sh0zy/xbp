interface AddTemplateTileProps {
  onClick: () => void;
}

export function AddTemplateTile({ onClick }: AddTemplateTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tap-highlight-none flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-ink-200 bg-white/40 px-3 py-3 text-left transition active:scale-[0.99] hover:border-brand-300 hover:bg-brand-50/50 dark:border-ink-700 dark:bg-ink-800/40 dark:hover:border-brand-700 dark:hover:bg-ink-700/40"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
        ＋
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">
          テンプレを追加
        </span>
        <span className="truncate text-xs text-ink-500 dark:text-ink-400">
          自分専用のテンプレを作る
        </span>
      </span>
    </button>
  );
}
