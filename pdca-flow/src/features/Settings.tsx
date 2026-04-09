import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Header } from '../components/Header';
import { SectionCard } from '../components/SectionCard';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function Settings() {
  const { settings, updateSettings, loadSampleData, clearAllData } = useApp();
  const [showClear, setShowClear] = useState(false);
  const [showSample, setShowSample] = useState(false);

  const accentColors = [
    { value: '#3b82f6', label: 'ブルー' },
    { value: '#06b6d4', label: 'シアン' },
    { value: '#8b5cf6', label: 'パープル' },
    { value: '#10b981', label: 'グリーン' },
    { value: '#f59e0b', label: 'アンバー' },
  ];

  return (
    <div className="pb-24">
      <Header title="設定" />
      <div className="p-4 space-y-4">
        <SectionCard title="テーマカラー">
          <div className="flex gap-3">
            {accentColors.map((c) => (
              <button
                key={c.value}
                onClick={() => updateSettings({ accentColor: c.value })}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 transition ${
                    settings.accentColor === c.value ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.value }}
                />
                <span className="text-xs text-text-muted">{c.label}</span>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="データ管理">
          <div className="space-y-3">
            <button
              onClick={() => setShowSample(true)}
              className="w-full bg-surface-light rounded-xl py-3 text-sm font-medium text-primary"
            >
              サンプルデータを投入
            </button>
            <button
              onClick={() => setShowClear(true)}
              className="w-full bg-danger/10 rounded-xl py-3 text-sm font-medium text-danger"
            >
              全データを削除
            </button>
          </div>
        </SectionCard>

        <SectionCard title="アプリ情報">
          <div className="space-y-2 text-sm text-text-muted">
            <div className="flex justify-between">
              <span>バージョン</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>ストレージ</span>
              <span>localStorage</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="将来の機能（Pro）">
          <div className="space-y-2 text-sm text-text-muted">
            <p>CSV/JSONエクスポート</p>
            <p>詳細統計・分析</p>
            <p>テンプレート保存</p>
            <p>週次レポート</p>
            <p className="text-xs mt-2">※ 今後のアップデートで追加予定</p>
          </div>
        </SectionCard>
      </div>

      <ConfirmDialog
        open={showClear}
        title="全データ削除"
        message="すべてのテーマ・記録が削除されます。元に戻せません。"
        onConfirm={() => { clearAllData(); setShowClear(false); }}
        onCancel={() => setShowClear(false)}
        confirmLabel="削除する"
        danger
      />
      <ConfirmDialog
        open={showSample}
        title="サンプルデータ投入"
        message="既存データはサンプルデータに置き換わります。"
        onConfirm={() => { loadSampleData(); setShowSample(false); }}
        onCancel={() => setShowSample(false)}
        confirmLabel="投入する"
      />
    </div>
  );
}
