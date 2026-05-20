import { PenSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FloatingActionButton() {
  return (
    <Link
      to="/note/new"
      aria-label="新規メモを作成"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+96px)] left-1/2 z-30 flex h-16 w-16 translate-x-[138px] items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(145deg,#f8fafc,#d4d4d8)] text-slate-950 shadow-[0_24px_64px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:shadow-[0_28px_70px_rgba(255,255,255,0.22)] max-[430px]:left-auto max-[430px]:right-6 max-[430px]:translate-x-0"
    >
      <PenSquare className="h-6 w-6" strokeWidth={2.2} />
    </Link>
  );
}
