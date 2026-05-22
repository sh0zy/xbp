import type { ChapterId, Direction, Expression } from '../game/types';
import { characters } from '../characters/characters';
import { spriteClasses } from '../characters/characterStyles';
import { TILE_SIZE } from '../game/constants';
import { getChapterOpacity } from '../characters/characterExpressions';

interface CharacterSpriteProps {
  characterId: string;
  x: number;
  y: number;
  direction?: Direction;
  chapter?: ChapterId;
  expression?: Expression;
  walking?: boolean;
  running?: boolean;
  chase?: boolean;
  hasFlashlight?: boolean;
  tileSize?: number;
}

export function CharacterSprite({
  characterId,
  x,
  y,
  direction = 'down',
  chapter = 'prologue',
  walking = false,
  running = false,
  chase = false,
  hasFlashlight = false,
  tileSize = TILE_SIZE,
}: CharacterSpriteProps) {
  const character = characters[characterId] ?? characters.player;
  const spriteClass = spriteClasses[character.id as keyof typeof spriteClasses] ?? spriteClasses.player;
  const opacity = getChapterOpacity(character.id, chapter);
  const left = x * tileSize + tileSize / 2;
  const top = y * tileSize + tileSize / 2;

  return (
    <div
      className={`character-sprite ${spriteClass} dir-${direction} ${walking ? 'is-walking' : ''} ${running ? 'is-running' : ''} ${chase ? 'is-chasing' : ''}`}
      style={{ left, top, opacity }}
      aria-label={character.name}
    >
      {character.id === 'player' && hasFlashlight ? <span className={`flashlight-beam beam-${direction}`} /> : null}
      <span className="sprite-shadow" />
      <span className="sprite-head" />
      <span className="sprite-hair" />
      <span className="sprite-body" />
      <span className="sprite-bag" />
      <span className="sprite-arm sprite-arm-left" />
      <span className="sprite-arm sprite-arm-right" />
      <span className="sprite-leg sprite-leg-left" />
      <span className="sprite-leg sprite-leg-right" />
      {character.id === 'absentee' ? (
        <>
          <span className="absentee-eye eye-left" />
          <span className="absentee-eye eye-right" />
        </>
      ) : null}
      {character.id === 'clerk' ? <span className="staff-badge" /> : null}
    </div>
  );
}
