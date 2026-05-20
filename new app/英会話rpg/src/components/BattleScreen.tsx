import { ArrowLeft, Bot, Loader2, Send, Shield, Sparkles, Swords, Zap } from "lucide-react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import {
  getAdjustedEnemyAttack,
  getAdjustedEnemyMaxHp,
  getAdjustedRequiredWords,
  getAdjustedReward,
  getC1TitlesForStage,
  getDifficultyConfig,
  getLeveledEnemyName,
  getLeveledExpressions,
  getLeveledHint,
  getLeveledMission,
  getLeveledQuestion,
} from "../data/difficulty";
import { getEnemyById } from "../data/enemies";
import { getEquipmentBonus } from "../data/equipment";
import { getStageById, MAX_STAGE_ID } from "../data/stages";
import type { ElementType, EnglishLevel, EvaluationRequest, EvaluationResult, PlayerData, Rank } from "../types";
import { evaluateEnglish } from "../utils/evaluateEnglish";
import { evaluateWithOpenAI } from "../utils/openaiClient";
import { expToNextLevel } from "../utils/storage";
import BossIntro from "./BossIntro";
import LevelUpModal from "./LevelUpModal";
import ResultModal from "./ResultModal";
import VoiceInputButton from "./VoiceInputButton";

const rankFromScore = (score: number): Rank => {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const elementGlyph: Record<ElementType, string> = {
  fire: "Flame",
  water: "Wave",
  ice: "Freeze",
  thunder: "Volt",
  heal: "Recover",
  talk: "Voice",
  normal: "Strike",
};

const rankBattleMessage: Record<Rank, string> = {
  D: "少し伝わった！",
  C: "英語の力が届いた！",
  B: "いい英文！",
  A: "自然な英語で大ダメージ！",
  S: "Perfect English Strike!",
};

const countWords = (text: string) => text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];

const addSentenceStats = (
  player: PlayerData,
  stageId: number,
  text: string,
  evaluation: EvaluationResult,
  damage: number,
  nextHp: number,
): PlayerData => {
  const words = countWords(text);
  const wordUsage = { ...player.wordUsage };
  for (const word of words) {
    if (word.length < 2) continue;
    wordUsage[word] = (wordUsage[word] ?? 0) + 1;
  }
  const comboCount = evaluation.score >= 60 ? player.comboCount + 1 : 0;
  return {
    ...player,
    hp: nextHp,
    comboCount,
    bestCombo: Math.max(player.bestCombo, comboCount),
    totalSentences: player.totalSentences + 1,
    totalWords: player.totalWords + evaluation.wordCount,
    bestScore: Math.max(player.bestScore, evaluation.score),
    maxDamage: Math.max(player.maxDamage, damage),
    recentSentences: [
      { text, score: evaluation.score, stageId, createdAt: new Date().toISOString() },
      ...player.recentSentences,
    ].slice(0, 12),
    wordUsage,
  };
};

const applyRewards = (
  player: PlayerData,
  stageId: number,
  userText: string,
  evaluation: EvaluationResult,
  damage: number,
  nextHp: number,
  englishLevel: EnglishLevel,
) => {
  const stage = getStageById(stageId);
  const reward = getAdjustedReward(stage.reward, englishLevel);
  const afterStats = addSentenceStats(player, stageId, userText, evaluation, damage, nextHp);
  let exp = afterStats.exp + reward.exp;
  let level = afterStats.level;
  let maxHp = afterStats.maxHp;
  let maxMp = afterStats.maxMp;
  let attack = afterStats.attack;
  const levelBefore = level;

  while (exp >= expToNextLevel(level)) {
    exp -= expToNextLevel(level);
    level += 1;
    maxHp += 12;
    maxMp += 3;
    attack += 2;
  }

  const owned = new Set(afterStats.equipment.owned);
  if (stage.reward.equipmentId) {
    owned.add(stage.reward.equipmentId);
  }
  const titles = new Set([...afterStats.titles, ...getC1TitlesForStage(stage, englishLevel)]);

  return {
    player: {
      ...afterStats,
      level,
      exp,
      maxHp,
      maxMp,
      attack,
      hp: level > levelBefore ? maxHp : nextHp,
      mp: Math.min(maxMp, afterStats.mp + 5),
      gold: afterStats.gold + reward.gold,
      currentStage: Math.max(afterStats.currentStage, Math.min(MAX_STAGE_ID, stage.id + 1)),
      clearedStages: Array.from(new Set([...afterStats.clearedStages, stage.id])).sort((a, b) => a - b),
      defeatedEnemies: afterStats.defeatedEnemies + 1,
      learnedExpressions: Array.from(new Set([...afterStats.learnedExpressions, stage.reward.expression])).slice(-60),
      titles: Array.from(titles),
      equipment: {
        ...afterStats.equipment,
        owned: Array.from(owned),
      },
    },
    levelBefore,
    levelAfter: level,
  };
};

export default function BattleScreen({
  stageId,
  player,
  onPlayerChange,
  onExit,
}: {
  stageId: number;
  player: PlayerData;
  onPlayerChange: (player: PlayerData) => void;
  onExit: () => void;
}) {
  const stage = useMemo(() => getStageById(stageId), [stageId]);
  const enemy = useMemo(() => getEnemyById(stage.enemyId), [stage.enemyId]);
  const difficulty = useMemo(() => getDifficultyConfig(player.englishLevel), [player.englishLevel]);
  const requiredWords = useMemo(() => getAdjustedRequiredWords(stage, player.englishLevel), [stage, player.englishLevel]);
  const displayEnemyName = useMemo(() => getLeveledEnemyName(enemy, player.englishLevel), [enemy, player.englishLevel]);
  const recommendedExpressions = useMemo(() => getLeveledExpressions(stage, player.englishLevel), [stage, player.englishLevel]);
  const adjustedReward = useMemo(() => getAdjustedReward(stage.reward, player.englishLevel), [stage.reward, player.englishLevel]);
  const equipmentBonus = useMemo(
    () => getEquipmentBonus(player.equipment.owned, [player.equipment.weapon, player.equipment.armor, player.equipment.accessory]),
    [player.equipment],
  );
  const playerMaxHp = player.maxHp + equipmentBonus.maxHp;
  const enemyMaxHp = useMemo(
    () => getAdjustedEnemyMaxHp(Math.round(enemy.hp + stage.id * 11 + (stage.isBoss ? stage.id * 5 : 0)), stage, player.englishLevel),
    [enemy.hp, stage, player.englishLevel],
  );
  const enemyAttack = useMemo(
    () => getAdjustedEnemyAttack(Math.round(enemy.attack + stage.id * 1.15), stage, player.englishLevel),
    [enemy.attack, stage, player.englishLevel],
  );
  const [enemyHp, setEnemyHp] = useState(enemyMaxHp);
  const [playerHp, setPlayerHp] = useState(Math.min(player.hp || playerMaxHp, playerMaxHp));
  const [turn, setTurn] = useState(0);
  const [input, setInput] = useState("");
  const [inputFlash, setInputFlash] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | undefined>();
  const [aiNotice, setAiNotice] = useState("");
  const [attackEffect, setAttackEffect] = useState<{
    key: number;
    text: string;
    message: string;
    element: ElementType;
    rank: Rank;
    damage: number;
    healing: number;
  } | null>(null);
  const [showBossIntro, setShowBossIntro] = useState(stage.isBoss);
  const [result, setResult] = useState<{
    didWin: boolean;
    didLose: boolean;
    damage: number;
    enemyAttack: number;
    levelBefore: number;
    levelAfter: number;
  } | null>(null);
  const [pendingLevel, setPendingLevel] = useState<{ before: number; after: number } | null>(null);

  const question = getLeveledQuestion(stage, enemy, player.englishLevel, turn);
  const mission = getLeveledMission(stage, player.englishLevel, requiredWords);
  const hint = getLeveledHint(stage, enemy, player.englishLevel, requiredWords);
  const enemyHpPercent = clamp((enemyHp / enemyMaxHp) * 100, 0, 100);
  const playerHpPercent = clamp((playerHp / playerMaxHp) * 100, 0, 100);
  const playerMpPercent = clamp((player.mp / player.maxMp) * 100, 0, 100);

  const calculateDamage = (result: EvaluationResult) => {
    const scoreFactor = result.score / 55;
    const lengthFactor = result.lengthClear ? 1 : player.englishLevel === "C1" ? 0.28 : player.englishLevel === "B2" ? 0.48 : 0.62;
    const weaknessFactor = result.element === enemy.weakness ? 1.25 : 1;
    const comboFactor = 1 + Math.min(player.comboCount + equipmentBonus.comboBonus, 10) * 0.055;
    const bossFactor = enemy.type === "boss" ? 0.92 : 1;
    const wordOver = Math.max(0, result.wordCount + equipmentBonus.wordBonus - requiredWords) * 0.014;
    const c1BossHighStreak = player.englishLevel === "C1" && stage.isBoss ? Math.min(1, 0.45 + (result.score >= 75 ? player.comboCount + 1 : 0) * 0.11) : 1;
    const c1RankFactor =
      player.englishLevel === "C1" && stage.isBoss
        ? result.rank === "S"
          ? 1.45
          : result.rank === "A"
            ? 1.05
            : result.rank === "B"
              ? 0.68
              : result.rank === "C"
                ? 0.34
                : 0.18
        : 1;
    const baseAttack = player.attack + equipmentBonus.attack + player.level * 2;
    return Math.max(
      1,
      Math.round(baseAttack * scoreFactor * lengthFactor * result.damageBonus * weaknessFactor * comboFactor * bossFactor * (1 + wordOver) * c1BossHighStreak * c1RankFactor),
    );
  };

  const applyScoreBonus = (result: EvaluationResult): EvaluationResult => {
    const score = clamp(result.score + equipmentBonus.scoreBonus, 0, 100);
    return {
      ...result,
      score,
      rank: rankFromScore(score),
      damageBonus: clamp(result.damageBonus + equipmentBonus.scoreBonus / 100, 0.5, 2),
    };
  };

  const handleRecognized = (text: string) => {
    setInput(text);
    setInputFlash(true);
    window.setTimeout(() => setInputFlash(false), 900);
  };

  const handleAttack = async () => {
    const userText = input.trim();
    if (!userText || isEvaluating || result) {
      return;
    }

    setIsEvaluating(true);
    setAiNotice("");
    const request: EvaluationRequest = {
      userText,
      enemyName: displayEnemyName,
      enemyMessage: question,
      stage: stage.id,
      selectedEnglishLevel: player.englishLevel,
      requiredWords,
      mission,
      battleContext: `Turn ${turn + 1}. Player combo ${player.comboCount}. Enemy HP ${enemyHp}/${enemyMaxHp}.`,
    };

    const aiResult = await evaluateWithOpenAI(request, player.settings);
    const evaluated = applyScoreBonus(aiResult.success ? aiResult : { ...evaluateEnglish(request), fallback: true });
    if (!aiResult.success && player.settings.aiScoring) {
      setAiNotice(aiResult.message);
    }

    const damage = calculateDamage(evaluated);
    const nextEnemyHp = Math.max(0, enemyHp - damage);
    const healAmount = evaluated.element === "heal" ? Math.ceil(damage * 0.16) : 0;
    const c1ShortBossCounter = player.englishLevel === "C1" && stage.isBoss && !evaluated.lengthClear ? 1.55 : 1;
    const counter = nextEnemyHp <= 0 ? 0 : Math.max(1, Math.round((enemyAttack - player.defense - player.level * 0.25) * c1ShortBossCounter));
    const nextPlayerHp = nextEnemyHp <= 0 ? playerHp : Math.max(0, Math.min(playerMaxHp, playerHp + healAmount) - counter);

    setEvaluation(evaluated);
    const effectKey = Date.now();
    setAttackEffect({
      key: effectKey,
      text: `${elementGlyph[evaluated.element]} ${damage}`,
      message: rankBattleMessage[evaluated.rank],
      element: evaluated.element,
      rank: evaluated.rank,
      damage,
      healing: healAmount,
    });
    window.setTimeout(() => {
      setAttackEffect((current) => (current?.key === effectKey ? null : current));
    }, 1350);
    setEnemyHp(nextEnemyHp);
    setPlayerHp(nextPlayerHp);
    setInput("");
    setTurn((value) => value + 1);

    if (nextEnemyHp <= 0) {
      const rewarded = applyRewards(player, stage.id, userText, evaluated, damage, nextPlayerHp, player.englishLevel);
      onPlayerChange(rewarded.player);
      setResult({
        didWin: true,
        didLose: false,
        damage,
        enemyAttack: 0,
        levelBefore: rewarded.levelBefore,
        levelAfter: rewarded.levelAfter,
      });
      if (rewarded.levelAfter > rewarded.levelBefore) {
        setPendingLevel({ before: rewarded.levelBefore, after: rewarded.levelAfter });
      }
    } else if (nextPlayerHp <= 0) {
      const afterStats = addSentenceStats(player, stage.id, userText, evaluated, damage, Math.ceil(playerMaxHp * 0.55));
      onPlayerChange({
        ...afterStats,
        comboCount: 0,
        hp: Math.ceil(playerMaxHp * 0.55),
      });
      setResult({
        didWin: false,
        didLose: true,
        damage,
        enemyAttack: counter,
        levelBefore: player.level,
        levelAfter: player.level,
      });
    } else {
      onPlayerChange(addSentenceStats(player, stage.id, userText, evaluated, damage, nextPlayerHp));
    }

    setIsEvaluating(false);
  };

  const retry = () => {
    setEnemyHp(enemyMaxHp);
    setPlayerHp(Math.min(player.maxHp + equipmentBonus.maxHp, playerMaxHp));
    setResult(null);
    setEvaluation(undefined);
    setInput("");
    setTurn(0);
  };

  const continueAfterResult = () => {
    setResult(null);
    if (pendingLevel) {
      return;
    }
    onExit();
  };

  return (
    <main className={clsx("safe-screen relative space-y-4", stage.isBoss && "bg-black/20", player.englishLevel === "C1" && "level-c1-mode", attackEffect?.rank === "S" && "battle-screen-shake")}>
      <header className="rpg-dialogue flex items-center justify-between p-3">
        <button type="button" onClick={onExit} className="rpg-command grid h-11 w-11 place-items-center text-white">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <p className={clsx("text-xs font-black uppercase", stage.isBoss ? "text-coral" : "text-amber")}>
            {player.englishLevel === "C1" ? "C1 Advanced Mode" : stage.isBoss ? "Boss Battle" : `Stage ${stage.id}`}
          </p>
          <h1 className="rpg-title max-w-[250px] truncate text-lg font-black">{stage.name}</h1>
          <p className="text-[11px] font-black text-skyglass/75">{difficulty.label}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded border-2 border-[#fff6d0] bg-black/35 text-amber">
          <Zap size={20} />
        </div>
      </header>

      <section
        className={clsx(
          "rpg-enemy-stage relative overflow-hidden p-4",
          stage.isBoss && "border-coral",
          attackEffect && `impact-rank-${attackEffect.rank.toLowerCase()}`,
        )}
      >
        {attackEffect ? (
          <div
            key={attackEffect.key}
            className={clsx(
              "attack-cinematic pointer-events-none absolute inset-0 z-20",
              `attack-element-${attackEffect.element}`,
              `attack-rank-${attackEffect.rank.toLowerCase()}`,
            )}
            aria-hidden="true"
          >
            <div className="attack-screen-flash" />
            <div className="attack-aura attack-aura-back" />
            <div className="attack-aura attack-aura-front" />
            <div className="attack-slash attack-slash-primary" />
            <div className="attack-slash attack-slash-secondary" />
            <div className="attack-particles">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="attack-damage-card">
              <span className="attack-rank-label">
                {attackEffect.rank === "S" ? <Sparkles size={13} /> : <Swords size={13} />}
                Rank {attackEffect.rank}
              </span>
              <strong>{attackEffect.message}</strong>
              <span>
                {attackEffect.text}
                {attackEffect.healing > 0 ? ` / Heal +${attackEffect.healing}` : ""}
              </span>
            </div>
          </div>
        ) : null}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="rpg-dialogue min-w-0 flex-1 p-3">
            <div className="flex items-center gap-2">
              <p className="truncate text-xl font-black text-white">{displayEnemyName}</p>
              <span className="rounded border border-amber bg-black/25 px-2 py-1 text-[10px] font-black text-amber">weak: {enemy.weakness}</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-skyglass/85">{enemy.introMessage}</p>
          </div>
          <div
            className={clsx(
              "rpg-enemy-sprite grid h-24 w-24 shrink-0 place-items-center rounded border-2 border-[#fff6d0] bg-black/30 text-6xl",
              stage.isBoss && "bg-coral/20",
              attackEffect && "enemy-hit",
              attackEffect?.rank === "S" && "enemy-hit-critical",
            )}
          >
            {enemy.emoji}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-skyglass/72">
            <span>Enemy HP</span>
            <span>
              {enemyHp}/{enemyMaxHp}
            </span>
          </div>
          <div className="hp-bar">
            <div className={clsx("hp-fill", stage.isBoss ? "bg-coral" : "bg-amber")} style={{ width: `${enemyHpPercent}%` }} />
          </div>
        </div>
      </section>

      <section className="rpg-dialogue p-4">
        <div className="mb-3 flex items-center gap-2 text-amber">
          <Bot size={19} />
          <p className="text-xs font-black uppercase">Enemy says</p>
        </div>
        <p className="rpg-log-line text-xl font-black leading-8 text-white">{question}</p>
        <p className="mt-3 rounded border border-white/20 bg-[#082e7e] p-3 text-sm leading-6 text-skyglass/90">{hint}</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rpg-window p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-skyglass/90">
            <span>Hero HP</span>
            <span>
              {playerHp}/{playerMaxHp}
            </span>
          </div>
          <div className="hp-bar">
            <div className="hp-fill bg-mint" style={{ width: `${playerHpPercent}%` }} />
          </div>
        </div>
        <div className="rpg-window p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-skyglass/90">
            <span>MP</span>
            <span>
              {player.mp}/{player.maxMp}
            </span>
          </div>
          <div className="mp-bar">
            <div className="mp-fill bg-skyglass" style={{ width: `${playerMpPercent}%` }} />
          </div>
        </div>
      </section>

      <section className="rpg-window p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="rpg-menu-cursor font-black text-white">Command: Speak</h2>
          <span className="rounded border border-[#fff6d0] bg-black/25 px-3 py-1 text-xs font-bold text-amber">
            {requiredWords}+ words / Combo {player.comboCount}
          </span>
        </div>
        <textarea
          value={input}
          disabled={isEvaluating || Boolean(result)}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type your answer in English..."
          className={clsx(
            "min-h-[108px] w-full resize-none rounded border-2 border-[#fff6d0] bg-black/45 p-4 text-base leading-6 text-white outline-none transition focus:border-amber",
            inputFlash && "recognized-flash",
          )}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {recommendedExpressions.map((expression) => (
            <button
              key={expression}
              type="button"
              onClick={() => setInput((current) => (current ? `${current} ${expression}` : expression))}
              className="rounded border border-white/20 bg-black/25 px-3 py-2 text-xs font-bold text-skyglass/90"
            >
              {expression}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-[112px_1fr] items-center gap-3">
          <VoiceInputButton enemyQuestion={question} hint={hint} disabled={isEvaluating || Boolean(result)} onRecognized={handleRecognized} />
          <button
            type="button"
            onClick={handleAttack}
            disabled={!input.trim() || isEvaluating || Boolean(result)}
            className={clsx(
              "rpg-command flex min-h-16 items-center justify-center gap-2 px-4 text-base font-black",
              input.trim() ? "rpg-command-primary" : "text-white/45",
            )}
          >
            {isEvaluating ? <Loader2 className="animate-spin" size={22} /> : <Send size={21} />}
            {isEvaluating ? "Scoring..." : "Attack"}
          </button>
        </div>
      </section>

      {aiNotice ? <div className="rpg-dialogue p-3 text-sm leading-6 text-amber">{aiNotice}</div> : null}

      {evaluation ? (
        <section className="rpg-window p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="rpg-small-label text-xs">Evaluation</p>
              <p className="text-2xl font-black text-white">
                {evaluation.score} <span className="text-base text-amber">Rank {evaluation.rank}</span>
              </p>
            </div>
            <div className={`rounded border border-[#fff6d0] bg-black/25 px-3 py-2 text-sm font-black element-${evaluation.element}`}>{evaluation.element}</div>
          </div>
          <p className="mt-3 text-sm leading-6 text-skyglass/90">{evaluation.shortExplanationJa}</p>
          <div className="mt-3 grid gap-2">
            <div className="rpg-dialogue p-3">
              <p className="text-xs font-bold text-mint">Good</p>
              <ul className="mt-1 space-y-1 text-sm text-white">
                {evaluation.goodPoints.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </div>
            <div className="rpg-dialogue p-3">
              <p className="text-xs font-bold text-coral">Improve</p>
              <ul className="mt-1 space-y-1 text-sm text-white">
                {evaluation.improvements.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rpg-dialogue p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded border border-[#fff6d0] bg-[#082e7e] text-amber">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-white">Damage Formula</p>
            <p className="text-xs leading-5 text-skyglass/72">Attack × level strictness × words × element × combo × equipment</p>
          </div>
        </div>
      </section>

      {showBossIntro ? <BossIntro stage={stage} enemy={enemy} enemyName={displayEnemyName} onClose={() => setShowBossIntro(false)} /> : null}
      {result ? (
        <ResultModal
          didWin={result.didWin}
          didLose={result.didLose}
          damage={result.damage}
          enemyAttack={result.enemyAttack}
          evaluation={evaluation}
          stage={stage}
          reward={adjustedReward}
          onRetry={retry}
          onContinue={continueAfterResult}
        />
      ) : null}
      {pendingLevel && !result ? (
        <LevelUpModal
          before={pendingLevel.before}
          after={pendingLevel.after}
          onClose={() => {
            setPendingLevel(null);
            onExit();
          }}
        />
      ) : null}
    </main>
  );
}
