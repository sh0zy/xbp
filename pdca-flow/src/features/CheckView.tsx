import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { SectionCard } from '../components/SectionCard';
import { TextAreaField, FormField } from '../components/FormField';
import { formatDate } from '../lib/date';

interface CheckViewProps {
  themeId: string;
  cycle: number;
}

export function CheckView({ themeId, cycle }: CheckViewProps) {
  const { checks, doLogs, saveCheck } = useApp();
  const existing = checks.find((c) => c.themeId === themeId && c.cycle === cycle);
  const [editing, setEditing] = useState(!existing);

  const [goodPoints, setGoodPoints] = useState('');
  const [badPoints, setBadPoints] = useState('');
  const [resultValue, setResultValue] = useState('');
  const [causeAnalysis, setCauseAnalysis] = useState('');
  const [achievementRate, setAchievementRate] = useState(50);

  const cycleLogs = useMemo(
    () => doLogs.filter((d) => d.themeId === themeId && d.cycle === cycle),
    [doLogs, themeId, cycle]
  );

  useEffect(() => {
    if (existing) {
      setGoodPoints(existing.goodPoints);
      setBadPoints(existing.badPoints);
      setResultValue(existing.resultValue);
      setCauseAnalysis(existing.causeAnalysis);
      setAchievementRate(existing.achievementRate);
    }
  }, [existing]);

  const handleSave = () => {
    saveCheck({ themeId, cycle, goodPoints, badPoints, resultValue, causeAnalysis, achievementRate });
    setEditing(false);
  };

  if (!editing && existing) {
    return (
      <div className="space-y-4">
        <SectionCard title="Check - 振り返り">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-3xl font-bold text-check">{existing.achievementRate}%</div>
              <div className="text-text-muted text-xs">達成度</div>
            </div>
            <div className="w-full bg-surface-lighter rounded-full h-2">
              <div className="bg-check h-2 rounded-full transition-all" style={{ width: `${existing.achievementRate}%` }} />
            </div>
            <div><span className="text-text-muted">良かった点:</span><p className="mt-1">{existing.goodPoints}</p></div>
            <div><span className="text-text-muted">悪かった点:</span><p className="mt-1">{existing.badPoints}</p></div>
            <div><span className="text-text-muted">結果数値:</span> {existing.resultValue}</div>
            <div><span className="text-text-muted">原因分析:</span><p className="mt-1">{existing.causeAnalysis}</p></div>
          </div>
          <button onClick={() => setEditing(true)} className="mt-4 text-check text-sm font-medium">
            編集する
          </button>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cycleLogs.length > 0 && (
        <SectionCard title="Doログ参照">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {cycleLogs.map((log) => (
              <div key={log.id} className="text-xs bg-surface-light rounded-lg p-2">
                <span className="text-text-muted">{formatDate(log.date)}</span> - {log.description}
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      <SectionCard title="Check - 振り返る">
        <label className="block mb-4">
          <span className="text-sm text-text-secondary mb-1 block">達成度: {achievementRate}%</span>
          <input
            type="range"
            min={0}
            max={100}
            value={achievementRate}
            onChange={(e) => setAchievementRate(Number(e.target.value))}
            className="w-full accent-check"
          />
        </label>
        <TextAreaField label="良かった点" value={goodPoints} onChange={setGoodPoints} placeholder="うまくいったこと" />
        <TextAreaField label="悪かった点" value={badPoints} onChange={setBadPoints} placeholder="改善が必要なこと" />
        <FormField label="結果数値" value={resultValue} onChange={(e) => setResultValue(e.target.value)} placeholder="例: 25回" />
        <TextAreaField label="原因分析" value={causeAnalysis} onChange={setCauseAnalysis} placeholder="なぜその結果に？" />
        <button onClick={handleSave} className="w-full bg-check text-white py-3 rounded-xl font-bold mt-2">
          保存する
        </button>
      </SectionCard>
    </div>
  );
}
