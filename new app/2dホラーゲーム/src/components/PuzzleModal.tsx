import { useEffect, useMemo, useState } from 'react';
import type { PuzzleData } from '../game/types';

interface PuzzleModalProps {
  puzzle: PuzzleData;
  error: string;
  onSubmit: (answer: string | string[]) => boolean;
  onClose: () => void;
}

export function PuzzleModal({ puzzle, error, onSubmit, onClose }: PuzzleModalProps) {
  const [text, setText] = useState('');
  const [hour, setHour] = useState(23);
  const [minute, setMinute] = useState(50);
  const [sequence, setSequence] = useState(() => puzzle.options?.map((option) => option.id) ?? []);
  const [breakers, setBreakers] = useState([true, false, false, true]);
  const [choice, setChoice] = useState('榊ユウ');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setText('');
    setHour(23);
    setMinute(50);
    setSequence(puzzle.options?.map((option) => option.id) ?? []);
    setBreakers([true, false, false, true]);
    setChoice('榊ユウ');
  }, [puzzle.id, puzzle.options]);

  useEffect(() => {
    if (!error) {
      return undefined;
    }
    setShake(true);
    const id = window.setTimeout(() => setShake(false), 450);
    return () => window.clearTimeout(id);
  }, [error]);

  const optionMap = useMemo(() => new Map(puzzle.options?.map((option) => [option.id, option.label]) ?? []), [puzzle.options]);

  const submit = () => {
    let answer: string | string[] = text;
    if (puzzle.kind === 'password' && puzzle.prefix && !text.startsWith(puzzle.prefix)) {
      answer = `${puzzle.prefix}${text}`;
    }
    if (puzzle.kind === 'clock') {
      answer = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
    if (puzzle.kind === 'sequence') {
      answer = sequence;
    }
    if (puzzle.kind === 'breaker') {
      answer = breakers.map((item) => (item ? '1' : '0')).join('');
    }
    if (puzzle.kind === 'photo') {
      answer = choice;
    }
    onSubmit(answer);
  };

  const moveSequence = (index: number, direction: -1 | 1) => {
    const next = [...sequence];
    const target = index + direction;
    if (target < 0 || target >= next.length) {
      return;
    }
    [next[index], next[target]] = [next[target], next[index]];
    setSequence(next);
  };

  return (
    <section className="puzzle-overlay screen-fade" role="dialog" aria-modal="true" aria-label={puzzle.title}>
      <div className={`puzzle-modal ${shake ? 'shake-x' : ''}`}>
        <header>
          <button type="button" onClick={onClose} aria-label="閉じる">×</button>
          <h2>{puzzle.title}</h2>
        </header>
        <p className="puzzle-prompt">{puzzle.prompt}</p>

        {(puzzle.kind === 'password' || puzzle.kind === 'code' || puzzle.kind === 'name') ? (
          <div className="password-input">
            {puzzle.prefix ? <span>{puzzle.prefix}</span> : null}
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={puzzle.placeholder}
              autoFocus
              aria-label={puzzle.title}
            />
          </div>
        ) : null}

        {puzzle.kind === 'clock' ? (
          <div className="clock-puzzle">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="48" fill="var(--color-bg-deep)" stroke="var(--color-border-active)" />
              <path d="M60 60 L60 25 M60 60 L89 75" stroke="var(--color-log-ink)" strokeWidth="3" />
              <circle cx="60" cy="60" r="4" fill="var(--color-danger)" />
            </svg>
            <div className="clock-controls">
              <button type="button" onClick={() => setHour((value) => (value + 1) % 24)}>↑</button>
              <button type="button" onClick={() => setMinute((value) => (value + 1) % 60)}>↑</button>
              <strong>{hour.toString().padStart(2, '0')} : {minute.toString().padStart(2, '0')}</strong>
              <button type="button" onClick={() => setHour((value) => (value + 23) % 24)}>↓</button>
              <button type="button" onClick={() => setMinute((value) => (value + 59) % 60)}>↓</button>
            </div>
          </div>
        ) : null}

        {puzzle.kind === 'sequence' ? (
          <div className="sequence-list">
            {sequence.map((id, index) => (
              <div key={id} className="sequence-row">
                <span>{optionMap.get(id)}</span>
                <div>
                  <button type="button" onClick={() => moveSequence(index, -1)} aria-label="上へ">↑</button>
                  <button type="button" onClick={() => moveSequence(index, 1)} aria-label="下へ">↓</button>
                  <b>≡</b>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {puzzle.kind === 'breaker' ? (
          <div className="breaker-list">
            {breakers.map((enabled, index) => (
              <button key={index} type="button" className={enabled ? 'active' : ''} onClick={() => setBreakers((current) => current.map((item, i) => (i === index ? !item : item)))}>
                {index + 1}<span>{enabled ? 'ON' : 'OFF'}</span>
              </button>
            ))}
          </div>
        ) : null}

        {puzzle.kind === 'photo' ? (
          <div className="photo-choices">
            {['榊ユウ', '榎木ユウ', '榊ミナト'].map((name) => (
              <button key={name} type="button" className={choice === name ? 'active' : ''} onClick={() => setChoice(name)}>{name}</button>
            ))}
          </div>
        ) : null}

        {error ? <p className="puzzle-error">{error}</p> : null}
        <div className="puzzle-actions">
          <button type="button" onClick={submit}>確定する</button>
        </div>
      </div>
    </section>
  );
}
