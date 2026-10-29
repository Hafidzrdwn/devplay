import * as React from 'react';
import { MascotSvg } from '@/components/mascot/MascotSvg';
import { SimulationContainer } from '@/components/mdx/SimulationContainer';
import { MotionProvider, m } from '@/components/simulations/shared/MotionProvider';
import type { MascotMood, SimulationProps } from '@/types/content';
import { getLabels } from './labels';

interface VisualDot {
  id: string;
  x: number;
  timestamp: number;
}

interface DebounceState {
  rawCount: number;
  debouncedCount: number;
  delayMs: number;
  remainingMs: number;
  status: 'idle' | 'counting' | 'executed';
  lastEventTime: number;
  rawDots: VisualDot[];
  debouncedDots: VisualDot[];
  isInternTyping: boolean;
  captionKey: 'idle' | 'counting' | 'restarted' | 'executed' | 'reset';
  captionParam: number;
}

type DebounceAction =
  | { type: 'TRIGGER_RAW'; id: string; timestamp: number }
  | { type: 'TICK'; remainingMs: number }
  | { type: 'EXECUTE_DEBOUNCE'; id: string; timestamp: number }
  | { type: 'SET_DELAY'; delayMs: number }
  | { type: 'RESET' }
  | { type: 'STOP_TYPING' };

const INITIAL_DELAY_MS = 350;

function createInitialState(): DebounceState {
  return {
    rawCount: 0,
    debouncedCount: 0,
    delayMs: INITIAL_DELAY_MS,
    remainingMs: 0,
    status: 'idle',
    lastEventTime: 0,
    rawDots: [],
    debouncedDots: [],
    isInternTyping: false,
    captionKey: 'idle',
    captionParam: 0,
  };
}

function calculateDotX(index: number, total: number, startX: number, endX: number): number {
  const step = 28;
  const maxAvailable = endX - startX;
  if (total * step > maxAvailable) {
    const compactStep = maxAvailable / Math.max(1, total - 1);
    return startX + index * compactStep;
  }
  return startX + index * step;
}

function debounceReducer(state: DebounceState, action: DebounceAction): DebounceState {
  switch (action.type) {
    case 'TRIGGER_RAW': {
      const nextRawCount = state.rawCount + 1;
      const nextRawDots = [
        ...state.rawDots.slice(-14),
        { id: action.id, x: 0, timestamp: action.timestamp },
      ];
      const nextRawDotsWithPositions = nextRawDots.map((dot, index) => ({
        ...dot,
        x: calculateDotX(index, nextRawDots.length, 140, 520),
      }));
      const isRestarting = state.status === 'counting';

      return {
        ...state,
        rawCount: nextRawCount,
        remainingMs: state.delayMs,
        status: 'counting',
        lastEventTime: action.timestamp,
        rawDots: nextRawDotsWithPositions,
        isInternTyping: true,
        captionKey: isRestarting ? 'restarted' : 'counting',
        captionParam: state.delayMs,
      };
    }

    case 'TICK': {
      return {
        ...state,
        remainingMs: Math.max(0, action.remainingMs),
      };
    }

    case 'EXECUTE_DEBOUNCE': {
      const nextDebouncedCount = state.debouncedCount + 1;
      const nextDebouncedDots = [
        ...state.debouncedDots.slice(-14),
        { id: action.id, x: 0, timestamp: action.timestamp },
      ];
      const nextDebouncedDotsWithPositions = nextDebouncedDots.map((dot, index) => ({
        ...dot,
        x: calculateDotX(index, nextDebouncedDots.length, 140, 520),
      }));

      return {
        ...state,
        debouncedCount: nextDebouncedCount,
        remainingMs: 0,
        status: 'executed',
        debouncedDots: nextDebouncedDotsWithPositions,
        captionKey: 'executed',
        captionParam: nextDebouncedCount,
      };
    }

    case 'SET_DELAY': {
      return {
        ...state,
        delayMs: action.delayMs,
        remainingMs: state.status === 'counting' ? action.delayMs : state.remainingMs,
      };
    }

    case 'RESET': {
      return {
        ...createInitialState(),
        delayMs: state.delayMs,
        captionKey: 'reset',
      };
    }

    case 'STOP_TYPING': {
      return {
        ...state,
        isInternTyping: false,
      };
    }
  }
}

export function Debouncing({ lang }: SimulationProps): React.JSX.Element {
  const labels = getLabels(lang);
  const [state, dispatch] = React.useReducer(debounceReducer, undefined, createInitialState);

  const timerRef = React.useRef<number | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const targetTimeRef = React.useRef<number>(0);
  const typingTimeoutRef = React.useRef<number | null>(null);
  const spamIntervalsRef = React.useRef<number[]>([]);

  const clearAllTimers = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    for (const intervalId of spamIntervalsRef.current) {
      window.clearTimeout(intervalId);
    }
    spamIntervalsRef.current = [];
  }, []);

  const triggerSingleEvent = React.useCallback(() => {
    const timestamp = Date.now();
    const eventId = `raw-${timestamp}-${Math.random().toString(36).slice(2, 7)}`;

    dispatch({ type: 'TRIGGER_RAW', id: eventId, timestamp });

    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      dispatch({ type: 'STOP_TYPING' });
    }, 200);

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }

    targetTimeRef.current = timestamp + state.delayMs;

    const tick = () => {
      const now = Date.now();
      const remaining = targetTimeRef.current - now;

      if (remaining > 0) {
        dispatch({ type: 'TICK', remainingMs: remaining });
        animationFrameRef.current = window.requestAnimationFrame(tick);
      } else {
        dispatch({ type: 'TICK', remainingMs: 0 });
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);

    timerRef.current = window.setTimeout(() => {
      const execTimestamp = Date.now();
      const execId = `debounced-${execTimestamp}-${Math.random().toString(36).slice(2, 7)}`;
      dispatch({ type: 'EXECUTE_DEBOUNCE', id: execId, timestamp: execTimestamp });
      timerRef.current = null;
    }, state.delayMs);
  }, [state.delayMs]);

  const triggerBurst = React.useCallback(() => {
    for (const timeoutId of spamIntervalsRef.current) {
      window.clearTimeout(timeoutId);
    }
    spamIntervalsRef.current = [];

    const burstCount = 10;
    const intervalSpacingMs = 70;

    for (let index = 0; index < burstCount; index += 1) {
      const timeoutId = window.setTimeout(() => {
        triggerSingleEvent();
      }, index * intervalSpacingMs);
      spamIntervalsRef.current.push(timeoutId);
    }
  }, [triggerSingleEvent]);

  const handleReset = React.useCallback(() => {
    clearAllTimers();
    dispatch({ type: 'RESET' });
  }, [clearAllTimers]);

  const handleDelayChange = React.useCallback(
    (newDelay: number) => {
      clearAllTimers();
      dispatch({ type: 'SET_DELAY', delayMs: newDelay });
    },
    [clearAllTimers]
  );

  React.useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const narratorMood: MascotMood =
    state.status === 'counting'
      ? 'thinking'
      : state.status === 'executed'
        ? 'celebrate'
        : 'idle';

  const captionText =
    state.captionKey === 'counting'
      ? labels.captions.counting(state.remainingMs)
      : state.captionKey === 'restarted'
        ? labels.captions.restarted(state.remainingMs)
        : state.captionKey === 'executed'
          ? labels.captions.executed(state.debouncedCount)
          : state.captionKey === 'reset'
            ? labels.captions.reset
            : labels.captions.idle;

  const savedPercent =
    state.rawCount > 0
      ? Math.max(0, Math.round(((state.rawCount - state.debouncedCount) / state.rawCount) * 100))
      : 0;

  const ringRadius = 26;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const progressRatio = state.delayMs > 0 ? state.remainingMs / state.delayMs : 0;
  const strokeDashoffset = ringCircumference * (1 - progressRatio);

  return (
    <SimulationContainer
      lang={lang as 'id' | 'en'}
      title={labels.title}
      kind="2d"
      caption={captionText}
      narrator="pixel"
      mood={narratorMood}
      onReset={handleReset}
      sliders={[
        {
          id: 'debounce-delay',
          label: labels.delayLabel,
          min: 100,
          max: 1000,
          step: 50,
          value: state.delayMs,
          unit: 'ms',
          onChange: handleDelayChange,
        },
      ]}
      minHeight={340}
    >
      <MotionProvider>
        <div className="flex flex-col items-center justify-between w-full h-full p-4 gap-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-card border-2 border-ink bg-surface shadow-[2px_2px_0_0_var(--ink)]">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-muted uppercase tracking-wider text-center">
                {labels.rawCountLabel}
              </span>
              <span className="font-heading text-lg sm:text-2xl font-bold text-ink">
                {state.rawCount}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-card border-2 border-ink bg-surface shadow-[2px_2px_0_0_var(--ink)]">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-muted uppercase tracking-wider text-center">
                {labels.debouncedCountLabel}
              </span>
              <span className="font-heading text-lg sm:text-2xl font-bold text-success">
                {state.debouncedCount}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-card border-2 border-ink bg-surface shadow-[2px_2px_0_0_var(--ink)]">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-muted uppercase tracking-wider text-center">
                {labels.efficiencyLabel}
              </span>
              <span className="font-heading text-lg sm:text-2xl font-bold text-primary">
                {savedPercent}%
              </span>
            </div>
          </div>

          <div className="w-full relative rounded-card border-2 border-ink bg-surface shadow-[3px_3px_0_0_var(--ink)] overflow-hidden">
            <svg
              viewBox="0 0 680 230"
              className="w-full h-auto select-none block"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="debounce-grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1" className="fill-ink/15" />
                </pattern>
              </defs>

              <rect width="680" height="230" fill="url(#debounce-grid)" />

              <g transform="translate(16, 12)">
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="22"
                  rx="4"
                  className="fill-bg stroke-ink"
                  strokeWidth="1.5"
                />
                <text
                  x="10"
                  y="15"
                  className="font-mono text-[11px] font-bold fill-ink"
                >
                  {labels.rawLaneTitle}
                </text>
              </g>

              <line
                x1="120"
                y1="70"
                x2="540"
                y2="70"
                className="stroke-ink/40"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              <MascotSvg
                crew="intern"
                mood={state.isInternTyping ? 'happy' : 'idle'}
                embed={{ x: 16, y: 46, scale: 0.42 }}
              />

              <g transform="translate(74, 56)">
                <rect
                  x="0"
                  y="0"
                  width="36"
                  height="26"
                  rx="3"
                  className="fill-surface stroke-ink"
                  strokeWidth="1.5"
                />
                <rect x="4" y="4" width="28" height="14" rx="2" className="fill-bg stroke-ink/30" strokeWidth="1" />
                <rect x="12" y="21" width="12" height="2" className="fill-ink" />
              </g>

              {state.rawDots.map((dot) => (
                <m.g
                  key={dot.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <circle
                    cx={dot.x}
                    cy="70"
                    r="8"
                    className="fill-accent stroke-ink"
                    strokeWidth="2"
                  />
                  <circle
                    cx={dot.x}
                    cy="70"
                    r="3"
                    className="fill-accent-ink"
                  />
                </m.g>
              ))}

              <g transform="translate(565, 30)">
                <rect
                  x="0"
                  y="0"
                  width="98"
                  height="170"
                  rx="8"
                  className="fill-surface stroke-ink"
                  strokeWidth="2"
                />
                <text
                  x="49"
                  y="20"
                  textAnchor="middle"
                  className="font-mono text-[10px] font-bold fill-muted uppercase"
                >
                  {labels.countdownRingLabel}
                </text>

                <circle
                  cx="49"
                  cy="75"
                  r={ringRadius}
                  className="stroke-ink/20 fill-bg"
                  strokeWidth="5"
                />

                <circle
                  cx="49"
                  cy="75"
                  r={ringRadius}
                  className="stroke-primary fill-none"
                  strokeWidth="5"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 49 75)"
                />

                {state.status === 'executed' ? (
                  <path
                    d="M43 75 L47 79 L55 70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-success"
                  />
                ) : (
                  <text
                    x="49"
                    y="73"
                    textAnchor="middle"
                    className="font-heading text-[12px] font-bold fill-ink"
                  >
                    {state.status === 'counting' ? `${Math.ceil(state.remainingMs)}` : '0'}
                  </text>
                )}
                <text
                  x="49"
                  y="86"
                  textAnchor="middle"
                  className="font-mono text-[9px] fill-muted font-bold"
                >
                  {state.status === 'counting' ? 'ms' : state.status === 'executed' ? 'DONE' : 'READY'}
                </text>

                <g transform="translate(10, 116)">
                  <rect
                    x="0"
                    y="0"
                    width="78"
                    height="42"
                    rx="4"
                    className="fill-bg stroke-ink/30"
                    strokeWidth="1"
                  />
                  <text
                    x="39"
                    y="16"
                    textAnchor="middle"
                    className="font-mono text-[9px] font-bold fill-muted"
                  >
                    STATUS
                  </text>
                  <text
                    x="39"
                    y="32"
                    textAnchor="middle"
                    className={`font-mono text-[10px] font-bold ${
                      state.status === 'counting'
                        ? 'fill-accent'
                        : state.status === 'executed'
                          ? 'fill-success'
                          : 'fill-ink'
                    }`}
                  >
                    {state.status === 'counting' ? 'HOLD' : state.status === 'executed' ? 'FIRED' : 'IDLE'}
                  </text>
                </g>
              </g>

              <g transform="translate(16, 130)">
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="22"
                  rx="4"
                  className="fill-bg stroke-ink"
                  strokeWidth="1.5"
                />
                <text
                  x="10"
                  y="15"
                  className="font-mono text-[11px] font-bold fill-ink"
                >
                  {labels.debouncedLaneTitle}
                </text>
              </g>

              <line
                x1="120"
                y1="178"
                x2="540"
                y2="178"
                className="stroke-ink/40"
                strokeWidth="2"
              />

              <g transform="translate(48, 160)">
                <rect
                  x="0"
                  y="0"
                  width="58"
                  height="34"
                  rx="4"
                  className="fill-surface stroke-ink"
                  strokeWidth="1.5"
                />
                <text
                  x="29"
                  y="16"
                  textAnchor="middle"
                  className="font-mono text-[9px] font-bold fill-muted uppercase"
                >
                  HANDLER
                </text>
                <text
                  x="29"
                  y="28"
                  textAnchor="middle"
                  className="font-mono text-[10px] font-bold fill-success"
                >
                  {state.debouncedCount > 0 ? `CALL #${state.debouncedCount}` : 'READY'}
                </text>
              </g>

              {state.debouncedDots.map((dot) => (
                <m.g
                  key={dot.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.4, 1], opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <circle
                    cx={dot.x}
                    cy="178"
                    r="10"
                    className="fill-success stroke-ink"
                    strokeWidth="2"
                  />
                  <circle
                    cx={dot.x}
                    cy="178"
                    r="4"
                    className="fill-white"
                  />
                </m.g>
              ))}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-1">
            <button
              type="button"
              onClick={triggerSingleEvent}
              className="nb-button inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-mono font-bold rounded focus-visible:ring-2 focus-visible:ring-primary select-none cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
              </svg>
              <span>{labels.typeButton}</span>
            </button>

            <button
              type="button"
              onClick={triggerBurst}
              className="nb-button bg-accent text-accent-ink inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-mono font-bold rounded focus-visible:ring-2 focus-visible:ring-primary select-none cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>{labels.spamButton}</span>
            </button>
          </div>
        </div>
      </MotionProvider>
    </SimulationContainer>
  );
}

export default Debouncing;
