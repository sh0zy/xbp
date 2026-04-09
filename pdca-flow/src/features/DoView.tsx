import { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { SectionCard } from '../components/SectionCard';
import { TextAreaField } from '../components/FormField';
import { formatDate, today } from '../lib/date';

interface DoViewProps {
  themeId: string;
  cycle: number;
}

export function DoView({ themeId, cycle }: DoViewProps) {
  const { doLogs, addDoLog } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(today());
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(true);
  const [memo, setMemo] = useState('');

  const logs = useMemo(
    () => doLogs.filter((d) => d.themeId === themeId && d.cycle === cycle).sort((a, b) => b.date.localeCompare(a.date)),
    [doLogs, themeId, cycle]
  );

  const totalCompleted = logs.filter((l) => l.completed).length;

  const consecutiveDays = useMemo(() => {
    const dates = new Set(logs.filter((l) => l.completed).map((l) => l.date));
    let count = 0;
    const d = new Date();
    while (dates.has(d.toISOString().slice(0, 10))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [logs]);

  const handleAdd = () => {
    if (!description.trim()) return;
    addDoLog({ themeId, cycle, date, description, completed, memo });
    setDescription('');
    setMemo('');
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-do/10 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-do">{logs.length}</div>
          <div className="text-xs text-text-muted">実行回数</div>
        </div>
        <div className="bg-do/10 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-do">{totalCompleted}</div>
          <div className="text-xs text-text-muted">完了</div>
        </div>
        <div className="bg-do/10 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-do">{consecutiveDays}</div>
          <div className="text-xs text-text-muted">継続日数</div>
        </div>
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="w-full bg-do text-white py-3 rounded-xl font-bold">
          + 実行ログを追加
        </button>
      ) : (
        <SectionCard title="Do - 実行記録">
          <label className="block mb-4">
            <span className="text-sm text-text-secondary mb-1 block">実行日</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface-light rounded-xl px-4 py-3 text-text-primary outline-none"
            />
          </label>
          <TextAreaField label="やったこと" value={description} onChange={setDescription} placeholder="具体的に何をした？" />
          <label className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-5 h-5 rounded accent-do"
            />
            <span className="text-sm">実行できた</span>
          </label>
          <TextAreaField label="メモ" value={memo} onChange={setMemo} rows={2} placeholder="気づいたこと" />
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="flex-1 bg-surface-lighter py-3 rounded-xl text-text-muted font-medium">
              キャンセル
            </button>
            <button onClick={handleAdd} className="flex-1 bg-do text-white py-3 rounded-xl font-bold">
              記録する
            </button>
          </div>
        </SectionCard>
      )}

      {logs.length > 0 && (
        <SectionCard title="実行履歴">
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-surface-light rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-muted">{formatDate(log.date)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${log.completed ? 'bg-do/20 text-do' : 'bg-danger/20 text-danger'}`}>
                    {log.completed ? '完了' : '未完了'}
                  </span>
                </div>
                <p className="text-sm">{log.description}</p>
                {log.memo && <p className="text-xs text-text-muted mt-1">{log.memo}</p>}
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
