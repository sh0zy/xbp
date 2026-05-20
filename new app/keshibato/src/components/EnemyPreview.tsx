import type { EnemyData } from '../types';

interface Props {
  enemy: EnemyData;
  size?: number;
  /** 進行段階のUI重み(ボス撃破後などに上げるとオーラが強くなる) */
  forceAura?: 0 | 1 | 2 | 3 | 4;
}

/** 敵の見た目プレビュー(SVG)。色・目・輪郭・オーラが mutationStage とデータ依存で変わる。 */
export function EnemyPreview({ enemy, size = 72, forceAura }: Props) {
  const r = 24;
  const pad = 14;
  const view = r * 2 + pad * 2;
  const aura = Math.max(forceAura ?? 0, enemy.auraLevel);

  // オーラの色は段階で変化
  const auraStroke =
    enemy.phaseStyle === 'cute'
      ? 'rgba(255,255,255,0.2)'
      : enemy.phaseStyle === 'uneasy'
      ? 'rgba(255,209,102,0.35)'
      : enemy.phaseStyle === 'weird'
      ? 'rgba(155,107,255,0.45)'
      : enemy.phaseStyle === 'sinister'
      ? 'rgba(255,74,255,0.5)'
      : 'rgba(255,0,64,0.65)';

  // 目の描画
  const drawEyes = () => {
    const ey = -4;
    switch (enemy.eyeStyle) {
      case 'slit':
        return (
          <g stroke={enemy.accentColor} strokeWidth={2} strokeLinecap="round">
            <line x1={-10} y1={ey} x2={-5} y2={ey} />
            <line x1={5} y1={ey} x2={10} y2={ey} />
          </g>
        );
      case 'glow':
        return (
          <g>
            <circle cx={-7} cy={ey} r={2.4} fill={enemy.accentColor} style={{ filter: 'url(#enemyGlow)' }} />
            <circle cx={7} cy={ey} r={2.4} fill={enemy.accentColor} style={{ filter: 'url(#enemyGlow)' }} />
          </g>
        );
      case 'cross':
        return (
          <g stroke={enemy.accentColor} strokeWidth={1.5}>
            <line x1={-10} y1={ey - 2} x2={-4} y2={ey + 2} />
            <line x1={-10} y1={ey + 2} x2={-4} y2={ey - 2} />
            <line x1={4} y1={ey - 2} x2={10} y2={ey + 2} />
            <line x1={4} y1={ey + 2} x2={10} y2={ey - 2} />
          </g>
        );
      case 'void':
        return (
          <g>
            <circle cx={-7} cy={ey} r={3} fill="#000" />
            <circle cx={7} cy={ey} r={3} fill="#000" />
          </g>
        );
      case 'round':
        return (
          <g fill="#fff">
            <circle cx={-7} cy={ey} r={3} />
            <circle cx={7} cy={ey} r={3} />
            <circle cx={-6} cy={ey - 1} r={1} fill="#000" />
            <circle cx={8} cy={ey - 1} r={1} fill="#000" />
          </g>
        );
      case 'dot':
      default:
        return (
          <g fill="#0b0e14">
            <circle cx={-6} cy={ey} r={1.8} />
            <circle cx={6} cy={ey} r={1.8} />
          </g>
        );
    }
  };

  // 口・面の描画
  const drawFace = () => {
    switch (enemy.faceStyle) {
      case 'smile':
        return <path d={`M -6 4 Q 0 9 6 4`} fill="none" stroke="#0b0e14" strokeWidth={1.5} strokeLinecap="round" />;
      case 'frown':
        return <path d={`M -6 6 Q 0 2 6 6`} fill="none" stroke="#0b0e14" strokeWidth={1.5} strokeLinecap="round" />;
      case 'hollow':
        return <rect x={-5} y={3} width={10} height={3} rx={1} fill="#000" opacity={0.6} />;
      case 'mask':
        return (
          <g>
            <path d={`M -10 -2 L 10 -2 L 7 6 L -7 6 Z`} fill={enemy.accentColor} opacity={0.35} />
            <line x1={-10} y1={-2} x2={10} y2={-2} stroke={enemy.accentColor} strokeWidth={0.6} />
          </g>
        );
      case 'void':
        return <circle cx={0} cy={3} r={2} fill="#000" />;
      case 'neutral':
      default:
        return <line x1={-4} y1={4} x2={4} y2={4} stroke="#0b0e14" strokeWidth={1.3} strokeLinecap="round" />;
    }
  };

  // 輪郭(silhouetteType)で形を変える
  const body = (() => {
    switch (enemy.silhouetteType) {
      case 'wide':
        return <ellipse rx={r * 1.15} ry={r * 0.85} fill={enemy.baseColor} stroke={enemy.accentColor} strokeWidth={1.5} />;
      case 'tall':
        return <ellipse rx={r * 0.85} ry={r * 1.15} fill={enemy.baseColor} stroke={enemy.accentColor} strokeWidth={1.5} />;
      case 'angular':
        return (
          <polygon
            points={`0,${-r} ${r},0 0,${r} ${-r},0`}
            fill={enemy.baseColor}
            stroke={enemy.accentColor}
            strokeWidth={1.5}
          />
        );
      case 'organic':
        return (
          <path
            d={`M ${-r} 0 Q ${-r * 0.6} ${-r} 0 ${-r} Q ${r * 0.6} ${-r * 0.8} ${r} 0 Q ${r * 0.6} ${r} 0 ${r} Q ${-r * 0.6} ${r * 0.9} ${-r} 0 Z`}
            fill={enemy.baseColor}
            stroke={enemy.accentColor}
            strokeWidth={1.5}
          />
        );
      case 'round':
      default:
        return <circle r={r} fill={enemy.baseColor} stroke={enemy.accentColor} strokeWidth={1.5} />;
    }
  })();

  return (
    <svg width={size} height={size} viewBox={`${-view / 2} ${-view / 2} ${view} ${view}`}>
      <defs>
        <filter id="enemyGlow">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* 影 */}
      <ellipse cx={0} cy={r + 4} rx={r * 0.9} ry={3} fill="#00000066" />
      {/* オーラ */}
      {aura > 0 && (
        <circle r={r + 4 + aura * 1.5} fill="none" stroke={auraStroke} strokeWidth={aura + 1} opacity={0.7} />
      )}
      {aura >= 3 && (
        <circle r={r + 10 + aura * 2} fill="none" stroke={auraStroke} strokeWidth={1} opacity={0.4} />
      )}
      {body}
      {drawEyes()}
      {drawFace()}
      {/* ボス印 */}
      {enemy.isBoss && (
        <text y={-r - 6} textAnchor="middle" fontSize={8} fontWeight="800" fill={enemy.accentColor}>
          BOSS
        </text>
      )}
    </svg>
  );
}
