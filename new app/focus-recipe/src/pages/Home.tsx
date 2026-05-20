import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { calcInsights, getRecentTrend } from '../utils/analysis'
import { Card } from '../components/Card'
import { ScoreStars } from '../components/ScoreStars'
import { LOCATION_LABELS, NOISE_LABELS } from '../types'
import { Play, Flame, TrendingUp, Sparkles } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function Home() {
  const navigate = useNavigate()
  const sessions = useAppStore((s) => s.sessions)
  const userProfile = useAppStore((s) => s.userProfile)
  const activeSession = useAppStore((s) => s.activeSession)

  const insights = calcInsights(sessions)
  const trend = getRecentTrend(sessions, 7)
  const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 5) return 'おつかれさまです'
    if (h < 12) return 'おはようございます'
    if (h < 18) return 'こんにちは'
    return 'こんばんは'
  })()

  const displayName = userProfile.name || ''

  if (activeSession) {
    return (
      <div className="scrollable" style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#38bdf8', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>セッション進行中</span>
          </div>
          <button
            onClick={() => navigate('/session')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              background: '#38bdf8',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            セッションに戻る
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="scrollable" style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
      {/* Header */}
      <div>
        <p style={{ color: '#64748b', fontSize: 13 }}>{greeting}{displayName ? `、${displayName}` : ''}</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginTop: 2 }}>
          Focus Recipe
        </h1>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <Card style={{ textAlign: 'center', padding: '12px 8px' }}>
          <div style={{ color: '#f59e0b', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Flame size={16} />
            {insights.streak}
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>連続日数</div>
        </Card>
        <Card style={{ textAlign: 'center', padding: '12px 8px' }}>
          <div style={{ color: '#38bdf8', fontSize: 20, fontWeight: 700 }}>{insights.totalSessions}</div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>合計</div>
        </Card>
        <Card style={{ textAlign: 'center', padding: '12px 8px' }}>
          <div style={{ color: '#34d399', fontSize: 20, fontWeight: 700 }}>
            {insights.avgFocusScore > 0 ? insights.avgFocusScore.toFixed(1) : '—'}
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>平均集中度</div>
        </Card>
      </div>

      {/* Start session CTA */}
      <button
        onClick={() => navigate('/session/setup')}
        style={{
          width: '100%',
          padding: '18px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 17,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: '0 4px 20px rgba(14,165,233,0.3)',
        }}
      >
        <Play size={20} fill="white" />
        セッションを始める
      </button>

      {/* Recipe hint */}
      {insights.bestLocation && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Sparkles size={16} style={{ color: '#f59e0b' }} />
            <span style={{ color: '#f59e0b', fontSize: 13, fontWeight: 600 }}>おすすめ条件</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {insights.bestTimeOfDay && (
              <span style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(56,189,248,0.1)', color: '#38bdf8', fontSize: 12, border: '1px solid rgba(56,189,248,0.2)' }}>
                {insights.bestTimeOfDay}
              </span>
            )}
            {insights.bestLocation && (
              <span style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(167,139,250,0.1)', color: '#a78bfa', fontSize: 12, border: '1px solid rgba(167,139,250,0.2)' }}>
                {LOCATION_LABELS[insights.bestLocation]}
              </span>
            )}
            {insights.bestNoiseLevel && (
              <span style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(52,211,153,0.1)', color: '#34d399', fontSize: 12, border: '1px solid rgba(52,211,153,0.2)' }}>
                {NOISE_LABELS[insights.bestNoiseLevel]}
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Trend chart */}
      {sessions.length >= 3 && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TrendingUp size={16} style={{ color: '#38bdf8' }} />
            <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>直近7日の集中度</span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={trend}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} hide />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#38bdf8' }}
                formatter={(v) => [(v as number) > 0 ? v : '—', '集中度']}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ fill: '#38bdf8', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Last session */}
      {lastSession && (
        <Card>
          <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>前回のセッション</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                {LOCATION_LABELS[lastSession.location]}
              </div>
              <div style={{ color: '#64748b', fontSize: 12 }}>
                {lastSession.actualDuration}分 ·{' '}
                {new Date(lastSession.startedAt).toLocaleDateString('ja', { month: 'numeric', day: 'numeric' })}
              </div>
            </div>
            {lastSession.focusScore !== null && (
              <ScoreStars value={lastSession.focusScore} size={18} />
            )}
          </div>
        </Card>
      )}

      {/* Empty state */}
      {sessions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#475569' }}>
          <Sparkles size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            最初のセッションを記録して<br />集中レシピを育てましょう
          </p>
        </div>
      )}
    </div>
  )
}
