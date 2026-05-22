import { useMemo } from 'react';
import { ChapterClearScreen } from './components/ChapterClearScreen';
import { CreditsScreen } from './components/CreditsScreen';
import { EndingScreen } from './components/EndingScreen';
import { GameScreen } from './components/GameScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { LogScreen } from './components/LogScreen';
import { NoiseOverlay } from './components/NoiseOverlay';
import { PauseMenu } from './components/PauseMenu';
import { PuzzleModal } from './components/PuzzleModal';
import { SaveSelectScreen } from './components/SaveSelectScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { TitleScreen } from './components/TitleScreen';
import { useAudioSettings } from './hooks/useAudioSettings';
import { useGameState } from './hooks/useGameState';

export default function App() {
  const game = useGameState();
  const globalAudio = useAudioSettings();

  const latestSlot = useMemo(() => {
    return game.summaries
      .filter((slot) => !slot.isEmpty && slot.updatedAt)
      .sort((a, b) => new Date(b.updatedAt ?? '').getTime() - new Date(a.updatedAt ?? '').getTime())[0];
  }, [game.summaries]);

  const closeOverlay = () => {
    if (game.saveData) {
      game.resume();
    } else {
      game.openTitle();
    }
  };

  return (
    <div className="app-shell">
      {game.screen === 'title' ? (
        <>
          <TitleScreen
            summaries={game.summaries}
            unlockAudio={globalAudio.unlockAudio}
            onStart={game.openSaveSelect}
            onContinue={() => {
              if (latestSlot) {
                game.loadGame(latestSlot.slot);
              }
            }}
            onSettings={game.openSettings}
          />
          <NoiseOverlay enabled={globalAudio.settings.noiseEnabled} intensity={0.025} />
        </>
      ) : null}

      {game.screen === 'saveSelect' ? (
        <SaveSelectScreen
          summaries={game.summaries}
          onBack={game.openTitle}
          onLoad={game.loadGame}
          onNew={game.startNewGame}
          onDelete={game.deleteSave}
        />
      ) : null}

      {game.screen === 'game' && game.saveData ? (
        <GameScreen
          saveData={game.saveData}
          currentMap={game.currentMap}
          currentChapter={game.currentChapter}
          currentDialogue={game.currentDialogue}
          setCurrentDialogue={game.setCurrentDialogue}
          visiblePoints={game.visiblePoints}
          nearestPoint={game.nearestPoint}
          enemyPosition={game.enemyPosition}
          isChaseMode={game.isChaseMode}
          chaseIntensity={game.chaseIntensity}
          jumpscare={game.jumpscare}
          notifications={game.notifications}
          onMove={game.move}
          onInteract={game.interact}
          onPause={game.openPause}
          onOpenLogs={game.openLogs}
          onOpenInventory={game.openInventory}
        />
      ) : null}

      {game.screen === 'pause' ? (
        <PauseMenu
          onResume={game.resume}
          onLogs={game.openLogs}
          onInventory={game.openInventory}
          onSettings={game.openSettings}
          onSave={game.saveGame}
          onTitle={game.openTitle}
        />
      ) : null}

      {game.screen === 'logs' && game.saveData ? (
        <LogScreen
          saveData={game.saveData}
          onClose={closeOverlay}
          onMarkRead={game.markLogRead}
        />
      ) : null}

      {game.screen === 'inventory' && game.saveData ? (
        <InventoryScreen saveData={game.saveData} onClose={closeOverlay} />
      ) : null}

      {game.screen === 'settings' ? (
        <SettingsScreen
          settings={game.saveData?.audioSettings ?? globalAudio.settings}
          onBack={closeOverlay}
          onChange={(settings) => {
            globalAudio.setSettings(settings);
            if (game.saveData) {
              game.updateAudioSettings(settings);
            }
          }}
        />
      ) : null}

      {game.activePuzzle && game.saveData ? (
        <PuzzleModal
          puzzle={game.activePuzzle}
          error={game.puzzleError}
          onSubmit={game.solvePuzzle}
          onClose={game.closePuzzle}
        />
      ) : null}

      {game.screen === 'chapterClear' ? (
        <ChapterClearScreen
          chapter={game.currentChapter}
          logCount={game.counts.logs}
          puzzleCount={game.counts.puzzles}
          onNext={game.continueAfterChapterClear}
        />
      ) : null}

      {game.screen === 'ending' && game.selectedEnding ? (
        <EndingScreen ending={game.selectedEnding} onCredits={game.finishEnding} onTitle={game.openTitle} />
      ) : null}

      {game.screen === 'credits' ? <CreditsScreen onTitle={game.openTitle} /> : null}
    </div>
  );
}
