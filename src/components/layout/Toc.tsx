import * as React from 'react';
import type { Lang } from '@/i18n/config';
import { useTranslations } from '@/i18n/ui';
import { cn } from '@/lib/cn';

export interface TocHeading {
  depth: 2 | 3;
  slug: string;
  text: string;
}

interface TocProps {
  headings: TocHeading[];
  lang: Lang;
}

export function Toc({ headings, lang }: TocProps): React.JSX.Element | null {
  const [activeSlug, setActiveSlug] = React.useState<string>(headings[0]?.slug ?? '');
  const t = useTranslations(lang);

  React.useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        }
      },
      {
        rootMargin: '0px 0px -70% 0px',
      }
    );

    const elements = headings
      .map((heading) => document.getElementById(heading.slug))
      .filter((element): element is HTMLElement => Boolean(element));

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const handleHeadingClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    slug: string
  ) => {
    event.preventDefault();
    const targetElement = document.getElementById(slug);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${slug}`);
      setActiveSlug(slug);
    }
  };

  return (
    <nav
      aria-label={t('toc.title')}
      data-pagefind-ignore
      className="space-y-2 rounded-card border-2 border-ink bg-surface p-4 shadow-hard text-xs sticky top-24"
    >
      <h2 className="font-heading font-bold text-sm text-ink pb-2 border-b-2 border-ink flex items-center justify-between">
        <span>{t('toc.title')}</span>
      </h2>

      <ul className="space-y-1 pt-1 font-medium">
        {headings.map((heading) => {
          const isActive = heading.slug === activeSlug;
          const isH3 = heading.depth === 3;
          const displayText = heading.text.replace(/\s*#$/, '');

          return (
            <li
              key={heading.slug}
              className={cn(isH3 ? 'pl-4' : 'pl-0')}
            >
              <a
                href={`#${heading.slug}`}
                onClick={(event) => handleHeadingClick(event, heading.slug)}
                className={cn(
                  'block py-1 px-2 rounded-md transition-all text-left truncate',
                  isActive
                    ? 'bg-accent text-accent-ink font-bold border-2 border-ink shadow-[2px_2px_0_0_var(--ink)] -translate-x-px -translate-y-px'
                    : 'text-muted hover:text-ink hover:bg-bg/50'
                )}
              >
                {displayText}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
