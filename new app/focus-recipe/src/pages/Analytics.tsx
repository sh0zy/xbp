import { useAppStore } from '../store'
import { calcInsights, getRecentTrend } from '../utils/analysis'
import { Card } from '../components/Card'
import type { FocusSession, Location, NoiseLevel, SleepState } from '../types'
import { LOCATION_LABELS, NOISE_LABELS, SLEEP_LABELS } from '../types'
import { BarChart2, TrendingUp } from 'lucide-react'
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

function groupAvg<T extends string>(
  sessions: FocusSession[],
  keyFn: (s: FocusSession) => T,
  labelFn: (k: T) => string,
): { name: string; avg: number; count: number }[] {
  const map = new Map<T, { sum: number; count: number }>()
  for (const s of sessions) {
    if (s.focusScore === null) continue
    const key = keyFn(s)
    const entry = map.get(key) ?? { sum: 0, count: 0 }
    entry.sum += s.focusScore
    entry.count += 1
    map.set(key, entry)
  }
  return Array.from(map.entries()).map(([k, v]) => ({
    name: labelFn(k),
    avg: Math.round((v.sum / v.count) * 10) / 10,
    count: v.count,
  })).sort((a, b) => b.avg - a.avg)
}

function getHourLabel(ts: number): string {
  const h = new Date(ts).getHours()
  if (h >= 5 && h < 9) return '早朝'
  if (h >= 9 && h < 12) return '午前'
  if (h >= 12 && h < 15) return '昼'
  if (h >= 15 && h < 18) return '夕方'
  if (h >= 18 && h < 21) return '夜'
  return '深夜'
}

const chartStyle = {
  background: 'transparent',
}

export function Analytics() {
  const sessions = useAppStore((s) => s.sessions)
  const insights = calcInsights(sessions)
  const trend7 = getRecentTrend(sessions, 7)
  const trend30 = getRecentTrend(sessions, 30)

  const completed = sessions.filter((s) => s.focusScore !== null)

  const locationData = groupAvg(completed, (s) => s.location, (k) => LOCATION_LABELS[k as Location])
  const noiseData = groupAvg(completed, (s) => s.noiseLevel, (k) => NOISE_LABELS[k as NoiseLevel])
  const timeData = groupAvg(completed, (s) => getHourLabel(s.startedAt), (k) => k)
  const sleepData = groupAvg(completed, (s) => s.sleepState, (k) => SLEEP_LABELS[k as SleepState])

  const tooltipProps = {
    contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: '#94a3b8' },
    itemStyle: { color: '#38bdf8' },
  }

  if (sessions.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', color: '#475569' }}>
        <BarChart2 size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <p style={{ fontSize: 15, lineHeight: 1.6 }}>セッションを記録すると<br />ここに分析が表示されます</p>
        <p style={{ fontSize: 13, marginTop: 8 }}>7セッションで初回の仮説が生まれます</p>
      </div>
    )
  }

  return (
    <div className="scrollable" style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>分析</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ padding: '4px 10px', borderRadius: 20, background: '#1e293b', color: '#64748b', fontSize: 12, border: '1px solid #334155' }}>
            {completed.length}セッション
          </span>
          <span style={{
            padding: '4px 10px',
            borderRadius: 20,
            background: insights.dataConfidence === 'high' ? 'rgba(52,211,153,0.1)' : insights.dataConfidence === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)',
            color: insights.dataConfidence === 'high' ? '#34d399' : insights.dataConfidence === 'medium' ? '#f59e0b' : '#64748b',
            fontSize: 12,
            border: `1px solid ${insights.dataConfidence === 'high' ? 'rgba(52,211,153,0.2)' : insights.dataConfidence === 'medium' ? 'rgba(245,158,11,0.2)' : '#334155'}`,
          }}>
            {insights.dataConfidence === 'high' ? '信頼度：高' : insights.dataConfidence === 'medium' ? '信頼度：中' : '仮説段階'}
          </span>
        </div>
      </div>

      {/* Trend 7days */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <TrendingUp size={15} style={{ color: '#38bdf8' }} />
          <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>直近7日のトレンド</span>
        </div>
        <ResponsiveContainer width="100%" height={110}>
          <LineChart data={trend7} style={chartStyle}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 5]} hide />
            <Tooltip {...tooltipProps} formatter={(v) => [(v as number) > 0 ? v : '—', '集中度']} />
            <Line type="monotone" dataKey="avg" stroke="#38bdf8" strokeWidth={2} dot={{ fill: '#38bdf8', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Location */}
      {locationData.length >= 2 && (
        <Card>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>場所別 平均集中度</p>
          <ResponsiveContainer width="100%" height={locationData.length * 40 + 20}>
            <BarChart data={locationData} layout="vertical" style={chartStyle}>
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipProps} formatter={(v) => [v as number, "平均集中度"]} />
              <Bar dataKey="avg" fill="#a78bfa" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Time of day */}
      {timeData.length >= 2 && (
        <Card>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>時間帯別 平均集中度</p>
          <ResponsiveContainer width="100%" height={timeData.length * 40 + 20}>
            <BarChart data={timeData} layout="vertical" style={chartStyle}>
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={50} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipProps} formatter={(v) => [v as number, "平均集中度"]} />
              <Bar dataKey="avg" fill="#38bdf8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Noise */}
      {noiseData.length >= 2 && (
        <Card>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>音環境別 平均集中度</p>
          <ResponsiveContainer width="100%" height={noiseData.length * 40 + 20}>
            <BarChart data={noiseData} layout="vertical" style={chartStyle}>
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipProps} formatter={(v) => [v as number, "平均集中度"]} />
              <Bar dataKey="avg" fill="#34d399" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Sleep */}
      {sleepData.length >= 2 && (
        <Card>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>睡眠状態別 平均集中度</p>
          <ResponsiveContainer width="100%" height={sleepData.length * 40 + 20}>
            <BarChart data={sleepData} layout="vertical" style={chartStyle}>
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipProps} formatter={(v) => [v as number, "平均集中度"]} />
              <Bar dataKey="avg" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Insights summary */}
      {(insights.worstSleepImpact || insights.phoneRiskImpact) && (
        <Card>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>気づき</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {insights.worstSleepImpact && (
              <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', color: '#fca5a5', fontSize: 13, border: '1px solid rgba(239,68,68,0.15)' }}>
                😴 睡眠不足の日は集中度が下がる傾向があります
              </div>
            )}
            {insights.phoneRiskImpact && (
              <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(245,158,11,0.08)', color: '#fcd34d', fontSize: 13, border: '1px solid rgba(245,158,11,0.15)' }}>
                📱 スマホ誘惑が高い日は集中しにくい傾向があります
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 30-day trend */}
      {sessions.length >= 10 && (
        <Card>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>30日トレンド</p>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={trend30} style={chartStyle}>
              <XAxis dataKey="date" tick={false} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} hide />
              <Tooltip {...tooltipProps} formatter={(v) => [(v as number) > 0 ? v : '—', '集中度']} />
              <Line type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
