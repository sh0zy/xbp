import { useCallback, useEffect, useRef, useState } from 'react';
import type { Direction } from '../game/types';

const INITIAL_REPEAT_DELAY_MS = 180;
const REPEAT_INTERVAL_MS = 135;

export function useMobileControls(onMove: (direction: Direction, running?: boolean) => void) {
  const [pressed, setPressed] = useState<Direction | null>(null);
  const moveRef = useRef(onMove);
  const repeatDelayRef = useRef<number | null>(null);
  const repeatIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    moveRef.current = onMove;
  }, [onMove]);

  const clearRepeat = useCallback(() => {
    if (repeatDelayRef.current !== null) {
      window.clearTimeout(repeatDelayRef.current);
      repeatDelayRef.current = null;
    }
    if (repeatIntervalRef.current !== null) {
      window.clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
  }, []);

  const press = useCallback((direction: Direction, running = false) => {
    clearRepeat();
    setPressed(direction);
    moveRef.current(direction, running);

    repeatDelayRef.current = window.setTimeout(() => {
      repeatIntervalRef.current = window.setInterval(() => {
        moveRef.current(direction, running);
      }, REPEAT_INTERVAL_MS);
    }, INITIAL_REPEAT_DELAY_MS);
  }, [clearRepeat]);

  const release = useCallback(() => {
    clearRepeat();
    setPressed(null);
  }, [clearRepeat]);

  useEffect(() => release, [release]);

  return { pressed, press, release };
}
