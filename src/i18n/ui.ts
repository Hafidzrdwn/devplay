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
  'quiz.explanation': 'Penjelasan',
  'common.soon': 'Segera hadir',
  'search.placeholder': 'Cari konsep, simulasi, atau arsitektur...',
  'search.quick': 'Rekomendasi Konsep',
  'search.empty': 'Tidak ada konsep yang cocok',
  'search.loading': 'Mencari...',
  'search.dev_notice': 'Indeks Pagefind lengkap aktif pada build produksi',
  'search.hint.navigate': 'navigasi',
  'search.hint.select': 'pilih',
  'search.hint.close': 'tutup',
  'nav.prev': 'Sebelumnya',
  'nav.next': 'Selanjutnya',
  'toc.title': 'Di Halaman Ini',
  'reading.time': '{n} menit',
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
  'quiz.explanation': 'Explanation',
  'common.soon': 'Coming soon',
  'search.placeholder': 'Search concepts, simulations, or architecture...',
  'search.quick': 'Recommended Concepts',
  'search.empty': 'No matching concepts found',
  'search.loading': 'Searching...',
  'search.dev_notice': 'Full Pagefind index is available on production build',
  'search.hint.navigate': 'navigate',
  'search.hint.select': 'select',
  'search.hint.close': 'close',
  'nav.prev': 'Previous',
  'nav.next': 'Next',
  'toc.title': 'On This Page',
  'reading.time': '{n} min read',
};

export const ui: Record<Lang, Record<UiKey, string>> = { id, en };

export function useTranslations(lang: Lang): (key: UiKey) => string {
  return (key: UiKey): string => ui[lang][key];
}
