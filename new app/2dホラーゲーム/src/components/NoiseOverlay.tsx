import { useEffect, useRef } from 'react';

interface NoiseOverlayProps {
  intensity?: number;
  chase?: boolean;
  endingB?: boolean;
  enabled?: boolean;
}

export function NoiseOverlay({ intensity = 0.025, chase = false, endingB = false, enabled = true }: NoiseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return undefined;
    }
    let frame = 0;
    let raf = 0;
    const render = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const image = context.createImageData(width, height);
      const data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = chase || endingB ? value * 0.55 : value;
        data[i + 2] = chase || endingB ? value * 0.48 : value;
        data[i + 3] = 28;
      }
      context.putImageData(image, 0, 0);
      frame += 1;
      raf = window.requestAnimationFrame(render);
    };
    render();
    return () => window.cancelAnimationFrame(raf);
  }, [chase, enabled, endingB]);

  const opacity = endingB ? 0.4 : chase ? Math.max(0.15, intensity) : intensity;
  return <canvas ref={canvasRef} className="noise-overlay" style={{ opacity: enabled ? opacity : 0 }} aria-hidden="true" />;
}
