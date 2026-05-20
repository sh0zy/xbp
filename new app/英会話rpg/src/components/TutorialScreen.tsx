import { Bot, CheckCircle2, MessageCircle, Mic, Swords, Wand2 } from "lucide-react";

const steps = [
  { icon: Bot, title: "敵が英語で話しかける", text: "質問を読んで、日本語ヒントを確認します。" },
  { icon: MessageCircle, title: "英語で返すと攻撃", text: "短くてもOK。テキスト入力でも音声入力でも進めます。" },
  { icon: Swords, title: "自然な英文ほど強い", text: "語数、文法、会話の適切さでダメージが変わります。" },
  { icon: Wand2, title: "ステージで必要語数UP", text: "最後は理由・具体例・意見・感情を含む長い英語に挑戦します。" },
  { icon: Mic, title: "AI採点は任意", text: "OpenAI APIキーを設定するとAI採点が使えます。" },
  { icon: CheckCircle2, title: "APIキーなしでも遊べる", text: "通常採点へ自動で切り替わるので、ゲームは止まりません。" },
];

export default function TutorialScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <main className="safe-screen space-y-5">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Tutorial</p>
        <h1 className="mt-1 text-3xl font-black text-white">How to Battle</h1>
      </header>
      <section className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="glass-panel rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint text-ink">
                  <Icon size={21} />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber">Step {index + 1}</p>
                  <h2 className="mt-1 font-black text-white">{step.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-skyglass/78">{step.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>
      <button type="button" onClick={onComplete} className="min-h-14 w-full rounded-2xl bg-mint font-black text-ink shadow-glow">
        Start Quest
      </button>
    </main>
  );
}
