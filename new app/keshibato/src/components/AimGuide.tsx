interface Props {
  fromX: number;
  fromY: number;
  dragX: number;
  dragY: number;
}

/** ドラッグ中のガイド: 矢印 + 強さ */
export function AimGuide({ fromX, fromY, dragX, dragY }: Props) {
  const dx = dragX - fromX;
  const dy = dragY - fromY;
  const len = Math.hypot(dx, dy);
  if (len < 4) return null;
  // 発射方向は引いた方向の逆
  const nx = -dx / len;
  const ny = -dy / len;
  const previewLen = Math.min(len, 120) * 1.6;
  const endX = fromX + nx * previewLen;
  const endY = fromY + ny * previewLen;
  const strength = Math.min(1, len / 120);
  const color = strength > 0.8 ? '#ff6b6b' : strength > 0.5 ? '#ffd166' : '#4ea9ff';

  return (
    <g pointerEvents="none">
      <line x1={fromX} y1={fromY} x2={endX} y2={endY} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
      <circle cx={endX} cy={endY} r={6} fill={color} opacity={0.9} />
      {/* 強さゲージ */}
      <rect x={fromX - 40} y={fromY + 30} width={80} height={6} rx={3} fill="#00000066" />
      <rect x={fromX - 40} y={fromY + 30} width={80 * strength} height={6} rx={3} fill={color} />
    </g>
  );
}
