import type { WantItem, ItemCategory } from '../types'
import { CATEGORY_LABELS } from '../types'

export interface BasicStats {
  totalItems: number
  resistedCount: number
  boughtCount: number
  waitingCount: number
  totalSaved: number
  totalSpent: number
  resistRate: number
}

export function calcBasicStats(items: WantItem[]): BasicStats {
  const decided = items.filter((i) => i.decision !== 'waiting')
  const resisted = items.filter((i) => i.decision === 'resisted')
  const bought = items.filter((i) => i.decision === 'bought')
  const waiting = items.filter((i) => i.decision === 'waiting')

  const totalSaved = resisted.reduce((a, i) => a + i.price, 0)
  const totalSpent = bought.reduce((a, i) => a + i.price, 0)
  const resistRate = decided.length > 0 ? resisted.length / decided.length : 0

  return {
    totalItems: items.length,
    resistedCount: resisted.length,
    boughtCount: bought.length,
    waitingCount: waiting.length,
    totalSaved,
    totalSpent,
    resistRate,
  }
}

export interface CategoryBreakdown {
  category: string
  label: string
  total: number
  resisted: number
  bought: number
  totalAmount: number
  savedAmount: number
}

export function calcCategoryBreakdown(items: WantItem[]): CategoryBreakdown[] {
  const map = new Map<ItemCategory, { total: number; resisted: number; bought: number; totalAmount: number; savedAmount: number }>()

  for (const item of items) {
    const entry = map.get(item.category) ?? { total: 0, resisted: 0, bought: 0, totalAmount: 0, savedAmount: 0 }
    entry.total++
    entry.totalAmount += item.price
    if (item.decision === 'resisted') {
      entry.resisted++
      entry.savedAmount += item.price
    } else if (item.decision === 'bought') {
      entry.bought++
    }
    map.set(item.category, entry)
  }

  return Array.from(map.entries())
    .map(([cat, v]) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      ...v,
    }))
    .sort((a, b) => b.total - a.total)
}

export function calcRecentTrend(
  items: WantItem[],
  days = 7,
): { date: string; resisted: number; bought: number; saved: number }[] {
  const now = Date.now()
  const result: { date: string; resisted: number; bought: number; saved: number }[] = []

  for (let i = days - 1; i >= 0; i--) {
    const start = now - (i + 1) * 86400000
    const end = now - i * 86400000
    const d = new Date(end - 86400000)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    const dayItems = items.filter(
      (item) => item.decidedAt !== null && item.decidedAt >= start && item.decidedAt < end,
    )
    const resisted = dayItems.filter((i) => i.decision === 'resisted').length
    const bought = dayItems.filter((i) => i.decision === 'bought').length
    const saved = dayItems.filter((i) => i.decision === 'resisted').reduce((a, i) => a + i.price, 0)
    result.push({ date: label, resisted, bought, saved })
  }

  return result
}

export function getStreak(items: WantItem[]): number {
  const resisted = items
    .filter((i) => i.decision === 'resisted' && i.decidedAt !== null)
    .map((i) => {
      const d = new Date(i.decidedAt!)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
  const unique = [...new Set(resisted)].sort().reverse()
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
    if (prev.getTime() - curr.getTime() > 86400000 * 1.5) break
    streak++
  }
  return streak
}

export function formatPrice(yen: number): string {
  return `¥${yen.toLocaleString()}`
}

export function getRemainingTime(waitUntil: number): string {
  const diff = waitUntil - Date.now()
  if (diff <= 0) return '判定可能'
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    const remHours = hours % 24
    return `あと${days}日${remHours}時間`
  }
  return `あと${hours}時間${minutes}分`
}

export function isWaitComplete(item: WantItem): boolean {
  return item.decision === 'waiting' && Date.now() >= item.waitUntil
}
