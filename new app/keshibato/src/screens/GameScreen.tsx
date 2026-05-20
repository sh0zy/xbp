import { useEffect, useMemo, useRef, useState } from 'react';
import { Board } from '../components/Board';
import { HUD } from '../components/HUD';
import { TurnBanner } from '../components/TurnBanner';
import { Button } from '../components/Button';
import { getStage } from '../data/stages';
import { getStageTheme } from '../data/stageThemes';
import { useGameStore } from '../hooks/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { aliveCount, checkWinner, createInitialPieces } from '../game/engine';
import type { Piece, PlayerId } from '../types';
import { computeAILaunch, pickAITarget } from '../utils/ai';
import { composeStats } from '../data/equipments';

export function GameScreen() {
  const match = useGameStore((s) => s.match)!;
  const endMatch = useGameStore((s) => s.endMatch);
  const setScreen = useGameStore((s) => s.setScreen);
  const save = useGameStore((s) => s.save);
  const setSave = useGameStore((s) => s.setSave);
  const { play, vibrate } = useAudio(save.volume, save.vibration);

  const stage = useMemo(() => getStage(match.stageId), [match.stageId]);
  const [pieces, setPieces] = useState<Piece[]>(() => createInitialPieces(match, stage));
  const [currentPlayer, setCurrentPlayer] = useState<PlayerId>(1);
  const [turn, setTurn] = useState(1);
  const [showBanner, setShowBanner] = useState(true);
  const [paused, setPaused] = useState(false);
  const [cpuLaunch, setCpuLaunch] = useState<{ pieceId: string; vx: number; vy: number } | null>(null);
  const [hint, setHint] = useState<string | null>(
    save.tutorialDone ? null : 'コマを指で引っ張って離すと発射！相手を場外に落とそう'
  );
  const endedRef = useRef(false);

  // バナー自動消去
  useEffect(() => {
    if (!showBanner) return;
    const t = setTimeout(() => setShowBanner(false), 900);
    return () => clearTimeout(t);
  }, [showBanner, currentPlayer]);

  // CPU ターンなら発射を計算
  useEffect(() => {
    if (match.mode !== 'solo') return;
    if (currentPlayer !== 2) return;
    if (showBanner || paused) return;
    const pick = pickAITarget(pieces, 2, stage, { level: save.cpuLevel ?? match.difficulty });
    if (!pick) return;
    const power = composeStats(16, 1, pick.attacker.equipments).power;
    const streak = save.cpuStreak?.solo.current ?? 0;
    const launch = computeAILaunch(pick.attacker, pick.target, save.cpuLevel ?? match.difficulty, power, { streak });
    const t = setTimeout(() => setCpuLaunch({ pieceId: launch.attackerId, vx: launch.vx, vy: launch.vy }), 650);
    return () => clearTimeout(t);
  }, [currentPlayer, showBanner, paused, match.mode, match.difficulty, pieces, stage, save.cpuLevel, save.cpuStreak]);

  const handleTurnEnd = (nextPieces: Piece[], kills: number) => {
    setPieces(nextPieces);
    if (kills > 0) vibrate(40);
    // 勝敗判定
    const winner = checkWinner(nextPieces);
    if (winner !== null) {
      if (endedRef.current) return;
      endedRef.current = true;
      play('win');
      vibrate(120);
      // ミッション進捗を少し更新
      setSave((s) => ({
        ...s,
        missionsProgress: {
          ...s.missionsProgress,
          play1: Math.min(1, (s.missionsProgress.play1 ?? 0) + 1),
          koTwo: Math.max(s.missionsProgress.koTwo ?? 0, kills),
        },
      }));
      endMatch(winner);
      return;
    }
    const next: PlayerId = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(next);
    setTurn((t) => t + 1);
    setShowBanner(true);
    setHint(null);
  };

  const p1 = aliveCount(pieces, 1);
  const p2 = aliveCount(pieces, 2);
  const isCpuTurn = match.mode === 'solo' && currentPlayer === 2;
  const theme = getStageTheme(stage.uiThemeId);

  return (
    <div className={`min-h-[100dvh] ${theme.backgroundClass} ${theme.textClass} flex flex-col`}>
      <HUD
        currentPlayer={currentPlayer}
        p1Alive={p1}
        p2Alive={p2}
        turn={turn}
        isCpuTurn={isCpuTurn}
      />

      <div className={`mx-3 mb-1 rounded-xl border px-3 py-1 text-[10px] flex justify-between ${theme.platePlateClass}`}>
        <span className={`font-black ${theme.accentTextClass}`}>{stage.name}</span>
        <span className="opacity-70">{theme.moodLabel ?? ''}</span>
      </div>

      <div className="relative flex-1">
        {showBanner && <TurnBanner player={currentPlayer} cpu={isCpuTurn} />}
        <Board
          stage={stage}
          pieces={pieces}
          currentPlayer={currentPlayer}
          disabled={showBanner || paused || isCpuTurn}
          onTurnEnd={handleTurnEnd}
          externalLaunch={cpuLaunch}
          onAfterExternalLaunch={() => setCpuLaunch(null)}
          onHit={() => play('hit')}
          onFall={() => play('fall')}
          onLaunch={() => play('launch')}
        />
        {hint && (
          <div className="absolute bottom-2 left-0 right-0 mx-auto max-w-xs text-center px-4 py-2 rounded-xl bg-boardEdge/80 text-xs text-accent">
            {hint}
          </div>
        )}
      </div>

      <div className="flex gap-2 p-3">
        <Button variant="secondary" onClick={() => { endedRef.current = false; setPieces(createInitialPieces(match, stage)); setCurrentPlayer(1); setTurn(1); setShowBanner(true); }}>
          リトライ
        </Button>
        <Button variant="secondary" onClick={() => setPaused((v) => !v)}>
          {paused ? '再開' : '一時停止'}
        </Button>
        <Button variant="ghost" onClick={() => setScreen('home')}>ホーム</Button>
      </div>

      {paused && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="p-6 rounded-2xl bg-board space-y-3 w-72">
            <div className="text-center text-lg font-bold">一時停止中</div>
            <Button full onClick={() => setPaused(false)}>再開</Button>
            <Button full variant="secondary" onClick={() => setScreen('home')}>ホームへ戻る</Button>
          </div>
        </div>
      )}
    </div>
  );
}
