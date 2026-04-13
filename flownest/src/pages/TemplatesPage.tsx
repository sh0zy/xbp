import type { Route } from '../app/router';
import PageHeader from '../components/PageHeader';
import { useStore } from '../store/AppStoreContext';
import { formatDuration, totalDurationMinutes } from '../lib/time';
import type { RoutineMode } from '../types';

interface Props {
  mode: RoutineMode;
  navigate: (r: Route) => void;
}

export default function TemplatesPage({ mode, navigate }: Props) {
  const { templatesByMode, setDefaultTemplate, deleteTemplate, startSession } = useStore();
  const list = templatesByMode(mode);
  const isMorning = mode === 'morning';

  return (
    <div>
      <PageHeader
        title={isMorning ? '朝ルート' : '夜プラン'}
        subtitle={isMorning ? '出発時刻から逆算' : '就寝時刻から逆算'}
        accent={isMorning ? 'morning' : 'night'}
        right={
          <button
            onClick={() => navigate({ name: 'editor', mode })}
            className="nest-btn-primary px-3 py-2 text-sm"
          >
            ＋新規
          </button>
        }
      />
      <div className="space-y-3 px-5 pt-2">
        {list.length === 0 && (
          <p className="text-sm text-nest-sub">まだテンプレートがありません</p>
        )}
        {list.map((tpl) => (
          <div key={tpl.id} className="nest-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{tpl.name}</h3>
                  {tpl.isDefault && (
                    <span className="rounded-full bg-nest-accent/15 px-2 py-0.5 text-[10px] font-bold text-nest-accent">
                      既定
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-nest-sub">
                  目標 {tpl.targetTime} · 合計 {formatDuration(totalDurationMinutes(tpl.tasks))} ·{' '}
                  {tpl.tasks.length}工程
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="nest-btn-primary px-3 py-2 text-sm"
                onClick={() => {
                  startSession(tpl.id);
                  navigate({ name: 'run' });
                }}
              >
                開始
              </button>
              <button
                className="nest-btn-ghost px-3 py-2 text-sm"
                onClick={() => navigate({ name: 'editor', templateId: tpl.id })}
              >
                編集
              </button>
              {!tpl.isDefault && (
                <button
                  className="nest-btn-ghost px-3 py-2 text-sm"
                  onClick={() => setDefaultTemplate(tpl.id)}
                >
                  既定に
                </button>
              )}
              <button
                className="nest-btn-danger px-3 py-2 text-sm"
                onClick={() => {
                  if (confirm(`「${tpl.name}」を削除しますか？`)) deleteTemplate(tpl.id);
                }}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
