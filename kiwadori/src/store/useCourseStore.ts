import { create } from 'zustand'
import type { Course, ScoreRecord } from '../types'
import { loadCourses, saveCourses, clearCourses } from '../utils/storage'

function today(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

const seedCourses: Course[] = [
  {
    id: uid(),
    name: '統計学',
    color: 'indigo',
    dayOfWeek: 1,
    period: 2,
    totalSessions: 15,
    maxAbsences: 4,
    passingScore: 60,
    weights: { attendance: 20, assignment: 20, quiz: 10, midterm: 20, final: 30 },
    scores: { attendedCount: 6, assignmentScore: 70, quizScore: 60, midtermScore: 55 },
    logs: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uid(),
    name: '英語コミュニケーション',
    color: 'blue',
    dayOfWeek: 3,
    period: 1,
    totalSessions: 15,
    maxAbsences: 4,
    passingScore: 60,
    weights: { attendance: 30, assignment: 15, quiz: 15, midterm: 10, final: 30 },
    scores: { attendedCount: 7, assignmentScore: 80, quizScore: 70, midtermScore: 65 },
    logs: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uid(),
    name: '情報処理論',
    color: 'green',
    dayOfWeek: 5,
    period: 3,
    totalSessions: 15,
    maxAbsences: 4,
    passingScore: 60,
    weights: { attendance: 10, assignment: 20, quiz: 10, midterm: 20, final: 40 },
    scores: { attendedCount: 5, assignmentScore: 60, quizScore: 50, midtermScore: 60 },
    logs: [],
    createdAt: new Date().toISOString(),
  },
]

interface CourseStore {
  courses: Course[]
  addCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void
  updateCourse: (id: string, patch: Partial<Course>) => void
  deleteCourse: (id: string) => void
  recordAttendance: (courseId: string, attended: boolean) => void
  updateScore: (
    courseId: string,
    field: keyof ScoreRecord,
    value: number,
  ) => void
  resetAll: () => void
}

function persist(courses: Course[]): Course[] {
  saveCourses(courses)
  return courses
}

const initial: Course[] = (() => {
  const stored = loadCourses()
  if (stored && stored.length > 0) return stored
  saveCourses(seedCourses)
  return seedCourses
})()

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: initial,

  addCourse: (course) => {
    const next: Course = {
      ...course,
      id: uid(),
      createdAt: new Date().toISOString(),
    }
    set({ courses: persist([...get().courses, next]) })
  },

  updateCourse: (id, patch) => {
    const next = get().courses.map((c) => (c.id === id ? { ...c, ...patch } : c))
    set({ courses: persist(next) })
  },

  deleteCourse: (id) => {
    set({ courses: persist(get().courses.filter((c) => c.id !== id)) })
  },

  recordAttendance: (courseId, attended) => {
    const t = today()
    const next = get().courses.map((c) => {
      if (c.id !== courseId) return c
      const prevLog = c.logs.find((l) => l.date === t)
      const filtered = c.logs.filter((l) => l.date !== t)
      const newLogs = [...filtered, { date: t, attended }]
      // attendedCount adjustment: 同日内で変更があれば差分反映
      let attendedCount = c.scores.attendedCount
      const wasAttended = prevLog?.attended === true
      if (attended && !wasAttended) attendedCount += 1
      if (!attended && wasAttended) attendedCount = Math.max(0, attendedCount - 1)
      if (attended && !prevLog) {
        // 初回出席追加時は既に +1 済み
      } else if (!attended && !prevLog) {
        // 初回欠席 — attendedCount は変わらない
      }
      attendedCount = Math.min(attendedCount, c.totalSessions)
      return {
        ...c,
        logs: newLogs,
        scores: { ...c.scores, attendedCount },
      }
    })
    set({ courses: persist(next) })
  },

  updateScore: (courseId, field, value) => {
    const next = get().courses.map((c) => {
      if (c.id !== courseId) return c
      const clamped = (() => {
        if (field === 'attendedCount') {
          const v = Math.round(value)
          if (v < 0) return 0
          if (v > c.totalSessions) return c.totalSessions
          return v
        }
        if (value < 0) return 0
        if (value > 100) return 100
        return value
      })()
      return { ...c, scores: { ...c.scores, [field]: clamped } }
    })
    set({ courses: persist(next) })
  },

  resetAll: () => {
    clearCourses()
    saveCourses(seedCourses)
    set({ courses: seedCourses })
  },
}))
