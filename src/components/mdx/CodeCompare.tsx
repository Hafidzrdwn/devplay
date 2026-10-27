import * as React from 'react';
import { MascotSvg } from '@/components/mascot/MascotSvg';
import { useTranslations } from '@/i18n/ui';
import { cn } from '@/lib/cn';
import { highlightCode, type HighlightLanguage } from '@/lib/highlight';
import type { CodeCompareProps, CodeSample } from '@/types/content';

type LayoutMode = 'tab' | 'stack' | 'split';
type ActiveTab = 'bad' | 'good';

export function CodeCompare({
  lang,
  language,
  bad,
  good,
  className,
}: CodeCompareProps): React.JSX.Element {
  const t = useTranslations(lang);
  const [layout, setLayout] = React.useState<LayoutMode>('tab');
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('bad');
  const [badHtml, setBadHtml] = React.useState<string | null>(null);
  const [goodHtml, setGoodHtml] = React.useState<string | null>(null);
  const [copiedType, setCopiedType] = React.useState<'bad' | 'good' | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    highlightCode(bad.code, language as HighlightLanguage).then((html) => {
      if (isMounted) {
        setBadHtml(html);
      }
    });

    highlightCode(good.code, language as HighlightLanguage).then((html) => {
      if (isMounted) {
        setGoodHtml(html);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [bad.code, good.code, language]);

  const handleCopy = React.useCallback(async (type: 'bad' | 'good') => {
    const textToCopy = type === 'bad' ? bad.code : good.code;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedType(type);
      setTimeout(() => {
        setCopiedType(null);
      }, 2000);
    } catch {
      setCopiedType(null);
    }
  }, [bad.code, good.code]);

  const renderPanel = (type: 'bad' | 'good') => {
    const isBad = type === 'bad';
    const sample: CodeSample = isBad ? bad : good;
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
          'nb-card flex flex-col rounded-card border-2 bg-surface shadow-hard overflow-hidden w-full transition-all',
          borderClass
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between border-b-2 px-4 py-2.5 select-none',
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
              {language}
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

        <div className="flex-1 min-h-35 bg-bg/25">
          {html ? (
            <div
              className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed [&>pre]:m-0 [&>pre]:bg-transparent [&>pre]:p-0 [&>pre]:font-mono [&>pre]:text-xs sm:[&>pre]:text-sm [&>pre]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed m-0 text-ink bg-transparent whitespace-pre">
              <code>{sample.code}</code>
            </pre>
          )}
        </div>

        {sample.caption && (
          <div className="border-t-2 border-ink/15 bg-bg/50 px-4 py-2.5 text-xs sm:text-sm leading-relaxed text-ink/85 font-sans">
            {sample.caption}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('my-6 w-full', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 select-none">
        {layout === 'tab' ? (
          <div className="inline-flex rounded-lg border-2 border-ink bg-surface p-1 shadow-[2px_2px_0_0_var(--ink)] gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('bad')}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer',
                activeTab === 'bad'
                  ? 'bg-danger text-white border border-ink shadow-[1px_1px_0_0_var(--ink)] -translate-x-px -translate-y-px'
                  : 'text-muted hover:text-ink hover:bg-bg/60'
              )}
            >
              <MascotSvg crew="bug" mood="confused" size={18} variant="head" />
              <span>{t('code.bad')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('good')}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer',
                activeTab === 'good'
                  ? 'bg-success text-white border border-ink shadow-[1px_1px_0_0_var(--ink)] -translate-x-px -translate-y-px'
                  : 'text-muted hover:text-ink hover:bg-bg/60'
              )}
            >
              <MascotSvg crew="dev" mood="happy" size={18} variant="head" />
              <span>{t('code.good')}</span>
            </button>
          </div>
        ) : (
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
            {layout === 'stack' ? 'Tampilan Bertumpuk' : 'Tampilan Berdampingan'}
          </div>
        )}

        <div className="inline-flex rounded-lg border-2 border-ink bg-surface p-1 shadow-[2px_2px_0_0_var(--ink)] gap-1 ml-auto">
          <button
            type="button"
            onClick={() => setLayout('tab')}
            aria-label="Tab view"
            title="Tampilan Tab (Fokus)"
            className={cn(
              'inline-flex items-center justify-center size-7 rounded text-xs font-mono font-bold transition-all cursor-pointer',
              layout === 'tab'
                ? 'bg-accent text-accent-ink border border-ink shadow-[1px_1px_0_0_var(--ink)] -translate-x-px -translate-y-px'
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
            aria-label="Stacked view"
            title="Tampilan Bertumpuk (Atas-Bawah)"
            className={cn(
              'inline-flex items-center justify-center size-7 rounded text-xs font-mono font-bold transition-all cursor-pointer',
              layout === 'stack'
                ? 'bg-accent text-accent-ink border border-ink shadow-[1px_1px_0_0_var(--ink)] -translate-x-px -translate-y-px'
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
            onClick={() => setLayout('split')}
            aria-label="Side-by-side view"
            title="Tampilan Berdampingan"
            className={cn(
              'hidden sm:inline-flex items-center justify-center size-7 rounded text-xs font-mono font-bold transition-all cursor-pointer',
              layout === 'split'
                ? 'bg-accent text-accent-ink border border-ink shadow-[1px_1px_0_0_var(--ink)] -translate-x-px -translate-y-px'
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
              <rect x="3" y="3" width="7" height="18" rx="2" />
              <rect x="14" y="3" width="7" height="18" rx="2" />
            </svg>
          </button>
        </div>
      </div>

      {layout === 'tab' && (
        <div className="w-full">
          {activeTab === 'bad' ? renderPanel('bad') : renderPanel('good')}
        </div>
      )}

      {layout === 'stack' && (
        <div className="flex flex-col gap-5 w-full">
          {renderPanel('bad')}
          {renderPanel('good')}
        </div>
      )}

      {layout === 'split' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch w-full xl:-mx-8 2xl:-mx-16 xl:w-[calc(100%+4rem)] 2xl:w-[calc(100%+8rem)]">
          {renderPanel('bad')}
          {renderPanel('good')}
        </div>
      )}
    </div>
  );
}

export default CodeCompare;
