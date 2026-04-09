import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Header } from '../components/Header';
import { SectionCard } from '../components/SectionCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { PDCAStageTabs } from '../components/PDCAStageTabs';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CATEGORY_LABELS } from '../types';
import { formatDate } from '../lib/date';
import { PlanView } from './PlanView';
import { DoView } from './DoView';
import { CheckView } from './CheckView';
import { ActView } from './ActView';

type Stage = 'plan' | 'do' | 'check' | 'act';

export function ThemeDetail() {
  const { id } = useParams<{ id: string }>();
  const { themes, deleteTheme, advanceCycle } = useApp();
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('plan');
  const [showDelete, setShowDelete] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);

  const theme = themes.find((t) => t.id === id);
  if (!theme) {
    return (
      <div className="pb-24">
        <Header title="テーマ" back />
        <div className="p-4 text-text-muted text-center mt-16">テーマが見つかりません</div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteTheme(theme.id);
    navigate('/themes');
  };

  const handleAdvance = () => {
    advanceCycle(theme.id);
    setShowAdvance(false);
    setStage('plan');
  };

  return (
    <div className="pb-24">
      <Header
        title={theme.title}
        back
        right={
          <div className="flex gap-2">
            <button onClick={() => navigate(`/themes/${theme.id}/edit`)} className="text-primary text-sm font-medium">
              編集
            </button>
            <button onClick={() => setShowDelete(true)} className="text-danger text-sm font-medium">
              削除
            </button>
          </div>
        }
      />

      <div className="p-4 space-y-4">
        <SectionCard>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-surface-lighter px-2 py-0.5 rounded-full text-text-secondary">
              {CATEGORY_LABELS[theme.category]}
            </span>
            <StatusBadge status={theme.status} />
            <PriorityBadge priority={theme.priority} />
          </div>
          <p className="text-sm text-text-secondary">{theme.goal}</p>
          <div className="flex justify-between mt-3 text-xs text-text-muted">
            <span>サイクル {theme.currentCycle}</span>
            <span>期限: {formatDate(theme.deadline)}</span>
          </div>
        </SectionCard>

        <PDCAStageTabs active={stage} onChange={setStage} />

        <div>
          {stage === 'plan' && <PlanView themeId={theme.id} cycle={theme.currentCycle} />}
          {stage === 'do' && <DoView themeId={theme.id} cycle={theme.currentCycle} />}
          {stage === 'check' && <CheckView themeId={theme.id} cycle={theme.currentCycle} />}
          {stage === 'act' && <ActView themeId={theme.id} cycle={theme.currentCycle} />}
        </div>

        <button
          onClick={() => setShowAdvance(true)}
          className="w-full bg-act/20 text-act py-3 rounded-xl font-medium text-sm"
        >
          次のサイクルへ進む →
        </button>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="テーマを削除"
        message="このテーマと関連する全データが削除されます。"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        confirmLabel="削除"
        danger
      />
      <ConfirmDialog
        open={showAdvance}
        title="次のサイクルへ"
        message={`サイクル ${theme.currentCycle + 1} を開始しますか？`}
        onConfirm={handleAdvance}
        onCancel={() => setShowAdvance(false)}
        confirmLabel="開始"
      />
    </div>
  );
}
