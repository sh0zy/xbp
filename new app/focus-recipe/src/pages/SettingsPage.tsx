import { useState } from 'react'
import { useAppStore } from '../store'
import { Card } from '../components/Card'
import { Info, Trash2, Database, Package } from 'lucide-react'

export function SettingsPage() {
  const sessions = useAppStore((s) => s.sessions)
  const userProfile = useAppStore((s) => s.userProfile)
  const updateUserProfile = useAppStore((s) => s.updateUserProfile)
  const loadSampleData = useAppStore((s) => s.loadSampleData)
  const clearAllData = useAppStore((s) => s.clearAllData)

  const [name, setName] = useState(userProfile.name)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSaveName() {
    updateUserProfile({ name })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleClearData() {
    if (showClearConfirm) {
      clearAllData()
      setShowClearConfirm(false)
    } else {
      setShowClearConfirm(true)
      setTimeout(() => setShowClearConfirm(false), 5000)
    }
  }

  return (
    <div className="scrollable" style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>設定</h2>

      {/* Profile */}
      <Card>
        <p style={{ color: '#64748b', fontSize: 12, marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>プロフィール</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>ニックネーム</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: '#0f172a',
                  border: '1px solid #334155',
                  color: '#f1f5f9',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSaveName}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  background: saved ? '#34d399' : '#0284c7',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {saved ? '✓' : '保存'}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Data */}
      <Card>
        <p style={{ color: '#64748b', fontSize: 12, marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>データ</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 14 }}>
              <Database size={16} />
              記録済みセッション数
            </div>
            <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 16 }}>{sessions.length}</span>
          </div>

          <button
            onClick={() => loadSampleData()}
            style={{
              padding: '12px',
              borderRadius: 12,
              background: '#0f172a',
              color: '#38bdf8',
              fontSize: 14,
              border: '1px solid #334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Package size={16} />
            サンプルデータを追加（7セッション）
          </button>

          <button
            onClick={handleClearData}
            style={{
              padding: '12px',
              borderRadius: 12,
              background: showClearConfirm ? 'rgba(239,68,68,0.15)' : '#0f172a',
              color: showClearConfirm ? '#ef4444' : '#64748b',
              fontSize: 14,
              border: `1px solid ${showClearConfirm ? 'rgba(239,68,68,0.3)' : '#334155'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: showClearConfirm ? 600 : 400,
            }}
          >
            <Trash2 size={16} />
            {showClearConfirm ? 'もう一度タップで全データ削除' : '全データを初期化'}
          </button>
        </div>
      </Card>

      {/* Storage info */}
      <Card>
        <div style={{ display: 'flex', gap: 10 }}>
          <Info size={16} style={{ color: '#38bdf8', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>データについて</p>
            <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.6 }}>
              すべてのデータはこのデバイスのローカルストレージに保存されます。
              外部サーバーへの送信は一切行いません。
            </p>
          </div>
        </div>
      </Card>

      {/* App info */}
      <Card>
        <p style={{ color: '#64748b', fontSize: 12, marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>アプリ情報</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <InfoRow label="アプリ名" value="Focus Recipe" />
          <InfoRow label="バージョン" value="1.0.0" />
          <InfoRow label="パッケージ名" value="com.focusrecipe.app" />
        </div>
      </Card>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ color: '#64748b', fontSize: 13 }}>{label}</span>
      <span style={{ color: '#94a3b8', fontSize: 13 }}>{value}</span>
    </div>
  )
}
