import { useState } from "react";
import type { AppApi } from "../App";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { STORAGE_KEY } from "../utils/storage";

const ICON_CHECK = [
  "public/icon-192.png が存在する",
  "public/icon-512.png が存在する",
  "public/favicon.png が存在する",
  "manifest.json に正しく登録されている",
  "index.html に favicon が設定されている",
  "Capacitorのアプリアイコンとして反映できる構成",
  "Android Studio上でランチャーアイコンが確認できる",
];

export function Settings({ api }: { api: AppApi }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmSample, setConfirmSample] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <div className="px-4 pt-4 space-y-5">
      <header>
        <p className="text-[12px] text-ink-dim tracking-widest">SETTINGS</p>
        <h1 className="h-title">設定</h1>
      </header>

      <Section title="アプリについて">
        <div className="card p-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-deep flex items-center justify-center text-white font-bold tracking-wider">
              TF
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink-base">TaskFlow</div>
              <div className="text-[11px] text-ink-dim">v{api.state.settings.appVersion}</div>
            </div>
          </div>
          <p className="text-[13px] text-ink-mute leading-relaxed mt-2">
            前日の夜に明日のToDoを整え、忘れても当日の朝に立て直せるToDo管理アプリ。
            「前日準備」「当日リカバリー」「優先順位整理」「集中」「ふりかえり」までを1画面で。
          </p>
        </div>
      </Section>

      <Section title="データ">
        <div className="card p-4 space-y-3">
          <button className="btn-ghost w-full" onClick={() => setConfirmSample(true)}>
            サンプルデータを追加する
          </button>
          <button className="btn-danger w-full" onClick={() => setConfirmReset(true)}>
            データを初期化する
          </button>
          <div className="text-[11px] text-ink-dim">
            localStorage key: <span className="text-ink-mute">{STORAGE_KEY}</span>
          </div>
          <div className="text-[11px] text-ink-dim">
            タスク {api.state.tasks.length}件 / ふりかえり {api.state.reviewNotes.length}件
          </div>
        </div>
      </Section>

      <Section title="PWAインストール">
        <div className="card p-4 space-y-2 text-[13px] text-ink-mute leading-relaxed">
          <p>
            iOS Safari: 共有ボタン → ホーム画面に追加。
          </p>
          <p>
            Android Chrome: メニュー → ホーム画面に追加 / アプリをインストール。
          </p>
          <p>
            インストール後はオフラインでもタスクを表示でき、起動も高速になります。
          </p>
        </div>
      </Section>

      <Section title="Android Studio で開く手順">
        <ol className="card p-4 space-y-2 text-[13px] text-ink-mute leading-relaxed list-decimal list-inside">
          <li>npm install</li>
          <li>npm run build</li>
          <li>npx cap add android (初回のみ)</li>
          <li>npx cap sync android</li>
          <li>npx cap open android</li>
          <li>Android Studioで実機/エミュレータに実行</li>
        </ol>
      </Section>

      <Section title="アイコン確認チェックリスト">
        <div className="card p-4 space-y-2">
          {ICON_CHECK.map((label) => (
            <label key={label} className="flex items-start gap-2 text-[13px] text-ink-mute">
              <input
                type="checkbox"
                checked={!!checked[label]}
                onChange={(e) => setChecked((s) => ({ ...s, [label]: e.target.checked }))}
                className="mt-1 accent-[#7c6cff]"
              />
              <span>{label}</span>
            </label>
          ))}
          <p className="text-[11px] text-ink-dim mt-2">
            アイコンは public/ 直下に配置されています。Android Studio で
            android/app/src/main/res 以下を確認できます。
          </p>
        </div>
      </Section>

      <Section title="Netlify 公開">
        <div className="card p-4 space-y-2 text-[13px] text-ink-mute leading-relaxed">
          <p>build command: <span className="text-ink-base">npm run build</span></p>
          <p>publish directory: <span className="text-ink-base">dist</span></p>
          <p>SPA フォールバック: _redirects ファイルが /* /index.html 200 を返します。</p>
        </div>
      </Section>

      <ConfirmDialog
        open={confirmSample}
        title="サンプルデータを追加しますか？"
        description="既存のタスクは消えません。サンプルが上に追加されます。"
        confirmLabel="追加する"
        onConfirm={() => {
          api.loadSample();
          setConfirmSample(false);
        }}
        onCancel={() => setConfirmSample(false)}
      />

      <ConfirmDialog
        open={confirmReset}
        title="本当に初期化しますか？"
        description="すべてのタスクとふりかえりが削除されます。元に戻せません。"
        destructive
        confirmLabel="初期化する"
        onConfirm={() => {
          api.resetAll();
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
}
