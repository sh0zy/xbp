import { useState, type ReactNode } from 'react';
import { MoonStar, Package2, RefreshCw, RotateCcw, Sparkles, SunMedium, Trash2 } from 'lucide-react';
import { APP_NAME, APP_VERSION, PACKAGE_NAME } from '@/app/constants';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageHeader } from '@/components/PageHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useNotes } from '@/features/notes/hooks/useNotes';
import type { SortOrder, ThemeMode } from '@/features/notes/types/note';

const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
] as const satisfies ReadonlyArray<{ value: ThemeMode; label: string }>;

const SORT_OPTIONS = [
  { value: 'updatedDesc', label: '更新順' },
  { value: 'createdDesc', label: '作成順' },
  { value: 'titleAsc', label: 'タイトル順' },
] as const satisfies ReadonlyArray<{ value: SortOrder; label: string }>;

interface SettingsActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
  destructive?: boolean;
}

function SettingsActionCard({
  icon,
  title,
  description,
  actionLabel,
  onClick,
  destructive = false,
}: SettingsActionCardProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[rgba(12,15,23,0.82)] p-5">
      <div className="flex items-start gap-4">
        <div className="rounded-[20px] border border-white/10 bg-white/6 p-3 text-white/78">{icon}</div>
        <div className="flex-1">
          <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">{description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`mt-5 flex min-h-12 w-full items-center justify-center rounded-[20px] border px-4 text-sm font-semibold transition ${
          destructive
            ? 'border-rose-400/16 bg-rose-500/10 text-rose-100 hover:bg-rose-500/16'
            : 'border-white/10 bg-white text-slate-950 hover:bg-white/92'
        }`}
      >
        {actionLabel}
      </button>
    </div>
  );
}

export function SettingsPage() {
  const { settings, updateTheme, updateSortOrder, regenerateDemoNotes, clearAllData } = useNotes();
  const [dialog, setDialog] = useState<'demo' | 'clear' | null>(null);

  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+120px)] pt-[calc(env(safe-area-inset-top)+18px)]">
        <PageHeader title="設定" subtitle="表示とデータの挙動を、Android 配布前提で整えられます。" />

        <section className="mt-5 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,19,29,0.96),rgba(10,12,18,0.96))] p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/10 bg-white/6 text-white/82">
              <MoonStar className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/34">Theme</p>
              <h2 className="mt-2 font-display text-lg font-semibold text-white">テーマ</h2>
            </div>
          </div>

          <SegmentedControl
            value={settings.theme}
            options={THEME_OPTIONS}
            onChange={(value) => void updateTheme(value)}
            className="mt-5 grid-cols-3"
          />

          <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-white/48">
            <div className="rounded-[18px] border border-white/10 bg-white/5 px-3 py-3 text-center">
              <MoonStar className="mx-auto mb-2 h-4 w-4" />
              ダーク
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/5 px-3 py-3 text-center">
              <SunMedium className="mx-auto mb-2 h-4 w-4" />
              ライト
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/5 px-3 py-3 text-center">
              <Sparkles className="mx-auto mb-2 h-4 w-4" />
              自動
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[30px] border border-white/10 bg-[rgba(12,15,23,0.82)] p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/10 bg-white/6 text-white/82">
              <RotateCcw className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/34">Sort</p>
              <h2 className="mt-2 font-display text-lg font-semibold text-white">並び順</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => void updateSortOrder(option.value)}
                className={`flex min-h-12 items-center justify-between rounded-[20px] border px-4 text-sm font-medium transition ${
                  option.value === settings.sortOrder
                    ? 'border-white/12 bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.12)]'
                    : 'border-white/10 bg-white/6 text-white/70'
                }`}
              >
                <span>{option.label}</span>
                <span className="text-xs uppercase tracking-[0.2em]">
                  {option.value === settings.sortOrder ? 'Active' : ''}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 space-y-4">
          <SettingsActionCard
            icon={<RefreshCw className="h-5 w-5" />}
            title="サンプルメモを再生成"
            description="ホーム画面の見栄えをすぐに戻したいときに使えます。既存メモは上書きされます。"
            actionLabel="サンプルを再生成"
            onClick={() => setDialog('demo')}
          />

          <SettingsActionCard
            icon={<Trash2 className="h-5 w-5" />}
            title="全データを削除"
            description="保存済みのメモをすべて消去し、空の状態に戻します。危険操作なので確認を入れています。"
            actionLabel="全データを削除"
            onClick={() => setDialog('clear')}
            destructive
          />
        </section>

        <section className="mt-5 rounded-[30px] border border-white/10 bg-[rgba(12,15,23,0.82)] p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/10 bg-white/6 text-white/82">
              <Package2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/34">App Info</p>
              <h2 className="mt-2 font-display text-lg font-semibold text-white">アプリ情報</h2>
            </div>
          </div>

          <dl className="mt-5 grid gap-3">
            <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
              <dt className="text-xs uppercase tracking-[0.2em] text-white/40">App Name</dt>
              <dd className="mt-2 text-sm font-medium text-white">{APP_NAME}</dd>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
              <dt className="text-xs uppercase tracking-[0.2em] text-white/40">Package</dt>
              <dd className="mt-2 text-sm font-medium text-white">{PACKAGE_NAME}</dd>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
              <dt className="text-xs uppercase tracking-[0.2em] text-white/40">Version</dt>
              <dd className="mt-2 text-sm font-medium text-white">{APP_VERSION}</dd>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
              <dt className="text-xs uppercase tracking-[0.2em] text-white/40">Storage</dt>
              <dd className="mt-2 text-sm font-medium text-white">Capacitor Preferences / offline-first</dd>
            </div>
          </dl>
        </section>
      </main>

      <ConfirmDialog
        open={dialog === 'demo'}
        title="サンプルメモを再生成しますか？"
        description="現在のメモはデモ内容に置き換わります。スクリーンショットを整えたいときに便利です。"
        confirmLabel="再生成する"
        onConfirm={() => {
          void regenerateDemoNotes();
          setDialog(null);
        }}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === 'clear'}
        title="全データを削除しますか？"
        description="保存済みメモはすべて消去され、元に戻せません。必要なら先にスクリーンショットや書き出しを残してください。"
        confirmLabel="削除する"
        destructive
        onConfirm={() => {
          void clearAllData();
          setDialog(null);
        }}
        onCancel={() => setDialog(null)}
      />
    </>
  );
}
