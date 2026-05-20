import { cn } from '@/lib/cn';

interface AppBrandProps {
  compact?: boolean;
}

export function AppBrand({ compact = false }: AppBrandProps) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-[26px] border border-white/12 bg-[linear-gradient(145deg,rgba(22,28,48,0.98),rgba(12,15,24,0.94))] shadow-[0_24px_60px_rgba(7,10,17,0.5)]',
        compact ? 'h-14 w-14' : 'h-[4.5rem] w-[4.5rem]',
      )}
    >
      <div className="absolute inset-[18%] rounded-[22px] bg-[linear-gradient(180deg,rgba(250,250,252,0.96),rgba(229,231,235,0.92))]" />
      <div className="absolute left-[34%] top-[28%] h-[12%] w-[30%] rounded-full bg-slate-900" />
      <div className="absolute left-[34%] top-[46%] h-[10%] w-[44%] rounded-full bg-slate-700" />
      <div className="absolute left-[34%] top-[62%] h-[10%] w-[38%] rounded-full bg-slate-500" />
      <div className="absolute right-[20%] top-[24%] h-[46%] w-[10%] rounded-full bg-[linear-gradient(180deg,#8b5cf6,#f472b6)] shadow-[0_10px_24px_rgba(168,85,247,0.4)]" />
    </div>
  );
}
