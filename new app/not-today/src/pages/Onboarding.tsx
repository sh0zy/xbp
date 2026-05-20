import { useState } from 'react'
import { useAppStore } from '../store'
import { ShieldCheck, Clock, TrendingDown, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: ShieldCheck,
    title: '衝動買い、ちょっと待てる？',
    desc: '欲しいと思ったら、まず登録。\n買うかどうかは、少し待ってから。',
  },
  {
    icon: Clock,
    title: '「待つ」だけのシンプルな仕組み',
    desc: '設定した時間が過ぎたら判定タイム。\n冷静な自分が答えを出してくれます。',
  },
  {
    icon: TrendingDown,
    title: '気づいたら、賢い買い物に',
    desc: '待って買わなかった金額が見える。\n自分の買い方のクセもわかります。',
  },
]

export function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)

  if (step < steps.length) {
    const { icon: Icon, title, desc } = steps[step]
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', gap: 24 }}>
        <Icon size={56} style={{ color: '#38bdf8', opacity: 0.9 }} />
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>{title}</h2>
          <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{desc}</p>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === step ? '#38bdf8' : '#334155' }} />
          ))}
        </div>
        <button
          onClick={() => setStep(step + 1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 14, background: '#0284c7', color: '#fff',
            fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: 16,
          }}
        >
          {step === steps.length - 1 ? 'はじめる' : '次へ'}
          <ArrowRight size={18} />
        </button>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>ニックネームを教えて</h2>
      <p style={{ color: '#94a3b8', fontSize: 14 }}>あとから変更できます</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ニックネーム"
        style={{
          width: '100%', maxWidth: 280, padding: '14px 16px', borderRadius: 12,
          background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9',
          fontSize: 16, outline: 'none', textAlign: 'center',
        }}
      />
      <button
        onClick={() => completeOnboarding(name || 'ユーザー')}
        disabled={!name.trim()}
        style={{
          padding: '14px 40px', borderRadius: 14,
          background: name.trim() ? '#0284c7' : '#1e293b',
          color: name.trim() ? '#fff' : '#475569',
          fontSize: 16, fontWeight: 600, border: 'none', cursor: name.trim() ? 'pointer' : 'default',
        }}
      >
        Not Today をはじめる
      </button>
    </div>
  )
}
