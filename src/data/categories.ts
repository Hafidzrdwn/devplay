import type { CategoryId, CategoryMeta } from '@/types/content';

export const categoryIds = [
  'frontend-performance',
  'concurrency-locking',
  'database-integrity',
  'caching-state',
  'distributed-reliability',
] as const;

export const categories: CategoryMeta[] = [
  {
    id: 'frontend-performance',
    name: {
      id: 'Performa Frontend & Browser',
      en: 'Frontend & Browser Performance',
    },
    description: {
      id: 'Optimalkan rendering, interaksi pengguna, dan efisiensi thread utama pada aplikasi web modern.',
      en: 'Optimize rendering, user interactions, and main thread efficiency in modern web applications.',
    },
    icon: 'Zap',
    accentColor: 'accent',
    lead: 'pixel',
  },
  {
    id: 'concurrency-locking',
    name: {
      id: 'Konkurensi & Penguncian',
      en: 'Concurrency & Locking',
    },
    description: {
      id: 'Pahami sinkronisasi thread, pencegahan race condition, serta penanganan kebuntuan sistem.',
      en: 'Understand thread synchronization, race condition prevention, and deadlock handling.',
    },
    icon: 'Lock',
    accentColor: 'primary',
    lead: 'mutex',
  },
  {
    id: 'database-integrity',
    name: {
      id: 'Basis Data & Integritas Data',
      en: 'Database & Data Integrity',
    },
    description: {
      id: 'Pelajari transaksi ACID, anomali baca, teknik indexing pohon, dan replikasi data.',
      en: 'Explore ACID transactions, read anomalies, tree indexing techniques, and data replication.',
    },
    icon: 'Database',
    accentColor: 'info',
    lead: 'query',
  },
  {
    id: 'caching-state',
    name: {
      id: 'Caching, Memori & State',
      en: 'Caching, Memory & State',
    },
    description: {
      id: 'Kuasai strategi invalidasi cache, mitigasi memory leak, dan pengelolaan state tunggal.',
      en: 'Master cache invalidation strategies, memory leak mitigation, and single-source state management.',
    },
    icon: 'Layers',
    accentColor: 'success',
    lead: 'cache',
  },
  {
    id: 'distributed-reliability',
    name: {
      id: 'Sistem Terdistribusi & Keandalan',
      en: 'Distributed Systems & Reliability',
    },
    description: {
      id: 'Rancang sistem tangguh menghadapi partisi jaringan, lonjakan beban, dan kegagalan komponen.',
      en: 'Design resilient systems handling network partitions, traffic bursts, and component failures.',
    },
    icon: 'Network',
    accentColor: 'danger',
    lead: 'ping',
  },
];

export function getCategory(id: CategoryId): CategoryMeta | undefined {
  return categories.find((category) => category.id === id);
}
