import type { EquipmentId, Piece } from '../types';

interface Props {
  piece: Piece;
  /** プレビュー時のみ true にするとオーナーカラー装飾を省略 */
  preview?: boolean;
  overrideRadius?: number;
}

/**
 * 装備ごとの見た目をコマ上に重ねる。
 * 新装備を増やすときはここに1ブロック足すだけで済むようデータ駆動的に配置。
 */
export function EquipmentDecor({ piece, overrideRadius }: Props) {
  const r = overrideRadius ?? piece.radius;
  const ids = piece.equipments;

  const has = (id: EquipmentId) => ids.includes(id);

  return (
    <g>
      {has('pencil') && (
        <g>
          <rect x={-2} y={-r - 8} width={4} height={10} fill="#ffd166" stroke="#8a5a00" strokeWidth={0.5} />
          <polygon points={`-2,${-r - 8} 2,${-r - 8} 0,${-r - 12}`} fill="#2e2e2e" />
        </g>
      )}
      {has('triangle') && (
        <polygon
          points={`0,${-r - 10} ${r},${-r + 4} ${-r},${-r + 4}`}
          fill="#c9eaff"
          stroke="#4ea9ff"
          strokeWidth={1}
          opacity={0.9}
        />
      )}
      {has('eraserBig') && (
        <rect
          x={-r}
          y={-r / 2}
          width={r * 2}
          height={r}
          fill="#2e2e2e"
          stroke="#f5f5f7"
          strokeWidth={1}
          opacity={0.85}
        />
      )}
      {has('ruler') && (
        <rect x={-r} y={-1.5} width={r * 2} height={3} fill="#ffd166" opacity={0.9} />
      )}
      {has('sticky') && (
        <rect x={-6} y={-6} width={12} height={12} fill="#fff46b" opacity={0.9} />
      )}
      {has('clip') && (
        <g>
          <rect x={-r - 2} y={-2} width={4} height={4} fill="#c0c4cc" />
          <rect x={r - 2} y={-2} width={4} height={4} fill="#c0c4cc" />
        </g>
      )}
      {has('notebook') && (
        <g>
          <rect x={-r - 2} y={-r / 1.8} width={r * 2 + 4} height={r / 0.9} fill="#5aa3ff" opacity={0.85} stroke="#1f4e8a" strokeWidth={1} />
          <line x1={-r} y1={0} x2={r} y2={0} stroke="#ffffffaa" />
        </g>
      )}
      {has('penCase') && (
        <rect
          x={-r - 4}
          y={-r / 3}
          width={r * 2 + 8}
          height={r / 1.5}
          rx={r / 2}
          fill="#8a5acf"
          stroke="#ffffff"
          strokeWidth={1}
          opacity={0.9}
        />
      )}
      {has('pushpin') && (
        <g>
          <circle cx={0} cy={-r - 4} r={4} fill="#ff6b6b" stroke="#fff" strokeWidth={1} />
          <polygon points={`-1,${-r - 2} 1,${-r - 2} 0,${-r + 4}`} fill="#c0c4cc" />
        </g>
      )}
      {has('scissors') && (
        <g>
          <line x1={-r} y1={-r} x2={r} y2={r} stroke="#c0c4cc" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={-r} y1={r} x2={r} y2={-r} stroke="#c0c4cc" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={-r + 2} cy={-r + 2} r={2.5} fill="#ff6b6b" />
          <circle cx={r - 2} cy={-r + 2} r={2.5} fill="#ff6b6b" />
        </g>
      )}
      {has('eraserCover') && (
        <circle cx={0} cy={0} r={r - 2} fill="none" stroke="#f0c06a" strokeWidth={3} opacity={0.9} />
      )}
      {has('redPen') && (
        <g>
          <rect x={-2} y={-r - 8} width={4} height={10} fill="#ff6b6b" stroke="#7a1f1f" strokeWidth={0.5} />
          <polygon points={`-2,${-r - 8} 2,${-r - 8} 0,${-r - 12}`} fill="#2e2e2e" />
        </g>
      )}
      {has('protractor') && (
        <path
          d={`M ${-r - 2} 0 A ${r + 2} ${r + 2} 0 0 1 ${r + 2} 0 L ${r} 0 A ${r} ${r} 0 0 0 ${-r} 0 Z`}
          fill="#c9eaff"
          stroke="#4ea9ff"
          strokeWidth={1}
          opacity={0.85}
        />
      )}
      {has('magnet') && (
        <g>
          <path d={`M ${-r + 2} ${-r / 2} L ${-r + 2} ${r / 3} L ${-r / 3} ${r / 3}`} fill="none" stroke="#ff6b6b" strokeWidth={3} />
          <path d={`M ${r - 2} ${-r / 2} L ${r - 2} ${r / 3} L ${r / 3} ${r / 3}`} fill="none" stroke="#4ea9ff" strokeWidth={3} />
        </g>
      )}
      {has('chalk') && (
        <rect x={-2} y={-r - 4} width={4} height={12} fill="#ffffff" stroke="#bfbfbf" strokeWidth={0.5} />
      )}
      {has('binder') && (
        <g>
          <rect x={-r - 2} y={-r / 1.5} width={r * 2 + 4} height={r * 1.2} fill="#444" opacity={0.8} stroke="#ffd166" strokeWidth={1} />
          <circle cx={-r + 2} cy={-r / 3} r={1.6} fill="#ffd166" />
          <circle cx={-r + 2} cy={r / 3} r={1.6} fill="#ffd166" />
        </g>
      )}
      {has('looseLeaf') && (
        <g>
          <rect x={-r} y={-r / 1.8} width={r * 2} height={r} fill="#f8f8fc" opacity={0.85} stroke="#a0a6b4" strokeWidth={0.6} />
          <line x1={-r + 2} y1={-r / 3} x2={r - 2} y2={-r / 3} stroke="#a0a6b4" strokeWidth={0.4} />
          <line x1={-r + 2} y1={0} x2={r - 2} y2={0} stroke="#a0a6b4" strokeWidth={0.4} />
          <line x1={-r + 2} y1={r / 3} x2={r - 2} y2={r / 3} stroke="#a0a6b4" strokeWidth={0.4} />
        </g>
      )}
      {has('tape') && (
        <g>
          <circle cx={0} cy={0} r={r * 0.7} fill="none" stroke="#ffd166" strokeWidth={3} opacity={0.85} />
          <circle cx={0} cy={0} r={r * 0.3} fill="none" stroke="#ffd166" strokeWidth={2} opacity={0.85} />
        </g>
      )}
    </g>
  );
}
