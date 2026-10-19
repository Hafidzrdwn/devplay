import * as React from 'react';
import { useStore } from '@nanostores/react';
import { themeMode, syncThemeFromDocument, type ThemeMode } from '@/stores/theme';

export const tokenNames = [
  'bg',
  'surface',
  'ink',
  'muted',
  'primary',
  'accent',
  'success',
  'danger',
  'info',
  'grid',
] as const;

export type TokenName = (typeof tokenNames)[number];

export type SimTokens = Record<TokenName, string> & { mode: ThemeMode };

export const fallbackTokens: Record<ThemeMode, Record<TokenName, string>> = {
  light: {
    bg: '#fff8ec',
    surface: '#ffffff',
    ink: '#1b1b1f',
    muted: '#6b6b76',
    primary: '#7c5cff',
    accent: '#ffc933',
    success: '#2fbf71',
    danger: '#ff5c5c',
    info: '#3ba7ff',
    grid: '#e7dfce',
  },
  dark: {
    bg: '#14131a',
    surface: '#1e1c27',
    ink: '#f5f1e8',
    muted: '#a19fb0',
    primary: '#a48dff',
    accent: '#ffd65c',
    success: '#4ade94',
    danger: '#ff7a7a',
    info: '#6bbfff',
    grid: '#2e2b3b',
  },
};

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export function useThemeTokens(): SimTokens {
  const mode = useStore(themeMode);
  const [tokens, setTokens] = React.useState<SimTokens>(() => ({
    ...fallbackTokens[mode],
    mode,
  }));

  React.useEffect(() => {
    syncThemeFromDocument();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const computedStyle = getComputedStyle(document.documentElement);
    const resolvedTokens = {} as Record<TokenName, string>;

    for (const tokenName of tokenNames) {
      const rawValue = computedStyle.getPropertyValue(`--${tokenName}`).trim();
      resolvedTokens[tokenName] = rawValue || fallbackTokens[mode][tokenName];
    }

    setTokens({
      ...resolvedTokens,
      mode,
    });
  }, [mode]);

  return tokens;
}
