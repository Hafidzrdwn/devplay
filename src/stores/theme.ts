import { atom } from 'nanostores';

export type ThemeMode = 'light' | 'dark';

export const themeMode = atom<ThemeMode>('light');

export function syncThemeFromDocument(): void {
  if (typeof document === 'undefined') {
    return;
  }
  themeMode.set(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.classList.toggle('dark', mode === 'dark');
  localStorage.setItem('devplay-theme', mode);
  themeMode.set(mode);
}
