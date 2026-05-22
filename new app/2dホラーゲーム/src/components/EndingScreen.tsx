import { useEffect } from 'react';
import type { EndingData } from '../game/types';
import { CharacterPortrait } from './CharacterPortrait';
import { GlitchText } from './GlitchText';

interface EndingScreenProps {
  ending: EndingData;
  onCredits: () => void;
  onTitle: () => void;
}

export function EndingScreen({ ending, onCredits, onTitle }: EndingScreenProps) {
  useEffect(() => {
    if (ending.id !== 'endingC') {
      return undefined;
    }
    const id = window.setTimeout(onCredits, 11000);
    return () => window.clearTimeout(id);
  }, [ending.id, onCredits]);

  return (
    <section className={`ending-screen ${ending.id} screen-fade`}>
      {ending.id === 'endingA' ? (
        <svg className="ending-poster" viewBox="0 0 220 260" aria-hidden="true">
          <rect x="35" y="30" width="150" height="200" rx="2" fill="var(--color-log-paper)" stroke="var(--color-border)" />
          <path d="M55 75 H165 M55 105 H165 M55 135 H165" stroke="var(--color-text-muted)" />
          <text x="110" y="178" textAnchor="middle" fill="var(--color-danger)" fontSize="14">本日の欠席者：2名</text>
        </svg>
      ) : null}
      {ending.id === 'endingC' ? (
        <div className="ending-clock" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" fill="var(--color-bg-deep)" stroke="var(--color-accent-glow)" />
            <path className="minute-hand" d="M60 60 L60 18" stroke="var(--color-log-ink)" strokeWidth="3" />
            <path d="M60 60 L82 76" stroke="var(--color-log-ink)" strokeWidth="3" />
          </svg>
          <strong>23:59</strong>
        </div>
      ) : null}
      <div className="ending-copy">
        <p>{ending.title}</p>
        <h2>{ending.subtitle}</h2>
        {ending.body.map((line, index) => (
          <p key={`${line}-${index}`} className={ending.id === 'endingB' && index > 0 ? 'text-glitch' : ''}>
            {ending.id === 'endingB' && index > 0 ? <GlitchText text={line} active amount={0.2} /> : line}
          </p>
        ))}
      </div>
      {ending.id === 'endingC' ? (
        <div className="ending-portraits" aria-label="復元された記録">
          {['player', 'minato', 'librarian', 'clerk', 'absentee', 'yu'].map((id) => (
            <CharacterPortrait key={id} characterId={id} expression={id === 'yu' ? 'restored' : id === 'absentee' ? 'hidden' : 'silent'} chapter="final" size="md" horror={id === 'absentee'} />
          ))}
        </div>
      ) : null}
      <div className="ending-actions">
        <button type="button" onClick={ending.id === 'endingC' ? onCredits : onTitle}>
          {ending.id === 'endingC' ? 'Credits' : 'Title'}
        </button>
      </div>
    </section>
  );
}
