import type {
  FocusSession,
  InsightSummary,
  RecipeSuggestion,
  Location,
  NoiseLevel,
} from '../types'
import { LOCATION_LABELS, NOISE_LABELS } from '../types'

function getHour(ts: number): number {
  return new Date(ts).getHours()
}

function getTimeOfDayLabel(hour: number): string {
  if (hour >= 5 && hour < 9) return '早朝（5〜9時）'
  if (hour >= 9 && hour < 12) return '午前（9〜12時）'
  if (hour >= 12 && hour < 15) return '昼（12〜15時）'
  if (hour >= 15 && hour < 18) return '夕方（15〜18時）'
  if (hour >= 18 && hour < 21) return '夜（18〜21時）'
  return '深夜（21〜5時）'
}

function groupAvg<T extends string>(
  sessions: FocusSession[],
  keyFn: (s: FocusSession) => T,
): Map<T, { avg: number; count: number }> {
  const map = new Map<T, { sum: number; count: number }>()
  for (const s of sessions) {
    if (s.focusScore === null) continue
    const key = keyFn(s)
    const entry = map.get(key) ?? { sum: 0, count: 0 }
    entry.sum += s.focusScore
    entry.count += 1
    map.set(key, entry)
  }
  const result = new Map<T, { avg: number; count: number }>()
  for (const [k, v] of map) {
    result.set(k, { avg: v.sum / v.count, count: v.count })
  }
  return result
}

function bestKey<T extends string>(
  map: Map<T, { avg: number; count: number }>,
  minCount = 1,
): T | null {
  let best: T | null = null
  let bestAvg = -1
  for (const [k, v] of map) {
    if (v.count >= minCount && v.avg > bestAvg) {
      bestAvg = v.avg
      best = k
    }
  }
  return best
}

export function calcStreak(sessions: FocusSession[]): number {
  const completed = sessions
    .filter((s) => s.endedAt !== null)
    .map((s) => {
      const d = new Date(s.startedAt)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
  const unique = [...new Set(completed)].sort().reverse()
  if (unique.length === 0) return 0

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const yesterday = new Date(Date.now() - 86400000)
  const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`

  if (unique[0] !== todayStr && unique[0] !== yesterdayStr) return 0

  let streak = 1
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1])
    const curr = new Date(unique[i])
    const diff = prev.getTime() - curr.getTime()
    if (diff > 86400000 * 1.5) break
    streak++
  }
  return streak
}

export function calcInsights(sessions: FocusSession[]): InsightSummary {
  const completed = sessions.filter((s) => s.focusScore !== null)
  const totalSessions = sessions.length

  if (completed.length === 0) {
    return {
      bestTimeOfDay: null,
      bestLocation: null,
      bestNoiseLevel: null,
      worstSleepImpact: false,
      phoneRiskImpact: false,
      avgFocusScore: 0,
      totalSessions,
      streak: calcStreak(sessions),
      dataConfidence: 'low',
    }
  }

  const avgFocusScore =
    completed.reduce((a, s) => a + (s.focusScore ?? 0), 0) / completed.length

  const timeMap = groupAvg(completed, (s) => getTimeOfDayLabel(getHour(s.startedAt)))
  const locationMap = groupAvg(completed, (s) => s.location)
  const noiseMap = groupAvg(completed, (s) => s.noiseLevel)

  const bestTimeOfDay = bestKey(timeMap)
  const bestLocation = bestKey(locationMap) as Location | null
  const bestNoiseLevel = bestKey(noiseMap) as NoiseLevel | null

  // sleep impact: sessions with tired/exhausted vs great/good
  const goodSleep = completed.filter((s) => s.sleepState === 'great' || s.sleepState === 'good')
  const badSleep = completed.filter((s) => s.sleepState === 'tired' || s.sleepState === 'exhausted')
  const goodSleepAvg = goodSleep.length > 0
    ? goodSleep.reduce((a, s) => a + (s.focusScore ?? 0), 0) / goodSleep.length
    : 0
  const badSleepAvg = badSleep.length > 0
    ? badSleep.reduce((a, s) => a + (s.focusScore ?? 0), 0) / badSleep.length
    : 0
  const worstSleepImpact = badSleep.length >= 2 && goodSleepAvg - badSleepAvg > 0.8

  const lowPhone = completed.filter((s) => s.phoneRisk === 'low')
  const highPhone = completed.filter((s) => s.phoneRisk === 'high')
  const lowPhoneAvg = lowPhone.length > 0
    ? lowPhone.reduce((a, s) => a + (s.focusScore ?? 0), 0) / lowPhone.length
    : 0
  const highPhoneAvg = highPhone.length > 0
    ? highPhone.reduce((a, s) => a + (s.focusScore ?? 0), 0) / highPhone.length
    : 0
  const phoneRiskImpact = highPhone.length >= 2 && lowPhoneAvg - highPhoneAvg > 0.8

  const dataConfidence: 'low' | 'medium' | 'high' =
    completed.length >= 30 ? 'high' : completed.length >= 14 ? 'medium' : 'low'

  return {
    bestTimeOfDay,
    bestLocation,
    bestNoiseLevel,
    worstSleepImpact,
    phoneRiskImpact,
    avgFocusScore,
    totalSessions,
    streak: calcStreak(sessions),
    dataConfidence,
  }
}

export function calcRecipe(sessions: FocusSession[]): RecipeSuggestion {
  const completed = sessions.filter((s) => s.focusScore !== null)

  if (completed.length < 3) {
    return {
      timeOfDay: null,
      location: null,
      noiseLevel: null,
      avoidConditions: [],
      bestCombination: null,
      confidence: 'hypothesis',
      sessionCount: completed.length,
    }
  }

  const timeMap = groupAvg(completed, (s) => getTimeOfDayLabel(getHour(s.startedAt)))
  const locationMap = groupAvg(completed, (s) => s.location)
  const noiseMap = groupAvg(completed, (s) => s.noiseLevel)

  const bestTime = bestKey(timeMap)
  const bestLocation = bestKey(locationMap) as Location | null
  const bestNoise = bestKey(noiseMap) as NoiseLevel | null

  // worst conditions
  const avoidConditions: string[] = []
  for (const [k, v] of locationMap) {
    if (v.avg <= 2.5 && v.count >= 2) {
      avoidConditions.push(`${LOCATION_LABELS[k]}は集中しにくい傾向`)
    }
  }
  for (const [k, v] of noiseMap) {
    if (v.avg <= 2.5 && v.count >= 2) {
      avoidConditions.push(`${NOISE_LABELS[k]}環境は集中しにくい傾向`)
    }
  }

  const sleepImpact = completed.filter(
    (s) => (s.sleepState === 'tired' || s.sleepState === 'exhausted') && (s.focusScore ?? 0) <= 2,
  )
  if (sleepImpact.length >= 2) {
    avoidConditions.push('睡眠不足の日は集中度が下がりやすい')
  }

  const phoneImpact = completed.filter(
    (s) => s.phoneRisk === 'high' && (s.focusScore ?? 0) <= 2,
  )
  if (phoneImpact.length >= 2) {
    avoidConditions.push('スマホ誘惑リスクが高いと集中度が落ちやすい')
  }

  const bestCombination =
    bestLocation || bestNoise
      ? {
          location: bestLocation ?? undefined,
          noiseLevel: bestNoise ?? undefined,
        }
      : null

  const confidence: 'hypothesis' | 'emerging' | 'established' =
    completed.length >= 30 ? 'established' : completed.length >= 14 ? 'emerging' : 'hypothesis'

  return {
    timeOfDay: bestTime,
    location: bestLocation,
    noiseLevel: bestNoise,
    avoidConditions,
    bestCombination,
    confidence,
    sessionCount: completed.length,
  }
}

export function getRecentTrend(
  sessions: FocusSession[],
  days = 7,
): { date: string; avg: number; count: number }[] {
  const now = Date.now()
  const result: { date: string; avg: number; count: number }[] = []

  for (let i = days - 1; i >= 0; i--) {
    const start = now - (i + 1) * 86400000
    const end = now - i * 86400000
    const daySessions = sessions.filter(
      (s) => s.startedAt >= start && s.startedAt < end && s.focusScore !== null,
    )
    const d = new Date(end - 86400000)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    const avg =
      daySessions.length > 0
        ? daySessions.reduce((a, s) => a + (s.focusScore ?? 0), 0) / daySessions.length
        : 0
    result.push({ date: label, avg: Math.round(avg * 10) / 10, count: daySessions.length })
  }

  return result
}
