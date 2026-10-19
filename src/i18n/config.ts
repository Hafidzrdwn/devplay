export const languages = {
  id: 'Bahasa Indonesia',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'id';

export function isLang(value: string): value is Lang {
  return value in languages;
}
