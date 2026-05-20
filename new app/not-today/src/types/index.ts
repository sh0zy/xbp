// ── カテゴリ ──
export type ItemCategory =
  | 'fashion'
  | 'electronics'
  | 'food'
  | 'entertainment'
  | 'hobby'
  | 'beauty'
  | 'daily'
  | 'other'

// ── 待機プリセット ──
export type WaitPreset = '24h' | '48h' | '72h' | '1week' | '2weeks' | 'custom'

// ── アイテム判定結果 ──
export type ItemDecision = 'waiting' | 'resisted' | 'bought'

// ── 流入元 ──
export type ItemSource =
  | 'sns'
  | 'store'
  | 'online_shop'
  | 'ad'
  | 'friend'
  | 'other'

// ── 欲しいもの ──
export interface WantItem {
  id: string
  name: string
  price: number
  category: ItemCategory
  reason: string
  source: ItemSource
  imageUrl: string
  addedAt: number
  waitUntil: number
  decision: ItemDecision
  decidedAt: number | null
  note: string
}

// ── ユーザープロフィール ──
export interface UserProfile {
  name: string
  onboardingDone: boolean
  createdAt: number
}

// ── 設定 ──
export interface AppSettings {
  theme: 'dark' | 'light'
  defaultWaitPreset: WaitPreset
  defaultWaitHours: number
  notificationsEnabled: boolean
}

// ── アプリ状態 ──
export interface AppState {
  items: WantItem[]
  userProfile: UserProfile
  settings: AppSettings
}

// ── ラベル ──
export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  fashion: 'ファッション',
  electronics: '家電・ガジェット',
  food: '食べ物・飲み物',
  entertainment: '娯楽・エンタメ',
  hobby: '趣味',
  beauty: '美容・コスメ',
  daily: '日用品',
  other: 'その他',
}

export const SOURCE_LABELS: Record<ItemSource, string> = {
  sns: 'SNS',
  store: '店頭',
  online_shop: 'ネット通販',
  ad: '広告',
  friend: '友人・口コミ',
  other: 'その他',
}

export const WAIT_PRESET_LABELS: Record<WaitPreset, string> = {
  '24h': '24時間',
  '48h': '48時間',
  '72h': '3日間',
  '1week': '1週間',
  '2weeks': '2週間',
  custom: 'カスタム',
}

export const CATEGORY_EMOJI: Record<ItemCategory, string> = {
  fashion: '👗',
  electronics: '📱',
  food: '🍽️',
  entertainment: '🎮',
  hobby: '🎨',
  beauty: '💄',
  daily: '🏠',
  other: '📦',
}

export function getWaitHours(preset: WaitPreset, customHours: number): number {
  switch (preset) {
    case '24h': return 24
    case '48h': return 48
    case '72h': return 72
    case '1week': return 168
    case '2weeks': return 336
    case 'custom': return customHours
  }
}
