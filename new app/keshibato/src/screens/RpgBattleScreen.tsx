import { useEffect, useMemo, useRef, useState } from 'react';
import { Board } from '../components/Board';
import { Button } from '../components/Button';
import { EnemyPreview } from '../components/EnemyPreview';
import { useGameStore } from '../hooks/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { buildRpgStage, mutationStageAtProgress } from '../data/rpgStages';
import { getEnemy } from '../data/rpgEnemies';
import { createRpgPieces, rpgStageToStageData } from '../game/rpgEngine';
import { aliveCount } from '../game/engine';
import { composeStats } from '../data/equipments';
import { computeAILaunch, pickAITarget } from '../utils/ai';
import type { Piece, PlayerId } from '../types';

/** 前景の雰囲気トーン(mutationStage別の背景グラデ) */
const TONE_BG: Record<number, string> = {
  0: 'from-[#1e2a3a] via-[#2a3545] to-[#1e2a3a]',
  1: 'from-[#2a2030] via-[#3a2a3a] to-[#1e1a24]',
  2: 'from-[#1a1028] via-[#2a1838] to-[#0a0418]',
  3: 'from-[#10081a] via-[#1a0820] to-[#050210]',
  4: 'from-[#000005] via-[#1a0010] to-[#000000]',
};

const TONE_TEXT: Record<number, string> = {
  0: 'text-accent',
  1: 'text-amber-300',
  2: 'text-violet-300',
  3: 'text-fuchsia-400',
  4: 'text-rose-500',
};

export function RpgBattleScreen() {
  const save = useGameStore((s) => s.save);
  const rpgResolve = useGameStore((s) => s.rpgResolve);
  const setScreen = useGameStore((s) => s.setScreen);
  const { play, vibrate } = useAudio(save.volume, save.vibration);

  const rpg = save.rpg!;
  const level = rpg.currentStage;
  const difficulty = rpg.selectedDifficulty;

  const rpgStage = useMemo(() => buildRpgStage(level), [level]);
  const stage = useMemo(() => rpgStageToStageData(rpgStage), [rpgStage]);
  const enemies = useMemo(() => rpgStage.enemyIds.map(getEnemy), [rpgStage]);

  // UIトーン: ボス撃破による世界基準の変化を反映
  const worldMutation = mutationStageAtProgress(rpg.maxUnlockedStage, rpg.defeatedBosses);
  const displayMutation = Math.max(worldMutation, rpgStage.mutationStage) as 0 | 1 | 2 | 3 | 4;

  // 連勝相当ボーナス: ボス撃破数 + レベル帯で擬似的に蓄積
  const streakLikeBonus = rpg.bossClearCount + Math.floor(level / 80);

  // プレイヤー装備: 前回のloadoutsがあれば再利用、なければ 'none'
  const playerLoadout = useMemo(() => {
    const existing = useGameStore.getState().match?.loadouts?.[1];
    if (existing && existing.length > 0) return existing.slice(0, 3);
    return [['none'], ['none'], ['none']] as import('../types').EquipmentId[][];
  }, []);

  const initialPieces = useMemo(
    () =>
      createRpgPieces({
        playerLoadout,
        enemyIds: rpgStage.enemyIds,
        rpgStage,
        streakLikeBonus,
      }),
    [rpgStage, playerLoadout, streakLikeBonus]
  );

  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerId>(1);
  const [cpuLaunch, setCpuLaunch] = useState<{ pieceId: string; vx: number; vy: number } | null>(null);
  const [flashStart, setFlashStart] = useState(true);
  const endedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setFlashStart(false), 650);
    return () => clearTimeout(t);
  }, []);

  // CPU思考
  useEffect(() => {
    if (currentPlayer !== 2 || endedRef.current) return;
    const pick = pickAITarget(pieces, 2, stage, { level: difficulty });
    if (!pick) return;
    const enemyData = getEnemy(pick.attacker.enemyId ?? rpgStage.enemyIds[0] ?? 'slime');
    const power = composeStats(16, 1, pick.attacker.equipments).power * (pick.attacker.extraPowerScale ?? 1);
    const launch = computeAILaunch(pick.attacker, pick.target, difficulty, power, {
      streak: streakLikeBonus,
      aiStyle: pick.attacker.aiStyle ?? enemyData.aiStyle,
    });
    const t = setTimeout(
      () => setCpuLaunch({ pieceId: launch.attackerId, vx: launch.vx, vy: launch.vy }),
      500
    );
    return () => clearTimeout(t);
  }, [currentPlayer, pieces, stage, difficulty, rpgStage, streakLikeBonus]);

  const handleTurnEnd = (nextPieces: Piece[]) => {
    setPieces(nextPieces);
    const a = aliveCount(nextPieces, 1);
    const b = aliveCount(nextPieces, 2);
    if (a === 0 || b === 0) {
      if (endedRef.current) return;
      endedRef.current = true;
      const playerWon = b === 0; // 同時全滅はプレイヤー勝ち扱い
      if (playerWon) { play('win'); vibrate(120); } else { vibrate(40); }
      setTimeout(() => rpgResolve(playerWon), 280);
      return;
    }
    const next: PlayerId = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(next);
  };

  const isBoss = rpgStage.bossStage;
  const bossEnemy = isBoss ? enemies[0] : null;
  const p1 = aliveCount(pieces, 1);
  const p2 = aliveCount(pieces, 2);

  return (
    <div className={`min-h-[100dvh] text-ink flex flex-col bg-gradient-to-b ${TONE_BG[displayMutation]}`}>
      {/* HUD */}
      <div className="flex items-center justify-between px-3 py-2 text-sm select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-p1 shadow-glow" />
          <span className="font-bold">YOU</span>
          <span className="text-ink/70">×{p1}</span>
        </div>
        <div className={`font-black ${TONE_TEXT[displayMutation]}`}>
          {isBoss ? `BOSS Lv${rpgStage.level}` : `Lv ${rpgStage.level} / 500`}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-ink/70">×{p2}</span>
          <span className="font-bold">ENEMY</span>
          <span className="w-3 h-3 rounded-full bg-p2" />
        </div>
      </div>

      {/* 敵アイコン群 */}
      <div className="flex gap-2 px-3 pb-1 items-end overflow-x-auto">
        {enemies.map((e, i) => (
          <div
            key={`${e.id}-${i}`}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 border ${
              e.isBoss ? 'bg-black/60 border-rose-500/60 shadow-glow' : 'bg-board/60 border-ink/10'
            }`}
          >
            <EnemyPreview enemy={e} size={36} forceAura={displayMutation} />
            <div className="text-[10px] leading-tight">
              <div className={`font-black truncate ${e.isBoss ? 'text-rose-300' : 'text-ink'}`}>{e.name}</div>
              <div className="text-ink/50">P×{e.powerScale.toFixed(2)} S×{e.stabilityScale.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 開始フラッシュ */}
      {flashStart && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-30">
          <div className="animate-pop bg-boardEdge/85 rounded-2xl px-6 py-4 border border-ink/20 text-center">
            {isBoss ? (
              <>
                <div className={`text-[10px] tracking-[0.3em] ${TONE_TEXT[displayMutation]}`}>WARNING</div>
                <div className="text-2xl font-black text-rose-400 mt-1">{bossEnemy?.name}</div>
                <div className="text-[10px] text-ink/60 mt-1">Lv {rpgStage.level} BOSS</div>
              </>
            ) : (
              <>
                <div className="text-[10px] tracking-widest text-accent">STAGE</div>
                <div className="text-3xl font-black">{rpgStage.level}</div>
                <div className="text-[11px] text-ink/60 mt-1">{rpgStage.theme}</div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="relative flex-1">
        <Board
          stage={stage}
          pieces={pieces}
          currentPlayer={currentPlayer}
          disabled={flashStart || currentPlayer === 2}
          onTurnEnd={(next) => handleTurnEnd(next)}
          externalLaunch={cpuLaunch}
          onAfterExternalLaunch={() => setCpuLaunch(null)}
          onHit={() => play('hit')}
          onFall={() => play('fall')}
          onLaunch={() => play('launch')}
        />
      </div>

      <div className="flex gap-2 p-3">
        <Button variant="ghost" onClick={() => setScreen('rpgHome')}>撤退</Button>
      </div>
    </div>
  );
}
