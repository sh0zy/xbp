import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  trailing?: ReactNode;
}

export function PageHeader({ title, subtitle, backTo, trailing }: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {backTo ? (
          <Link
            to={backTo}
            className="mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/82 transition hover:bg-white/10"
            aria-label="戻る"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : null}

        <div>
          <h1 className="font-display text-[1.6rem] font-semibold leading-tight text-white">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm leading-6 text-white/60">{subtitle}</p> : null}
        </div>
      </div>

      {trailing ? <div>{trailing}</div> : null}
    </header>
  );
}
