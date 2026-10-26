import * as React from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { MascotSvg } from '@/components/mascot/MascotSvg';
import { getCategory } from '@/data/categories';
import { getConcept } from '@/data/concepts';
import { useTranslations } from '@/i18n/ui';
import { cn } from '@/lib/cn';
import { getCurrentConceptSlug, markConceptCompleted } from '@/stores/progress';
import type { CrewId, MascotMood, QuickCheckProps } from '@/types/content';

const confettiParticles = [
  { dx: '-36px', dy: '-32px', rot: '45deg', color: '#ffc933' },
  { dx: '36px', dy: '-30px', rot: '-35deg', color: '#7c5cff' },
  { dx: '-24px', dy: '-48px', rot: '60deg', color: '#2fbf71' },
  { dx: '28px', dy: '-45px', rot: '-50deg', color: '#ff5c5c' },
  { dx: '-44px', dy: '-12px', rot: '20deg', color: '#3ba7ff' },
  { dx: '44px', dy: '-16px', rot: '-25deg', color: '#ff7a1a' },
  { dx: '0px', dy: '-52px', rot: '15deg', color: '#ffd65c' },
];

export function QuickCheck({
  lang,
  question,
  options,
  correctOptionId,
  className,
}: QuickCheckProps): React.JSX.Element {
  const t = useTranslations(lang);
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null);
  const [isAnswered, setIsAnswered] = React.useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(0);
  const optionRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const currentSlug = getCurrentConceptSlug();
  const concept = currentSlug ? getConcept(currentSlug) : undefined;
  const categoryMeta = concept?.category ? getCategory(concept.category) : undefined;
  const leadCrew: CrewId = categoryMeta?.lead ?? 'dev';

  const isCorrect = selectedOptionId === correctOptionId;

  let activeCrew: CrewId = 'intern';
  let activeMood: MascotMood = 'thinking';

  if (isAnswered) {
    if (isCorrect) {
      activeCrew = leadCrew;
      activeMood = 'celebrate';
    } else {
      activeCrew = 'intern';
      activeMood = 'confused';
    }
  }

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) {
      return;
    }
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    if (optionId === correctOptionId && currentSlug) {
      markConceptCompleted(currentSlug);
    }
  };

  const handleRetry = () => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setFocusedIndex(0);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number,
    optionId: string
  ) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = (index + 1) % options.length;
      setFocusedIndex(nextIndex);
      optionRefs.current[nextIndex]?.focus();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length;
      setFocusedIndex(prevIndex);
      optionRefs.current[prevIndex]?.focus();
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleSelectOption(optionId);
    }
  };

  return (
    <div
      className={cn(
        'nb-card relative my-8 rounded-card border-2 border-ink bg-surface shadow-hard p-5 sm:p-7 text-ink',
        className
      )}
    >
      <div className="flex flex-col items-center justify-center mb-5">
        <div className="relative flex items-center justify-center size-16">
          <MascotSvg crew={activeCrew} mood={activeMood} size={56} variant="head" />
          {isAnswered && isCorrect && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
              aria-hidden="true"
            >
              {confettiParticles.map((particle, i) => (
                <span
                  key={i}
                  className="confetti-piece"
                  style={
                    {
                      backgroundColor: particle.color,
                      '--dx': particle.dx,
                      '--dy': particle.dy,
                      '--rot': particle.rot,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <h3 className="font-heading font-bold text-lg sm:text-xl text-ink text-center mb-6 leading-snug">
        {question}
      </h3>

      <div
        role="radiogroup"
        aria-label={question}
        className="space-y-3"
      >
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isOptionCorrect = option.id === correctOptionId;
          const isFocused = focusedIndex === index;

          let cardBorderClass = 'border-ink bg-bg/50 hover:bg-bg hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--ink)]';

          if (isAnswered) {
            if (isOptionCorrect) {
              cardBorderClass = 'border-success bg-success/15 shadow-[2px_2px_0_0_var(--success)]';
            } else if (isSelected) {
              cardBorderClass = 'border-danger bg-danger/15 shadow-[2px_2px_0_0_var(--danger)]';
            } else {
              cardBorderClass = 'border-ink/30 bg-surface opacity-75';
            }
          }

          return (
            <div
              key={option.id}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isAnswered}
              tabIndex={isFocused ? 0 : -1}
              onClick={() => handleSelectOption(option.id)}
              onKeyDown={(event) => handleKeyDown(event, index, option.id)}
              className={cn(
                'group flex flex-col rounded-card border-2 p-4 transition-all outline-none select-none',
                !isAnswered && 'cursor-pointer focus-visible:ring-2 focus-visible:ring-primary',
                cardBorderClass
              )}
            >
              <div className="flex items-start justify-between gap-3 min-w-0">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={cn(
                      'mt-0.5 shrink-0 size-5 rounded-full border-2 border-ink flex items-center justify-center bg-surface transition-colors',
                      isSelected && 'border-ink bg-primary'
                    )}
                  >
                    {isSelected && <span className="size-2 rounded-full bg-white dark:bg-ink" />}
                  </div>

                  <span className="font-sans font-medium text-sm sm:text-base text-ink leading-relaxed">
                    {option.text}
                  </span>
                </div>

                {isAnswered && (
                  <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
                    {isOptionCorrect ? (
                      <span className="inline-flex items-center gap-1 rounded border border-success/40 bg-success/20 px-2 py-0.5 text-xs font-mono font-bold text-success uppercase">
                        <CheckCircle2 size={13} strokeWidth={2.5} aria-hidden="true" />
                        <span>{t('quiz.correct')}</span>
                      </span>
                    ) : isSelected ? (
                      <span className="inline-flex items-center gap-1 rounded border border-danger/40 bg-danger/20 px-2 py-0.5 text-xs font-mono font-bold text-danger uppercase">
                        <XCircle size={13} strokeWidth={2.5} aria-hidden="true" />
                        <span>{t('quiz.wrong')}</span>
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              {isAnswered && option.explanation && (
                <div className="mt-3 pt-3 border-t-2 border-ink/10 font-sans text-xs sm:text-sm leading-relaxed text-ink/80">
                  {option.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isAnswered && !isCorrect && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleRetry}
            className="nb-button inline-flex items-center justify-center gap-2 px-5 py-2.5 font-mono font-bold text-sm min-h-10 rounded focus-visible:ring-2 focus-visible:ring-primary cursor-pointer select-none"
          >
            <RotateCcw size={15} strokeWidth={2.5} aria-hidden="true" />
            <span>{t('quiz.retry')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default QuickCheck;
