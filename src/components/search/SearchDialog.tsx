import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { MascotSvg } from '@/components/mascot/MascotSvg';
import { categories } from '@/data/categories';
import { useTranslations } from '@/i18n/ui';
import type { Lang } from '@/i18n/config';
import type { PagefindInstance } from '@/types/pagefind';

interface SearchDialogProps {
  lang: Lang;
}

interface SearchResultItem {
  url: string;
  title: string;
  excerpt: string;
  category: string;
}

function sanitizeExcerpt(excerpt: string): string {
  return excerpt.replace(/<(?!\/?mark\b)[^>]*>/gi, '');
}

function getCategoryName(categoryId: string, currentLang: Lang): string {
  const matchedCategory = categories.find((cat) => cat.id === categoryId);
  if (matchedCategory) {
    return matchedCategory.name[currentLang];
  }
  return categoryId;
}

export function SearchDialog({ lang }: SearchDialogProps): React.JSX.Element {
  const t = useTranslations(lang);
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDevNotice, setIsDevNotice] = React.useState(false);
  const [results, setResults] = React.useState<SearchResultItem[]>([]);
  const pagefindRef = React.useRef<PagefindInstance | null>(null);
  const hasAttemptedRef = React.useRef(false);

  const loadPagefind = React.useCallback(async (): Promise<PagefindInstance | null> => {
    if (pagefindRef.current) {
      return pagefindRef.current;
    }
    if (hasAttemptedRef.current && isDevNotice) {
      return null;
    }

    try {
      const pagefindUrl = '/pagefind/pagefind.js';
      const headResponse = await fetch(pagefindUrl, { method: 'HEAD' });
      const contentType = headResponse.headers.get('content-type') ?? '';

      if (!headResponse.ok || !contentType.includes('javascript')) {
        hasAttemptedRef.current = true;
        setIsDevNotice(true);
        return null;
      }

      const pagefindModule = (await import(/* @vite-ignore */ pagefindUrl)) as PagefindInstance;
      await pagefindModule.init();
      pagefindRef.current = pagefindModule;
      hasAttemptedRef.current = true;
      setIsDevNotice(false);
      return pagefindModule;
    } catch {
      hasAttemptedRef.current = true;
      setIsDevNotice(true);
      return null;
    }
  }, [isDevNotice]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setQuery('');
      setDebouncedQuery('');
      setResults([]);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    const handleOpenSearch = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('devplay:open-search', handleOpenSearch);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('devplay:open-search', handleOpenSearch);
    };
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      void loadPagefind();
    }
  }, [isOpen, loadPagefind]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query]);

  React.useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const performSearch = async () => {
      setIsLoading(true);
      const pagefind = await loadPagefind();
      if (!pagefind) {
        if (!isCancelled) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const searchResponse = await pagefind.search(debouncedQuery);
        if (isCancelled) return;

        const maxResults = searchResponse.results.slice(0, 8);
        const resolvedData = await Promise.all(
          maxResults.map((result) => result.data())
        );

        if (isCancelled) return;

        const items: SearchResultItem[] = resolvedData.map((data) => {
          const rawCategory = data.filters?.category;
          const categoryString = Array.isArray(rawCategory)
            ? (rawCategory[0] ?? 'general')
            : (rawCategory ?? 'general');

          return {
            url: data.url,
            title: data.meta?.title ?? data.url,
            excerpt: sanitizeExcerpt(data.excerpt),
            category: categoryString,
          };
        });

        setResults(items);
      } catch {
        if (!isCancelled) {
          setResults([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void performSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, loadPagefind]);

  const groupedResults = React.useMemo(() => {
    const groups: Record<string, SearchResultItem[]> = {};
    for (const item of results) {
      const groupList = groups[item.category] ?? [];
      groupList.push(item);
      groups[item.category] = groupList;
    }
    return groups;
  }, [results]);

  const categoryKeys = Object.keys(groupedResults);

  const handleSelect = (url: string) => {
    handleOpenChange(false);
    window.location.href = url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-2 border-ink shadow-hard rounded-card">
        <DialogTitle className="sr-only">{t('nav.search')}</DialogTitle>
        <Command shouldFilter={false} className="border-0 shadow-none rounded-none">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={t('search.placeholder')}
            className="pr-12"
          />

          <CommandList className="max-h-96 overflow-y-auto p-2">
            {isLoading && (
              <div className="py-8 text-center text-sm font-semibold text-muted">
                {t('search.loading')}
              </div>
            )}

            {!isLoading && isDevNotice && (
              <div className="py-8 px-4 text-center">
                <div className="flex justify-center mb-3">
                  <MascotSvg crew="intern" mood="confused" size={64} />
                </div>
                <p className="text-sm font-semibold text-muted max-w-xs mx-auto">
                  {t('search.dev_notice')}
                </p>
              </div>
            )}

            {!isLoading && !isDevNotice && debouncedQuery && results.length === 0 && (
              <CommandEmpty className="py-8 px-4 text-center">
                <div className="flex justify-center mb-3">
                  <MascotSvg crew="intern" mood="confused" size={64} />
                </div>
                <p className="text-sm font-bold text-ink">
                  {t('search.empty')}
                </p>
              </CommandEmpty>
            )}

            {!isLoading && !isDevNotice && !debouncedQuery && (
              <div className="py-8 text-center text-xs text-muted">
                {t('search.placeholder')}
              </div>
            )}

            {!isLoading &&
              !isDevNotice &&
              categoryKeys.map((catKey) => {
                const items = groupedResults[catKey] ?? [];
                const catName = getCategoryName(catKey, lang);

                return (
                  <CommandGroup
                    key={catKey}
                    heading={catName}
                    className="pb-2"
                  >
                    {items.map((item) => (
                      <CommandItem
                        key={item.url}
                        value={`${item.title} ${item.url}`}
                        onSelect={() => handleSelect(item.url)}
                        className="flex flex-col items-start gap-1 p-3 rounded-card border-2 border-transparent data-[selected=true]:border-ink data-[selected=true]:bg-accent/20 data-[selected=true]:shadow-[2px_2px_0_0_var(--ink)] transition-all cursor-pointer mb-1.5"
                      >
                        <span className="font-heading font-bold text-sm text-ink">
                          {item.title}
                        </span>
                        <span
                          className="text-xs text-muted line-clamp-2 [&_mark]:bg-accent/40 [&_mark]:text-ink [&_mark]:px-0.5 [&_mark]:rounded-xs [&_mark]:font-bold"
                          dangerouslySetInnerHTML={{ __html: item.excerpt }}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}
          </CommandList>

          <div className="flex items-center justify-between border-t-2 border-ink bg-bg/50 px-4 py-2 text-[10px] font-mono text-muted">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-ink/40 bg-surface px-1 py-0.5 font-bold shadow-[1px_1px_0_0_var(--ink)]">
                  ↓↑
                </kbd>
                {t('search.hint.navigate')}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-ink/40 bg-surface px-1 py-0.5 font-bold shadow-[1px_1px_0_0_var(--ink)]">
                  ↵
                </kbd>
                {t('search.hint.select')}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-ink/40 bg-surface px-1 py-0.5 font-bold shadow-[1px_1px_0_0_var(--ink)]">
                ESC
              </kbd>
              {t('search.hint.close')}
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
