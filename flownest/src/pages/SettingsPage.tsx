import type { Route } from '../app/router';
import PageHeader from '../components/PageHeader';
import { useStore } from '../store/AppStoreContext';

interface Props {
  navigate: (r: Route) => void;
}

export default function SettingsPage({ navigate }: Props) {
  const { settings, updateSettings, templates, setDefaultTemplate, clearAllData } = useStore();
  const morning = templates.filter((t) => t.mode === 'morning');
  const night = templates.filter((t) => t.mode === 'night');

  return (
    <div>
      <PageHeader title="設定" subtitle="FlowNest の環境設定" accent="accent" onBack={() => navigate({ name: 'home' })} />
      <div className="space-y-4 px-5 pt-2">
        <section className="nest-card space-y-3 p-4">
          <h3 className="nest-label">既定テンプレート</h3>
          <label className="block">
            <span className="text-xs text-nest-sub">☀ 朝</span>
            <select
              value={morning.find((t) => t.isDefault)?.id ?? ''}
              onChange={(e) => setDefaultTemplate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-nest-border bg-nest-surface px-3 py-2 text-sm"
            >
              <option value="" disabled>
                選択
              </option>
              {morning.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-nest-sub">☾ 夜</span>
            <select
              value={night.find((t) => t.isDefault)?.id ?? ''}
              onChange={(e) => setDefaultTemplate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-nest-border bg-nest-surface px-3 py-2 text-sm"
            >
              <option value="" disabled>
                選択
              </option>
              {night.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="nest-card space-y-3 p-4">
          <h3 className="nest-label">通知（将来拡張）</h3>
          <label className="flex items-center justify-between text-sm">
            <span>通知を有効にする</span>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
            />
          </label>
          <p className="text-xs text-nest-sub">
            現在の版では通知は未実装です。Capacitor Local Notifications への拡張枠として保持します。
          </p>
        </section>

        <section className="nest-card space-y-3 p-4">
          <h3 className="nest-label">テーマ</h3>
          <select
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as 'auto' | 'dark' })}
            className="w-full rounded-lg border border-nest-border bg-nest-surface px-3 py-2 text-sm"
          >
            <option value="dark">ダーク（既定）</option>
            <option value="auto">自動（将来拡張）</option>
          </select>
        </section>

        <section className="nest-card space-y-3 p-4">
          <h3 className="nest-label text-nest-danger">データ</h3>
          <button
            className="nest-btn-danger w-full"
            onClick={() => {
              if (confirm('すべてのローカルデータを初期化します。よろしいですか？'))
                clearAllData();
            }}
          >
            すべて初期化
          </button>
        </section>

        <p className="pb-8 text-center text-xs text-nest-sub">
          FlowNest v0.1 · com.flownest.routine
        </p>
      </div>
    </div>
  );
}
