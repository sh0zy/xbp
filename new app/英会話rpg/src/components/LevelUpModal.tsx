import { ArrowUp, Sparkle } from "lucide-react";

export default function LevelUpModal({
  before,
  after,
  onClose,
}: {
  before: number;
  after: number;
  onClose: () => void;
}) {
  if (after <= before) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/62 p-5 backdrop-blur-sm">
      <section className="w-full max-w-[340px] rounded-[24px] border border-mint/30 bg-ink p-6 text-center shadow-glow">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-mint text-ink">
          <Sparkle size={32} />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-mint">Level Up</p>
        <div className="mt-3 flex items-center justify-center gap-3 text-4xl font-black text-white">
          <span>{before}</span>
          <ArrowUp className="text-amber" size={28} />
          <span>{after}</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-skyglass/82">HPと攻撃力が上がりました。長い英文にも挑みやすくなります。</p>
        <button type="button" onClick={onClose} className="mt-6 min-h-12 w-full rounded-2xl bg-mint font-black text-ink">
          Nice
        </button>
      </section>
    </div>
  );
}
