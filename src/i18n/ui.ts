import type { Lang } from '@/i18n/config';

const id = {
  'nav.docs': 'Dokumentasi',
  'nav.feedback': 'Masukan',
  'nav.search': 'Cari konsep...',
  'theme.toggle': 'Ganti tema',
  'lang.switch': 'Ganti bahasa',
  'difficulty.easy': 'Mudah',
  'difficulty.medium': 'Menengah',
  'difficulty.hard': 'Sulit',
  'sim.reset': 'Reset',
  'sim.step': 'Langkah berikutnya',
  'sim.previous': 'Langkah sebelumnya',
  'sim.play': 'Putar',
  'sim.pause': 'Jeda',
  'code.bad': 'Praktik Buruk',
  'code.good': 'Praktik Baik',
  'quiz.correct': 'Benar!',
  'quiz.wrong': 'Kurang tepat',
  'quiz.retry': 'Coba lagi',
  'common.soon': 'Segera hadir',
} as const;

export type UiKey = keyof typeof id;

const en: Record<UiKey, string> = {
  'nav.docs': 'Docs',
  'nav.feedback': 'Feedback',
  'nav.search': 'Search concepts...',
  'theme.toggle': 'Toggle theme',
  'lang.switch': 'Switch language',
  'difficulty.easy': 'Easy',
  'difficulty.medium': 'Medium',
  'difficulty.hard': 'Hard',
  'sim.reset': 'Reset',
  'sim.step': 'Next step',
  'sim.previous': 'Previous step',
  'sim.play': 'Play',
  'sim.pause': 'Pause',
  'code.bad': 'Bad Practice',
  'code.good': 'Good Practice',
  'quiz.correct': 'Correct!',
  'quiz.wrong': 'Incorrect',
  'quiz.retry': 'Try again',
  'common.soon': 'Coming soon',
};

export const ui: Record<Lang, Record<UiKey, string>> = { id, en };

export function useTranslations(lang: Lang): (key: UiKey) => string {
  return (key: UiKey): string => ui[lang][key];
}
