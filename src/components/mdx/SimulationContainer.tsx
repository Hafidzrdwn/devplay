import * as React from 'react';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { SpeechBubble } from '@/components/mascot/SpeechBubble';
import { useReducedMotion } from '@/components/simulations/shared/useReducedMotion';
import { useTranslations } from '@/i18n/ui';
import { cn } from '@/lib/cn';
import type { CrewId, Lang, MascotMood, VisualizationKind } from '@/types/content';

export interface SimulationSlider {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
}

export interface SimulationStepControls {
  stepIndex: number;
  stepCount: number;
  onNext: () => void;
  onPrevious?: () => void;
}

export interface SimulationContainerProps {
  lang: Lang;
  title: string;
  kind: VisualizationKind;
  caption: string;
  onReset: () => void;
  stepControls?: SimulationStepControls;
  sliders?: SimulationSlider[];
  minHeight?: number;
  children: React.ReactNode;
  narrator?: CrewId;
  mood?: MascotMood;
  className?: string;
}

export function SimulationContainer({
  lang,
  title,
  kind,
  caption,
  onReset,
  stepControls,
  sliders,
  minHeight = 280,
  children,
  narrator = 'dev',
  mood = 'idle',
  className,
}: SimulationContainerProps): React.JSX.Element {
  const isReducedMotion = useReducedMotion();
  const t = useTranslations(lang);

  const kindBadgeClass =
    kind === '3d'
      ? 'bg-primary text-white dark:text-ink'
      : 'bg-accent text-accent-ink';

  return (
    <div
      data-reduced-motion={isReducedMotion ? 'true' : 'false'}
      className={cn(
        'nb-card relative my-6 rounded-card border-2 border-ink bg-surface shadow-hard overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between border-b-2 border-ink bg-surface px-4 py-3 select-none">
        <h3 className="font-heading font-bold text-base sm:text-lg text-ink truncate m-0">
          {title}
        </h3>
        <span
          className={cn(
            'inline-flex items-center rounded border-2 border-ink px-2 py-0.5 text-xs font-mono font-bold shadow-[2px_2px_0_0_var(--ink)] uppercase shrink-0',
            kindBadgeClass
          )}
        >
          {kind}
        </span>
      </div>

      <div
        className="relative flex flex-col items-center justify-center w-full bg-bg/40 overflow-hidden"
        style={{ minHeight: `${minHeight}px` }}
      >
        {children}
      </div>

      {caption && (
        <div
          role="status"
          aria-live="polite"
          className="border-t-2 border-ink bg-surface p-4"
        >
          <SpeechBubble
            crew={narrator}
            mood={mood}
            className="w-full"
          >
            <p className="m-0 text-sm leading-relaxed text-ink font-sans">
              {caption}
            </p>
          </SpeechBubble>
        </div>
      )}

      <div className="flex flex-col gap-4 border-t-2 border-ink bg-surface p-4">
        {sliders && sliders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {sliders.map((slider) => (
              <div key={slider.id} className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-ink">
                  <label htmlFor={slider.id} className="truncate cursor-pointer">
                    {slider.label}
                  </label>
                  <span className="shrink-0 text-muted">
                    {slider.value}
                    {slider.unit ? ` ${slider.unit}` : ''}
                  </span>
                </div>
                <input
                  id={slider.id}
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={slider.value}
                  aria-valuemin={slider.min}
                  aria-valuemax={slider.max}
                  aria-valuenow={slider.value}
                  aria-valuetext={`${slider.value}${slider.unit ? ` ${slider.unit}` : ''}`}
                  onChange={(event) => slider.onChange(Number(event.target.value))}
                  className="h-10 w-full cursor-pointer appearance-none bg-transparent accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={onReset}
            className="nb-button inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono font-bold min-h-10 min-w-10 rounded focus-visible:ring-2 focus-visible:ring-primary select-none"
          >
            <RotateCcw size={15} strokeWidth={2.5} aria-hidden="true" />
            <span>{t('sim.reset')}</span>
          </button>

          {stepControls && (
            <div className="flex items-center gap-2">
              {stepControls.onPrevious && (
                <button
                  type="button"
                  onClick={stepControls.onPrevious}
                  aria-label={t('sim.previous')}
                  className="nb-button inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-mono font-bold min-h-10 min-w-10 rounded focus-visible:ring-2 focus-visible:ring-primary select-none"
                >
                  <ChevronLeft size={16} strokeWidth={2.5} aria-hidden="true" />
                  <span className="hidden sm:inline">{t('sim.previous')}</span>
                </button>
              )}

              <span
                className="inline-flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-mono font-bold text-ink rounded border-2 border-ink bg-bg shadow-[2px_2px_0_0_var(--ink)] min-h-10 select-none"
                aria-live="polite"
              >
                Step {stepControls.stepIndex} / {stepControls.stepCount}
              </span>

              <button
                type="button"
                onClick={stepControls.onNext}
                aria-label={t('sim.step')}
                className="nb-button bg-accent text-accent-ink inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-mono font-bold min-h-10 min-w-10 rounded focus-visible:ring-2 focus-visible:ring-primary select-none"
              >
                <span>{t('sim.step')}</span>
                <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SimulationContainer;
