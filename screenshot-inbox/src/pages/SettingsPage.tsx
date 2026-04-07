import { useState } from 'react';
import { ArrowLeft, Trash2, Database, Info, Download, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateSampleData } from '../utils/sample-data';

interface Props {
  onBack: () => void;
}

export function SettingsPage({ onBack }: Props) {
  const { settings, updateSettings, loadSampleData, clearAllData, items } = useStore();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleLoadSample = () => {
    const samples = generateSampleData();
    loadSampleData(samples);
  };

  const handleClear = () => {
    clearAllData();
    setShowConfirmClear(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-500">
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-bold text-gray-900">設定</h1>
      </div>

      <div className="p-4 space-y-3">
        {/* Data Info */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Database size={16} className="text-primary-500" />
            データ
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>保存件数</span>
              <span className="font-medium">{items.length}枚</span>
            </div>
            <div className="flex justify-between">
              <span>保存先</span>
              <span className="font-medium">ローカルストレージ</span>
            </div>
          </div>
        </div>

        {/* Sample Data */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={handleLoadSample}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-gray-700"
          >
            <Download size={18} className="text-primary-500" />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">サンプルデータを追加</div>
              <div className="text-xs text-gray-400">7件のサンプルデータを追加します</div>
            </div>
          </button>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-gray-700">取り込み設定</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-700">自動分類</div>
              <div className="text-xs text-gray-400">取り込み時にカテゴリを自動推定</div>
            </div>
            <button
              onClick={() => updateSettings({ autoClassify: !settings.autoClassify })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.autoClassify ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  settings.autoClassify ? 'translate-x-6.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-700">デフォルトリマインド</div>
              <div className="text-xs text-gray-400">{settings.defaultReminderHours}時間後</div>
            </div>
            <select
              value={settings.defaultReminderHours}
              onChange={(e) => updateSettings({ defaultReminderHours: Number(e.target.value) })}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
            >
              <option value={12}>12時間</option>
              <option value={24}>24時間</option>
              <option value={48}>48時間</option>
              <option value={72}>72時間</option>
            </select>
          </div>
        </div>

        {/* Clear Data */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {!showConfirmClear ? (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="w-full px-4 py-3.5 flex items-center gap-3 text-danger-500"
            >
              <Trash2 size={18} />
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">データを初期化</div>
                <div className="text-xs text-danger-400">すべてのデータが削除されます</div>
              </div>
            </button>
          ) : (
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-700 font-medium">本当にすべてのデータを削除しますか？</p>
              <p className="text-xs text-gray-500">この操作は取り消せません</p>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="flex-1 py-2 bg-danger-500 text-white rounded-xl text-sm font-medium"
                >
                  削除する
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Info size={16} className="text-gray-400" />
            アプリ情報
          </h3>
          <div className="text-xs text-gray-500 space-y-1.5">
            <p>Screenshot Inbox v1.0.0</p>
            <p>スクショを行動に変えるアプリ</p>
            <p className="mt-2">データはすべてこのデバイスにローカル保存されます。</p>
            <p>外部サーバーへの送信は行いません。</p>
            <p className="mt-2">OCR・分類はルールベース処理で動作します。</p>
            <p>外部 AI / API は使用していません。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
