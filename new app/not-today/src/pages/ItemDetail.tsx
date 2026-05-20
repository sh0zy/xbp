import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Card } from '../components/Card'
import { formatPrice, getRemainingTime, isWaitComplete } from '../utils/analysis'
import { CATEGORY_LABELS, CATEGORY_EMOJI, SOURCE_LABELS } from '../types'
import { ArrowLeft, ShieldCheck, ShoppingCart, Trash2 } from 'lucide-react'
import { useState } from 'react'

export function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const items = useAppStore((s) => s.items)
  const decideItem = useAppStore((s) => s.decideItem)
  const deleteItem = useAppStore((s) => s.deleteItem)
  const [showDelete, setShowDelete] = useState(false)

  const item = items.find((i) => i.id === id)
  if (!item) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
        アイテムが見つかりません
      </div>
    )
  }

  const ready = isWaitComplete(item)
  const isWaiting = item.decision === 'waiting'
  const addedDate = new Date(item.addedAt)

  function handleResist() {
    if (!item) return
    decideItem(item.id, 'resisted')
    navigate('/')
  }

  function handleBuy() {
    if (!item) return
    decideItem(item.id, 'bought')
    navigate('/')
  }

  function handleDelete() {
    if (!item) return
    if (showDelete) {
      deleteItem(item.id)
      navigate('/')
    } else {
      setShowDelete(true)
      setTimeout(() => setShowDelete(false), 5000)
    }
  }

  const decisionBadge = {
    waiting: { label: ready ? '判定可能' : '待機中', color: ready ? '#f59e0b' : '#38bdf8' },
    resisted: { label: '見送り', color: '#34d399' },
    bought: { label: '購入済み', color: '#f87171' },
  }[item.decision]

  return (
    <div className="scrollable" style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={22} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', flex: 1 }}>アイテム詳細</h2>
        <span style={{
          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
          color: decisionBadge.color,
          background: `${decisionBadge.color}18`,
          border: `1px solid ${decisionBadge.color}30`,
        }}>
          {decisionBadge.label}
        </span>
      </div>

      {/* Main info */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(99,102,241,0.08))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 32 }}>{CATEGORY_EMOJI[item.category]}</span>
          <div>
            <div style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700 }}>{item.name}</div>
            <div style={{ color: '#38bdf8', fontSize: 20, fontWeight: 700, marginTop: 4 }}>{formatPrice(item.price)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <InfoChip label={CATEGORY_LABELS[item.category]} />
          <InfoChip label={SOURCE_LABELS[item.source]} />
          <InfoChip label={`${addedDate.getMonth() + 1}/${addedDate.getDate()} 登録`} />
        </div>
      </Card>

      {/* Timer / Status */}
      {isWaiting && (
        <Card style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>
            {ready ? '待機完了' : '待機時間'}
          </p>
          <p style={{ color: ready ? '#f59e0b' : '#38bdf8', fontSize: 24, fontWeight: 700 }}>
            {getRemainingTime(item.waitUntil)}
          </p>
          {!ready && (
            <p style={{ color: '#475569', fontSize: 12, marginTop: 8 }}>
              {new Date(item.waitUntil).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} に判定可能
            </p>
          )}
        </Card>
      )}

      {/* Reason */}
      {item.reason && (
        <Card>
          <p style={{ color: '#64748b', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>欲しい理由</p>
          <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.7 }}>{item.reason}</p>
        </Card>
      )}

      {/* Note */}
      {item.note && (
        <Card>
          <p style={{ color: '#64748b', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>メモ</p>
          <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.7 }}>{item.note}</p>
        </Card>
      )}

      {/* Decision buttons */}
      {isWaiting && ready && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <p style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 600, textAlign: 'center' }}>
            まだ欲しい？
          </p>
          <button
            onClick={handleResist}
            style={{
              padding: '16px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.1))',
              color: '#34d399', fontSize: 16, fontWeight: 700,
              border: '1px solid rgba(52,211,153,0.3)', cursor: 'pointer',
            }}
          >
            <ShieldCheck size={20} />
            Not Today — 今は要らない
          </button>
          <button
            onClick={handleBuy}
            style={{
              padding: '16px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: '#0f172a', color: '#94a3b8', fontSize: 15,
              border: '1px solid #334155', cursor: 'pointer',
            }}
          >
            <ShoppingCart size={18} />
            やっぱり買う
          </button>
        </div>
      )}

      {/* Delete */}
      <button
        onClick={handleDelete}
        style={{
          padding: '12px', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: showDelete ? 'rgba(239,68,68,0.15)' : 'transparent',
          color: showDelete ? '#ef4444' : '#475569', fontSize: 13,
          border: `1px solid ${showDelete ? 'rgba(239,68,68,0.3)' : '#1e293b'}`, cursor: 'pointer',
          marginTop: 8,
        }}
      >
        <Trash2 size={14} />
        {showDelete ? 'もう一度タップで削除' : 'このアイテムを削除'}
      </button>
    </div>
  )
}

function InfoChip({ label }: { label: string }) {
  return (
    <span style={{
      padding: '4px 12px', borderRadius: 20, background: '#0f172a',
      color: '#94a3b8', fontSize: 12, border: '1px solid #334155',
    }}>
      {label}
    </span>
  )
}
