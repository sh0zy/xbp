import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import type { ThemeId } from "../types";
import { THEMES } from "../types";
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendTestNotification,
  scheduleTodayNotifications,
} from "../utils/notifications";
import type { LaterItem } from "../types";

type Props = {
  theme: ThemeId;
  onChangeTheme: (t: ThemeId) => void;
  onResetData: () => void;
  onRestoreSample: () => void;
  onReplayTutorial: () => void;
  canInstall: boolean;
  installed: boolean;
  onInstall: () => void;
  items: LaterItem[];
};

export function SettingsScreen({
  theme,
  onChangeTheme,
  onResetData,
  onRestoreSample,
  onReplayTutorial,
  canInstall,
  installed,
  onInstall,
  items,
}: Props) {
  const [notifPerm, setNotifPerm] = useState<"granted" | "denied" | "default">("default");

  useEffect(() => {
    getNotificationPermission().then(setNotifPerm);
  }, []);

  async function handleEnable() {
    const perm = await requestNotificationPermission();
    setNotifPerm(perm);
    if (perm === "granted") {
      await scheduleTodayNotifications(items);
    } else if (perm === "denied") {
      alert(
        "通知が拒否されています。\nスマホの設定 → アプリ → スクショToDo → 通知 をオンにしてから、もう一度お試しください。"
      );
    }
  }

  const todayCount = items.filter((i) => {
    const today = new Date().toISOString().slice(0, 10);
    return i.dueDate === today && i.actionStatus !== "done" &&
      i.actionStatus !== "archive" && i.actionStatus !== "forget";
  }).length;

  return (
    <div className="px-5 pb-32">
      <Header subtitle="Settings" title="設定" />

      <h2 className="text-sm text-white/70 mb-2 px-1">テーマ</h2>
      <div className="card">
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => onChangeTheme(t.id)}
              className={`rounded-2xl p-3 border transition ${
                theme === t.id
                  ? "border-gold-400/60 bg-white/[0.05]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className={`h-10 rounded-xl bg-gradient-to-br ${t.swatch} mb-2`} />
              <div className="text-xs text-white/80">{t.name}</div>
            </button>
          ))}
        </div>
      </div>

      <h2 className="text-sm text-white/70 mt-6 mb-2 px-1">通知</h2>
      <div className="card space-y-3">
        <p className="text-xs text-white/50 leading-relaxed">
          今日期限のスクショを、指定時刻（または起動時）にお知らせします。
        </p>
        {notifPerm === "granted" ? (
          <>
            <div className="rounded-2xl p-3 bg-emerald-500/10 border border-emerald-400/30 text-sm text-emerald-200 text-center">
              ✓ 通知は有効です（本日の対象: {todayCount} 件）
            </div>
            <button
              className="btn-ghost w-full"
              onClick={() => sendTestNotification()}
            >
              テスト通知を送る
            </button>
          </>
        ) : notifPerm === "denied" ? (
          <>
            <div className="rounded-2xl p-3 bg-rose-500/10 border border-rose-400/30 text-sm text-rose-200">
              通知が拒否されています。
            </div>
            <div className="rounded-2xl p-3 bg-white/[0.03] border border-white/[0.06] text-xs text-white/70 leading-relaxed">
              <div className="font-medium text-white/90 mb-2">有効にする手順</div>
              <div>1. スマホの「設定」アプリを開く</div>
              <div>2. 「アプリ」→「スクショToDo」を選択</div>
              <div>3. 「通知」をタップしてオンにする</div>
            </div>
            <button className="btn-ghost w-full" onClick={handleEnable}>
              もう一度リクエスト
            </button>
          </>
        ) : (
          <button className="btn-primary w-full py-3" onClick={handleEnable}>
            通知を有効にする
          </button>
        )}
      </div>

      <h2 className="text-sm text-white/70 mt-6 mb-2 px-1">データ</h2>
      <div className="card space-y-3">
        <button onClick={onRestoreSample} className="btn-ghost w-full">
          サンプルデータを復元
        </button>
        <button
          onClick={() => {
            if (confirm("すべての保存情報を削除します。よろしいですか？")) onResetData();
          }}
          className="btn-ghost w-full text-rose-300"
        >
          データを初期化
        </button>
      </div>

      <h2 className="text-sm text-white/70 mt-6 mb-2 px-1">使い方</h2>
      <div className="card">
        <button onClick={onReplayTutorial} className="btn-ghost w-full">
          使い方講座をもう一度見る
        </button>
      </div>

      <h2 className="text-sm text-white/70 mt-6 mb-2 px-1">このアプリ</h2>
      <div className="card">
        <Row label="アプリ名" value="スクショToDo" />
        <Row label="バージョン" value="1.0.0" />
        <Row label="保存方法" value="端末ローカル（外部送信なし）" />
      </div>

      <h2 className="text-sm text-white/70 mt-6 mb-2 px-1">アプリを入れる</h2>
      <div className="card space-y-3">
        {installed ? (
          <div className="rounded-2xl p-3 bg-emerald-500/10 border border-emerald-400/30 text-sm text-emerald-200 text-center">
            ✓ このアプリはインストール済みです
          </div>
        ) : canInstall ? (
          <button onClick={onInstall} className="btn-primary w-full py-4 text-base">
            ▼ このアプリをインストール
          </button>
        ) : (
          <>
            <div className="rounded-2xl p-3 bg-white/[0.03] border border-white/[0.06] text-xs text-white/70 leading-relaxed">
              <div className="font-medium text-white/90 mb-2">
                自動インストールが使えないブラウザの場合
              </div>
              <div>・iOS Safari: 共有ボタン → 「ホーム画面に追加」</div>
              <div>・Android Chrome: 右上メニュー → 「アプリをインストール」</div>
              <div>・PC Chrome/Edge: アドレスバー右端のインストールアイコン</div>
            </div>
            <button onClick={onInstall} className="btn-ghost w-full">
              インストールを試す
            </button>
          </>
        )}
      </div>

      <div className="card mt-4 text-sm text-white/70 leading-relaxed">
        <p>
          スクショToDoは、保存したスクショを見返すだけで終わらせず、
          「今日やる・今週やる・調べる・買う・返信する」などの次の行動に変えるためのアプリです。
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div className="text-sm text-white/60">{label}</div>
      <div className="text-sm text-white/90">{value}</div>
    </div>
  );
}
