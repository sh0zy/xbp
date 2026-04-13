import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCourseStore } from '../store/useCourseStore'
import SafetyGauge from '../components/SafetyGauge'
import ScoreInput from '../components/ScoreInput'
import SimulateModal from '../components/SimulateModal'
import {
  calcAttendanceScore,
  calcEarnedPoints,
  calcRequiredFinalScore,
  canStillPass,
  getRemainingAbsences,
  getSafetyLevel,
} from '../utils/gradeCalculator'

const dayLabels = ['日', '月', '火', '水', '木', '金', '土']

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const course = useCourseStore((s) => s.courses.find((c) => c.id === id))
  const updateScore = useCourseStore((s) => s.updateScore)
  const deleteCourse = useCourseStore((s) => s.deleteCourse)
  const recordAttendance = useCourseStore((s) => s.recordAttendance)
  const [simOpen, setSimOpen] = useState(false)

  if (!course) {
    return (
      <div className="min-h-screen p-6">
        <p className="text-neutral-400">科目が見つかりません</p>
        <Link to="/" className="text-indigo-400 underline">
          ホームへ戻る
        </Link>
      </div>
    )
  }

  const required = calcRequiredFinalScore(course)
  const canPass = canStillPass(course)
  const level = getSafetyLevel(required, canPass)
  const remaining = getRemainingAbsences(course)
  const earned = Math.round(calcEarnedPoints(course) * 10) / 10
  const attScore = Math.round(calcAttendanceScore(course) * 10) / 10

  const onDelete = (): void => {
    if (!confirm('この科目を削除しますか？')) return
    deleteCourse(course.id)
    navigate('/')
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-10 bg-neutral-950/90 backdrop-blur border-b border-neutral-900 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="h-11 px-2 flex items-center text-neutral-400">
          ← 戻る
        </Link>
        <button
          className="h-11 px-3 text-sm text-red-400"
          onClick={onDelete}
        >
          削除
        </button>
      </header>

      <main className="px-4 py-4 space-y-6">
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-xs text-neutral-400">
            {dayLabels[course.dayOfWeek] ?? ''}曜 {course.period}限
          </p>
          <h1 className="text-2xl font-bold text-neutral-100 mb-3">
            {course.name}
          </h1>
          <SafetyGauge
            required={required}
            canPass={canPass}
            level={level}
            size="lg"
          />
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div>
              <p className="text-xs text-neutral-500">残り欠席</p>
              <p
                className={`font-bold ${
                  remaining < 0 ? 'text-red-400' : 'text-neutral-100'
                }`}
              >
                {remaining}回
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">確定点</p>
              <p className="font-bold text-neutral-100">{earned}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">合格点</p>
              <p className="font-bold text-neutral-100">
                {course.passingScore}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-neutral-300 mb-2">
            評価項目
          </h2>
          <ScoreInput
            label={`出席 (${attScore}/${course.weights.attendance}点)`}
            value={course.scores.attendedCount}
            onChange={(v) => updateScore(course.id, 'attendedCount', v)}
            min={0}
            max={course.totalSessions}
            step={1}
            suffix="回"
          />
          <ScoreInput
            label={`課題 (配点${course.weights.assignment})`}
            value={course.scores.assignmentScore}
            onChange={(v) => updateScore(course.id, 'assignmentScore', v)}
          />
          <ScoreInput
            label={`小テスト (配点${course.weights.quiz})`}
            value={course.scores.quizScore}
            onChange={(v) => updateScore(course.id, 'quizScore', v)}
          />
          <ScoreInput
            label={`中間 (配点${course.weights.midterm})`}
            value={course.scores.midtermScore}
            onChange={(v) => updateScore(course.id, 'midtermScore', v)}
          />
          <p className="text-xs text-neutral-500 mt-2">
            期末の配点: {course.weights.final}点
          </p>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-neutral-300">出席ログ</h2>
            <button
              className="h-9 px-3 rounded-md bg-amber-600 text-white text-xs font-medium"
              onClick={() => setSimOpen(true)}
            >
              今日休んだら？
            </button>
          </div>
          {course.logs.length === 0 ? (
            <p className="text-sm text-neutral-500">ログなし</p>
          ) : (
            <ul className="space-y-1">
              {[...course.logs]
                .sort((a, b) => (a.date < b.date ? 1 : -1))
                .map((l) => (
                  <li
                    key={l.date}
                    className="flex justify-between text-sm py-1 border-b border-neutral-800 last:border-0"
                  >
                    <span className="text-neutral-400">{l.date}</span>
                    <span
                      className={
                        l.attended ? 'text-indigo-400' : 'text-red-400'
                      }
                    >
                      {l.attended ? '✓ 出席' : '✗ 欠席'}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </section>
      </main>

      {simOpen && (
        <SimulateModal
          course={course}
          onClose={() => setSimOpen(false)}
          onAbsent={() => {
            recordAttendance(course.id, false)
            setSimOpen(false)
          }}
          onAttend={() => {
            recordAttendance(course.id, true)
            setSimOpen(false)
          }}
        />
      )}
    </div>
  )
}
