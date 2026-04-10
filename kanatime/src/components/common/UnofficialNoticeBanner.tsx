import { Info, X } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export function UnofficialNoticeBanner() {
  const { settings, update } = useSettingsStore();

  if (!settings.showUnofficialBanner) return null;

  return (
    <div className="relative flex items-start gap-2 bg-accent-blue/10 border border-accent-blue/20 rounded-xl px-3 py-2.5 text-xs text-dark-100">
      <Info size={16} className="text-accent-blue shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">KanaTime は神奈川大学の非公式時間割アプリです。</p>
        <p className="text-dark-300 mt-0.5">最新情報は大学公式情報を確認してください。</p>
      </div>
      <button
        onClick={() => update({ showUnofficialBanner: false })}
        className="absolute top-2 right-2 text-dark-400 active:text-dark-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}
