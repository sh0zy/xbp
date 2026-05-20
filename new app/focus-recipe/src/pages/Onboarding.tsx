import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Sparkles, Target, Brain, BarChart2, ChevronRight } from 'lucide-react'

const steps = [
  {
    icon: <Brain size={48} strokeWidth={1.5} />,
    title: '頑張るアプリではありません',
    desc: '「もっと集中しなきゃ」ではなく\n「自分が集中できる条件を再現する」\nためのアプリです。',
    accent: '#38bdf8',
  },
  {
    icon: <Target size={48} strokeWidth={1.5} />,
    title: '条件を記録する',
    desc: 'セッション前に場所・音・睡眠・やる気を\n10秒でチェック。\n記録のハードルを極力下げました。',
    accent: '#a78bfa',
  },
  {
    icon: <BarChart2 size={48} strokeWidth={1.5} />,
    title: 'パターンが見えてくる',
    desc: '7セッションで仮説が生まれ、\n14セッションで傾向が見え始め、\n30セッションで集中レシピが完成します。',
    accent: '#34d399',
  },
  {
    icon: <Sparkles size={48} strokeWidth={1.5} />,
    title: '集中レシピを育てる',
    desc: 'あなただけの「集中できる条件」が\n蓄積されていきます。\n今すぐ始めましょう。',
    accent: '#f59e0b',
  },
]

export function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState(5)
  const navigate = useNavigate()
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const loadSampleData = useAppStore((s) => s.loadSampleData)

  const isLast = step === steps.length

  function handleNext() {
    if (step < steps.length) setStep(step + 1)
  }

  function handleComplete(withSample: boolean) {
    if (withSample) loadSampleData()
    completeOnboarding(name, goal)
    navigate('/', { replace: true })
  }

  if (!isLast) {
    const s = steps[step]
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          textAlign: 'center',
          gap: 24,
        }}
      >
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === step ? s.accent : '#334155',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        <div style={{ color: s.accent }}>{s.icon}</div>

        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>
            {s.title}
          </h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: 15 }}>
            {s.desc}
          </p>
        </div>

        <button
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 14,
            background: s.accent,
            color: '#0f172a',
            fontWeight: 700,
            fontSize: 16,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          次へ <ChevronRight size={18} />
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px',
        gap: 24,
        overflowY: 'auto',
      }}
      className="scrollable"
    >
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
          最初の設定
        </h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>あとから変更できます</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ color: '#94a3b8', fontSize: 13 }}>ニックネーム（任意）</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: あなたの名前"
          style={{
            padding: '14px 16px',
            borderRadius: 12,
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#f1f5f9',
            fontSize: 15,
            outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ color: '#94a3b8', fontSize: 13 }}>
          週の目標セッション数: <strong style={{ color: '#38bdf8' }}>{goal}回</strong>
        </label>
        <input
          type="range"
          min={1}
          max={14}
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#38bdf8' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 12 }}>
          <span>1回</span><span>7回</span><span>14回</span>
        </div>
      </div>

      <div
        style={{
          background: '#1e293b',
          borderRadius: 14,
          padding: 16,
          border: '1px solid #334155',
        }}
      >
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 12 }}>
          サンプルデータを使って分析画面を試してみますか？
        </p>
        <button
          onClick={() => handleComplete(true)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            background: '#0284c7',
            color: '#f0f9ff',
            fontWeight: 600,
            fontSize: 15,
            border: 'none',
            cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          サンプルデータで始める
        </button>
        <button
          onClick={() => handleComplete(false)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            background: 'transparent',
            color: '#64748b',
            fontWeight: 500,
            fontSize: 15,
            border: '1px solid #334155',
            cursor: 'pointer',
          }}
        >
          空の状態で始める
        </button>
      </div>
    </div>
  )
}
