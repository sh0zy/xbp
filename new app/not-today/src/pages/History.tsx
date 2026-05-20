import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Card } from '../components/Card'
import { formatPrice } from '../utils/analysis'
import { CATEGORY_EMOJI, CATEGORY_LABELS } from '../types'
import type { ItemDecision } from '../types'
import { Clock, ShieldCheck, ShoppingCart } from 'lucide-react'

type FilterTab = 'all' | 'resisted' | 'bought' | 'waiting'

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'waiting', label: '待機中' },
  { key: 'resisted', label: '見送り' },
  { key: 'bought', label: '購入済み' },
]

const decisionIcon: Record<ItemDecision, { icon: typeof ShieldCheck; color: string }> = {
  waiting: { icon: Clock, color: '#38bdf8' },
  resisted: { icon: ShieldCheck, color: '#34d399' },
  bought: { icon: ShoppingCart, color: '#f87171' },
}

export function History() {
  const items = useAppStore((s) => s.items)
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterTab>('all')

  const filtered = filter === 'all' ? items : items.filter((i) => i.decision === filter)
  const sorted = [...filtered].sort((a, b) => b.addedAt - a.addedAt)

  return (
    <div className="scrollable" style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>履歴</h2>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '8px 16px', borderRadius: 20, whiteSpace: 'nowrap',
              background: filter === tab.key ? 'rgba(56,189,248,0.15)' : '#0f172a',
              color: filter === tab.key ? '#38bdf8' : '#64748b',
              border: `1px solid ${filter === tab.key ? 'rgba(56,189,248,0.3)' : '#334155'}`,
              fontSize: 13, fontWeight: filter === tab.key ? 600 : 400, cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={{ color: '#64748b', fontSize: 12 }}>{sorted.length}件</p>

      {/* Items */}
      {sorted.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 32 }}>
          <p style={{ color: '#475569', fontSize: 14 }}>まだ履歴がありません</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map((item) => {
            const { icon: StatusIcon, color } = decisionIcon[item.decision]
            const date = new Date(item.addedAt)
            return (
              <Card key={item.id} onClick={() => navigate(`/item/${item.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{CATEGORY_EMOJI[item.category]}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
                      {CATEGORY_LABELS[item.category]} · {date.getMonth() + 1}/{date.getDate()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>{formatPrice(item.price)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
                      <StatusIcon size={12} style={{ color }} />
                      <span style={{ color, fontSize: 11 }}>
                        {item.decision === 'waiting' ? '待機中' : item.decision === 'resisted' ? '見送り' : '購入'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
