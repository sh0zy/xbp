import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { CourseWeights } from '../types'
import { useCourseStore } from '../store/useCourseStore'

const dayLabels = ['日', '月', '火', '水', '木', '金', '土']
const colorOptions = ['indigo', 'blue', 'green', 'purple', 'rose', 'amber']
const colorDot: Record<string, string> = {
  indigo: 'bg-indigo-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
}

type PresetKey = 'attendance' | 'final' | 'balance'

const presets: Record<PresetKey, CourseWeights> = {
  attendance: { attendance: 40, assignment: 15, quiz: 15, midterm: 10, final: 20 },
  final: { attendance: 10, assignment: 10, quiz: 10, midterm: 20, final: 50 },
  balance: { attendance: 20, assignment: 20, quiz: 10, midterm: 20, final: 30 },
}

type WKey = keyof CourseWeights

const weightFields: { key: WKey; label: string }[] = [
  { key: 'attendance', label: '出席' },
  { key: 'assignment', label: '課題' },
  { key: 'quiz', label: '小テスト' },
  { key: 'midterm', label: '中間' },
  { key: 'final', label: '期末' },
]

function clamp(v: number, min: number, max: number): number {
  if (Number.isNaN(v)) return min
  if (v < min) return min
  if (v > max) return max
  return v
}

export default function CourseRegister() {
  const navigate = useNavigate()
  const addCourse = useCourseStore((s) => s.addCourse)

  const [name, setName] = useState('')
  const [color, setColor] = useState('indigo')
  const [dayOfWeek, setDayOfWeek] = useState(1)
  const [period, setPeriod] = useState(1)
  const [totalSessions, setTotalSessions] = useState(15)
  const [maxAbsences, setMaxAbsences] = useState(4)
  const [passingScore, setPassingScore] = useState(60)
  const [weights, setWeights] = useState<CourseWeights>(presets.balance)

  const total =
    weights.attendance +
    weights.assignment +
    weights.quiz +
    weights.midterm +
    weights.final

  const canSubmit = name.trim().length > 0 && total === 100

  const redistribute = (changedKey: WKey, newVal: number): CourseWeights => {
    const v = clamp(Math.round(newVal), 0, 100)
    const others = weightFields
      .map((f) => f.key)
      .filter((k) => k !== changedKey)
    const remaining = 100 - v
    const currentOthers = others.map((k) => weights[k])
    const sumOthers = currentOthers.reduce((a, b) => a + b, 0)
    const next: CourseWeights = { ...weights, [changedKey]: v }
    if (sumOthers === 0) {
      const base = Math.floor(remaining / others.length)
      let leftover = remaining - base * others.length
      others.forEach((k) => {
        next[k] = base + (leftover > 0 ? 1 : 0)
        if (leftover > 0) leftover -= 1
      })
    } else {
      let assigned = 0
      others.forEach((k, i) => {
        if (i === others.length - 1) {
          next[k] = Math.max(0, remaining - assigned)
        } else {
          const share = Math.round((weights[k] / sumOthers) * remaining)
          const clamped = Math.max(0, Math.min(100, share))
          next[k] = clamped
          assigned += clamped
        }
      })
    }
    return next
  }

  const setWeight = (key: WKey, value: number): void => {
    setWeights(redistribute(key, value))
  }

  const applyPreset = (k: PresetKey): void => setWeights(presets[k])

  const onSubmit = (): void => {
    if (!canSubmit) return
    addCourse({
      name: name.trim(),
      color,
      dayOfWeek,
      period,
      totalSessions,
      maxAbsences,
      passingScore,
      weights,
      scores: {
        attendedCount: 0,
        assignmentScore: 0,
        quizScore: 0,
        midtermScore: 0,
      },
      logs: [],
    })
    navigate('/')
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-10 bg-neutral-950/90 backdrop-blur border-b border-neutral-900 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="h-11 px-2 flex items-center text-neutral-400">
          ← 戻る
        </Link>
        <h1 className="text-lg font-bold text-neutral-100">新規登録</h1>
        <button
          className={`h-11 px-3 text-sm font-medium ${
            canSubmit ? 'text-indigo-400' : 'text-neutral-600'
          }`}
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          保存
        </button>
      </header>

      <main className="px-4 py-4 space-y-4">
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
          <label className="block">
            <span className="text-xs text-neutral-400">科目名</span>
            <input
              className="mt-1 w-full h-11 rounded-md bg-neutral-800 border border-neutral-700 px-3 text-neutral-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 統計学"
            />
          </label>

          <div>
            <span className="text-xs text-neutral-400">色</span>
            <div className="mt-1 flex gap-2 flex-wrap">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-11 w-11 rounded-full ${colorDot[c]} ${
                    color === c ? 'ring-2 ring-white' : ''
                  }`}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-neutral-400">曜日</span>
              <select
                className="mt-1 w-full h-11 rounded-md bg-neutral-800 border border-neutral-700 px-2 text-neutral-100"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(Number(e.target.value))}
              >
                {dayLabels.map((d, i) => (
                  <option key={i} value={i}>
                    {d}曜
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-neutral-400">時限</span>
              <select
                className="mt-1 w-full h-11 rounded-md bg-neutral-800 border border-neutral-700 px-2 text-neutral-100"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((p) => (
                  <option key={p} value={p}>
                    {p}限
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="text-xs text-neutral-400">総回数</span>
              <input
                type="number"
                className="mt-1 w-full h-11 rounded-md bg-neutral-800 border border-neutral-700 px-2 text-neutral-100"
                value={totalSessions}
                min={1}
                max={60}
                onChange={(e) =>
                  setTotalSessions(clamp(Number(e.target.value), 1, 60))
                }
              />
            </label>
            <label className="block">
              <span className="text-xs text-neutral-400">欠席上限</span>
              <input
                type="number"
                className="mt-1 w-full h-11 rounded-md bg-neutral-800 border border-neutral-700 px-2 text-neutral-100"
                value={maxAbsences}
                min={0}
                max={totalSessions}
                onChange={(e) =>
                  setMaxAbsences(clamp(Number(e.target.value), 0, totalSessions))
                }
              />
            </label>
            <label className="block">
              <span className="text-xs text-neutral-400">合格点</span>
              <input
                type="number"
                className="mt-1 w-full h-11 rounded-md bg-neutral-800 border border-neutral-700 px-2 text-neutral-100"
                value={passingScore}
                min={1}
                max={100}
                onChange={(e) =>
                  setPassingScore(clamp(Number(e.target.value), 1, 100))
                }
              />
            </label>
          </div>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-neutral-300">配点</h2>
            <span
              className={`text-xs font-medium ${
                total === 100 ? 'text-indigo-400' : 'text-red-400'
              }`}
            >
              合計 {total}/100
            </span>
          </div>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button
              className="h-9 px-3 rounded-md bg-neutral-800 text-xs text-neutral-200"
              onClick={() => applyPreset('attendance')}
            >
              出席重視型
            </button>
            <button
              className="h-9 px-3 rounded-md bg-neutral-800 text-xs text-neutral-200"
              onClick={() => applyPreset('final')}
            >
              期末一発型
            </button>
            <button
              className="h-9 px-3 rounded-md bg-neutral-800 text-xs text-neutral-200"
              onClick={() => applyPreset('balance')}
            >
              バランス型
            </button>
          </div>
          <div className="space-y-2">
            {weightFields.map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <span className="w-20 text-xs text-neutral-400">{f.label}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={weights[f.key]}
                  onChange={(e) => setWeight(f.key, Number(e.target.value))}
                  className="flex-1 accent-indigo-500 h-11"
                />
                <span className="w-10 text-right text-sm text-neutral-100">
                  {weights[f.key]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
