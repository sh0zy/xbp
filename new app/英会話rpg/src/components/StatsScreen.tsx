import { Award, BarChart3, BookOpen, Flame, MessageCircle, Trophy } from "lucide-react";
import { getDifficultyConfig } from "../data/difficulty";
import type { PlayerData } from "../types";

const titleForPlayer = (player: PlayerData) => {
  if (player.titles.includes("C1 Dragon Slayer")) return "C1 Dragon Slayer";
  if (player.titles.includes("Global Communicator")) return "Global Communicator";
  if (player.titles.includes("Academic Adventurer")) return "Academic Adventurer";
  if (player.englishLevel === "C1" && player.bestScore >= 90) return "Critical Thinker";
  if (player.clearedStages.includes(50)) return "Grand English Hero";
  if (player.bestScore >= 90) return "Perfect Strike Speaker";
  if (player.totalWords >= 500) return "Long Talk Adventurer";
  if (player.clearedStages.length >= 20) return "Conversation Pathfinder";
  return "First Step Speaker";
};

export default function StatsScreen({ player }: { player: PlayerData }) {
  const difficulty = getDifficultyConfig(player.englishLevel);
  const frequentWords = Object.entries(player.wordUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const hasRecords = player.totalSentences > 0;

  return (
    <main className="safe-screen space-y-5">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Learning Log</p>
        <h1 className="mt-1 text-2xl font-black text-white">Your English Record</h1>
        <p className="mt-2 text-sm leading-6 text-skyglass/80">Current Level: {difficulty.label}</p>
      </header>

      {!hasRecords ? (
        <section className="glass-panel rounded-[22px] p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-mint/12 text-mint">
            <MessageCircle size={30} />
          </div>
          <h2 className="text-xl font-black text-white">まだ記録はありません</h2>
          <p className="mt-3 text-sm leading-6 text-skyglass/75">最初のステージで英語で話しかけてみよう。</p>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3">
            {[
              { label: "Cleared", value: player.clearedStages.length, icon: Trophy },
              { label: "Defeated", value: player.defeatedEnemies, icon: Flame },
              { label: "Sentences", value: player.totalSentences, icon: MessageCircle },
              { label: "Total Words", value: player.totalWords, icon: BookOpen },
              { label: "Best Score", value: player.bestScore, icon: BarChart3 },
              { label: "Max Damage", value: player.maxDamage, icon: Award },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="glass-panel rounded-2xl p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-mint/12 text-mint">
                    <Icon size={20} />
                  </div>
                  <p className="text-2xl font-black text-white">{item.value}</p>
                  <p className="text-sm text-skyglass/72">{item.label}</p>
                </div>
              );
            })}
          </section>

          <section className="glass-panel rounded-[20px] p-4">
            <p className="text-xs font-bold text-amber">TITLE</p>
            <h2 className="mt-1 text-xl font-black text-white">{titleForPlayer(player)}</h2>
            <p className="mt-2 text-sm text-skyglass/75">Best Combo: {player.bestCombo}</p>
            {player.titles.length ? <p className="mt-2 text-xs leading-5 text-amber">Titles: {player.titles.join(" / ")}</p> : null}
          </section>

          <section className="glass-panel rounded-[20px] p-4">
            <h2 className="text-lg font-black text-white">よく使った単語</h2>
            {frequentWords.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {frequentWords.map(([word, count]) => (
                  <span key={word} className="rounded-full bg-white/8 px-3 py-2 text-sm font-bold text-white">
                    {word} <span className="text-mint">{count}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-skyglass/72">まだ単語データがありません。</p>
            )}
          </section>

          <section className="glass-panel rounded-[20px] p-4">
            <h2 className="text-lg font-black text-white">最近の英文</h2>
            <div className="mt-3 space-y-2">
              {player.recentSentences.slice(0, 5).map((sentence) => (
                <div key={`${sentence.createdAt}-${sentence.stageId}`} className="rounded-2xl bg-white/7 p-3">
                  <p className="text-sm leading-6 text-white">{sentence.text}</p>
                  <p className="mt-1 text-xs text-skyglass/65">
                    Stage {sentence.stageId} / Score {sentence.score}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
