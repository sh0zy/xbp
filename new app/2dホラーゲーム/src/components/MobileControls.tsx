import { useState } from 'react';
import type { PointerEvent } from 'react';
import type { Direction } from '../game/types';
import { useMobileControls } from '../hooks/useMobileControls';

interface MobileControlsProps {
  onMove: (direction: Direction, running?: boolean) => void;
  onInteract: () => void;
  onOpenLogs: () => void;
  onOpenInventory: () => void;
  hasUnreadLogs: boolean;
}

const directions: Array<{ dir: Direction; label: string; className: string }> = [
  { dir: 'up', label: '↑', className: 'dpad-up' },
  { dir: 'left', label: '←', className: 'dpad-left' },
  { dir: 'down', label: '↓', className: 'dpad-down' },
  { dir: 'right', label: '→', className: 'dpad-right' },
];

export function MobileControls({ onMove, onInteract, onOpenLogs, onOpenInventory, hasUnreadLogs }: MobileControlsProps) {
  const [running, setRunning] = useState(false);
  const controls = useMobileControls((direction) => onMove(direction, running));

  const bindDirection = (direction: Direction) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Some mobile browsers already capture the pointer.
      }
      controls.press(direction, running);
    },
    onPointerUp: controls.release,
    onPointerLeave: controls.release,
    onPointerCancel: controls.release,
  });

  return (
    <div className="mobile-controls">
      <div className="mobile-tabbar">
        <button type="button" onClick={onOpenLogs} aria-label="ログを開く">
          <span className={hasUnreadLogs ? 'tab-dot' : ''} />記録
        </button>
        <button type="button" onClick={onOpenInventory} aria-label="アイテムを開く">持ち物</button>
      </div>
      <div className="control-pad" aria-label="移動操作">
        {directions.map((item) => (
          <button
            key={item.dir}
            type="button"
            className={`dpad-button ${item.className} ${controls.pressed === item.dir ? 'is-active' : ''}`}
            aria-label={`${item.label}へ移動`}
            {...bindDirection(item.dir)}
          >
            {item.label}
          </button>
        ))}
        <span className="dpad-center" />
      </div>
      <div className="action-pad">
        <button type="button" className="inspect-button" onClick={onInteract} aria-label="調べる">
          調べる<span>E</span>
        </button>
        <button
          type="button"
          className={`run-button ${running ? 'is-active' : ''}`}
          onPointerDown={(event) => {
            event.preventDefault();
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              // harmless on browsers without explicit capture support
            }
            setRunning(true);
          }}
          onPointerUp={() => setRunning(false)}
          onPointerLeave={() => setRunning(false)}
          onPointerCancel={() => setRunning(false)}
          aria-label="走る"
        >
          走る
        </button>
      </div>
    </div>
  );
}
