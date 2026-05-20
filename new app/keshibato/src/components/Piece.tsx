import type { Piece as PieceT } from '../types';
import { EquipmentDecor } from './EquipmentDecor';

interface Props {
  piece: PieceT;
  selected?: boolean;
  canSelect?: boolean;
  /** 端ギリギリで耐えている状態(場外判定前) — 盤面側で計算して渡す */
  wobble?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
}

/** 落下演出の総時間(ms)。これを超えたら非表示にする */
export const FALL_ANIM_MS = 700;

/** 小さな星屑パーティクル。落下開始時の小爆ぜ用。
 * index ごとに放射方向をずらすだけの軽量SVG。 */
function FallSparks({ r }: { r: number }) {
  const sparks = Array.from({ length: 6 });
  return (
    <g>
      {sparks.map((_, i) => {
        const angle = (Math.PI * 2 * i) / sparks.length;
        const sx = Math.cos(angle) * (r + 10);
        const sy = Math.sin(angle) * (r + 10);
        // CSS カスタムプロパティ(--sx/--sy)を渡すため型を緩める
        const style = {
          '--sx': `${sx}px`,
          '--sy': `${sy}px`,
          animationDelay: `${i * 20}ms`,
        } as React.CSSProperties;
        return (
          <circle
            key={i}
            className="fall-spark"
            r={1.8}
            fill="#ffd166"
            style={style}
          />
        );
      })}
    </g>
  );
}

/** 消しピン本体＋装備の簡易ビジュアル(SVG) */
export function PieceView({ piece, selected, canSelect, wobble, onPointerDown }: Props) {
  // 落下中 or 生存中のみ描画
  const falling = !piece.alive && typeof piece.fallStart === 'number';
  if (!piece.alive && !falling) return null;
  if (falling) {
    const elapsed = performance.now() - (piece.fallStart ?? 0);
    if (elapsed > FALL_ANIM_MS + 200) return null;
  }

  const color = piece.owner === 1 ? '#4ea9ff' : '#ff6b6b';
  const stroke = selected ? '#ffd166' : '#f5f5f7';
  const strokeW = selected ? 4 : 2;
  const glow = selected ? 'url(#glow)' : undefined;

  // 落下方向に応じて傾く方向を決定
  const fallTilt =
    piece.fallEdge === 'left' ? 'fall-left' :
    piece.fallEdge === 'right' ? 'fall-right' :
    piece.fallEdge === 'top' ? 'fall-up' : 'fall-down';

  // 内側アニメーションクラス: 落下中 > ぐらつき > 選択ポップ の優先順で適用
  const innerClass = falling
    ? `piece-fall ${fallTilt}`
    : wobble
    ? 'piece-wobble'
    : selected
    ? 'animate-pop'
    : '';

  return (
    <g
      transform={`translate(${piece.x}, ${piece.y})`}
      style={{ cursor: canSelect ? 'pointer' : 'default', touchAction: 'none' }}
      onPointerDown={onPointerDown}
    >
      {/* 影(生存中だけ。落下時はCSSのdrop-shadowに任せる) */}
      {!falling && (
        <ellipse
          cx={0}
          cy={piece.radius + 2}
          rx={piece.radius * (wobble ? 0.7 : 0.9)}
          ry={wobble ? 2 : 3}
          fill="#00000055"
        />
      )}

      {/* 落下中は内側グループにCSSアニメーション適用 */}
      <g className={innerClass}>
        {selected && !falling && (
          <circle r={piece.radius + 8} fill="none" stroke="#ffd166" strokeOpacity="0.35" strokeWidth={3} />
        )}
        {/* 本体 */}
        <circle r={piece.radius} fill={color} stroke={stroke} strokeWidth={strokeW} filter={glow} />
        {/* 装備の装飾(別コンポーネントに分離) */}
        <EquipmentDecor piece={piece} />
        {/* オーナー表示 */}
        <text y={4} textAnchor="middle" fontSize={10} fontWeight="800" fill="#0b0e14">
          {piece.owner === 1 ? '1P' : '2P'}
        </text>
      </g>

      {/* 落下開始時の小爆ぜ(アニメ前半で消える) */}
      {falling && <FallSparks r={piece.radius} />}
    </g>
  );
}
