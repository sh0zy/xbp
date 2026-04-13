import type { Course, SafetyLevel, AttendanceLog } from '../types'

function clamp(v: number, min: number, max: number): number {
  if (Number.isNaN(v)) return min
  if (v < min) return min
  if (v > max) return max
  return v
}

function today(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function calcAttendanceScore(course: Course): number {
  const total = course.totalSessions
  if (total <= 0) return 0
  const ratio = clamp(course.scores.attendedCount, 0, total) / total
  const score = ratio * course.weights.attendance
  return clamp(score, 0, course.weights.attendance)
}

export function calcEarnedPoints(course: Course): number {
  const att = calcAttendanceScore(course)
  const assign =
    (clamp(course.scores.assignmentScore, 0, 100) / 100) *
    course.weights.assignment
  const quiz =
    (clamp(course.scores.quizScore, 0, 100) / 100) * course.weights.quiz
  const mid =
    (clamp(course.scores.midtermScore, 0, 100) / 100) * course.weights.midterm
  return att + assign + quiz + mid
}

function rawRequiredFinalScore(course: Course): number {
  if (course.weights.final <= 0) {
    const earned = calcEarnedPoints(course)
    return earned >= course.passingScore ? 0 : Number.POSITIVE_INFINITY
  }
  const earned = calcEarnedPoints(course)
  if (earned >= course.passingScore) return 0
  return (course.passingScore - earned) / (course.weights.final / 100)
}

export function calcRequiredFinalScore(course: Course): number {
  if (course.weights.final <= 0) return 0
  const raw = rawRequiredFinalScore(course)
  if (!Number.isFinite(raw)) return 100
  if (raw <= 0) return 0
  return Math.round(clamp(raw, 0, 100))
}

export function getRemainingAbsences(course: Course): number {
  const absences = course.logs.filter((l) => l.attended === false).length
  return course.maxAbsences - absences
}

export function canStillPass(course: Course): boolean {
  const rawReq = rawRequiredFinalScore(course)
  if (!Number.isFinite(rawReq)) return false
  if (rawReq > 100) return false
  if (getRemainingAbsences(course) < 0) return false
  return true
}

export function getSafetyLevel(
  required: number,
  canPass: boolean,
): SafetyLevel {
  if (!canPass) return 'danger'
  if (required <= 40) return 'safe'
  if (required <= 70) return 'caution'
  return 'danger'
}

export function simulateAbsence(course: Course): {
  currentRequired: number
  afterRequired: number
  delta: number
  willBreachLimit: boolean
} {
  const t = today()
  const filteredLogs: AttendanceLog[] = course.logs.filter((l) => l.date !== t)
  const simulated: Course = {
    ...course,
    logs: [...filteredLogs, { date: t, attended: false }],
  }
  const currentRequired = calcRequiredFinalScore(course)
  const afterRequired = calcRequiredFinalScore(simulated)
  const delta = afterRequired - currentRequired
  const willBreachLimit = getRemainingAbsences(simulated) < 0
  return { currentRequired, afterRequired, delta, willBreachLimit }
}
