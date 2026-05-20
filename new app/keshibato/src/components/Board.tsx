import { useEffect, useMemo, useRef, useState } from 'react';
import type { Piece, PlayerId, StageData } from '../types';
import { PieceView } from './Piece';
import { AimGuide } from './AimGuide';
import { MAX_SIM_FRAMES, allStopped, computeLaunchVelocity, step } from '../utils/physics';
import { buildModifierMaps } from '../game/engine';
import { FALL_ANIM_MS } from './Piece';
import { getStageTheme } from '../data/stageThemes';

interface Props {
  stage: StageData;
  pieces: Piece[];
  currentPlayer: PlayerId;
  disabled: boolean;
  onTurnEnd: (nextPieces: Piece[], killsByCurrent: number) => void;
  externalLaunch?: { pieceId: string; vx: number; vy: number } | null;
  onAfterExternalLaunch?: () => void;
  onHit?: () => void;
  onFall?: () => void;
  onLaunch?: () => void;
}

interface DragState {
  pieceId: string;
  startX: number;
  startY: number;
  dragX: number;
  dragY: number;
}

export function Board({
  stage,
  pieces,
  currentPlayer,
  disabled,
  onTurnEnd,
  externalLaunch,
  onAfterExternalLaunch,
  onHit,
  onFall,
  onLaunch,
}: Props) {
  const [local, setLocal] = useState<Piece[]>(pieces);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const simulatingRef = useRef(false);
  const piecesRef = useRef<Piece[]>(pieces);
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const killsRef = useRef(0);

  const mods = useMemo(() => buildModifierMaps(pieces), [pieces]);

  useEffect(() => {
    setLocal(pieces);
    piecesRef.current = pieces;
    setSelectedId(null);
    setDrag(null);
    killsRef.current = 0;
  }, [pieces]);

  const toSvg = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };

  const startSim = (seed: Piece[]) => {
    if (simulatingRef.current) return;
    simulatingRef.current = true;
    piecesRef.current = seed;
    setLocal(seed);
    let frames = 0;

    const tick = () => {
      const cur = piecesRef.current;
      const next = step(cur, {
        stage,
        frictionByPiece: mods.frictionByPiece,
        bounceByPiece: mods.bounceByPiece,
      });
      // イベント検出
      for (const p of next) {
        const prev = cur.find((q) => q.id === p.id);
        if (!prev) continue;
        if (prev.alive && !p.alive) {
          onFall?.();
          if (p.owner !== currentPlayer) killsRef.current += 1;
        } else if (prev.alive && p.alive) {
          const dv = Math.hypot(p.vx - prev.vx, p.vy - prev.vy);
          if (dv > 2.5) onHit?.();
        }
      }
      piecesRef.current = next;
      setLocal(next);
      if (allStopped(next) || frames > MAX_SIM_FRAMES) {
        simulatingRef.current = false;
        const kills = killsRef.current;
        // 直近に落下したコマがあれば演出時間ぶん待ってからターン終了
        const now = performance.now();
        const recentFall = next
          .filter((p) => !p.alive && typeof p.fallStart === 'number')
          .reduce((m, p) => Math.max(m, p.fallStart ?? 0), 0);
        const wait = recentFall > 0 ? Math.max(120, FALL_ANIM_MS - (now - recentFall)) : 120;
        setTimeout(() => onTurnEnd(next, kills), wait);
        return;
      }
      frames += 1;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!externalLaunch || simulatingRef.current) return;
    const seed = piecesRef.current.map((p) =>
      p.id === externalLaunch.pieceId ? { ...p, vx: externalLaunch.vx, vy: externalLaunch.vy } : p
    );
    onLaunch?.();
    startSim(seed);
    onAfterExternalLaunch?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalLaunch]);

  const canSelect = (p: Piece) => !disabled && !simulatingRef.current && p.owner === currentPlayer && p.alive;

  const onPieceDown = (pieceId: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    const p = local.find((q) => q.id === pieceId);
    if (!p || !canSelect(p)) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const pos = toSvg(e.clientX, e.clientY);
    setSelectedId(pieceId);
    setDrag({ pieceId, startX: p.x, startY: p.y, dragX: pos.x, dragY: pos.y });
  };

  const onBoardMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const pos = toSvg(e.clientX, e.clientY);
    setDrag({ ...drag, dragX: pos.x, dragY: pos.y });
  };

  const onBoardUp = () => {
    if (!drag) return;
    const pullX = drag.dragX - drag.startX;
    const pullY = drag.dragY - drag.startY;
    const piece = local.find((p) => p.id === drag.pieceId);
    const d = drag;
    setDrag(null);
    if (!piece) return;
    const power = mods.powerByPiece[piece.id] ?? 1;
    const { vx, vy, speed } = computeLaunchVelocity(pullX, pullY, power);
    if (speed < 0.5) {
      setSelectedId(null);
      return;
    }
    const seed = piecesRef.current.map((p) => (p.id === d.pieceId ? { ...p, vx, vy } : p));
    onLaunch?.();
    startSim(seed);
  };

  const w = stage.width;
  const h = stage.height;
  const theme = getStageTheme(stage.uiThemeId);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        viewBox={`-20 -20 ${w + 40} ${h + 40}`}
        className="w-full max-w-[480px] max-h-full touch-none"
        preserveAspectRatio="xMidYMid meet"
        onPointerMove={onBoardMove}
        onPointerUp={onBoardUp}
        onPointerCancel={() => setDrag(null)}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="wood" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#f3d38a" />
            <path d="M0 20 Q10 16 20 20 T40 20" stroke="#d9a85a" strokeWidth="1" fill="none" opacity="0.5" />
          </pattern>
        </defs>

        <rect x={-8} y={-8} width={w + 16} height={h + 16} rx={14} fill={theme.boardFrameColor} />
        {theme.textureType === 'wood' ? (
          <rect x={0} y={0} width={w} height={h} rx={10} fill="url(#wood)" stroke="#8a5a2a" strokeWidth={2} />
        ) : (
          <rect x={0} y={0} width={w} height={h} rx={10} fill={theme.boardFieldColor} stroke={theme.boardFrameColor} strokeWidth={2} />
        )}

        <line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke={theme.boardLineColor} strokeDasharray="6 6" />

        {stage.obstacles.map((o, i) => (
          <circle
            key={i}
            cx={o.x}
            cy={o.y}
            r={o.r}
            fill={o.kind === 'bumper' ? '#ffd166' : '#6b4b2a'}
            stroke="#2e1f10"
            strokeWidth={2}
            opacity={0.95}
          />
        ))}

        {local.map((p) => {
          // 端ギリギリで耐える瞬間: 生存中かつコマ半径1個ぶん以内に寄っているとき
          const nearEdge =
            p.alive &&
            (p.x < p.radius * 1.0 ||
              p.x > stage.width - p.radius * 1.0 ||
              p.y < p.radius * 1.0 ||
              p.y > stage.height - p.radius * 1.0);
          return (
            <PieceView
              key={p.id}
              piece={p}
              selected={selectedId === p.id}
              canSelect={canSelect(p)}
              wobble={nearEdge}
              onPointerDown={onPieceDown(p.id)}
            />
          );
        })}

        {drag && (() => {
          const piece = local.find((p) => p.id === drag.pieceId);
          if (!piece) return null;
          return <AimGuide fromX={piece.x} fromY={piece.y} dragX={drag.dragX} dragY={drag.dragY} />;
        })()}
      </svg>
    </div>
  );
}
