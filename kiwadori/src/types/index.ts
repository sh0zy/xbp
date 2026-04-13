export type SafetyLevel = 'safe' | 'caution' | 'danger'

export interface CourseWeights {
  attendance: number
  assignment: number
  quiz: number
  midterm: number
  final: number
}

export interface ScoreRecord {
  attendedCount: number
  assignmentScore: number
  quizScore: number
  midtermScore: number
}

export interface AttendanceLog {
  date: string
  attended: boolean
}

export interface Course {
  id: string
  name: string
  color: string
  dayOfWeek: number
  period: number
  totalSessions: number
  maxAbsences: number
  passingScore: number
  weights: CourseWeights
  scores: ScoreRecord
  logs: AttendanceLog[]
  createdAt: string
}
