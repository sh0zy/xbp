import type { Course } from '../types'
import { simulateAbsence } from '../utils/gradeCalculator'

interface Props {
  course: Course
  onClose: () => void
  onAbsent: () => void
  onAttend: () => void
}

export default function SimulateModal({
  course,
  onClose,
  onAbsent,
  onAttend,
}: Props) {
  const sim = simulateAbsence(course)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-neutral-900 border border-neutral-800 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-neutral-100 mb-1">
          今日休んだら？
        </h2>
        <p className="text-xs text-neutral-400 mb-4">{course.name}</p>

        <div className="grid grid-cols-3 items-center gap-2 mb-4">
          <div className="text-center">
            <p className="text-xs text-neutral-500 mb-1">現在</p>
            <p className="text-2xl font-bold text-indigo-400">
              {sim.currentRequired}
              <span className="text-sm ml-0.5">点</span>
            </p>
          </div>
          <div className="text-center text-neutral-500 text-xl">→</div>
          <div className="text-center">
            <p className="text-xs text-neutral-500 mb-1">欠席後</p>
            <p
              className={`text-2xl font-bold ${
                sim.willBreachLimit ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              {sim.afterRequired}
              <span className="text-sm ml-0.5">点</span>
            </p>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-xs text-neutral-400">必要期末点の変化</p>
          <p className="text-sm font-medium text-neutral-200">
            {sim.delta >= 0 ? '+' : ''}
            {sim.delta} 点
          </p>
        </div>

        {sim.willBreachLimit && (
          <div className="mb-4 rounded-md bg-red-950/50 border border-red-800 p-3">
            <p className="text-sm text-red-300 font-medium">
              ⚠ 欠席上限を超えます
            </p>
            <p className="text-xs text-red-400 mt-1">
              この欠席で単位取得が不可能になる可能性があります
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            className="h-11 rounded-md bg-red-600 hover:bg-red-500 text-white font-medium"
            onClick={onAbsent}
          >
            休む（記録する）
          </button>
          <button
            className="h-11 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
            onClick={onAttend}
          >
            出席する
          </button>
          <button
            className="h-11 rounded-md bg-neutral-800 text-neutral-300"
            onClick={onClose}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  )
}
