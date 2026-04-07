import {
  useEffect,
  useEffectEvent,
  useReducer,
  useRef,
  useState
} from "react";
import { GameShell } from "./components/GameShell";
import { ResultScreen } from "./components/ResultScreen";
import { TitleScreen } from "./components/TitleScreen";
import {
  formatPlayTime,
  gameReducer,
  getActionLabel,
  getActionTarget,
  getAreaText,
  getCurrentDialogue,
  getEndingSummary,
  getInventoryItems,
  getJournalEntries,
  buildViewport,
  createTitleState,
  loadSaveData,
  persistSaveData,
  toSaveData
} from "./game/engine";

const arraysEqual = <T,>(first: T[], second: T[]) =>
  first.length === second.length && first.every((value, index) => value === second[index]);

export default function App() {
  const [storedSave, setStoredSave] = useState(() => loadSaveData());
  const [state, dispatch] = useReducer(gameReducer, storedSave, createTitleState);
  const lastAutoSaveSignature = useRef("");

  const persistCheckpoint = useEffectEvent((message?: string) => {
    if (state.phase !== "exploration" && state.phase !== "dialogue") {
      return;
    }
    if (state.chase.active) {
      return;
    }

    const saveData = toSaveData(state);
    persistSaveData(saveData);
    setStoredSave(saveData);
    if (message) {
      dispatch({ type: "REPORT_SAVE", message });
    }
  });

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const key = event.key.toLowerCase();
    if (key === "escape") {
      event.preventDefault();
      if (state.phase === "title" || state.phase === "ending" || state.phase === "gameover") {
        return;
      }
      if (state.activePanel) {
        dispatch({ type: "CLOSE_PANEL" });
      } else {
        dispatch({ type: "OPEN_MENU" });
      }
      return;
    }

    if (key === "enter" || key === " ") {
      event.preventDefault();
      if (state.phase === "title" || state.phase === "ending" || state.phase === "gameover") {
        return;
      }
      if (state.activePanel) {
        dispatch({ type: "CLOSE_PANEL" });
      } else {
        dispatch({ type: "INTERACT" });
      }
      return;
    }

    if (state.phase !== "exploration" || state.activePanel) {
      return;
    }

    const direction =
      key === "w" || key === "arrowup"
        ? "up"
        : key === "s" || key === "arrowdown"
          ? "down"
          : key === "a" || key === "arrowleft"
            ? "left"
            : key === "d" || key === "arrowright"
              ? "right"
              : null;

    if (direction) {
      event.preventDefault();
      dispatch({ type: "MOVE", direction });
    }
  });

  const handleVisibilityChange = useEffectEvent(() => {
    if (document.visibilityState === "hidden") {
      persistCheckpoint();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleKeyDown, handleVisibilityChange]);

  useEffect(() => {
    if (state.phase === "title" || state.phase === "ending" || state.phase === "gameover") {
      return;
    }
    const timer = window.setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state.phase]);

  const autoSaveSignature =
    state.phase === "exploration" || state.phase === "dialogue"
      ? JSON.stringify({
          phase: state.phase,
          player: state.player,
          inventory: state.inventory.itemIds,
          discoveredJournalIds: state.discoveredJournalIds,
          readJournalIds: state.readJournalIds,
          flags: state.flags,
          activeDialogueId: state.activeDialogueId,
          chaseCompleted: state.chase.completed,
          playTimeBucket: Math.floor(state.playTimeSeconds / 15)
        })
      : "";

  useEffect(() => {
    if (!autoSaveSignature || state.chase.active) {
      return;
    }
    if (lastAutoSaveSignature.current === autoSaveSignature) {
      return;
    }
    const saveData = toSaveData(state);
    persistSaveData(saveData);
    setStoredSave(saveData);
    lastAutoSaveSignature.current = autoSaveSignature;
  }, [autoSaveSignature, state, state.chase.active]);

  useEffect(() => {
    if (state.phase !== "ending") {
      return;
    }

    const baseSave =
      storedSave ??
      toSaveData({
        ...state,
        phase: "exploration",
        activePanel: null,
        activeDialogueId: null,
        currentEnding: null,
        gameOverText: null
      });

    if (arraysEqual(baseSave.seenEndings, state.seenEndings)) {
      return;
    }

    const mergedSave = {
      ...baseSave,
      seenEndings: state.seenEndings
    };
    persistSaveData(mergedSave);
    setStoredSave(mergedSave);
  }, [state, state.phase, state.seenEndings, storedSave]);

  const handleManualSave = () => {
    const timestamp = new Intl.DateTimeFormat("ja-JP", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());
    persistCheckpoint(`記録した ${timestamp}`);
  };

  const handleLoad = () => {
    if (!storedSave) {
      return;
    }
    dispatch({ type: "LOAD_SAVE", save: storedSave });
  };

  const dialogue = getCurrentDialogue(state);
  const actionLabel = getActionLabel(state);
  const actionTarget = getActionTarget(state);
  const areaText = getAreaText(state);
  const viewport = buildViewport(state);
  const inventoryItems = getInventoryItems(state);
  const journalEntries = getJournalEntries(state);
  const endingSummary = getEndingSummary(state.currentEnding);

  const handlePrimaryAction = () => {
    if (state.activePanel) {
      dispatch({ type: "CLOSE_PANEL" });
      return;
    }
    dispatch({ type: "INTERACT" });
  };

  const handleMenuToggle = () => {
    if (state.activePanel) {
      dispatch({ type: "CLOSE_PANEL" });
      return;
    }
    dispatch({ type: "OPEN_MENU" });
  };

  if (state.phase === "title") {
    return (
      <TitleScreen
        hasSave={Boolean(storedSave)}
        seenEndings={state.seenEndings}
        onNewGame={() => dispatch({ type: "NEW_GAME" })}
        onContinue={handleLoad}
      />
    );
  }

  if (state.phase === "gameover") {
    return (
      <ResultScreen
        eyebrow="Game Over"
        title="記録はそこで途切れた"
        body={state.gameOverText ?? "湿った足音が、あなたの行だけを回収していった。"}
        actionLabel={storedSave ? `直前の記録へ (${formatPlayTime(storedSave.playTimeSeconds)})` : "続きなし"}
        hasContinue={Boolean(storedSave)}
        onContinue={handleLoad}
        onTitle={() => dispatch({ type: "RETURN_TITLE" })}
      />
    );
  }

  if (state.phase === "ending" && endingSummary) {
    return (
      <ResultScreen
        eyebrow={endingSummary.ribbon}
        title={endingSummary.title}
        body={endingSummary.body}
        actionLabel={storedSave ? "直前の記録から再開" : "続きなし"}
        hasContinue={Boolean(storedSave)}
        onContinue={handleLoad}
        onTitle={() => dispatch({ type: "RETURN_TITLE" })}
      />
    );
  }

  return (
    <GameShell
      state={state}
      viewport={viewport}
      dialogue={dialogue}
      areaText={areaText}
      actionLabel={actionLabel}
      actionTarget={actionTarget}
      inventoryItems={inventoryItems}
      journalEntries={journalEntries}
      hasSave={Boolean(storedSave)}
      onMove={(direction) => dispatch({ type: "MOVE", direction })}
      onAction={handlePrimaryAction}
      onMenuToggle={handleMenuToggle}
      onOpenPanel={(panel) => dispatch({ type: "OPEN_PANEL", panel })}
      onClosePanel={() => dispatch({ type: "CLOSE_PANEL" })}
      onChooseDialogue={(index) => dispatch({ type: "CHOOSE_DIALOGUE", index })}
      onSelectItem={(itemId) => dispatch({ type: "SELECT_ITEM", itemId })}
      onSelectJournal={(journalId) => dispatch({ type: "SELECT_JOURNAL", journalId })}
      onManualSave={handleManualSave}
      onLoad={handleLoad}
      onBackToTitle={() => dispatch({ type: "RETURN_TITLE" })}
    />
  );
}
