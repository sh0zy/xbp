import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import type { ItemCategory, ItemSource } from '../types'
import { CATEGORY_LABELS, CATEGORY_EMOJI, SOURCE_LABELS } from '../types'
import { Card } from '../components/Card'
import { ArrowLeft, Check } from 'lucide-react'

const categories: ItemCategory[] = ['fashion', 'electronics', 'food', 'entertainment', 'hobby', 'beauty', 'daily', 'other']
const sources: ItemSource[] = ['sns', 'store', 'online_shop', 'ad', 'friend', 'other']

export function AddItem() {
  const navigate = useNavigate()
  const addItem = useAppStore((s) => s.addItem)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<ItemCategory>('other')
  const [reason, setReason] = useState('')
  const [source, setSource] = useState<ItemSource>('other')
  const [step, setStep] = useState(0)

  const canSubmit = name.trim() && Number(price) > 0

  function handleSubmit() {
    if (!canSubmit) return
    addItem({
      name: name.trim(),
      price: Number(price),
      category,
      reason: reason.trim(),
      source,
    })
    navigate('/')
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    background: '#0f172a',
    border: '1px solid #334155',
    color: '#f1f5f9',
    fontSize: 16,
    outline: 'none',
  } as const

  const chipStyle = (active: boolean) => ({
    padding: '10px 16px',
    borderRadius: 20,
    background: active ? 'rgba(56,189,248,0.15)' : '#0f172a',
    color: active ? '#38bdf8' : '#64748b',
    border: `1px solid ${active ? 'rgba(56,189,248,0.3)' : '#334155'}`,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
  } as const)

  return (
    <div className="scrollable" style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={22} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>欲しいものを登録</h2>
      </div>

      {/* Step 0: Name + Price */}
      {step === 0 && (
        <>
          <Card>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>何が欲しい？</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: ワイヤレスイヤホン"
              style={inputStyle}
              autoFocus
            />
          </Card>
          <Card>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>いくら？</p>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 16 }}>¥</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                style={{ ...inputStyle, paddingLeft: 32 }}
              />
            </div>
          </Card>
          <button
            onClick={() => setStep(1)}
            disabled={!canSubmit}
            style={{
              padding: '16px', borderRadius: 14,
              background: canSubmit ? '#0284c7' : '#1e293b',
              color: canSubmit ? '#fff' : '#475569',
              fontSize: 16, fontWeight: 600, border: 'none', cursor: canSubmit ? 'pointer' : 'default',
            }}
          >
            次へ
          </button>
        </>
      )}

      {/* Step 1: Category + Source + Reason */}
      {step === 1 && (
        <>
          <Card>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>カテゴリ</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)} style={chipStyle(category === cat)}>
                  {CATEGORY_EMOJI[cat]} {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>どこで見つけた？</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sources.map((src) => (
                <button key={src} onClick={() => setSource(src)} style={chipStyle(source === src)}>
                  {SOURCE_LABELS[src]}
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>欲しい理由（任意）</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="なぜ欲しいと思った？"
              rows={3}
              style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
            />
          </Card>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setStep(0)}
              style={{
                flex: 1, padding: '16px', borderRadius: 14,
                background: '#0f172a', color: '#94a3b8', fontSize: 16, border: '1px solid #334155', cursor: 'pointer',
              }}
            >
              戻る
            </button>
            <button
              onClick={handleSubmit}
              style={{
                flex: 2, padding: '16px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#0284c7', color: '#fff', fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer',
              }}
            >
              <Check size={18} />
              待機を開始する
            </button>
          </div>
        </>
      )}
    </div>
  )
}
