import { useAppStore } from '../store'
import { calcRecipe, calcInsights } from '../utils/analysis'
import { Card } from '../components/Card'
import { LOCATION_LABELS, NOISE_LABELS } from '../types'
import { Sparkles, Clock, MapPin, Volume2, AlertTriangle, CheckCircle2, Shield } from 'lucide-react'

export function Recipe() {
  const sessions = useAppStore((s) => s.sessions)
  const recipe = calcRecipe(sessions)
  const insights = calcInsights(sessions)

  const confidenceLabel = {
    hypothesis: '仮説（3〜13セッション）',
    emerging: '育成中（14〜29セッション）',
    established: '確立（30セッション以上）',
  }[recipe.confidence]

  const confidenceColor = {
    hypothesis: '#64748b',
    emerging: '#f59e0b',
    established: '#34d399',
  }[recipe.confidence]

  if (sessions.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', color: '#475569', gap: 16 }}>
        <Sparkles size={52} style={{ opacity: 0.25 }} />
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>集中レシピ</p>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            セッションを重ねると<br />
            あなただけの集中レシピが<br />
            ここに生まれます
          </p>
        </div>
        <div style={{ background: '#1e293b', borderRadius: 14, padding: 16, border: '1px solid #334155', width: '100%', textAlign: 'left' }}>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }}>成長ロードマップ</p>
          {[
            { n: 3, label: 'データ分析開始', done: false },
            { n: 7, label: '初回仮説が生まれる', done: false },
            { n: 14, label: '傾向が見え始める', done: false },
            { n: 30, label: '集中レシピ確立', done: false },
          ].map((item) => (
            <div key={item.n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid #1e293b' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#475569', flexShrink: 0 }}>
                {item.n}
              </div>
              <span style={{ color: '#475569', fontSize: 13 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="scrollable" style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>あなたの集中レシピ</h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: `rgba(${confidenceColor === '#34d399' ? '52,211,153' : confidenceColor === '#f59e0b' ? '245,158,11' : '100,116,139'},0.1)`, border: `1px solid ${confidenceColor}30` }}>
          <Shield size={12} style={{ color: confidenceColor }} />
          <span style={{ color: confidenceColor, fontSize: 12 }}>{confidenceLabel}</span>
        </div>
      </div>

      {/* Best conditions */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(99,102,241,0.1))', border: '1px solid rgba(56,189,248,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Sparkles size={16} style={{ color: '#f59e0b' }} />
          <span style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 700 }}>集中しやすい条件</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recipe.timeOfDay && (
            <RecipeItem icon={<Clock size={16} />} label="時間帯" value={recipe.timeOfDay} color="#38bdf8" />
          )}
          {recipe.location && (
            <RecipeItem icon={<MapPin size={16} />} label="場所" value={LOCATION_LABELS[recipe.location]} color="#a78bfa" />
          )}
          {recipe.noiseLevel && (
            <RecipeItem icon={<Volume2 size={16} />} label="音環境" value={NOISE_LABELS[recipe.noiseLevel]} color="#34d399" />
          )}
          {!recipe.timeOfDay && !recipe.location && !recipe.noiseLevel && (
            <p style={{ color: '#475569', fontSize: 13 }}>まだデータが足りません。{Math.max(0, 7 - recipe.sessionCount)}セッション後に仮説が生まれます。</p>
          )}
        </div>
      </Card>

      {/* Best combination */}
      {recipe.bestCombination && (recipe.bestCombination.location || recipe.bestCombination.noiseLevel) && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <CheckCircle2 size={16} style={{ color: '#34d399' }} />
            <span style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>ベスト組み合わせ</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {recipe.bestCombination.location && (
              <span style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(52,211,153,0.15)', color: '#34d399', fontSize: 13, border: '1px solid rgba(52,211,153,0.2)' }}>
                {LOCATION_LABELS[recipe.bestCombination.location]}
              </span>
            )}
            {recipe.bestCombination.noiseLevel && (
              <span style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(52,211,153,0.15)', color: '#34d399', fontSize: 13, border: '1px solid rgba(52,211,153,0.2)' }}>
                {NOISE_LABELS[recipe.bestCombination.noiseLevel]}
              </span>
            )}
            {recipe.timeOfDay && (
              <span style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(52,211,153,0.15)', color: '#34d399', fontSize: 13, border: '1px solid rgba(52,211,153,0.2)' }}>
                {recipe.timeOfDay}
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Avoid conditions */}
      {recipe.avoidConditions.length > 0 && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={16} style={{ color: '#f87171' }} />
            <span style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>崩れやすい条件</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recipe.avoidConditions.map((c, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.06)', color: '#fca5a5', fontSize: 13, border: '1px solid rgba(239,68,68,0.12)' }}>
                {c}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Progress to next level */}
      <Card>
        <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>レシピの育ち具合</p>
        <div style={{ position: 'relative', height: 8, background: '#0f172a', borderRadius: 4, overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              borderRadius: 4,
              background: recipe.confidence === 'established' ? '#34d399' : recipe.confidence === 'emerging' ? '#f59e0b' : '#38bdf8',
              width: `${Math.min((recipe.sessionCount / 30) * 100, 100)}%`,
              transition: 'width 0.5s',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', fontSize: 11, marginTop: 4 }}>
          <span>0</span><span>7</span><span>14</span><span>30</span>
        </div>
        <p style={{ color: '#475569', fontSize: 12, marginTop: 6 }}>
          {recipe.sessionCount} / 30 セッション
          {recipe.confidence !== 'established' && (
            <> · あと{Math.max(0, (recipe.confidence === 'emerging' ? 30 : 14) - recipe.sessionCount)}セッションで次のレベルへ</>
          )}
        </p>
      </Card>

      {/* Overall stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Card style={{ textAlign: 'center', padding: '14px 10px' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#38bdf8' }}>{insights.streak}</div>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>連続日数</div>
        </Card>
        <Card style={{ textAlign: 'center', padding: '14px 10px' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#a78bfa' }}>
            {insights.avgFocusScore > 0 ? insights.avgFocusScore.toFixed(1) : '—'}
          </div>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>平均集中度</div>
        </Card>
      </div>
    </div>
  )
}

function RecipeItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ color, width: 32, display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <div>
        <div style={{ color: '#64748b', fontSize: 11 }}>{label}</div>
        <div style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  )
}
