import { useCallback, useEffect, useMemo, useState } from 'react';
import { audioManager } from '../audio/AudioManager';
import { chapters } from '../game/chapters';
import { DEFAULT_AUDIO_SETTINGS } from '../game/constants';
import { dialogues } from '../game/dialogues';
import { endings } from '../game/endings';
import { items } from '../game/items';
import { logs, importantLogIds } from '../game/logs';
import { maps } from '../game/maps';
import { puzzles } from '../game/puzzles';
import { createInitialSave, deleteSlot, getSlotSummaries, loadSlot, saveSlot, updateSlotAfterEnding, writeAudioSettings } from '../game/save';
import type { DialogueData, Direction, InvestigationPoint, Point, RuntimeNotification, SaveData, SaveSlotSummary, ScreenName } from '../game/types';
import { getAmbientForChapter, getChapterForMap, getEndingForFinalName, getCurrentPuzzleHint, isPuzzleAnswerCorrect } from '../game/progression';
import { distance, isWalkable } from '../utils/collision';
import { getNearestPoint, hasRequirements, isHiddenPoint } from '../utils/mapHelpers';
import { clamp, makeId } from '../utils/random';

type PendingChapterTarget = {
  targetMapId: string;
  targetPosition: Point;
  fromChapter: string;
};

export function useGameState() {
  const [screen, setScreen] = useState<ScreenName>('title');
  const [saveData, setSaveData] = useState<SaveData | null>(null);
  const [summaries, setSummaries] = useState<SaveSlotSummary[]>(() => getSlotSummaries());
  const [currentDialogue, setCurrentDialogue] = useState<DialogueData | null>(null);
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);
  const [puzzleError, setPuzzleError] = useState<string>('');
  const [notifications, setNotifications] = useState<RuntimeNotification[]>([]);
  const [pendingChapter, setPendingChapter] = useState<PendingChapterTarget | null>(null);
  const [endingId, setEndingId] = useState<'endingA' | 'endingB' | 'endingC' | null>(null);
  const [enemyPosition, setEnemyPosition] = useState<Point | null>(null);
  const [isChaseMode, setIsChaseMode] = useState(false);
  const [lastInteractionLabel, setLastInteractionLabel] = useState<string>('');
  const [jumpscare, setJumpscare] = useState<{ id: string; variant: 'shadow' | 'face' | 'memory'; text: string } | null>(null);

  const currentMap = saveData ? maps[saveData.currentMapId] : maps.gate;
  const currentChapter = saveData ? chapters[saveData.currentChapter] : chapters.prologue;
  const activePuzzle = activePuzzleId ? puzzles[activePuzzleId] : null;
  const selectedEnding = endingId ? endings[endingId] : null;

  const pushNotification = useCallback((type: RuntimeNotification['type'], text: string) => {
    const notification = { id: makeId(type), type, text };
    setNotifications((current) => [...current, notification]);
    window.setTimeout(() => {
      setNotifications((current) => current.filter((item) => item.id !== notification.id));
    }, 3200);
  }, []);

  const triggerJumpscare = useCallback((variant: 'shadow' | 'face' | 'memory' = 'shadow', text = '出席確認') => {
    const id = makeId('jumpscare');
    setJumpscare({ id, variant, text });
    audioManager.play('approach');
    window.setTimeout(() => setJumpscare((current) => (current?.id === id ? null : current)), 950);
  }, []);

  const persist = useCallback((next: SaveData) => {
    saveSlot(next);
    setSummaries(getSlotSummaries());
  }, []);

  const updateSave = useCallback((updater: (current: SaveData) => SaveData, shouldPersist = false) => {
    setSaveData((current) => {
      if (!current) {
        return current;
      }
      const next = updater(current);
      if (shouldPersist) {
        persist(next);
      }
      return next;
    });
  }, [persist]);

  const collectLog = useCallback((logId: string, shouldNotify = true) => {
    const log = logs[logId];
    if (!log) {
      return;
    }
    updateSave((current) => {
      if (current.collectedLogs.includes(logId)) {
        return current;
      }
      const now = new Date().toISOString();
      if (shouldNotify) {
        pushNotification('log', `記録取得：${log.title}`);
        audioManager.play('log');
      }
      return {
        ...current,
        collectedLogs: [...current.collectedLogs, logId],
        logDiscoveredAt: { ...current.logDiscoveredAt, [logId]: now },
      };
    }, true);
  }, [pushNotification, updateSave]);

  const collectItem = useCallback((itemId: string, shouldNotify = true) => {
    const item = items[itemId];
    if (!item) {
      return;
    }
    updateSave((current) => {
      if (current.inventory.includes(itemId)) {
        return current;
      }
      const now = new Date().toISOString();
      if (shouldNotify) {
        pushNotification('item', `入手：${item.name}`);
        audioManager.play('inspect');
      }
      return {
        ...current,
        inventory: [...current.inventory, itemId],
        itemObtainedAt: { ...current.itemObtainedAt, [itemId]: now },
      };
    }, true);
  }, [pushNotification, updateSave]);

  const startDialogue = useCallback((dialogueId: string) => {
    const dialogue = dialogues[dialogueId];
    if (dialogue) {
      setCurrentDialogue(dialogue);
      updateSave((current) => ({
        ...current,
        discoveredDialogues: current.discoveredDialogues.includes(dialogueId)
          ? current.discoveredDialogues
          : [...current.discoveredDialogues, dialogueId],
      }), true);
    }
  }, [updateSave]);

  const transitionToMap = useCallback((mapId: string, position?: Point) => {
    const targetMap = maps[mapId];
    if (!targetMap) {
      return;
    }
    audioManager.play('door');
    updateSave((current) => ({
      ...current,
      currentMapId: mapId,
      currentChapter: getChapterForMap(mapId),
      playerPosition: position ?? targetMap.spawn,
      checkpoint: { mapId, position: position ?? targetMap.spawn },
    }), true);
    setEnemyPosition(targetMap.enemy ? { x: targetMap.enemy.x, y: targetMap.enemy.y } : null);
  }, [updateSave]);

  const startNewGame = useCallback((slot: number) => {
    const next = createInitialSave(slot);
    setSaveData(next);
    persist(next);
    setScreen('game');
    setCurrentDialogue(dialogues.opening);
    setEndingId(null);
    setEnemyPosition(maps[next.currentMapId].enemy ? { x: maps[next.currentMapId].enemy!.x, y: maps[next.currentMapId].enemy!.y } : null);
    audioManager.startAmbient('campus');
  }, [persist]);

  const loadGame = useCallback((slot: number) => {
    const loaded = loadSlot(slot);
    if (!loaded) {
      startNewGame(slot);
      return;
    }
    setSaveData(loaded);
    setScreen('game');
    setCurrentDialogue(null);
    setEndingId(null);
    const map = maps[loaded.currentMapId];
    setEnemyPosition(map.enemy ? { x: map.enemy.x, y: map.enemy.y } : null);
    audioManager.setSettings(loaded.audioSettings);
    audioManager.startAmbient(getAmbientForChapter(loaded.currentChapter));
  }, [startNewGame]);

  const deleteSave = useCallback((slot: number) => {
    deleteSlot(slot);
    setSummaries(getSlotSummaries());
  }, []);

  const saveGame = useCallback(() => {
    if (!saveData) {
      return;
    }
    const ok = saveSlot(saveData);
    pushNotification(ok ? 'save' : 'warning', ok ? 'セーブしました' : 'セーブに失敗しました');
    if (ok) {
      audioManager.play('save');
      setSummaries(getSlotSummaries());
    }
  }, [pushNotification, saveData]);

  const visiblePoints = useMemo(() => {
    if (!saveData) {
      return [];
    }
    return currentMap.points.filter((point) => {
      if (isHiddenPoint(point, saveData.collectedLogs, saveData.inventory, saveData.solvedPuzzles)) {
        return false;
      }
      if (point.kind === 'log' && point.logId && saveData.collectedLogs.includes(point.logId)) {
        return false;
      }
      if (point.kind === 'item' && point.itemId && saveData.inventory.includes(point.itemId)) {
        return false;
      }
      if (point.kind === 'puzzle' && point.puzzleId && saveData.solvedPuzzles.includes(point.puzzleId)) {
        return false;
      }
      if (point.kind === 'dialogue' && point.dialogueId && saveData.discoveredDialogues.includes(point.dialogueId)) {
        return false;
      }
      return true;
    });
  }, [currentMap.points, saveData]);

  const nearestPoint = useMemo(() => {
    if (!saveData) {
      return undefined;
    }
    return getNearestPoint({ ...currentMap, points: visiblePoints }, saveData.playerPosition);
  }, [currentMap, saveData, visiblePoints]);

  const move = useCallback((direction: Direction, running = false) => {
    if (!saveData || currentDialogue || activePuzzleId || screen !== 'game') {
      return;
    }
    const delta: Record<Direction, Point> = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    const step = running ? 1 : 1;
    const next = {
      x: saveData.playerPosition.x + delta[direction].x * step,
      y: saveData.playerPosition.y + delta[direction].y * step,
    };
    if (!isWalkable(currentMap, next)) {
      updateSave((current) => ({ ...current, direction }));
      audioManager.play('noise');
      return;
    }
    updateSave((current) => ({
      ...current,
      direction,
      playerPosition: next,
      playTimeSeconds: current.playTimeSeconds + (running ? 2 : 1),
    }));
    audioManager.play('footstep');
    if (running && currentMap.enemy && enemyPosition && distance(next, enemyPosition) < (currentMap.enemy.triggerDistance ?? 4)) {
      setIsChaseMode(true);
      audioManager.startChase();
    }
  }, [activePuzzleId, currentDialogue, currentMap, enemyPosition, saveData, screen, updateSave]);

  const interact = useCallback(() => {
    if (!saveData || screen !== 'game') {
      return;
    }
    if (currentDialogue) {
      return;
    }
    const point = nearestPoint;
    if (!point) {
      pushNotification('system', '調べられるものは近くにない');
      return;
    }
    setLastInteractionLabel(point.label);
    if (!hasRequirements(point, saveData.collectedLogs, saveData.inventory, saveData.solvedPuzzles)) {
      pushNotification('warning', `${point.label}：まだ手がかりが足りない`);
      audioManager.play('error');
      return;
    }

    audioManager.play('inspect');
    const alreadySawDialogue = point.dialogueId ? saveData.discoveredDialogues.includes(point.dialogueId) : false;
    if (!alreadySawDialogue && ['hall_chase', 'hide_event', 'big_chase_dialogue', 'final_intro'].includes(point.id)) {
      triggerJumpscare(point.id === 'final_intro' ? 'memory' : point.id === 'hide_event' ? 'face' : 'shadow');
    }
    if (point.kind === 'log' && point.logId) {
      collectLog(point.logId);
      if (point.dialogueId) {
        startDialogue(point.dialogueId);
      }
      return;
    }
    if (point.kind === 'item' && point.itemId) {
      collectItem(point.itemId);
      return;
    }
    if (point.kind === 'dialogue' && point.dialogueId) {
      startDialogue(point.dialogueId);
      return;
    }
    if (point.kind === 'puzzle' && point.puzzleId) {
      setPuzzleError('');
      setActivePuzzleId(point.puzzleId);
      return;
    }
    if (point.kind === 'transition' && point.targetMapId) {
      transitionToMap(point.targetMapId, point.targetPosition);
      return;
    }
    if (point.kind === 'chapterEnd' && point.targetMapId) {
      setPendingChapter({
        targetMapId: point.targetMapId,
        targetPosition: point.targetPosition ?? maps[point.targetMapId].spawn,
        fromChapter: saveData.currentChapter,
      });
      setScreen('chapterClear');
      return;
    }
    if (point.kind === 'ending') {
      const finalEnding = saveData.endingFlags.finalEnding as boolean | undefined;
      const selected = finalEnding ? (saveData.choices.finalEnding as 'endingA' | 'endingB' | 'endingC') : 'endingA';
      setEndingId(selected);
      setScreen('ending');
    }
  }, [collectItem, collectLog, currentDialogue, nearestPoint, pushNotification, saveData, screen, startDialogue, transitionToMap, triggerJumpscare]);

  const solvePuzzle = useCallback((answer: string | string[]) => {
    if (!saveData || !activePuzzle) {
      return false;
    }
    const correct = isPuzzleAnswerCorrect(activePuzzle, answer);
    if (activePuzzle.id === 'final-name') {
      const textAnswer = Array.isArray(answer) ? answer.join(' ') : answer;
      const ending = getEndingForFinalName(saveData, textAnswer, correct);
      const next = updateSlotAfterEnding({
        ...saveData,
        solvedPuzzles: correct && !saveData.solvedPuzzles.includes(activePuzzle.id)
          ? [...saveData.solvedPuzzles, activePuzzle.id]
          : saveData.solvedPuzzles,
        choices: { ...saveData.choices, finalName: textAnswer, finalEnding: ending },
        endingFlags: { ...saveData.endingFlags, finalEnding: true },
      }, ending);
      setSaveData(next);
      setActivePuzzleId(null);
      setEndingId(ending);
      setScreen('ending');
      audioManager.play(ending === 'endingB' ? 'noise' : 'success');
      return true;
    }

    if (!correct) {
      setPuzzleError(activePuzzle.failureText ?? '正しくない。近くの記録を見直そう。');
      audioManager.play('error');
      return false;
    }

    const nextSolved = saveData.solvedPuzzles.includes(activePuzzle.id)
      ? saveData.solvedPuzzles
      : [...saveData.solvedPuzzles, activePuzzle.id];
    const rewardLogs = activePuzzle.rewardLogs ?? [];
    const rewardItems = activePuzzle.rewardItems ?? [];
    const now = new Date().toISOString();
    const nextLogs = Array.from(new Set([...saveData.collectedLogs, ...rewardLogs]));
    const nextItems = Array.from(new Set([...saveData.inventory, ...rewardItems]));
    const next: SaveData = {
      ...saveData,
      solvedPuzzles: nextSolved,
      collectedLogs: nextLogs,
      inventory: nextItems,
      logDiscoveredAt: rewardLogs.reduce((acc, id) => ({ ...acc, [id]: saveData.logDiscoveredAt[id] ?? now }), saveData.logDiscoveredAt),
      itemObtainedAt: rewardItems.reduce((acc, id) => ({ ...acc, [id]: saveData.itemObtainedAt[id] ?? now }), saveData.itemObtainedAt),
    };
    setSaveData(next);
    persist(next);
    setActivePuzzleId(null);
    setPuzzleError('');
    rewardLogs.forEach((id) => pushNotification('log', `記録取得：${logs[id]?.title ?? id}`));
    rewardItems.forEach((id) => pushNotification('item', `入手：${items[id]?.name ?? id}`));
    audioManager.play(activePuzzle.id === 'pc-login' ? 'pc' : 'success');
    if (activePuzzle.successDialogueId) {
      startDialogue(activePuzzle.successDialogueId);
    }
    return true;
  }, [activePuzzle, persist, pushNotification, saveData, startDialogue]);

  const closePuzzle = useCallback(() => {
    setActivePuzzleId(null);
    setPuzzleError('');
  }, []);

  const continueAfterChapterClear = useCallback(() => {
    if (!pendingChapter) {
      setScreen('game');
      return;
    }
    transitionToMap(pendingChapter.targetMapId, pendingChapter.targetPosition);
    setPendingChapter(null);
    setScreen('game');
  }, [pendingChapter, transitionToMap]);

  const markLogRead = useCallback((logId: string) => {
    updateSave((current) => {
      if (current.readLogs.includes(logId)) {
        return current;
      }
      return { ...current, readLogs: [...current.readLogs, logId] };
    }, true);
  }, [updateSave]);

  const requestHint = useCallback((puzzleId?: string) => {
    updateSave((current) => {
      const id = puzzleId ?? currentMap.points.find((point) => point.kind === 'puzzle' && point.puzzleId && !current.solvedPuzzles.includes(point.puzzleId))?.puzzleId;
      if (!id) {
        pushNotification('system', currentMap.objective);
        return current;
      }
      const puzzle = puzzles[id];
      const nextLevel = clamp((current.hintLevels[id] ?? 0) + 1, 0, puzzle.hints.length - 1);
      pushNotification('system', puzzle.hints[nextLevel]);
      return { ...current, hintLevels: { ...current.hintLevels, [id]: nextLevel } };
    }, true);
  }, [currentMap, pushNotification, updateSave]);

  const updateAudioSettings = useCallback((settings: SaveData['audioSettings']) => {
    writeAudioSettings(settings);
    audioManager.setSettings(settings);
    updateSave((current) => ({ ...current, audioSettings: settings }), true);
  }, [updateSave]);

  useEffect(() => {
    if (screen !== 'game') {
      return undefined;
    }
    const id = window.setInterval(() => {
      updateSave((current) => ({ ...current, playTimeSeconds: current.playTimeSeconds + 1 }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [screen, updateSave]);

  useEffect(() => {
    if (!saveData) {
      return;
    }
    audioManager.startAmbient(getAmbientForChapter(saveData.currentChapter));
  }, [saveData?.currentChapter]);

  useEffect(() => {
    if (!saveData) {
      return undefined;
    }
    const enemy = currentMap.enemy;
    if (!enemy) {
      setEnemyPosition(null);
      setIsChaseMode(false);
      return undefined;
    }
    if (!enemyPosition) {
      setEnemyPosition({ x: enemy.x, y: enemy.y });
    }
    const intervalMs = saveData.inventory.includes('flashlight') ? 900 : 700;
    const id = window.setInterval(() => {
      setEnemyPosition((current) => {
        if (!current) {
          return { x: enemy.x, y: enemy.y };
        }
        if (enemy.behavior === 'patrol' && enemy.patrol?.length) {
          const nearestIndex = enemy.patrol.findIndex((point) => point.x === current.x && point.y === current.y);
          return enemy.patrol[(nearestIndex + 1 + enemy.patrol.length) % enemy.patrol.length];
        }
        if (enemy.behavior !== 'chase') {
          return current;
        }
        const dx = Math.sign(saveData.playerPosition.x - current.x);
        const dy = Math.sign(saveData.playerPosition.y - current.y);
        const next = Math.abs(saveData.playerPosition.x - current.x) > Math.abs(saveData.playerPosition.y - current.y)
          ? { x: current.x + dx, y: current.y }
          : { x: current.x, y: current.y + dy };
        return isWalkable(currentMap, next) ? next : current;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [currentMap, enemyPosition, saveData]);

  useEffect(() => {
    if (!saveData || !enemyPosition || !currentMap.enemy) {
      return;
    }
    const d = distance(saveData.playerPosition, enemyPosition);
    if (d < 0.8 && currentMap.enemy.behavior === 'chase') {
      pushNotification('warning', '接触された。少し前からやり直す');
      triggerJumpscare('face', '欠席');
      audioManager.play('approach');
      transitionToMap(saveData.checkpoint.mapId, saveData.checkpoint.position);
      setIsChaseMode(false);
    } else if (d < (currentMap.enemy.triggerDistance ?? 4) && currentMap.enemy.behavior === 'chase') {
      setIsChaseMode(true);
      audioManager.startChase();
    } else if (isChaseMode && d > 8) {
      setIsChaseMode(false);
      audioManager.stopChase(getAmbientForChapter(saveData.currentChapter));
    }
  }, [currentMap.enemy, enemyPosition, isChaseMode, pushNotification, saveData, transitionToMap, triggerJumpscare]);

  const chaseIntensity = useMemo(() => {
    if (!saveData || !enemyPosition || !currentMap.enemy) {
      return 0;
    }
    const d = distance(saveData.playerPosition, enemyPosition);
    return clamp(1 - d / (currentMap.enemy.triggerDistance ?? 6), 0, isChaseMode ? 1 : 0.7);
  }, [currentMap.enemy, enemyPosition, isChaseMode, saveData]);

  const currentHint = saveData ? getCurrentPuzzleHint(saveData) : '';
  const counts = saveData
    ? {
        logs: saveData.collectedLogs.length,
        important: saveData.collectedLogs.filter((id) => importantLogIds.includes(id)).length,
        puzzles: saveData.solvedPuzzles.length,
      }
    : { logs: 0, important: 0, puzzles: 0 };

  return {
    screen,
    setScreen,
    saveData,
    summaries,
    currentMap,
    currentChapter,
    currentDialogue,
    setCurrentDialogue,
    activePuzzle,
    puzzleError,
    notifications,
    pendingChapter,
    selectedEnding,
    enemyPosition,
    isChaseMode,
    chaseIntensity,
    jumpscare,
    nearestPoint,
    visiblePoints,
    currentHint,
    counts,
    lastInteractionLabel,
    startNewGame,
    loadGame,
    deleteSave,
    saveGame,
    move,
    interact,
    solvePuzzle,
    closePuzzle,
    continueAfterChapterClear,
    markLogRead,
    requestHint,
    collectLog,
    collectItem,
    startDialogue,
    updateAudioSettings,
    openTitle: () => setScreen('title'),
    openSaveSelect: () => {
      setSummaries(getSlotSummaries());
      setScreen('saveSelect');
    },
    openLogs: () => setScreen('logs'),
    openInventory: () => setScreen('inventory'),
    openSettings: () => setScreen('settings'),
    openPause: () => setScreen('pause'),
    resume: () => setScreen('game'),
    showCredits: () => setScreen('credits'),
    finishEnding: () => {
      audioManager.startAmbient('title');
      setScreen('credits');
    },
    audioSettings: saveData?.audioSettings ?? DEFAULT_AUDIO_SETTINGS,
  };
}
