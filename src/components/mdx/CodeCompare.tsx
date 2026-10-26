import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { MascotSvg } from '@/components/mascot/MascotSvg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from '@/i18n/ui';
import { cn } from '@/lib/cn';
import { highlightCode, type HighlightLanguage } from '@/lib/highlight';
import type { CodeCompareProps, CodeSample } from '@/types/content';

export function CodeCompare({
  lang,
  language,
  bad,
  good,
  className,
}: CodeCompareProps): React.JSX.Element {
  const t = useTranslations(lang);
  const [badHtml, setBadHtml] = React.useState<string | null>(null);
  const [goodHtml, setGoodHtml] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<boolean>(false);

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

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(good.code);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }, [good.code]);

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

    return (
      <div
        className={cn(
          'nb-card flex flex-col rounded-card border-2 bg-surface shadow-hard overflow-hidden h-full',
          borderClass
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between border-b-2 px-3.5 py-2 select-none',
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

            {!isBad && (
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? 'Copied' : 'Copy code'}
                title={copied ? 'Copied' : 'Copy code'}
                className="nb-button inline-flex items-center justify-center size-8 rounded border border-ink bg-surface text-ink hover:bg-bg transition-colors focus-visible:ring-2 focus-visible:ring-primary min-h-8 min-w-8 cursor-pointer"
              >
                {copied ? (
                  <Check size={14} strokeWidth={2.5} className="text-success" aria-hidden="true" />
                ) : (
                  <Copy size={14} strokeWidth={2.5} aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-35 bg-bg/30">
          {html ? (
            <div
              className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed [&>pre]:m-0 [&>pre]:bg-transparent [&>pre]:p-0 [&>pre]:font-mono [&>pre]:text-xs sm:[&>pre]:text-sm [&>pre]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed m-0 text-ink bg-transparent whitespace-pre">
              <code>{sample.code}</code>
            </pre>
          )}
        </div>

        {sample.caption && (
          <div className="border-t-2 border-ink/15 bg-bg/50 px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-ink/80 font-sans">
            {sample.caption}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('my-6 w-full', className)}>
      <div className="block md:hidden">
        <Tabs defaultValue="bad" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-3">
            <TabsTrigger value="bad" className="text-danger data-[state=active]:bg-danger/15">
              {t('code.bad')}
            </TabsTrigger>
            <TabsTrigger value="good" className="text-success data-[state=active]:bg-success/15">
              {t('code.good')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bad" className="m-0">
            {renderPanel('bad')}
          </TabsContent>
          <TabsContent value="good" className="m-0">
            {renderPanel('good')}
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden md:grid md:grid-cols-2 md:gap-4 lg:gap-6 items-stretch">
        {renderPanel('bad')}
        {renderPanel('good')}
      </div>
    </div>
  );
}

export default CodeCompare;
