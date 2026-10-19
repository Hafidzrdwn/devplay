import * as React from 'react';
import { useStore } from '@nanostores/react';
import { Sun, Moon } from 'lucide-react';
import { themeMode, applyTheme, syncThemeFromDocument } from '@/stores/theme';
import { useTranslations } from '@/i18n/ui';
import type { Lang } from '@/i18n/config';
import { cn } from '@/lib/cn';

export interface ThemeToggleProps {
  lang: Lang;
  className?: string;
}

export function ThemeToggle({ lang, className }: ThemeToggleProps) {
  const mode = useStore(themeMode);
  const t = useTranslations(lang);

  React.useEffect(() => {
    syncThemeFromDocument();
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';

    if (
      typeof document === 'undefined' ||
      !('startViewTransition' in document) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      applyTheme(nextMode);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.classList.add('theme-transitioning');
    const transition = document.startViewTransition(() => {
      applyTheme(nextMode);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });

    if (transition.finished) {
      transition.finished.finally(() => {
        document.documentElement.classList.remove('theme-transitioning');
      });
    } else {
      window.setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 500);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t('theme.toggle')}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-card border-2 border-ink bg-surface text-ink shadow-hard transition-all cursor-pointer hover:-translate-x-px hover:-translate-y-px hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className
      )}
    >
      <Sun className="size-4 hidden dark:block" />
      <Moon className="size-4 block dark:hidden" />
      <span className="sr-only">{t('theme.toggle')}</span>
    </button>
  );
}
