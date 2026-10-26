import type { JSX } from 'react';
import { MascotSvg } from './MascotSvg';
import { cn } from '@/lib/cn';
import type { SpeechBubbleProps } from '@/types/content';

export function SpeechBubble({
  crew,
  mood = 'idle',
  side = 'left',
  className,
  children,
}: SpeechBubbleProps): JSX.Element {
  const isRight = side === 'right';

  return (
    <div
      className={cn(
        'flex items-start gap-3.5',
        isRight && 'flex-row-reverse',
        className
      )}
    >
      <div className="shrink-0 pt-1">
        <MascotSvg
          crew={crew}
          mood={mood}
          size={56}
          variant="head"
          flip={isRight}
          className="size-10 min-[400px]:size-14"
        />
      </div>

      <div className="relative nb-card flex-1 bg-surface p-4 text-ink">
        <svg
          className={cn(
            'pointer-events-none absolute top-4 -left-2.5 h-3.5 w-3',
            isRight && '-right-2.5 left-auto scale-x-[-1]'
          )}
          viewBox="0 0 12 14"
          aria-hidden="true"
        >
          <polygon
            points="12,1 1,7 12,13"
            fill="var(--surface)"
            stroke="var(--ink)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="2"
            x2="12"
            y2="12"
            stroke="var(--surface)"
            strokeWidth="3"
          />
        </svg>

        <div className="relative z-1 font-sans text-sm leading-relaxed text-ink">
          {children}
        </div>
      </div>
    </div>
  );
}
