import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { SectionCard } from '../components/SectionCard';
import { FormField, TextAreaField } from '../components/FormField';
import { today } from '../lib/date';

interface PlanViewProps {
  themeId: string;
  cycle: number;
}

export function PlanView({ themeId, cycle }: PlanViewProps) {
  const { plans, savePlan } = useApp();
  const existing = plans.find((p) => p.themeId === themeId && p.cycle === cycle);
  const [editing, setEditing] = useState(!existing);

  const [goal, setGoal] = useState('');
  const [actions, setActions] = useState('');
  const [metrics, setMetrics] = useState('');
  const [startDate, setStartDate] = useState(today());
  const [deadline, setDeadline] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');

  useEffect(() => {
    if (existing) {
      setGoal(existing.goal);
      setActions(existing.actions);
      setMetrics(existing.metrics);
      setStartDate(existing.startDate);
      setDeadline(existing.deadline);
      setTargetValue(existing.targetValue);
      setSuccessCriteria(existing.successCriteria);
    }
  }, [existing]);

  const handleSave = () => {
    savePlan({ themeId, cycle, goal, actions, metrics, startDate, deadline, targetValue, successCriteria });
    setEditing(false);
  };

  if (!editing && existing) {
    return (
      <SectionCard title="Plan - 計画">
        <div className="space-y-3 text-sm">
          <div><span className="text-text-muted">達成したいこと:</span><p className="mt-1">{existing.goal}</p></div>
          <div><span className="text-text-muted">具体的行動:</span><p className="mt-1">{existing.actions}</p></div>
          <div><span className="text-text-muted">評価指標:</span><p className="mt-1">{existing.metrics}</p></div>
          <div className="flex gap-4">
            <div><span className="text-text-muted">開始:</span> {existing.startDate}</div>
            <div><span className="text-text-muted">期限:</span> {existing.deadline}</div>
          </div>
          <div><span className="text-text-muted">目標数値:</span> {existing.targetValue}</div>
          <div><span className="text-text-muted">成功条件:</span><p className="mt-1">{existing.successCriteria}</p></div>
        </div>
        <button onClick={() => setEditing(true)} className="mt-4 text-primary text-sm font-medium">
          編集する
        </button>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Plan - 計画を立てる">
      <TextAreaField label="達成したいこと" value={goal} onChange={setGoal} placeholder="何を達成する？" />
      <TextAreaField label="具体的行動" value={actions} onChange={setActions} placeholder="どう行動する？" />
      <FormField label="評価指標" value={metrics} onChange={(e) => setMetrics(e.target.value)} placeholder="何で測る？" />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="開始日" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <FormField label="期限" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>
      <FormField label="目標数値" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="例: 30回" />
      <TextAreaField label="成功条件" value={successCriteria} onChange={setSuccessCriteria} placeholder="どうなったら成功？" />
      <button onClick={handleSave} className="w-full bg-plan text-white py-3 rounded-xl font-bold mt-2">
        保存する
      </button>
    </SectionCard>
  );
}
