import type { AudioSettings } from '../game/types';

interface SettingsScreenProps {
  settings: AudioSettings;
  onChange: (settings: AudioSettings) => void;
  onBack: () => void;
}

export function SettingsScreen({ settings, onChange, onBack }: SettingsScreenProps) {
  const patch = (partial: Partial<AudioSettings>) => onChange({ ...settings, ...partial });
  return (
    <section className="menu-screen settings-screen screen-fade">
      <header className="screen-header">
        <button type="button" onClick={onBack} aria-label="戻る">← CLOSE</button>
        <h2>設定</h2>
      </header>
      <div className="settings-list">
        <label>
          <span>BGM音量</span>
          <input type="range" min="0" max="100" value={Math.round(settings.bgmVolume * 100)} onChange={(event) => patch({ bgmVolume: Number(event.target.value) / 100 })} />
          <b>{Math.round(settings.bgmVolume * 100)}</b>
        </label>
        <label>
          <span>SE音量</span>
          <input type="range" min="0" max="100" value={Math.round(settings.seVolume * 100)} onChange={(event) => patch({ seVolume: Number(event.target.value) / 100 })} />
          <b>{Math.round(settings.seVolume * 100)}</b>
        </label>
        <div className="setting-row">
          <span>テキスト速度</span>
          <div className="segments">
            {(['slow', 'normal', 'fast'] as const).map((speed) => (
              <button key={speed} type="button" className={settings.textSpeed === speed ? 'active' : ''} onClick={() => patch({ textSpeed: speed })}>
                {speed === 'slow' ? '遅い' : speed === 'normal' ? '普通' : '速い'}
              </button>
            ))}
          </div>
        </div>
        <div className="setting-row">
          <span>ノイズ演出</span>
          <div className="segments">
            <button type="button" className={settings.noiseEnabled ? 'active' : ''} onClick={() => patch({ noiseEnabled: true })}>ON</button>
            <button type="button" className={!settings.noiseEnabled ? 'active' : ''} onClick={() => patch({ noiseEnabled: false })}>OFF</button>
          </div>
        </div>
        <div className="setting-row">
          <span>音声</span>
          <div className="segments">
            <button type="button" className={settings.enabled ? 'active' : ''} onClick={() => patch({ enabled: true })}>ON</button>
            <button type="button" className={!settings.enabled ? 'active' : ''} onClick={() => patch({ enabled: false })}>OFF</button>
          </div>
        </div>
      </div>
    </section>
  );
}
