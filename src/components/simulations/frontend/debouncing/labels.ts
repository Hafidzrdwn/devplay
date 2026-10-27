import type { Lang } from '@/types/content';

const id = {
  title: 'Simulasi Debouncing',
  description: 'Amati bagaimana event mentah disaring hingga hanya satu pemanggilan yang lolos setelah jeda hening tercapai.',
  delayLabel: 'Durasi Jeda (Delay)',
  typeButton: 'Ketik',
  spamButton: 'Spam 10 Ketukan',
  rawLaneTitle: 'Event Mentah (Keystroke)',
  debouncedLaneTitle: 'Panggilan Lolos (Handler)',
  rawCountLabel: 'Total Ketukan',
  debouncedCountLabel: 'Panggilan Lolos',
  efficiencyLabel: 'Penghematan Beban',
  countdownRingLabel: 'Hitung Mundur',
  waitingText: 'Menunggu...',
  internStatus: 'Mengetik...',
  firedLabel: (count: number) => `${count} panggilan lolos`,
  savedLabel: (percent: number) => `${percent}% request dihemat`,
  captions: {
    idle: 'Ketik satu per satu atau gunakan tombol spam untuk menguji bagaimana jeda timer bekerja.',
    counting: (remainingMs: number) => `Ketukan diterima! Menunggu jeda hening ${remainingMs} ms...`,
    restarted: (remainingMs: number) => `Ketukan baru masuk! Timer dibatalkan dan direset ulang ke ${remainingMs} ms.`,
    executed: (count: number) => `Jeda hening tercapai! Panggilan handler ke-${count} akhirnya berhasil dieksekusi.`,
    reset: 'Simulasi direset ke kondisi awal. Silakan uji kembali.',
  },
};

export type Labels = typeof id;

const en: Labels = {
  title: 'Debouncing Simulation',
  description: 'Observe how rapid raw events are suppressed until a quiet period allows a single handler invocation to pass.',
  delayLabel: 'Delay Duration',
  typeButton: 'Type',
  spamButton: 'Spam 10 Keystrokes',
  rawLaneTitle: 'Raw Events (Keystroke)',
  debouncedLaneTitle: 'Debounced Calls (Handler)',
  rawCountLabel: 'Total Keystrokes',
  debouncedCountLabel: 'Debounced Calls',
  efficiencyLabel: 'Saved Overhead',
  countdownRingLabel: 'Countdown',
  waitingText: 'Waiting...',
  internStatus: 'Typing...',
  firedLabel: (count: number) => `${count} calls fired`,
  savedLabel: (percent: number) => `${percent}% calls saved`,
  captions: {
    idle: 'Click Type or Spam to test how the debounce countdown timer behaves under load.',
    counting: (remainingMs: number) => `Keystroke received! Waiting for ${remainingMs} ms of silence...`,
    restarted: (remainingMs: number) => `New keystroke arrived! Timer cancelled and reset back to ${remainingMs} ms.`,
    executed: (count: number) => `Silence reached! Debounced call #${count} has successfully executed.`,
    reset: 'Simulation reset to default state. Ready for new input.',
  },
};

export function getLabels(lang: Lang | string): Labels {
  return lang === 'en' ? en : id;
}
