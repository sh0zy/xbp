import { useCallback, useEffect, useState } from 'react';
import { audioManager } from '../audio/AudioManager';
import { readAudioSettings, writeAudioSettings } from '../game/save';
import type { AudioSettings } from '../game/types';

export function useAudioSettings() {
  const [settings, setSettingsState] = useState<AudioSettings>(() => readAudioSettings());

  useEffect(() => {
    audioManager.setSettings(settings);
    writeAudioSettings(settings);
  }, [settings]);

  const setSettings = useCallback((next: AudioSettings | ((current: AudioSettings) => AudioSettings)) => {
    setSettingsState((current) => (typeof next === 'function' ? next(current) : next));
  }, []);

  const unlockAudio = useCallback(async () => {
    await audioManager.init(settings).catch(() => undefined);
  }, [settings]);

  return { settings, setSettings, unlockAudio };
}
