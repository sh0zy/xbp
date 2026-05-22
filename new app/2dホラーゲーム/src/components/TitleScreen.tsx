import { useEffect, useMemo, useState } from 'react';
import type { SaveSlotSummary } from '../game/types';

interface TitleScreenProps {
  summaries: SaveSlotSummary[];
  onStart: () => void;
  onContinue: () => void;
  onSettings: () => void;
  unlockAudio: () => Promise<void>;
}

export function TitleScreen({ summaries, onStart, onContinue, onSettings, unlockAudio }: TitleScreenProps) {
  const [clock, setClock] = useState(() => new Date());
  const hasSave = useMemo(() => summaries.some((slot) => !slot.isEmpty), [summaries]);

  useEffect(() => {
    const id = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const hhmm = `${clock.getHours().toString().padStart(2, '0')}:${clock.getMinutes().toString().padStart(2, '0')}`;

  const activate = async (action: () => void) => {
    await unlockAudio();
    action();
  };

  return (
    <section className="title-screen screen-fade">
      <div className="campus-silhouette" aria-hidden="true">
        <svg viewBox="0 0 480 160">
          <path d="M20 150 H460 V120 H430 V65 H384 V120 H350 V42 H300 V120 H260 V75 H220 V120 H178 V34 H130 V120 H94 V82 H55 V120 H20 Z" />
          <path d="M135 34 L154 12 L173 34 M305 42 L325 18 L345 42" />
          <rect x="73" y="97" width="8" height="23" />
          <rect x="145" y="58" width="8" height="21" />
          <rect x="158" y="58" width="8" height="21" />
          <rect x="313" y="68" width="10" height="24" />
          <circle cx="392" cy="92" r="3" />
        </svg>
      </div>
      <div className="title-stack">
        <h1 className="game-logo"><span>23:58</span> <em>Campus</em></h1>
        <div className="title-rule" />
        <p className="title-sub">深夜の大学に残された、欠席者の記録</p>
        <nav className="title-menu" aria-label="タイトルメニュー">
          <button type="button" onClick={() => activate(onStart)} aria-label="スタート">START</button>
          <button type="button" onClick={() => activate(onContinue)} disabled={!hasSave} aria-label="続きから">
            {hasSave ? 'CONTINUE' : '--- NO DATA ---'}
          </button>
          <button type="button" onClick={() => activate(onSettings)} aria-label="設定">SETTINGS</button>
        </nav>
      </div>
      <div className="real-clock" aria-label={`現在時刻 ${hhmm}`}>{hhmm}</div>
    </section>
  );
}
