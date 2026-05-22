import type { CSSProperties } from 'react';

interface LightMaskProps {
  x: number;
  y: number;
  radius?: number;
  danger?: number;
}

export function LightMask({ x, y, radius = 120, danger = 0 }: LightMaskProps) {
  return (
    <div
      className="light-mask"
      style={{
        '--px': `${x}px`,
        '--py': `${y}px`,
        '--light-radius': `${radius}px`,
        '--danger-opacity': danger.toString(),
      } as CSSProperties}
      aria-hidden="true"
    />
  );
}
