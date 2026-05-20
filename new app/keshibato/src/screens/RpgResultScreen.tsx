import { Button } from '../components/Button';
import { MedalBadge } from '../components/MedalBadge';
import { useGameStore } from '../hooks/useGameStore';
import { MEDALS, MEDAL_BY_STAGE } from '../data/rpgMedals';
import { buildRpgStage, mutationStageAtProgress } from '../data/rpgStages';

const TONE_BG: Record<number, string> = {
  0: 'from-[#1e2a3a] via-[#2a3545] to-[#1e2a3a]',
  1: 'from-[#2a2030] via-[#3a2a3a] to-[#1e1a24]',
  2: 'from-[#1a1028] via-[#2a1838] to-[#0a0418]',
  3: 'from-[#10081a] via-[#1a0820] to-[#050210]',
  4: 'from-[#000005] via-[#1a0010] to-[#000000]',
};

export function RpgResultScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const save = useGameStore((s) => s.save);
  const winner = useGameStore((s) => s.lastWinner);
  const lastBoss = useGameStore((s) => s.lastBossDefeated);
  const lastMedal = useGameStore((s) => s.lastMedalGained);
  const rpgEnterBattle = useGameStore((s) => s.rpgEnterBattle);

  const rpg = save.rpg!;
  const won = winner === 1;
  const worldMutation = mutationStageAtProgress(rpg.maxUnlockedStage, rpg.defeatedBosses);
  const nextLv = rpg.currentStage;
  const isFinal = lastBoss === 500;
  const nextStage = nextLv <= 500 ? buildRpgStage(nextLv) : null;
  const medal = lastMedal ? MEDALS.find((m) => m.id === lastMedal) ?? null : null;
  const bossCleared = lastBoss !== null;

  return (
    <div className={`min-h-[100dvh] bg-gradient-to-b ${TONE_BG[worldMutation]} text-ink flex flex-col items-center p-6`}>
      <div className="animate-pop text-center mt-6">
        <div className="text-[11px] tracking-[0.3em] text-accent">RESULT</div>
        <div className={`text-5xl font-black mt-2 ${won ? 'text-accent' : 'text-rose-400'}`}>
          {won ? (isFinal ? '全ステージ制覇' : bossCleared ? 'BOSS撃破' : 'STAGE CLEAR') : 'DEFEATED'}
        </div>
        <div className="mt-2 text-[11px] text-ink/60">
          {won ? `Lv ${nextLv - 1} 突破` : `Lv ${nextLv} リトライ`}
        </div>
      </div>

      {/* ボス撃破/勲章獲得表示 */}
      {bossCleared && (
        <div className="mt-6 rounded-2xl bg-black/40 border border-accent/40 p-4 flex items-center gap-3 animate-slide">
          <MedalBadge medal={medal ?? MEDAL_BY_STAGE[lastBoss!]} owned size={72} />
          <div className="min-w-0">
            <div className="text-[10px] text-ink/60">勲章獲得</div>
            <div className="text-lg font-black text-accent">
              {(medal ?? MEDAL_BY_STAGE[lastBoss!]).name}
            </div>
            <div className="text-[10px] text-ink/60 leading-snug mt-1">
              {(medal ?? MEDAL_BY_STAGE[lastBoss!]).description}
            </div>
          </div>
        </div>
      )}

      {/* 進行状況 */}
      <div className="mt-6 w-full max-w-sm rounded-2xl bg-board/60 border border-ink/10 p-3 text-center">
        <div className="text-[10px] text-ink/60">到達</div>
        <div className="text-2xl font-black">{rpg.maxUnlockedStage}</div>
        <div className="text-[10px] text-ink/60">
          勝 {rpg.totalWins} / 敗 {rpg.totalLosses} ・ 勲章 {rpg.medals.length}/4
        </div>
      </div>

      <div className="mt-8 w-full max-w-sm flex flex-col gap-3">
        {!isFinal && nextStage && (
          <Button full onClick={() => rpgEnterBattle(nextLv)}>
            {won ? '次のステージへ' : 'もう一度挑戦'}
          </Button>
        )}
        {isFinal && (
          <Button full onClick={() => setScreen('rpgHome')}>RPGホームへ</Button>
        )}
        <Button full variant="secondary" onClick={() => setScreen('rpgHome')}>
          RPGメニューへ
        </Button>
        <Button full variant="ghost" onClick={() => setScreen('home')}>
          ホームへ戻る
        </Button>
      </div>
    </div>
  );
}
