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

  const toggleTheme = () => {
    applyTheme(mode === 'dark' ? 'light' : 'dark');
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
