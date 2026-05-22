import type { ChapterId, Expression } from '../game/types';
import { characters } from '../characters/characters';
import { expressionStyles, getChapterOpacity } from '../characters/characterExpressions';
import { portraitTones } from '../characters/characterStyles';

interface CharacterPortraitProps {
  characterId: string;
  expression?: Expression;
  chapter?: ChapterId;
  size?: 'sm' | 'md' | 'lg';
  horror?: boolean;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 96,
};

export function CharacterPortrait({ characterId, expression = 'neutral', chapter = 'prologue', size = 'md', horror = false }: CharacterPortraitProps) {
  const character = characters[characterId] ?? characters.player;
  const tone = portraitTones[character.id as keyof typeof portraitTones] ?? portraitTones.player;
  const style = expressionStyles[expression] ?? expressionStyles.neutral;
  const px = sizeMap[size];
  const opacity = getChapterOpacity(character.id, chapter);
  const filterId = `noise-${character.id}-${expression}-${size}`;
  const hidden = style.eye === 'hidden' || expression === 'hidden';
  const glitched = style.filter === 'glitch' || horror;
  const restored = style.filter === 'restored';

  if (character.id === 'absentee') {
    return (
      <svg className={`portrait portrait-${size} ${glitched ? 'portrait-glitch' : ''}`} width={px} height={px} viewBox="0 0 48 48" role="img" aria-label={character.name}>
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="23" />
            <feDisplacementMap in="SourceGraphic" scale={glitched ? '3' : '1'} />
          </filter>
        </defs>
        <rect width="48" height="48" rx="4" fill={tone.background} />
        <path d="M24 6 C15 8 12 18 14 29 C15 39 19 45 24 45 C29 45 34 39 35 29 C37 17 33 8 24 6Z" fill="var(--color-bg-deep)" stroke="var(--color-border)" filter={`url(#${filterId})`} />
        <path d="M16 30 C12 34 10 39 9 45" stroke="var(--color-bg-deep)" strokeWidth="4" />
        <path d="M32 30 C37 34 39 39 40 45" stroke="var(--color-bg-deep)" strokeWidth="4" />
        <rect x="18" y="19" width="4" height="1.5" fill="var(--color-danger)" opacity="0.75" />
        <rect x="27" y="19" width="4" height="1.5" fill="var(--color-danger)" opacity="0.75" />
        {restored ? <path d="M18 34 Q24 38 30 34" stroke="var(--color-log-ink)" strokeWidth="1" fill="none" opacity="0.55" /> : null}
      </svg>
    );
  }

  const eyeY = style.eye === 'wide' ? 21 : style.eye === 'down' ? 23 : 22;
  const eyeH = style.eye === 'wide' ? 4 : style.eye === 'noise' ? 2 : 2.5;
  const mouthPath = style.mouth === 'open'
    ? 'M21 33 Q24 36 27 33 Q24 39 21 33'
    : style.mouth === 'down'
      ? 'M20 34 Q24 31 28 34'
      : 'M20 33 Q24 34 28 33';

  return (
    <svg className={`portrait portrait-${size} ${glitched ? 'portrait-glitch' : ''} ${restored ? 'portrait-restored' : ''}`} width={px} height={px} viewBox="0 0 48 48" role="img" aria-label={character.name} style={{ opacity }}>
      <defs>
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency={glitched ? '0.75' : '0.2'} numOctaves="2" seed="58" />
          <feDisplacementMap in="SourceGraphic" scale={glitched ? '2.5' : '0'} />
        </filter>
        <clipPath id={`${filterId}-clip`}>
          <rect x="6" y="5" width="36" height="39" rx="4" />
        </clipPath>
      </defs>
      <rect width="48" height="48" rx="4" fill={tone.background} />
      <g clipPath={`url(#${filterId}-clip)`} filter={glitched ? `url(#${filterId})` : undefined}>
        <rect x="10" y="30" width="28" height="18" rx="4" fill={tone.outfit} />
        {character.id === 'player' ? <path d="M11 18 C12 8 20 6 24 6 C32 6 37 12 37 21 L34 34 L14 34 Z" fill={tone.outfit} /> : null}
        {character.id === 'minato' ? <path d="M11 14 C15 7 32 6 37 16 C32 12 24 15 19 14 C16 15 14 17 11 20 Z" fill={tone.hair} /> : null}
        {character.id === 'yu' ? <path d="M12 12 C17 7 31 8 36 15 C35 19 34 23 33 27 C28 23 21 21 14 25 C13 20 12 16 12 12 Z" fill={tone.hair} opacity="0.75" /> : null}
        {character.id === 'librarian' ? <path d="M13 13 C17 8 31 8 35 13 L34 27 C29 24 20 24 14 27 Z" fill={tone.hair} /> : null}
        {character.id === 'clerk' ? <path d="M12 12 H36 V27 H12 Z" fill={tone.hair} /> : null}
        <ellipse cx="24" cy="23" rx={character.id === 'clerk' ? 10 : 11} ry="13" fill={tone.skin ?? 'var(--color-log-ink)'} />
        {character.id === 'player' ? <path d="M13 15 C16 9 32 9 35 16 C32 14 29 13 24 13 C19 13 16 14 13 15 Z" fill="var(--color-bg-deep)" opacity="0.7" /> : null}
        {character.id === 'librarian' ? (
          <g opacity="0.75">
            <rect x="16" y="20" width="7" height="5" rx="1" stroke={tone.accent} fill="none" />
            <rect x="25" y="20" width="7" height="5" rx="1" stroke={tone.accent} fill="none" />
            <path d="M23 22 H25" stroke={tone.accent} />
          </g>
        ) : null}
        {style.brow !== 'gone' ? (
          <g stroke={tone.shadow} strokeWidth="1.4" opacity="0.8">
            <path d={style.brow === 'pinched' ? 'M17 18 L22 20' : style.brow === 'raised' ? 'M17 17 L22 16' : 'M17 18 L22 18'} />
            <path d={style.brow === 'pinched' ? 'M31 18 L26 20' : style.brow === 'raised' ? 'M31 17 L26 16' : 'M31 18 L26 18'} />
          </g>
        ) : null}
        {!hidden ? (
          <g fill={style.eye === 'noise' ? 'var(--color-danger)' : 'var(--color-bg-deep)'} opacity={style.eye === 'noise' ? 0.7 : 0.9}>
            <rect x="18" y={eyeY} width="3" height={eyeH} rx="1" />
            <rect x="27" y={eyeY} width="3" height={eyeH} rx="1" />
          </g>
        ) : null}
        {style.mouth !== 'none' ? <path d={mouthPath} stroke="var(--color-bg-deep)" strokeWidth="1.2" fill={style.mouth === 'open' ? 'var(--color-bg-deep)' : 'none'} opacity="0.75" /> : null}
        {character.id === 'yu' && opacity < 0.95 ? (
          <g opacity={1 - opacity}>
            <rect x="8" y="8" width="16" height="30" fill="var(--color-bg-deep)" opacity="0.55" />
            <path d="M31 6 L43 42" stroke="var(--color-border)" strokeWidth="3" />
          </g>
        ) : null}
        {hidden ? <rect x="10" y="9" width="28" height="28" fill="var(--color-bg-deep)" opacity="0.82" /> : null}
      </g>
      <rect x="0.5" y="0.5" width="47" height="47" rx="4" fill="none" stroke={glitched ? 'var(--color-danger)' : 'var(--color-border)'} />
    </svg>
  );
}
