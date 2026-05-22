import { useEffect, useMemo, useRef, useState } from 'react';
import { TILE_SIZE } from '../game/constants';
import type { ChapterData, DialogueData, Direction, InvestigationPoint, MapData, Point, RuntimeNotification, SaveData } from '../game/types';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { CharacterSprite } from './CharacterSprite';
import { DialogueBox } from './DialogueBox';
import { LightMask } from './LightMask';
import { MobileControls } from './MobileControls';
import { NoiseOverlay } from './NoiseOverlay';

interface GameScreenProps {
  saveData: SaveData;
  currentMap: MapData;
  currentChapter: ChapterData;
  currentDialogue: DialogueData | null;
  setCurrentDialogue: (dialogue: DialogueData | null) => void;
  visiblePoints: InvestigationPoint[];
  nearestPoint?: InvestigationPoint;
  enemyPosition: Point | null;
  isChaseMode: boolean;
  chaseIntensity: number;
  jumpscare: { id: string; variant: 'shadow' | 'face' | 'memory'; text: string } | null;
  notifications: RuntimeNotification[];
  onMove: (direction: Direction, running?: boolean) => void;
  onInteract: () => void;
  onPause: () => void;
  onOpenLogs: () => void;
  onOpenInventory: () => void;
}

function tileClass(tile: string): string {
  if (tile === '#') {
    return 'tile-wall';
  }
  if (tile === 'D') {
    return 'tile-door';
  }
  return 'tile-floor';
}

export function GameScreen({
  saveData,
  currentMap,
  currentChapter,
  currentDialogue,
  setCurrentDialogue,
  visiblePoints,
  nearestPoint,
  enemyPosition,
  isChaseMode,
  chaseIntensity,
  jumpscare,
  notifications,
  onMove,
  onInteract,
  onPause,
  onOpenLogs,
  onOpenInventory,
}: GameScreenProps) {
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [isWalking, setIsWalking] = useState(false);
  const [lastMoveWasRun, setLastMoveWasRun] = useState(false);
  const previousPlayerTile = useRef(`${saveData.playerPosition.x},${saveData.playerPosition.y}`);
  const boardWidth = currentMap.width * TILE_SIZE;
  const boardHeight = currentMap.height * TILE_SIZE;
  const scale = Math.min(1, Math.max(0.58, (viewportWidth - 24) / boardWidth));
  const playerLightX = saveData.playerPosition.x * TILE_SIZE + TILE_SIZE / 2;
  const playerLightY = saveData.playerPosition.y * TILE_SIZE + TILE_SIZE / 2;
  const hasUnreadLogs = saveData.collectedLogs.some((id) => !saveData.readLogs.includes(id));

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useKeyboardControls({
    enabled: true,
    move: (direction, running) => {
      setLastMoveWasRun(Boolean(running));
      onMove(direction, running);
    },
    interact: onInteract,
    pause: onPause,
    openLogs: onOpenLogs,
    openInventory: onOpenInventory,
    skipDialogue: () => setCurrentDialogue(null),
  });

  const pointMap = useMemo(() => new Set(visiblePoints.map((point) => `${point.x},${point.y}`)), [visiblePoints]);

  useEffect(() => {
    const current = `${saveData.playerPosition.x},${saveData.playerPosition.y}`;
    if (previousPlayerTile.current === current) {
      return undefined;
    }
    previousPlayerTile.current = current;
    setIsWalking(true);
    const id = window.setTimeout(() => {
      setIsWalking(false);
      setLastMoveWasRun(false);
    }, lastMoveWasRun ? 260 : 340);
    return () => window.clearTimeout(id);
  }, [lastMoveWasRun, saveData.playerPosition.x, saveData.playerPosition.y]);

  return (
    <main className={`game-screen ${isChaseMode ? 'chase-mode' : ''}`} id="game-root">
      <header className="hud-bar">
        <div>
          <span>{currentChapter.title}</span>
          <strong>{currentMap.name}</strong>
        </div>
        <button type="button" onClick={onPause} aria-label="メニュー">≡</button>
      </header>

      <section className="map-area" aria-label={currentMap.name}>
        <div className="map-board-shell" style={{ width: boardWidth * scale, height: boardHeight * scale }}>
          <div
            className={`map-board tint-${currentMap.tint}`}
            style={{ width: boardWidth, height: boardHeight, transform: `scale(${scale})` }}
          >
            {currentMap.tiles.map((row, y) =>
              [...row].map((tile, x) => (
                <span
                  key={`${x}-${y}`}
                  className={`tile ${tileClass(tile)} ${pointMap.has(`${x},${y}`) ? 'tile-has-point' : ''}`}
                  style={{ left: x * TILE_SIZE, top: y * TILE_SIZE }}
                />
              )),
            )}
            {visiblePoints.map((point) => (
              <button
                key={point.id}
                type="button"
                className={`investigation-point ${nearestPoint?.id === point.id ? 'is-near' : ''}`}
                style={{ left: point.x * TILE_SIZE + TILE_SIZE / 2, top: point.y * TILE_SIZE + TILE_SIZE / 2 }}
                onClick={onInteract}
                aria-label={point.label}
              >
                <span />
              </button>
            ))}
            {currentMap.npcs?.map((npc) => (
              <CharacterSprite key={npc.id} characterId={npc.characterId} x={npc.x} y={npc.y} chapter={saveData.currentChapter} />
            ))}
            {currentMap.enemy && enemyPosition ? (
              <CharacterSprite
                characterId="absentee"
                x={enemyPosition.x}
                y={enemyPosition.y}
                chapter={saveData.currentChapter}
                chase={isChaseMode || currentMap.enemy.behavior === 'chase'}
              />
            ) : null}
            <CharacterSprite
              characterId="player"
              x={saveData.playerPosition.x}
              y={saveData.playerPosition.y}
              direction={saveData.direction}
              chapter={saveData.currentChapter}
              hasFlashlight={saveData.inventory.includes('flashlight')}
              walking={isWalking}
              running={isChaseMode || (isWalking && lastMoveWasRun)}
            />
            <LightMask x={playerLightX} y={playerLightY} radius={saveData.inventory.includes('flashlight') ? 210 : 165} danger={chaseIntensity} />
          </div>
        </div>
        <div className="objective-line">
          <span>{currentMap.objective}</span>
          {nearestPoint ? <b>{nearestPoint.label}</b> : null}
        </div>
      </section>

      <div className="notifications" aria-live="polite">
        {notifications.map((notification) => (
          <div key={notification.id} className={`notification ${notification.type}`}>{notification.text}</div>
        ))}
      </div>

      {currentDialogue ? (
        <DialogueBox
          dialogue={currentDialogue}
          chapter={saveData.currentChapter}
          audioSettings={saveData.audioSettings}
          onComplete={() => setCurrentDialogue(null)}
        />
      ) : null}

      {jumpscare ? (
        <div key={jumpscare.id} className={`jumpscare-overlay jumpscare-${jumpscare.variant}`} aria-hidden="true">
          <div className="jumpscare-flash" />
          <div className="jumpscare-shadow">
            <span className="jumpscare-eye left" />
            <span className="jumpscare-eye right" />
          </div>
          <p>{jumpscare.text}</p>
        </div>
      ) : null}

      <MobileControls
        onMove={(direction, running) => {
          setLastMoveWasRun(Boolean(running));
          onMove(direction, running);
        }}
        onInteract={onInteract}
        onOpenLogs={onOpenLogs}
        onOpenInventory={onOpenInventory}
        hasUnreadLogs={hasUnreadLogs}
      />

      <NoiseOverlay
        enabled={saveData.audioSettings.noiseEnabled}
        intensity={(jumpscare ? 0.24 : 0.018) + chaseIntensity * 0.08}
        chase={isChaseMode || Boolean(jumpscare)}
      />
    </main>
  );
}
