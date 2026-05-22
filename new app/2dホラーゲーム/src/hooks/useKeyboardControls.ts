import { useEffect } from 'react';
import type { Direction } from '../game/types';

interface KeyboardHandlers {
  enabled: boolean;
  move: (direction: Direction, running?: boolean) => void;
  interact: () => void;
  pause: () => void;
  openLogs: () => void;
  openInventory: () => void;
  skipDialogue: () => void;
}

const keyToDirection: Record<string, Direction | undefined> = {
  ArrowUp: 'up',
  w: 'up',
  W: 'up',
  ArrowDown: 'down',
  s: 'down',
  S: 'down',
  ArrowLeft: 'left',
  a: 'left',
  A: 'left',
  ArrowRight: 'right',
  d: 'right',
  D: 'right',
};

export function useKeyboardControls(handlers: KeyboardHandlers): void {
  useEffect(() => {
    if (!handlers.enabled) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const direction = keyToDirection[event.key];
      if (direction) {
        event.preventDefault();
        handlers.move(direction, event.shiftKey);
        return;
      }
      if (event.key === 'e' || event.key === 'E' || event.key === 'Enter') {
        event.preventDefault();
        handlers.interact();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        handlers.pause();
        handlers.skipDialogue();
      }
      if (event.key === 'm' || event.key === 'M') {
        event.preventDefault();
        handlers.openLogs();
      }
      if (event.key === 'i' || event.key === 'I') {
        event.preventDefault();
        handlers.openInventory();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlers]);
}
