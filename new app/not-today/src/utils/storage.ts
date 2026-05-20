import type { AppState, WantItem } from '../types'

const STORAGE_KEY = 'not_today_data'

const defaultState: AppState = {
  items: [],
  userProfile: {
    name: '',
    onboardingDone: false,
    createdAt: Date.now(),
  },
  settings: {
    theme: 'dark',
    defaultWaitPreset: '48h',
    defaultWaitHours: 48,
    notificationsEnabled: false,
  },
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState, userProfile: { ...defaultState.userProfile, createdAt: Date.now() } }
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      items: parsed.items ?? [],
      userProfile: { ...defaultState.userProfile, ...parsed.userProfile },
      settings: { ...defaultState.settings, ...parsed.settings },
    }
  } catch {
    return { ...defaultState }
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function generateSampleItems(): WantItem[] {
  const now = Date.now()
  const h = 3600000
  return [
    {
      id: generateId(),
      name: 'ワイヤレスイヤホン',
      price: 15000,
      category: 'electronics',
      reason: '通勤中に音楽を聴きたい',
      source: 'ad',
      imageUrl: '',
      addedAt: now - 72 * h,
      waitUntil: now - 24 * h,
      decision: 'resisted',
      decidedAt: now - 20 * h,
      note: '手持ちのイヤホンがまだ使える',
    },
    {
      id: generateId(),
      name: 'デザイナーTシャツ',
      price: 8500,
      category: 'fashion',
      reason: 'SNSで見てかっこいいと思った',
      source: 'sns',
      imageUrl: '',
      addedAt: now - 48 * h,
      waitUntil: now + 24 * h,
      decision: 'waiting',
      decidedAt: null,
      note: '',
    },
    {
      id: generateId(),
      name: 'スイッチの新作ゲーム',
      price: 6980,
      category: 'entertainment',
      reason: '友達が面白いと言っていた',
      source: 'friend',
      imageUrl: '',
      addedAt: now - 96 * h,
      waitUntil: now - 48 * h,
      decision: 'bought',
      decidedAt: now - 40 * h,
      note: 'よく考えたけどやっぱり欲しかった',
    },
    {
      id: generateId(),
      name: '高級チョコレート詰め合わせ',
      price: 3200,
      category: 'food',
      reason: 'バレンタインの自分へのご褒美',
      source: 'store',
      imageUrl: '',
      addedAt: now - 120 * h,
      waitUntil: now - 72 * h,
      decision: 'resisted',
      decidedAt: now - 70 * h,
      note: '冷静になったら要らなかった',
    },
    {
      id: generateId(),
      name: 'スマートウォッチ',
      price: 35000,
      category: 'electronics',
      reason: '健康管理に使えそう',
      source: 'online_shop',
      imageUrl: '',
      addedAt: now - 10 * h,
      waitUntil: now + 38 * h,
      decision: 'waiting',
      decidedAt: null,
      note: '',
    },
  ]
}
