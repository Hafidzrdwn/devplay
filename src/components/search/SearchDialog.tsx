import * as React from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useTranslations } from '@/i18n/ui';
import type { Lang } from '@/i18n/config';
import { cn } from '@/lib/cn';

interface ConceptItem {
  id: string;
  title: string;
  category: string;
  href: string;
  badge: string;
}

interface SearchDialogProps {
  lang: Lang;
}

export function SearchDialog({ lang }: SearchDialogProps) {
  const t = useTranslations(lang);
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const concepts: ConceptItem[] = React.useMemo(
    () => [
      {
        id: 'critical-rendering-path-hydration',
        title:
          lang === 'id'
            ? 'Critical Rendering Path & Hidrasi'
            : 'Critical Rendering Path & Hydration',
        category:
          lang === 'id' ? 'Kinerja Frontend' : 'Frontend Performance',
        href: `/${lang}/docs/frontend-performance/critical-rendering-path-hydration/`,
        badge: '2D Sim',
      },
      {
        id: 'event-loop',
        title:
          lang === 'id'
            ? 'Event Loop & Macro/Microtasks'
            : 'Event Loop & Macro/Microtasks',
        category:
          lang === 'id' ? 'Kinerja Frontend' : 'Frontend Performance',
        href: `/${lang}/docs/frontend-performance/event-loop/`,
        badge: 'Interactive',
      },
      {
        id: 'locking-mechanisms',
        title:
          lang === 'id'
            ? 'Mutex & Optimistic vs Pessimistic Locking'
            : 'Mutex & Optimistic vs Pessimistic Locking',
        category:
          lang === 'id' ? 'Konkurensi & Locking' : 'Concurrency & Locking',
        href: `/${lang}/docs/concurrency-locking/locking-mechanisms/`,
        badge: 'Interactive',
      },
      {
        id: 'btree-indexing',
        title:
          lang === 'id'
            ? 'B-Tree & Indexing Database'
            : 'B-Tree & Database Indexing',
        category:
          lang === 'id' ? 'Integritas Database' : 'Database Integrity',
        href: `/${lang}/docs/database-integrity/btree-indexing/`,
        badge: '3D Scene',
      },
      {
        id: 'cache-stampede',
        title:
          lang === 'id'
            ? 'Cache Stampede & Thundering Herd'
            : 'Cache Stampede & Thundering Herd',
        category: lang === 'id' ? 'Caching & State' : 'Caching & State',
        href: `/${lang}/docs/caching-state/cache-stampede/`,
        badge: 'Interactive',
      },
    ],
    [lang]
  );

  const filteredConcepts = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return concepts;
    }
    return concepts.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmed) ||
        item.category.toLowerCase().includes(trimmed) ||
        item.id.toLowerCase().includes(trimmed)
    );
  }, [concepts, query]);

  const closeDialog = React.useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const openDialog = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        closeDialog();
      }
    };

    const handleOpenEvent = () => {
      openDialog();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-search-dialog', handleOpenEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-search-dialog', handleOpenEvent);
    };
  }, [isOpen, closeDialog, openDialog]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timeoutId = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        document.body.style.overflow = '';
        window.clearTimeout(timeoutId);
      };
    }
    document.body.style.overflow = '';
  }, [isOpen]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (filteredConcepts.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredConcepts.length);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (filteredConcepts.length > 0) {
        setSelectedIndex(
          (prev) => (prev - 1 + filteredConcepts.length) % filteredConcepts.length
        );
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = filteredConcepts[selectedIndex];
      if (target) {
        window.location.href = target.href;
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.search')}
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-20"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-150 animate-in fade-in"
        onClick={closeDialog}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl rounded-card border-2 border-ink bg-surface shadow-[8px_8px_0_0_var(--ink)] transition-all duration-150 animate-in fade-in zoom-in-95 overflow-hidden">
        <div className="flex items-center gap-3 border-b-2 border-ink px-4 py-3 bg-surface">
          <Search className="size-5 shrink-0 text-ink" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={t('search.placeholder')}
            className="w-full bg-transparent font-sans text-sm sm:text-base font-semibold text-ink placeholder:text-muted focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded p-1 text-muted hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Clear query"
            >
              <X className="size-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center rounded border border-ink/40 bg-bg px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink shadow-[1px_1px_0_0_var(--ink)]">
              ESC
            </kbd>
          )}
          <button
            type="button"
            onClick={closeDialog}
            className="rounded-md border-2 border-ink bg-bg p-1 text-ink hover:bg-accent hover:text-neutral-950 transition-colors cursor-pointer shadow-[2px_2px_0_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t('search.hint.close')}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          <div className="flex items-center justify-between px-3 py-1.5 text-xs font-bold text-muted uppercase tracking-wider">
            <span className="inline-flex items-center gap-1.5">
              {t('search.quick')}
            </span>
            <span className="text-[10px] font-normal normal-case opacity-75">
              {filteredConcepts.length} item
            </span>
          </div>

          {filteredConcepts.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-muted">
              {t('search.empty')}
            </div>
          ) : (
            filteredConcepts.map((concept, index) => {
              const isSelected = index === selectedIndex;
              return (
                <a
                  key={concept.id}
                  href={concept.href}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'group flex items-center justify-between gap-3 rounded-md border-2 px-3.5 py-2.5 transition-all cursor-pointer',
                    isSelected
                      ? 'border-ink bg-primary/15 shadow-[3px_3px_0_0_var(--ink)] -translate-y-0.5'
                      : 'border-transparent hover:border-ink/20 hover:bg-bg'
                  )}
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {concept.category}
                    </span>
                    <span className="font-heading text-sm font-bold text-ink truncate group-hover:text-primary transition-colors">
                      {concept.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-full border border-ink/40 bg-surface px-2 py-0.5 font-mono text-[10px] font-bold text-ink shadow-[1px_1px_0_0_var(--ink)]">
                      {concept.badge}
                    </span>
                    <ArrowRight
                      className={cn(
                        'size-4 text-ink transition-transform',
                        isSelected && 'translate-x-1 text-primary'
                      )}
                    />
                  </div>
                </a>
              );
            })
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-ink bg-bg px-4 py-2.5 text-xs text-muted">
          <span className="text-[11px] font-mono text-muted truncate">
            {t('search.dev_notice')}
          </span>
          <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-ink">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-ink/30 bg-surface px-1 py-0.2 text-[10px] shadow-[1px_1px_0_0_var(--ink)]">
                ↑↓
              </kbd>{' '}
              {t('search.hint.navigate')}
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-ink/30 bg-surface px-1 py-0.2 text-[10px] shadow-[1px_1px_0_0_var(--ink)]">
                <CornerDownLeft className="size-2.5 inline" />
              </kbd>{' '}
              {t('search.hint.select')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
