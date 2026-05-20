import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  full?: boolean;
}

const V: Record<Variant, string> = {
  primary: 'bg-accent text-boardEdge shadow-glow hover:brightness-110 active:brightness-125',
  secondary: 'bg-board text-ink border border-ink/20 hover:bg-board/80 active:bg-board/60',
  ghost: 'bg-transparent text-ink/80 hover:text-ink active:text-ink active:bg-ink/5',
  danger: 'bg-p2 text-ink hover:brightness-110 active:brightness-125',
};

export function Button({ children, variant = 'primary', full, className = '', disabled, ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`rounded-2xl px-5 py-3 font-bold tracking-wide transition-all duration-150
        min-h-[44px] select-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-boardEdge
        enabled:active:scale-[0.97]
        disabled:opacity-40 disabled:saturate-50 disabled:cursor-not-allowed
        ${full ? 'w-full' : ''} ${V[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
