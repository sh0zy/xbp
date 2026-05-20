import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { TASK_TYPE_LABELS, LOCATION_LABELS, NOISE_LABELS } from '../types'
import { CheckCircle, XCircle, MapPin, Volume2, Moon } from 'lucide-react'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function Session() {
  const navigate = useNavigate()
  const activeSession = useAppStore((s) => s.activeSession)
  const abandonSession = useAppStore((s) => s.abandonSession)

  const [elapsed, setElapsed] = useState(0)

  const updateElapsed = useCallback(() => {
    if (!activeSession) return
    const secs = Math.floor((Date.now() - activeSession.startedAt) / 1000)
    setElapsed(secs)
  }, [activeSession])

  useEffect(() => {
    updateElapsed()
    const id = setInterval(updateElapsed, 1000)
    return () => clearInterval(id)
  }, [updateElapsed])

  useEffect(() => {
    if (!activeSession) {
      navigate('/', { replace: true })
    }
  }, [activeSession, navigate])

  if (!activeSession) return null

  const plannedSecs = activeSession.plannedDuration * 60
  const progress = Math.min(elapsed / plannedSecs, 1)
  const remaining = Math.max(plannedSecs - elapsed, 0)
  const isOvertime = elapsed > plannedSecs

  const circumference = 2 * Math.PI * 90

  function handleComplete() {
    navigate('/session/review')
  }

  function handleAbandon() {
    if (confirm('セッションを中断しますか？\n記録は保存されません。')) {
      abandonSession()
      navigate('/', { replace: true })
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 24px',
        gap: 28,
        background: '#0f172a',
      }}
    >
      {/* Timer */}
      <div style={{ position: 'relative', width: 220, height: 220 }}>
        <svg width={220} height={220} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={110} cy={110} r={90} fill="none" stroke="#1e293b" strokeWidth={8} />
          <circle
            cx={110}
            cy={110}
            r={90}
            fill="none"
            stroke={isOvertime ? '#f59e0b' : '#38bdf8'}
            strokeWidth={8}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 700, color: '#f1f5f9', fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}>
            {isOvertime ? `+${formatTime(elapsed - plannedSecs)}` : formatTime(remaining)}
          </div>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
            {isOvertime ? '延長中' : '残り時間'}
          </div>
        </div>
      </div>

      {/* Session info */}
      <div
        style={{
          background: '#1e293b',
          borderRadius: 16,
          padding: '16px',
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13 }}>
          <span style={{ fontSize: 16 }}>📚</span>
          {TASK_TYPE_LABELS[activeSession.taskType]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13 }}>
          <MapPin size={14} />
          {LOCATION_LABELS[activeSession.location]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13 }}>
          <Volume2 size={14} />
          {NOISE_LABELS[activeSession.noiseLevel]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13 }}>
          <Moon size={14} />
          {activeSession.plannedDuration}分
        </div>
      </div>

      <p style={{ color: '#334155', fontSize: 13, textAlign: 'center', margin: 0 }}>
        集中してください。画面を閉じてもOK。
      </p>

      {/* Actions */}
      <div style={{ width: '100%', display: 'flex', gap: 12, marginTop: 'auto' }}>
        <button
          onClick={handleAbandon}
          style={{
            flex: 1,
            padding: '16px',
            borderRadius: 14,
            background: '#1e293b',
            color: '#ef4444',
            fontWeight: 600,
            fontSize: 15,
            border: '1px solid #ef444440',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <XCircle size={18} />
          中断
        </button>
        <button
          onClick={handleComplete}
          style={{
            flex: 2,
            padding: '16px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <CheckCircle size={18} />
          完了・振り返り
        </button>
      </div>
    </div>
  )
}
