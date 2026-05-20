import { useAppStore } from '../store'
import { calcBasicStats, calcCategoryBreakdown, calcRecentTrend, formatPrice } from '../utils/analysis'
import { Card } from '../components/Card'
import { BarChart2, TrendingDown, ShieldCheck, ShoppingCart } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

export function Analytics() {
  const items = useAppStore((s) => s.items)
  const stats = calcBasicStats(items)
  const categoryData = calcCategoryBreakdown(items)
  const trend7 = calcRecentTrend(items, 7)

  const tooltipProps = {
    contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: '#94a3b8' },
    itemStyle: { color: '#38bdf8' },
  }

  if (items.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', color: '#475569' }}>
        <BarChart2 size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <p style={{ fontSize: 15, lineHeight: 1.6 }}>アイテムを登録すると<br />ここに分析が表示されます</p>
      </div>
    )
  }

  return (
    <div className="scrollable" style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>分析</h2>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Card style={{ textAlign: 'center', padding: '14px 10px' }}>
          <TrendingDown size={18} style={{ color: '#34d399', margin: '0 auto 6px' }} />
          <div style={{ fontSize: 20, fontWeight: 700, color: '#34d399' }}>{formatPrice(stats.totalSaved)}</div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>買わずに済んだ金額</div>
        </Card>
        <Card style={{ textAlign: 'center', padding: '14px 10px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#38bdf8' }}>
            {Math.round(stats.resistRate * 100)}%
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>見送り率</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <Card style={{ textAlign: 'center', padding: '12px 8px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{stats.totalItems}</div>
          <div style={{ color: '#64748b', fontSize: 11 }}>合計</div>
        </Card>
        <Card style={{ textAlign: 'center', padding: '12px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <ShieldCheck size={14} style={{ color: '#34d399' }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: '#34d399' }}>{stats.resistedCount}</span>
          </div>
          <div style={{ color: '#64748b', fontSize: 11 }}>見送り</div>
        </Card>
        <Card style={{ textAlign: 'center', padding: '12px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <ShoppingCart size={14} style={{ color: '#f87171' }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: '#f87171' }}>{stats.boughtCount}</span>
          </div>
          <div style={{ color: '#64748b', fontSize: 11 }}>購入</div>
        </Card>
      </div>

      {/* 7-day trend */}
      {trend7.some((d) => d.resisted + d.bought > 0) && (
        <Card>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>直近7日の判定</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={trend7}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis hide allowDecimals={false} />
              <Tooltip {...tooltipProps} />
              <Bar dataKey="resisted" name="見送り" fill="#34d399" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="bought" name="購入" fill="#f87171" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Savings trend */}
      {trend7.some((d) => d.saved > 0) && (
        <Card>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>直近7日のセーブ金額</p>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={trend7}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip {...tooltipProps} formatter={(v) => [formatPrice(v as number), 'セーブ額']} />
              <Line type="monotone" dataKey="saved" stroke="#34d399" strokeWidth={2} dot={{ fill: '#34d399', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Category breakdown */}
      {categoryData.length > 0 && (
        <Card>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>カテゴリ別</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {categoryData.map((cat) => {
              const resistRate = cat.total > 0 ? cat.resisted / cat.total : 0
              return (
                <div key={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ color: '#e2e8f0', fontSize: 13 }}>{cat.label}</span>
                    <span style={{ color: '#64748b', fontSize: 12 }}>{cat.total}件 · {formatPrice(cat.savedAmount)}セーブ</span>
                  </div>
                  <div style={{ height: 6, background: '#0f172a', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3,
                      background: resistRate > 0.7 ? '#34d399' : resistRate > 0.4 ? '#f59e0b' : '#f87171',
                      width: `${Math.max(resistRate * 100, 4)}%`,
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
