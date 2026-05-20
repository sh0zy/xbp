import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { ScoreStars } from '../components/ScoreStars'
import type { FocusScore } from '../types'
import { CheckCircle } from 'lucide-react'

export function SessionReview() {
  const navigate = useNavigate()
  const activeSession = useAppStore((s) => s.activeSession)
  const endSession = useAppStore((s) => s.endSession)

  const [focusScore, setFocusScore] = useState<FocusScore>(3)
  const [phoneDistractionScore, setPhoneDistractionScore] = useState(1)
  const [interrupted, setInterrupted] = useState(false)
  const [completedAsPlanned, setCompletedAsPlanned] = useState(true)
  const [note, setNote] = useState('')
  const [repeatWanted, setRepeatWanted] = useState(true)

  if (!activeSession) {
    navigate('/', { replace: true })
    return null
  }

  function handleSubmit() {
    endSession({
      focusScore,
      phoneDistractionScore,
      interrupted,
      completedAsPlanned,
      note,
      repeatWanted,
    })
    navigate('/', { replace: true })
  }

  const elapsed = Math.round((Date.now() - activeSession.startedAt) / 60000)

  return (
    <div className="scrollable" style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>セッション振り返り</h2>
        <p style={{ color: '#64748b', fontSize: 13 }}>実際: {elapsed}分 / 予定: {activeSession.plannedDuration}分</p>
      </div>

      {/* Focus score */}
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 16, border: '1px solid #334155' }}>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 12 }}>集中度は？</p>
        <ScoreStars value={focusScore} onChange={(v) => setFocusScore(v as FocusScore)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 11, marginTop: 6 }}>
          <span>全然</span><span>まずまず</span><span>最高</span>
        </div>
      </div>

      {/* Phone distraction */}
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 16, border: '1px solid #334155' }}>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 12 }}>スマホを触った回数は？</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setPhoneDistractionScore(n)}
              style={{
                padding: '10px 16px',
                borderRadius: 12,
                border: `1.5px solid ${phoneDistractionScore === n ? '#f59e0b' : '#334155'}`,
                background: phoneDistractionScore === n ? 'rgba(245,158,11,0.15)' : 'transparent',
                color: phoneDistractionScore === n ? '#f59e0b' : '#64748b',
                fontWeight: phoneDistractionScore === n ? 700 : 400,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              {n === 0 ? '0' : n === 5 ? '5+' : n}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => setInterrupted(!interrupted)}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: 12,
            border: `1.5px solid ${interrupted ? '#ef4444' : '#334155'}`,
            background: interrupted ? 'rgba(239,68,68,0.1)' : 'transparent',
            color: interrupted ? '#ef4444' : '#64748b',
            fontSize: 13,
            cursor: 'pointer',
            fontWeight: interrupted ? 600 : 400,
          }}
        >
          {interrupted ? '⚠ 中断あり' : '中断なし'}
        </button>
        <button
          onClick={() => setCompletedAsPlanned(!completedAsPlanned)}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: 12,
            border: `1.5px solid ${completedAsPlanned ? '#34d399' : '#334155'}`,
            background: completedAsPlanned ? 'rgba(52,211,153,0.1)' : 'transparent',
            color: completedAsPlanned ? '#34d399' : '#64748b',
            fontSize: 13,
            cursor: 'pointer',
            fontWeight: completedAsPlanned ? 600 : 400,
          }}
        >
          {completedAsPlanned ? '✓ 予定達成' : '未達成'}
        </button>
      </div>

      {/* Repeat wanted */}
      <button
        onClick={() => setRepeatWanted(!repeatWanted)}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: 12,
          border: `1.5px solid ${repeatWanted ? '#a78bfa' : '#334155'}`,
          background: repeatWanted ? 'rgba(167,139,250,0.1)' : 'transparent',
          color: repeatWanted ? '#a78bfa' : '#64748b',
          fontSize: 14,
          cursor: 'pointer',
          fontWeight: repeatWanted ? 600 : 400,
        }}
      >
        {repeatWanted ? '★ 次回もこの条件でやりたい' : '次回は条件を変えてみたい'}
      </button>

      {/* Note */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="ひとことメモ（任意）"
        rows={3}
        style={{
          padding: '12px 14px',
          borderRadius: 12,
          background: '#1e293b',
          border: '1px solid #334155',
          color: '#f1f5f9',
          fontSize: 14,
          resize: 'none',
          outline: 'none',
          fontFamily: 'inherit',
        }}
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 16,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <CheckCircle size={18} />
        記録して完了
      </button>
    </div>
  )
}
