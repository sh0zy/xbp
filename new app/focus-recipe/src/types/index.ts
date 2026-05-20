export type TaskType =
  | 'study'
  | 'work'
  | 'reading'
  | 'writing'
  | 'coding'
  | 'creative'
  | 'other'

export type Location =
  | 'home_desk'
  | 'home_other'
  | 'cafe'
  | 'library'
  | 'office'
  | 'commute'
  | 'other'

export type NoiseLevel =
  | 'silent'
  | 'quiet'
  | 'ambient'
  | 'noisy'
  | 'music'
  | 'noise_cancel'

export type SleepState =
  | 'great'
  | 'good'
  | 'normal'
  | 'tired'
  | 'exhausted'

export type MotivationLevel = 1 | 2 | 3 | 4 | 5

export type PhoneRisk = 'low' | 'medium' | 'high'

export type FocusScore = 1 | 2 | 3 | 4 | 5

export interface FocusEnvironment {
  taskType: TaskType
  location: Location
  noiseLevel: NoiseLevel
  sleepState: SleepState
  motivationLevel: MotivationLevel
  phoneRisk: PhoneRisk
  plannedDuration: number
}

export interface SessionReview {
  focusScore: FocusScore
  phoneDistractionScore: number
  interrupted: boolean
  completedAsPlanned: boolean
  note: string
  repeatWanted: boolean
}

export interface FocusSession {
  id: string
  startedAt: number
  endedAt: number | null
  plannedDuration: number
  actualDuration: number | null
  taskType: TaskType
  location: Location
  noiseLevel: NoiseLevel
  sleepState: SleepState
  motivationLevel: MotivationLevel
  phoneRisk: PhoneRisk
  focusScore: FocusScore | null
  phoneDistractionScore: number | null
  interrupted: boolean | null
  completedAsPlanned: boolean | null
  note: string
  repeatWanted: boolean | null
}

export interface InsightSummary {
  bestTimeOfDay: string | null
  bestLocation: Location | null
  bestNoiseLevel: NoiseLevel | null
  worstSleepImpact: boolean
  phoneRiskImpact: boolean
  avgFocusScore: number
  totalSessions: number
  streak: number
  dataConfidence: 'low' | 'medium' | 'high'
}

export interface RecipeSuggestion {
  timeOfDay: string | null
  location: Location | null
  noiseLevel: NoiseLevel | null
  avoidConditions: string[]
  bestCombination: Partial<FocusEnvironment> | null
  confidence: 'hypothesis' | 'emerging' | 'established'
  sessionCount: number
}

export interface UserProfile {
  name: string
  goalSessions: number
  onboardingDone: boolean
  createdAt: number
}

export interface AppSettings {
  theme: 'dark' | 'light'
  notificationsEnabled: boolean
  reminderTime: string | null
}

export interface AppState {
  sessions: FocusSession[]
  activeSession: FocusSession | null
  userProfile: UserProfile
  settings: AppSettings
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  study: '勉強',
  work: '仕事',
  reading: '読書',
  writing: '文章作成',
  coding: 'コーディング',
  creative: 'クリエイティブ',
  other: 'その他',
}

export const LOCATION_LABELS: Record<Location, string> = {
  home_desk: '自宅（デスク）',
  home_other: '自宅（その他）',
  cafe: 'カフェ',
  library: '図書館',
  office: 'オフィス',
  commute: '通勤中',
  other: 'その他',
}

export const NOISE_LABELS: Record<NoiseLevel, string> = {
  silent: '無音',
  quiet: '静か',
  ambient: '環境音',
  noisy: '騒がしい',
  music: '音楽あり',
  noise_cancel: 'ノイキャン',
}

export const SLEEP_LABELS: Record<SleepState, string> = {
  great: '十分（8h+）',
  good: '良い（7h）',
  normal: '普通（6h）',
  tired: '少し不足',
  exhausted: '不足',
}

export const PHONE_RISK_LABELS: Record<PhoneRisk, string> = {
  low: '低い',
  medium: '中程度',
  high: '高い',
}
