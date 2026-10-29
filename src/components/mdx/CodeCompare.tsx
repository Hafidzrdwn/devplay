import * as React from 'react';
import { MascotSvg } from '@/components/mascot/MascotSvg';
import { useTranslations } from '@/i18n/ui';
import { cn } from '@/lib/cn';
import { highlightCode, type HighlightLanguage } from '@/lib/highlight';
import type {
  CodeCompareExample,
  CodeCompareProps,
  CodeSample,
} from '@/types/content';

type LayoutMode = 'tab' | 'stack';
type ActiveTab = 'bad' | 'good';

export function CodeCompare({
  lang,
  language,
  bad,
  good,
  examples,
  defaultExampleId,
  className,
}: CodeCompareProps): React.JSX.Element {
  const t = useTranslations(lang);

  const normalizedExamples = React.useMemo<CodeCompareExample[]>(() => {
    if (examples && examples.length > 0) {
      return examples;
    }
    if (language && bad && good) {
      return [
        {
          id: 'default',
          label: language.toUpperCase(),
          language,
          bad,
          good,
        },
      ];
    }
    return [];
  }, [examples, language, bad, good]);

  const [selectedExampleId, setSelectedExampleId] = React.useState<string>(() => {
    if (defaultExampleId && normalizedExamples.some((ex) => ex.id === defaultExampleId)) {
      return defaultExampleId;
    }
    return normalizedExamples[0]?.id ?? 'default';
  });

  const currentExample = React.useMemo(() => {
    return (
      normalizedExamples.find((ex) => ex.id === selectedExampleId) ??
      normalizedExamples[0]
    );
  }, [normalizedExamples, selectedExampleId]);

  const [layout, setLayout] = React.useState<LayoutMode>('tab');
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('bad');
  const [badHtml, setBadHtml] = React.useState<string | null>(null);
  const [goodHtml, setGoodHtml] = React.useState<string | null>(null);
  const [copiedType, setCopiedType] = React.useState<'bad' | 'good' | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!currentExample) {
      return;
    }
    let isMounted = true;

    highlightCode(
      currentExample.bad.code,
      currentExample.language as HighlightLanguage
    ).then((html) => {
      if (isMounted) {
        setBadHtml(html);
      }
    });

    highlightCode(
      currentExample.good.code,
      currentExample.language as HighlightLanguage
    ).then((html) => {
      if (isMounted) {
        setGoodHtml(html);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentExample]);

  React.useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const handleCopy = React.useCallback(
    async (type: 'bad' | 'good') => {
      if (!currentExample) {
        return;
      }
      const textToCopy =
        type === 'bad' ? currentExample.bad.code : currentExample.good.code;
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopiedType(type);
        setTimeout(() => {
          setCopiedType(null);
        }, 2000);
      } catch {
        setCopiedType(null);
      }
    },
    [currentExample]
  );

  if (!currentExample) {
    return <div className="hidden" />;
  }

  const renderPanel = (type: 'bad' | 'good') => {
    const isBad = type === 'bad';
    const sample: CodeSample = isBad ? currentExample.bad : currentExample.good;
    const html = isBad ? badHtml : goodHtml;
    const borderClass = isBad ? 'border-danger' : 'border-success';
    const headerBgClass = isBad ? 'bg-danger/10' : 'bg-success/10';
    const textClass = isBad ? 'text-danger' : 'text-success';
    const title = isBad ? t('code.bad') : t('code.good');
    const crew = isBad ? 'bug' : 'dev';
    const mood = isBad ? 'confused' : 'happy';
    const isCopied = copiedType === type;

    return (
      <div
        className={cn(
          'nb-card flex flex-col rounded-card border-2 bg-surface shadow-hard overflow-hidden w-full min-w-0 transition-all',
          borderClass
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between border-b-2 px-4 py-2.5 select-none shrink-0',
            borderClass,
            headerBgClass
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 size-8 flex items-center justify-center">
              <MascotSvg crew={crew} mood={mood} size={32} variant="head" />
            </div>
            <span className={cn('font-heading font-bold text-sm sm:text-base truncate', textClass)}>
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={cn(
                'inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-bold uppercase',
                isBad
                  ? 'border-danger/40 bg-surface text-danger shadow-[1px_1px_0_0_var(--danger)]'
                  : 'border-success/40 bg-surface text-success shadow-[1px_1px_0_0_var(--success)]'
              )}
            >
              {currentExample.language}
            </span>

            <button
              type="button"
              onClick={() => handleCopy(type)}
              aria-label={isCopied ? 'Copied' : 'Copy code'}
              title={isCopied ? 'Copied' : 'Copy code'}
              className="nb-button inline-flex items-center justify-center size-8 rounded border border-ink bg-surface text-ink hover:bg-bg transition-colors focus-visible:ring-2 focus-visible:ring-primary min-h-8 min-w-8 cursor-pointer"
            >
              {isCopied ? (
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-success"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-35 bg-bg/25 min-w-0 overflow-hidden flex flex-col justify-stretch">
          {html ? (
            <div
              className="nb-code-clean flex-1 p-4 sm:p-5 overflow-x-auto nb-scrollbar text-xs sm:text-sm font-mono leading-relaxed min-w-0 [&>pre]:m-0 [&>pre]:bg-transparent! [&>pre]:p-0 [&>pre]:font-mono [&>pre]:text-xs sm:[&>pre]:text-sm [&>pre]:leading-relaxed [&>pre]:min-w-full [&>pre]:w-max"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <div className="flex-1 p-4 sm:p-5 overflow-x-auto nb-scrollbar text-xs sm:text-sm font-mono leading-relaxed min-w-0">
              <pre className="m-0 text-ink bg-transparent whitespace-pre font-mono text-xs sm:text-sm leading-relaxed min-w-full w-max">
                <code>{sample.code}</code>
              </pre>
            </div>
          )}
        </div>

        {sample.caption && (
          <div className="border-t-2 border-ink/15 bg-bg/50 px-4 py-2.5 text-xs sm:text-sm leading-relaxed text-ink/85 font-sans shrink-0">
            {sample.caption}
          </div>
        )}
      </div>
    );
  };

  const renderLanguageSelector = () => {
    if (normalizedExamples.length <= 1) {
      return null;
    }

    if (normalizedExamples.length > 3) {
      return (
        <div className="inline-flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-muted uppercase tracking-wider hidden sm:inline">
            {lang === 'id' ? 'Bahasa:' : 'Language:'}
          </span>
          <div className="relative inline-flex items-center">
            <select
              value={currentExample.id}
              onChange={(e) => setSelectedExampleId(e.target.value)}
              aria-label={lang === 'id' ? 'Pilih varian bahasa' : 'Select language variant'}
              className="appearance-none h-8.5 rounded-card border-2 border-ink bg-surface pl-3 pr-8 text-xs font-mono font-bold text-ink shadow-[2px_2px_0_0_var(--ink)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:bg-bg transition-colors"
            >
              {normalizedExamples.map((ex) => (
                <option key={ex.id} value={ex.id} className="bg-surface text-ink font-mono text-xs">
                  {ex.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink">
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-muted uppercase tracking-wider hidden sm:inline">
          {lang === 'id' ? 'Bahasa:' : 'Language:'}
        </span>
        <div className="inline-flex items-center h-8.5 rounded-card border-2 border-ink bg-surface p-0.5 shadow-[2px_2px_0_0_var(--ink)] gap-1">
          {normalizedExamples.map((ex) => {
            const isSelected = ex.id === currentExample.id;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelectedExampleId(ex.id)}
                className={cn(
                  'inline-flex items-center h-7 px-2.5 rounded text-xs font-mono font-bold transition-all cursor-pointer',
                  isSelected
                    ? 'bg-accent text-accent-ink border border-ink shadow-[1px_1px_0_0_var(--ink)]'
                    : 'text-muted hover:text-ink hover:bg-bg/60'
                )}
              >
                <span>{ex.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('my-6 w-full min-w-0', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 select-none">
        <div className="flex items-center gap-2.5 flex-wrap">
          {renderLanguageSelector()}

          {layout === 'tab' ? (
            <div className="inline-flex items-center h-8.5 rounded-card border-2 border-ink bg-surface p-0.5 shadow-[2px_2px_0_0_var(--ink)] gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('bad')}
                className={cn(
                  'inline-flex items-center gap-1.5 h-7 px-3 rounded text-xs font-mono font-bold transition-all cursor-pointer',
                  activeTab === 'bad'
                    ? 'bg-danger text-danger-ink border border-ink shadow-[1px_1px_0_0_var(--ink)]'
                    : 'text-muted hover:text-ink hover:bg-bg/60'
                )}
              >
                <MascotSvg crew="bug" mood="confused" size={16} variant="head" />
                <span>{t('code.bad')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('good')}
                className={cn(
                  'inline-flex items-center gap-1.5 h-7 px-3 rounded text-xs font-mono font-bold transition-all cursor-pointer',
                  activeTab === 'good'
                    ? 'bg-success text-success-ink border border-ink shadow-[1px_1px_0_0_var(--ink)]'
                    : 'text-muted hover:text-ink hover:bg-bg/60'
                )}
              >
                <MascotSvg crew="dev" mood="happy" size={16} variant="head" />
                <span>{t('code.good')}</span>
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center h-8.5 px-2 text-xs font-mono font-bold uppercase tracking-wider text-muted">
              {lang === 'id' ? 'Tampilan Bertumpuk' : 'Stacked View'}
            </div>
          )}
        </div>

        <div className="inline-flex items-center h-8.5 rounded-card border-2 border-ink bg-surface p-0.5 shadow-[2px_2px_0_0_var(--ink)] gap-1 self-start sm:self-auto sm:ml-auto">
          <button
            type="button"
            onClick={() => setLayout('tab')}
            aria-label={lang === 'id' ? 'Tampilan Tab' : 'Tab view'}
            title={lang === 'id' ? 'Tampilan Tab (Fokus)' : 'Tab View (Focused)'}
            className={cn(
              'inline-flex items-center justify-center size-7 rounded text-xs font-mono font-bold transition-all cursor-pointer',
              layout === 'tab'
                ? 'bg-accent text-accent-ink border border-ink shadow-[1px_1px_0_0_var(--ink)]'
                : 'text-muted hover:text-ink hover:bg-bg/60'
            )}
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setLayout('stack')}
            aria-label={lang === 'id' ? 'Tampilan Bertumpuk' : 'Stacked view'}
            title={lang === 'id' ? 'Tampilan Bertumpuk (Atas-Bawah)' : 'Stacked View (Top-Bottom)'}
            className={cn(
              'inline-flex items-center justify-center size-7 rounded text-xs font-mono font-bold transition-all cursor-pointer',
              layout === 'stack'
                ? 'bg-accent text-accent-ink border border-ink shadow-[1px_1px_0_0_var(--ink)]'
                : 'text-muted hover:text-ink hover:bg-bg/60'
            )}
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="7" rx="2" />
              <rect x="3" y="14" width="18" height="7" rx="2" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label={lang === 'id' ? 'Buka komparasi layar penuh' : 'Open fullscreen comparison'}
            title={lang === 'id' ? 'Komparasi Berdampingan (Layar Penuh)' : 'Side-by-Side (Fullscreen Modal)'}
            className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded text-xs font-mono font-bold transition-all cursor-pointer text-muted hover:text-ink hover:bg-bg/60"
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 3h6v6" />
              <path d="M9 21H3v-6" />
              <path d="M21 3l-7 7" />
              <path d="M3 21l7-7" />
            </svg>
            <span className="hidden sm:inline text-[11px]">
              {lang === 'id' ? 'Fullscreen' : 'Fullscreen'}
            </span>
          </button>
        </div>
      </div>

      {layout === 'tab' && (
        <div className="w-full min-w-0">
          {activeTab === 'bad' ? renderPanel('bad') : renderPanel('good')}
        </div>
      )}

      {layout === 'stack' && (
        <div className="flex flex-col gap-5 w-full min-w-0">
          {renderPanel('bad')}
          {renderPanel('good')}
        </div>
      )}

      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'id' ? 'Komparasi Kode Layar Penuh' : 'Fullscreen Code Comparison'}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-bg/85 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="relative flex flex-col w-full max-w-7xl h-[92vh] max-h-240 rounded-card border-2 border-ink bg-surface shadow-[8px_8px_0_0_var(--ink)] overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-ink bg-surface px-4 sm:px-6 py-3 select-none shrink-0 gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-wrap">
                <span className="inline-flex items-center rounded border border-ink bg-accent px-2 py-0.5 text-xs font-mono font-bold text-accent-ink uppercase shadow-[1px_1px_0_0_var(--ink)]">
                  {currentExample.language}
                </span>
                <span className="font-heading font-bold text-base sm:text-lg text-ink truncate">
                  {lang === 'id'
                    ? `Komparasi Praktik: Buruk vs Baik (${currentExample.label})`
                    : `Code Comparison: Bad vs Good (${currentExample.label})`}
                </span>
                {renderLanguageSelector()}
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label={lang === 'id' ? 'Tutup komparasi layar penuh' : 'Close fullscreen comparison'}
                className="inline-flex items-center gap-1.5 rounded-card border-2 border-ink bg-bg px-3 py-1.5 text-xs font-mono font-bold text-ink shadow-[2px_2px_0_0_var(--ink)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <span>{lang === 'id' ? 'Tutup' : 'Close'}</span>
                <kbd className="hidden sm:inline-block px-1 py-0.5 text-[10px] rounded bg-surface border border-ink/40 text-muted shadow-[1px_1px_0_0_var(--ink)]">
                  ESC
                </kbd>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 nb-scrollbar min-w-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch min-w-0">
                {renderPanel('bad')}
                {renderPanel('good')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeCompare;
