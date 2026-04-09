import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { SectionCard } from '../components/SectionCard';
import { TextAreaField } from '../components/FormField';

interface ActViewProps {
  themeId: string;
  cycle: number;
}

export function ActView({ themeId, cycle }: ActViewProps) {
  const { acts, saveAct } = useApp();
  const existing = acts.find((a) => a.themeId === themeId && a.cycle === cycle);
  const [editing, setEditing] = useState(!existing);

  const [improvement, setImprovement] = useState('');
  const [carryOver, setCarryOver] = useState('');
  const [actionItems, setActionItems] = useState('');

  useEffect(() => {
    if (existing) {
      setImprovement(existing.improvement);
      setCarryOver(existing.carryOver);
      setActionItems(existing.actionItems);
    }
  }, [existing]);

  const handleSave = () => {
    saveAct({ themeId, cycle, improvement, carryOver, actionItems });
    setEditing(false);
  };

  if (!editing && existing) {
    return (
      <SectionCard title="Act - 改善">
        <div className="space-y-3 text-sm">
          <div><span className="text-text-muted">次回改善案:</span><p className="mt-1">{existing.improvement}</p></div>
          <div><span className="text-text-muted">引き継ぐ内容:</span><p className="mt-1">{existing.carryOver}</p></div>
          <div><span className="text-text-muted">改善アクション:</span><p className="mt-1">{existing.actionItems}</p></div>
        </div>
        <button onClick={() => setEditing(true)} className="mt-4 text-act text-sm font-medium">
          編集する
        </button>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Act - 改善を決める">
      <TextAreaField label="次回改善案" value={improvement} onChange={setImprovement} placeholder="次はどう変える？" />
      <TextAreaField label="次のPlanへ引き継ぐ内容" value={carryOver} onChange={setCarryOver} placeholder="続けること、やめること" />
      <TextAreaField label="改善アクション" value={actionItems} onChange={setActionItems} placeholder="具体的に何をする？" />
      <button onClick={handleSave} className="w-full bg-act text-white py-3 rounded-xl font-bold mt-2">
        保存する
      </button>
    </SectionCard>
  );
}
