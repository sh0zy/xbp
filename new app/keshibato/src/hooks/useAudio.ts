// Web Audio API ベースの軽量SE生成
import { useCallback, useRef } from 'react';

type SoundKind = 'tap' | 'hit' | 'fall' | 'win' | 'launch';

export function useAudio(volume: number = 0.6, enabled: boolean = true) {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = useCallback(() => {
    if (!enabled) return null;
    if (!ctxRef.current) {
      try {
        const AC =
          (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
            .AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AC) ctxRef.current = new AC();
      } catch {
        return null;
      }
    }
    return ctxRef.current;
  }, [enabled]);

  const play = useCallback(
    (kind: SoundKind) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      let freq = 440;
      let dur = 0.08;
      let type: OscillatorType = 'triangle';
      switch (kind) {
        case 'tap':
          freq = 660;
          dur = 0.05;
          type = 'square';
          break;
        case 'hit':
          freq = 220;
          dur = 0.08;
          type = 'sawtooth';
          break;
        case 'fall':
          freq = 140;
          dur = 0.3;
          type = 'sine';
          break;
        case 'win':
          freq = 880;
          dur = 0.35;
          type = 'triangle';
          break;
        case 'launch':
          freq = 520;
          dur = 0.1;
          type = 'triangle';
          break;
      }
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (kind === 'win') osc.frequency.exponentialRampToValueAtTime(freq * 2, now + dur);
      if (kind === 'fall') osc.frequency.exponentialRampToValueAtTime(60, now + dur);
      gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)) * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.start(now);
      osc.stop(now + dur);
    },
    [ensureCtx, volume]
  );

  const vibrate = useCallback((ms: number) => {
    if (!enabled) return;
    if (navigator.vibrate) navigator.vibrate(ms);
  }, [enabled]);

  return { play, vibrate };
}
