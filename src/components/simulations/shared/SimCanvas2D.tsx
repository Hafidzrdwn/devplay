import * as React from 'react';
import { useThemeTokens, type SimTokens } from './useThemeTokens';

export interface CanvasSize {
  width: number;
  height: number;
}

export interface SimCanvas2DProps {
  draw: (
    ctx: CanvasRenderingContext2D,
    size: CanvasSize,
    tokens: SimTokens,
    timeMs: number
  ) => void;
  running?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

export function SimCanvas2D({
  draw,
  running = false,
  className,
  style,
  ariaLabel,
}: SimCanvas2DProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const tokens = useThemeTokens();
  const tokensRef = React.useRef(tokens);
  tokensRef.current = tokens;

  const animationFrameIdRef = React.useRef<number | null>(null);
  const sizeRef = React.useRef<CanvasSize>({ width: 0, height: 0 });
  const drawRef = React.useRef(draw);

  const renderFrame = React.useCallback((timeMs: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    const size = sizeRef.current;
    if (size.width <= 0 || size.height <= 0) {
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(dpr, dpr);
    drawRef.current(context, size, tokensRef.current, timeMs);
    context.restore();
  }, []);

  const applyCanvasScaling = React.useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) {
      return;
    }

    const boundingClientRect = container.getBoundingClientRect();
    const width = Math.floor(boundingClientRect.width);
    const height = Math.floor(boundingClientRect.height);

    if (width <= 0 || height <= 0) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    sizeRef.current = { width, height };

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    if (context) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);
    }
  }, []);

  React.useEffect(() => {
    drawRef.current = draw;
    if (!running) {
      renderFrame(performance.now());
    }
  }, [draw, running, renderFrame]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    applyCanvasScaling();
    renderFrame(performance.now());

    const resizeObserver = new ResizeObserver(() => {
      applyCanvasScaling();
      renderFrame(performance.now());
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [applyCanvasScaling, renderFrame]);

  React.useEffect(() => {
    renderFrame(performance.now());
  }, [tokens, renderFrame]);

  React.useEffect(() => {
    if (!running) {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      return;
    }

    let isSubscribed = true;

    const tick = (timeMs: number) => {
      if (!isSubscribed) {
        return;
      }
      renderFrame(timeMs);
      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      isSubscribed = false;
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [running, renderFrame]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '120px',
        overflow: 'hidden',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
