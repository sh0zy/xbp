import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { calcBasicStats, formatPrice, getRemainingTime, isWaitComplete } from '../utils/analysis'
import { Card } from '../components/Card'
import { CATEGORY_EMOJI } from '../types'
import { Plus, ShieldCheck, Flame, TrendingDown } from 'lucide-react'

export function Home() {
  const items = useAppStore((s) => s.items)
  const userProfile = useAppStore((s) => s.userProfile)
  const navigate = useNavigate()
  const stats = calcBasicStats(items)

  const waitingItems = items
    .filter((i) => i.decision === 'waiting')
    .sort((a, b) => a.waitUntil - b.waitUntil)

  const readyItems = waitingItems.filter(isWaitComplete)

  return (
    <div className="scrollable" style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Greeting */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>
          {userProfile.name}さん、今日も冷静に
        </h2>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>衝動買いを待ってみよう</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <Card style={{ textAlign: 'center', padding: '14px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <TrendingDown size={16} style={{ color: '#34d399' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#34d399' }}>
            {formatPrice(stats.totalSaved)}
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>セーブ済み</div>
        </Card>
        <Card style={{ textAlign: 'center', padding: '14px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <ShieldCheck size={16} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#38bdf8' }}>
            {stats.resistedCount}
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>見送り</div>
        </Card>
        <Card style={{ textAlign: 'center', padding: '14px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <Flame size={16} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b' }}>
            {stats.waitingCount}
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>待機中</div>
        </Card>
      </div>

      {/* Add button */}
      <button
        onClick={() => navigate('/add')}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '16px', borderRadius: 16, background: 'linear-gradient(135deg, #0284c7, #6366f1)',
          color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer',
        }}
      >
        <Plus size={20} />
        欲しいものを登録する
      </button>

      {/* Ready to judge */}
      {readyItems.length > 0 && (
        <div>
          <p style={{ color: '#f59e0b', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
            判定できるアイテムがあります
          </p>
          {readyItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => navigate(`/item/${item.id}`)}
              style={{ marginBottom: 8, border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{CATEGORY_EMOJI[item.category]}</span>
                  <div>
                    <div style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{formatPrice(item.price)}</div>
                  </div>
                </div>
                <span style={{ color: '#f59e0b', fontSize: 12, fontWeight: 600 }}>判定可能</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Waiting items */}
      {waitingItems.filter((i) => !isWaitComplete(i)).length > 0 && (
        <div>
          <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>待機中</p>
          {waitingItems.filter((i) => !isWaitComplete(i)).map((item) => (
            <Card
              key={item.id}
              onClick={() => navigate(`/item/${item.id}`)}
              style={{ marginBottom: 8 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{CATEGORY_EMOJI[item.category]}</span>
                  <div>
                    <div style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{formatPrice(item.price)}</div>
                  </div>
                </div>
                <span style={{ color: '#64748b', fontSize: 12 }}>{getRemainingTime(item.waitUntil)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 32 }}>
          <ShieldCheck size={40} style={{ color: '#334155', margin: '0 auto 12px' }} />
          <p style={{ color: '#64748b', fontSize: 14 }}>
            欲しいものが出てきたら<br />ここに登録してみよう
          </p>
        </Card>
      )}
    </div>
  )
}
