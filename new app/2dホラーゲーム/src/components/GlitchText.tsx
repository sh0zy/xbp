import { useMemo } from 'react';
import { glitchText } from '../utils/random';

interface GlitchTextProps {
  text: string;
  active?: boolean;
  amount?: number;
  className?: string;
}

export function GlitchText({ text, active = false, amount = 0.12, className = '' }: GlitchTextProps) {
  const rendered = useMemo(() => (active ? glitchText(text, amount) : text), [active, amount, text]);
  return <span className={`text-glitch ${active ? 'glitch-text' : ''} ${className}`}>{rendered}</span>;
}
