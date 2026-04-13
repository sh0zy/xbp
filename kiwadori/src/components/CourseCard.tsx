import { useNavigate } from 'react-router-dom'
import type { Course } from '../types'
import {
  calcRequiredFinalScore,
  canStillPass,
  getRemainingAbsences,
  getSafetyLevel,
} from '../utils/gradeCalculator'
import SafetyGauge from './SafetyGauge'

interface Props {
  course: Course
  onRecord: (attended: boolean) => void
}

const dayLabels = ['日', '月', '火', '水', '木', '金', '土']

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
}

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function CourseCard({ course, onRecord }: Props) {
  const navigate = useNavigate()
  const required = calcRequiredFinalScore(course)
  const canPass = canStillPass(course)
  const level = getSafetyLevel(required, canPass)
  const remaining = getRemainingAbsences(course)
  const todayLog = course.logs.find((l) => l.date === todayStr())

  const accent = colorMap[course.color] ?? 'bg-neutral-500'

  return (
    <div
      className="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden active:opacity-80"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <div className="flex items-stretch">
        <div className={`w-1.5 ${accent}`} />
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-neutral-400">
                {dayLabels[course.dayOfWeek] ?? ''}曜 {course.period}限
              </p>
              <p className="font-bold text-neutral-100 truncate">
                {course.name}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-neutral-500">残り欠席</p>
              <p
                className={`font-bold ${
                  remaining < 0
                    ? 'text-red-400'
                    : remaining <= 1
                      ? 'text-amber-400'
                      : 'text-neutral-100'
                }`}
              >
                {remaining}回
              </p>
            </div>
          </div>

          <div className="mt-2">
            <SafetyGauge required={required} canPass={canPass} level={level} />
          </div>

          <div
            className="mt-3 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`flex-1 h-11 rounded-md text-sm font-medium ${
                todayLog?.attended === true
                  ? 'bg-indigo-600 text-white'
                  : 'bg-neutral-800 text-neutral-300'
              }`}
              onClick={() => onRecord(true)}
            >
              ✓ 出た
            </button>
            <button
              className={`flex-1 h-11 rounded-md text-sm font-medium ${
                todayLog?.attended === false
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-800 text-neutral-300'
              }`}
              onClick={() => onRecord(false)}
            >
              ✗ 休んだ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
