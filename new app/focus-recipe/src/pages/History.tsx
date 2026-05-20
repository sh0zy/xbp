import { useState } from 'react'
import { useAppStore } from '../store'
import { ScoreStars } from '../components/ScoreStars'
import { Card } from '../components/Card'
import type { FocusSession, TaskType } from '../types'
import { TASK_TYPE_LABELS, LOCATION_LABELS, NOISE_LABELS } from '../types'
import { Clock, MapPin, Volume2, Star } from 'lucide-react'

function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString('ja', { month: 'numeric', day: 'numeric', weekday: 'short' })
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString('ja', { hour: '2-digit', minute: '2-digit' })
}

export function History() {
  const sessions = useAppStore((s) => s.sessions)
  const [filter, setFilter] = useState<TaskType | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const sorted = [...sessions].sort((a, b) => b.startedAt - a.startedAt)
  const filtered = filter === 'all' ? sorted : sorted.filter((s) => s.taskType === filter)

  const filterOptions: { value: TaskType | 'all'; label: string }[] = [
    { value: 'all', label: 'すべて' },
    ...Object.entries(TASK_TYPE_LABELS).map(([k, v]) => ({ value: k as TaskType, label: v })),
  ]

  const selected = selectedId ? sessions.find((s) => s.id === selectedId) ?? null : null

  if (selected) {
    return (
      <div className="scrollable" style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textAlign: 'left', fontSize: 14, padding: 0 }}>
          ← 一覧に戻る
        </button>

        <div>
          <p style={{ color: '#64748b', fontSize: 12 }}>{formatDate(selected.startedAt)} {formatTime(selected.startedAt)}</p>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginTop: 4 }}>
            {TASK_TYPE_LABELS[selected.taskType]}
          </h2>
        </div>

        {selected.focusScore !== null && (
          <Card>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>集中度</p>
            <ScoreStars value={selected.focusScore} size={24} />
          </Card>
        )}

        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Row label="場所" value={LOCATION_LABELS[selected.location]} icon={<MapPin size={14} />} />
            <Row label="音環境" value={NOISE_LABELS[selected.noiseLevel]} icon={<Volume2 size={14} />} />
            <Row label="時間" value={`${selected.actualDuration ?? selected.plannedDuration}分`} icon={<Clock size={14} />} />
            {selected.interrupted !== null && (
              <Row label="中断" value={selected.interrupted ? 'あり' : 'なし'} />
            )}
            {selected.completedAsPlanned !== null && (
              <Row label="予定達成" value={selected.completedAsPlanned ? '達成' : '未達成'} />
            )}
            {selected.repeatWanted !== null && (
              <Row label="再現したい" value={selected.repeatWanted ? 'はい' : 'いいえ'} />
            )}
          </div>
        </Card>

        {selected.note && (
          <Card>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>メモ</p>
            <p style={{ color: '#f1f5f9', fontSize: 14, lineHeight: 1.6 }}>{selected.note}</p>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>履歴</h2>
        <div style={{ overflowX: 'auto', display: 'flex', gap: 8, paddingBottom: 12 }}>
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: `1px solid ${filter === opt.value ? '#38bdf8' : '#334155'}`,
                background: filter === opt.value ? 'rgba(56,189,248,0.1)' : 'transparent',
                color: filter === opt.value ? '#38bdf8' : '#64748b',
                fontSize: 12,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontWeight: filter === opt.value ? 600 : 400,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="scrollable" style={{ flex: 1, padding: '0 16px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#475569' }}>
            <Clock size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontSize: 14 }}>まだ記録がありません</p>
          </div>
        ) : (
          filtered.map((session) => (
            <SessionCard key={session.id} session={session} onClick={() => setSelectedId(session.id)} />
          ))
        )}
      </div>
    </div>
  )
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13 }}>
        {icon}
        {label}
      </div>
      <span style={{ color: '#f1f5f9', fontSize: 13 }}>{value}</span>
    </div>
  )
}

function SessionCard({ session, onClick }: { session: FocusSession; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#1e293b',
        borderRadius: 14,
        padding: '14px',
        border: '1px solid #334155',
        cursor: 'pointer',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {session.taskType === 'study' ? '📚' :
         session.taskType === 'work' ? '💼' :
         session.taskType === 'reading' ? '📖' :
         session.taskType === 'coding' ? '💻' :
         session.taskType === 'writing' ? '✏️' :
         session.taskType === 'creative' ? '🎨' : '📌'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <span style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>
            {LOCATION_LABELS[session.location]}
          </span>
          <span style={{ color: '#475569', fontSize: 11 }}>
            {formatDate(session.startedAt)}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: '#64748b', fontSize: 12 }}>{session.actualDuration ?? session.plannedDuration}分</span>
          <span style={{ color: '#334155' }}>·</span>
          <span style={{ color: '#64748b', fontSize: 12 }}>{TASK_TYPE_LABELS[session.taskType]}</span>
          {session.focusScore !== null && (
            <>
              <span style={{ color: '#334155' }}>·</span>
              <span style={{ color: '#f59e0b', fontSize: 12, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Star size={11} fill="#f59e0b" />
                {session.focusScore}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
