import { useEffect, useState } from "react";
import { PageContainer } from "../../components/common/PageContainer";
import { Card } from "../../components/common/Card";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { SettingRow } from "./components/SettingRow";
import { NotificationEditorSheet } from "./components/NotificationEditorSheet";
import { useAppStore } from "../../store/useAppStore";
import { classNames } from "../../lib/utils";
import type { ThemeMode } from "../../types/app";
import {
  getNotificationCapability,
  requestNotificationPermission,
  syncSchedules,
  cancelAllScheduled,
} from "../../lib/notifications";

const APP_VERSION = "0.1.0";

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "OSに合わせる" },
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={classNames(
        "relative h-7 w-12 shrink-0 overflow-hidden rounded-full transition-colors duration-300 ease-out",
        checked ? "bg-brand-500" : "bg-ink-900 dark:bg-black",
      )}
      aria-pressed={checked}
    >
      <span
        className={classNames(
          "absolute left-0 top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ease-out",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const setNotificationsEnabled = useAppStore(
    (s) => s.setNotificationsEnabled,
  );
  const setHapticsEnabled = useAppStore((s) => s.setHapticsEnabled);
  const loadSampleData = useAppStore((s) => s.loadSampleData);
  const resetAll = useAppStore((s) => s.resetAll);
  const schedules = useAppStore((s) => s.notificationSchedules);
  const addNotificationSchedule = useAppStore(
    (s) => s.addNotificationSchedule,
  );
  const updateNotificationSchedule = useAppStore(
    (s) => s.updateNotificationSchedule,
  );
  const removeNotificationSchedule = useAppStore(
    (s) => s.removeNotificationSchedule,
  );

  const [editorOpen, setEditorOpen] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState<string | null>(
    null,
  );

  const cap = getNotificationCapability();

  useEffect(() => {
    if (settings.notificationsEnabled) {
      void syncSchedules(schedules, true);
    } else {
      void cancelAllScheduled();
    }
  }, [schedules, settings.notificationsEnabled]);

  function handleReset() {
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "すべての履歴と設定を削除します。よろしいですか？",
      );
      if (!ok) return;
    }
    resetAll();
  }

  async function handleToggleMaster(next: boolean) {
    if (next) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        setPermissionMessage(
          "通知の許可が下りませんでした。OSの設定からアプリの通知をオンにしてください。",
        );
        setNotificationsEnabled(false);
        return;
      }
      setPermissionMessage(null);
    }
    setNotificationsEnabled(next);
  }

  async function handleAddSchedule(input: {
    hour: number;
    minute: number;
    label?: string;
  }) {
    addNotificationSchedule({ ...input, enabled: true });
    if (settings.notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        setPermissionMessage(
          "通知の許可が下りませんでした。OSの設定からアプリの通知をオンにしてください。",
        );
      }
    }
  }

  return (
    <PageContainer>
      <h2 className="mb-3 text-lg font-bold text-ink-800 dark:text-ink-100">
        設定
      </h2>

      <Card padded={false}>
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">
            テーマ
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((opt) => {
              const active = settings.themeMode === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setThemeMode(opt.value)}
                  className={classNames(
                    "rounded-xl px-2 py-2 text-xs font-medium",
                    active
                      ? "bg-brand-500 text-white shadow-soft"
                      : "bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-200",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card padded={false} className="mt-3">
        <SettingRow
          title="通知"
          description="他のアプリを使っているときも、設定した時刻に「3分だけ始めませんか？」と知らせます。"
          control={
            <Toggle
              checked={settings.notificationsEnabled}
              onChange={(v) => void handleToggleMaster(v)}
            />
          }
        />
        {permissionMessage && (
          <p className="px-4 pb-3 text-xs text-amber-600 dark:text-amber-300">
            {permissionMessage}
          </p>
        )}
        {cap === "unsupported" && (
          <p className="px-4 pb-3 text-xs text-ink-400 dark:text-ink-500">
            この環境では通知に対応していません。
          </p>
        )}
        {cap === "web" && settings.notificationsEnabled && (
          <p className="px-4 pb-3 text-xs text-ink-400 dark:text-ink-500">
            ブラウザ環境では端末を閉じると通知が届きません。Android アプリ版で常時受け取れます。
          </p>
        )}

        <div className="border-t border-ink-100 dark:border-ink-700" />

        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">
              通知スケジュール
            </p>
            <button
              type="button"
              onClick={() => setEditorOpen(true)}
              className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white shadow-soft"
            >
              ＋ 追加
            </button>
          </div>
          {schedules.length === 0 ? (
            <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
              まだ通知はありません。「＋ 追加」から時刻を決めてみよう。
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {schedules.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-ink-50 px-3 py-2 dark:bg-ink-900"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xl tabular-nums text-ink-800 dark:text-ink-50">
                      {pad(s.hour)}:{pad(s.minute)}
                    </div>
                    <div className="truncate text-[11px] text-ink-500 dark:text-ink-400">
                      毎日 ・ {s.label ?? "3分だけ始めませんか？"}
                    </div>
                  </div>
                  <Toggle
                    checked={s.enabled}
                    onChange={(v) =>
                      updateNotificationSchedule(s.id, { enabled: v })
                    }
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      removeNotificationSchedule(s.id);
                      await cancelAllScheduled();
                    }}
                    className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700"
                    aria-label="この通知をオフにする"
                    title="この通知をオフにする"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Card padded={false} className="mt-3">
        <SettingRow
          title="バイブ"
          description="完了時に軽く振動（端末対応時）"
          control={
            <Toggle
              checked={settings.hapticsEnabled}
              onChange={setHapticsEnabled}
            />
          }
        />
      </Card>

      <Card padded={false} className="mt-3">
        <SettingRow
          title="サンプルデータ"
          description="履歴と通知の見え方を確認できます。"
          control={
            <PrimaryButton size="md" variant="secondary" onClick={loadSampleData}>
              投入
            </PrimaryButton>
          }
        />
        <div className="border-t border-ink-100 dark:border-ink-700" />
        <SettingRow
          title="データを初期化"
          description="履歴・通知・設定を消して最初に戻します。"
          control={
            <PrimaryButton size="md" variant="danger" onClick={handleReset}>
              初期化
            </PrimaryButton>
          }
        />
      </Card>

      <Card className="mt-3">
        <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-100">
          アプリ情報
        </h3>
        <ul className="mt-2 text-xs text-ink-500 dark:text-ink-400">
          <li className="flex justify-between py-1">
            <span>バージョン</span>
            <span>{APP_VERSION}</span>
          </li>
          <li className="flex justify-between py-1">
            <span>App ID</span>
            <span>com.threeminutestart.app</span>
          </li>
          <li className="flex justify-between py-1">
            <span>PWA</span>
            <span>有効（ホーム画面追加可）</span>
          </li>
          <li className="flex justify-between py-1">
            <span>Capacitor</span>
            <span>Android 連携対応</span>
          </li>
        </ul>
      </Card>

      <NotificationEditorSheet
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onCreate={(input) => void handleAddSchedule(input)}
      />
    </PageContainer>
  );
}
