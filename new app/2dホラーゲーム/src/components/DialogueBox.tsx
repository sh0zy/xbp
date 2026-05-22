import { useEffect, useMemo, useState } from 'react';
import { characters } from '../characters/characters';
import type { AudioSettings, ChapterId, DialogueData } from '../game/types';
import { CharacterPortrait } from './CharacterPortrait';
import { GlitchText } from './GlitchText';
import { SmartphoneMessage } from './SmartphoneMessage';

interface DialogueBoxProps {
  dialogue: DialogueData;
  chapter: ChapterId;
  audioSettings: AudioSettings;
  onComplete: () => void;
}

const speedMap = {
  slow: 80,
  normal: 50,
  fast: 30,
};

export function DialogueBox({ dialogue, chapter, audioSettings, onComplete }: DialogueBoxProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const line = dialogue.lines[lineIndex];
  const character = characters[line?.speakerId ?? 'player'] ?? characters.player;
  const text = line?.text ?? '';
  const isComplete = visibleCount >= text.length;
  const typedText = useMemo(() => text.slice(0, visibleCount), [text, visibleCount]);

  useEffect(() => {
    setLineIndex(0);
    setVisibleCount(0);
  }, [dialogue.id]);

  useEffect(() => {
    setVisibleCount(0);
  }, [lineIndex]);

  useEffect(() => {
    if (!line || visibleCount >= text.length) {
      return undefined;
    }
    const speed = line.important ? Math.max(70, speedMap[audioSettings.textSpeed]) : speedMap[audioSettings.textSpeed];
    const id = window.setTimeout(() => setVisibleCount((current) => current + 1), speed);
    return () => window.clearTimeout(id);
  }, [audioSettings.textSpeed, line, text.length, visibleCount]);

  const advance = () => {
    if (!isComplete) {
      setVisibleCount(text.length);
      return;
    }
    if (lineIndex < dialogue.lines.length - 1) {
      setLineIndex((current) => current + 1);
      return;
    }
    onComplete();
  };

  if (!line) {
    return null;
  }

  if (line.mode === 'phone') {
    return (
      <button type="button" className="dialogue-box dialogue-phone" onClick={advance} aria-label="メッセージを進める">
        <CharacterPortrait characterId={line.speakerId} expression={line.expression} chapter={chapter} />
        <SmartphoneMessage sender={character.name} text={typedText} expression={line.expression} />
        <span className="dialogue-next">▼</span>
      </button>
    );
  }

  const anomaly = line.mode === 'anomaly';
  const record = line.mode === 'record';

  return (
    <button type="button" className={`dialogue-box ${anomaly ? 'dialogue-anomaly' : ''} ${record ? 'dialogue-record' : ''}`} onClick={advance} aria-label="会話を進める">
      <div className="dialogue-head">
        <CharacterPortrait characterId={line.speakerId} expression={line.expression} chapter={chapter} horror={anomaly} />
        <div>
          <div className="dialogue-name">{character.name}</div>
          <div className="dialogue-role">{record ? '記録断片' : anomaly ? '受信不能' : character.role}</div>
        </div>
      </div>
      <p className="dialogue-text">
        {anomaly ? <GlitchText text={typedText} active amount={0.18} /> : typedText}
      </p>
      <span className="dialogue-next">▼</span>
    </button>
  );
}
