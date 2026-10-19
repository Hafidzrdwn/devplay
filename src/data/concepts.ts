import type { CategoryId, ConceptMeta } from '@/types/content';

export const conceptSlugs = [
  'debouncing',
  'throttling',
  'ui-virtualization',
  'layout-thrashing',
  'critical-rendering-path-hydration',
  'event-delegation',
  'web-workers',
  'intersection-observer',
  'optimistic-ui-update',
  'request-cancellation',
  'race-condition',
  'deadlock',
  'pessimistic-locking',
  'optimistic-locking',
  'mutex-semaphore',
  'distributed-lock-redlock',
  'idempotency',
  'starvation-livelock',
  'thread-pool-exhaustion',
  'event-loop-blocking',
  'n-plus-one-query',
  'acid-transactions',
  'transaction-isolation-levels',
  'read-anomalies',
  'database-indexing-cardinality',
  'full-table-scan-vs-index-seek',
  'connection-pooling',
  'cursor-vs-offset-pagination',
  'read-replica-replication-lag',
  'partitioning-sharding',
  'cache-invalidation-stale-data',
  'cache-stampede',
  'cache-penetration',
  'caching-patterns',
  'memory-leak-gc-pause',
  'shallow-vs-deep-copy',
  'memoization',
  'stream-buffer-processing',
  'single-source-of-truth',
  'serialization-overhead',
  'rate-limiting',
  'backpressure',
  'circuit-breaker',
  'exponential-backoff-jitter',
  'message-queue-dlq',
  'cap-theorem-eventual-consistency',
  'saga-pattern',
  'cors-preflight-csrf',
  'head-of-line-blocking',
  'graceful-shutdown',
  'load-balancer',
] as const;

export type ConceptSlug = (typeof conceptSlugs)[number];

export const concepts: ConceptMeta[] = [
  {
    id: 1,
    slug: 'debouncing',
    category: 'frontend-performance',
    difficulty: 'easy',
    visualization: '2d',
    title: {
      id: 'Debouncing',
      en: 'Debouncing',
    },
  },
  {
    id: 2,
    slug: 'throttling',
    category: 'frontend-performance',
    difficulty: 'easy',
    visualization: '2d',
    title: {
      id: 'Throttling',
      en: 'Throttling',
    },
  },
  {
    id: 3,
    slug: 'ui-virtualization',
    category: 'frontend-performance',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Virtualisasi UI',
      en: 'UI Virtualization',
    },
  },
  {
    id: 4,
    slug: 'layout-thrashing',
    category: 'frontend-performance',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Layout Thrashing',
      en: 'Layout Thrashing',
    },
  },
  {
    id: 5,
    slug: 'critical-rendering-path-hydration',
    category: 'frontend-performance',
    difficulty: 'hard',
    visualization: '2d',
    title: {
      id: 'Jalur Rendering Kritis & Hidrasi',
      en: 'Critical Rendering Path & Hydration',
    },
  },
  {
    id: 6,
    slug: 'event-delegation',
    category: 'frontend-performance',
    difficulty: 'easy',
    visualization: '2d',
    title: {
      id: 'Delegasi Event',
      en: 'Event Delegation',
    },
  },
  {
    id: 7,
    slug: 'web-workers',
    category: 'frontend-performance',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Web Workers',
      en: 'Web Workers',
    },
  },
  {
    id: 8,
    slug: 'intersection-observer',
    category: 'frontend-performance',
    difficulty: 'easy',
    visualization: '2d',
    title: {
      id: 'Intersection Observer',
      en: 'Intersection Observer',
    },
  },
  {
    id: 9,
    slug: 'optimistic-ui-update',
    category: 'frontend-performance',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Pembaruan UI Optimistik',
      en: 'Optimistic UI Update',
    },
  },
  {
    id: 10,
    slug: 'request-cancellation',
    category: 'frontend-performance',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Pembatalan Request',
      en: 'Request Cancellation',
    },
  },
  {
    id: 11,
    slug: 'race-condition',
    category: 'concurrency-locking',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Race Condition',
      en: 'Race Condition',
    },
  },
  {
    id: 12,
    slug: 'deadlock',
    category: 'concurrency-locking',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Kebuntuan (Deadlock)',
      en: 'Deadlock',
    },
  },
  {
    id: 13,
    slug: 'pessimistic-locking',
    category: 'concurrency-locking',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Penguncian Pesimistik',
      en: 'Pessimistic Locking',
    },
  },
  {
    id: 14,
    slug: 'optimistic-locking',
    category: 'concurrency-locking',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Penguncian Optimistik',
      en: 'Optimistic Locking',
    },
  },
  {
    id: 15,
    slug: 'mutex-semaphore',
    category: 'concurrency-locking',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Mutex & Semaphore',
      en: 'Mutex & Semaphore',
    },
  },
  {
    id: 16,
    slug: 'distributed-lock-redlock',
    category: 'concurrency-locking',
    difficulty: 'hard',
    visualization: '3d',
    title: {
      id: 'Kunci Terdistribusi (Redlock)',
      en: 'Distributed Lock (Redlock)',
    },
  },
  {
    id: 17,
    slug: 'idempotency',
    category: 'concurrency-locking',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Idempotensi',
      en: 'Idempotency',
    },
  },
  {
    id: 18,
    slug: 'starvation-livelock',
    category: 'concurrency-locking',
    difficulty: 'hard',
    visualization: '2d',
    title: {
      id: 'Starvation & Livelock',
      en: 'Starvation & Livelock',
    },
  },
  {
    id: 19,
    slug: 'thread-pool-exhaustion',
    category: 'concurrency-locking',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Kelelahan Thread Pool',
      en: 'Thread Pool Exhaustion',
    },
  },
  {
    id: 20,
    slug: 'event-loop-blocking',
    category: 'concurrency-locking',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Pemblokiran Event Loop',
      en: 'Event Loop Blocking',
    },
  },
  {
    id: 21,
    slug: 'n-plus-one-query',
    category: 'database-integrity',
    difficulty: 'easy',
    visualization: '2d',
    title: {
      id: 'Masalah Query N+1',
      en: 'N+1 Query Problem',
    },
  },
  {
    id: 22,
    slug: 'acid-transactions',
    category: 'database-integrity',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Transaksi ACID',
      en: 'ACID Transactions',
    },
  },
  {
    id: 23,
    slug: 'transaction-isolation-levels',
    category: 'database-integrity',
    difficulty: 'hard',
    visualization: '2d',
    title: {
      id: 'Tingkat Isolasi Transaksi',
      en: 'Transaction Isolation Levels',
    },
  },
  {
    id: 24,
    slug: 'read-anomalies',
    category: 'database-integrity',
    difficulty: 'hard',
    visualization: '2d',
    title: {
      id: 'Anomali Pembacaan Data',
      en: 'Read Anomalies',
    },
  },
  {
    id: 25,
    slug: 'database-indexing-cardinality',
    category: 'database-integrity',
    difficulty: 'hard',
    visualization: '3d',
    title: {
      id: 'Pengindeksan Basis Data & Kardinalitas',
      en: 'Database Indexing & Cardinality',
    },
  },
  {
    id: 26,
    slug: 'full-table-scan-vs-index-seek',
    category: 'database-integrity',
    difficulty: 'medium',
    visualization: '3d',
    title: {
      id: 'Full Table Scan vs Index Seek',
      en: 'Full Table Scan vs Index Seek',
    },
  },
  {
    id: 27,
    slug: 'connection-pooling',
    category: 'database-integrity',
    difficulty: 'medium',
    visualization: '3d',
    title: {
      id: 'Pooling Koneksi Basis Data',
      en: 'Connection Pooling',
    },
  },
  {
    id: 28,
    slug: 'cursor-vs-offset-pagination',
    category: 'database-integrity',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Paginasi Kursor vs Offset',
      en: 'Cursor vs Offset Pagination',
    },
  },
  {
    id: 29,
    slug: 'read-replica-replication-lag',
    category: 'database-integrity',
    difficulty: 'hard',
    visualization: '3d',
    title: {
      id: 'Replika Baca & Lag Replikasi',
      en: 'Read Replica & Replication Lag',
    },
  },
  {
    id: 30,
    slug: 'partitioning-sharding',
    category: 'database-integrity',
    difficulty: 'hard',
    visualization: '3d',
    title: {
      id: 'Partisi & Sharding',
      en: 'Partitioning & Sharding',
    },
  },
  {
    id: 31,
    slug: 'cache-invalidation-stale-data',
    category: 'caching-state',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Invalidasi Cache & Data Usang',
      en: 'Cache Invalidation & Stale Data',
    },
  },
  {
    id: 32,
    slug: 'cache-stampede',
    category: 'caching-state',
    difficulty: 'hard',
    visualization: '3d',
    title: {
      id: 'Cache Stampede',
      en: 'Cache Stampede',
    },
  },
  {
    id: 33,
    slug: 'cache-penetration',
    category: 'caching-state',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Penetrasi Cache',
      en: 'Cache Penetration',
    },
  },
  {
    id: 34,
    slug: 'caching-patterns',
    category: 'caching-state',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Pola Caching',
      en: 'Caching Patterns',
    },
  },
  {
    id: 35,
    slug: 'memory-leak-gc-pause',
    category: 'caching-state',
    difficulty: 'hard',
    visualization: '3d',
    title: {
      id: 'Kebocoran Memori & Jeda Garbage Collection',
      en: 'Memory Leak & Garbage Collection Pause',
    },
  },
  {
    id: 36,
    slug: 'shallow-vs-deep-copy',
    category: 'caching-state',
    difficulty: 'easy',
    visualization: '2d',
    title: {
      id: 'Salinan Dangkal vs Salinan Dalam',
      en: 'Shallow vs Deep Copy',
    },
  },
  {
    id: 37,
    slug: 'memoization',
    category: 'caching-state',
    difficulty: 'easy',
    visualization: '2d',
    title: {
      id: 'Memoisasi',
      en: 'Memoization',
    },
  },
  {
    id: 38,
    slug: 'stream-buffer-processing',
    category: 'caching-state',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Pemrosesan Stream & Buffer',
      en: 'Stream & Buffer Processing',
    },
  },
  {
    id: 39,
    slug: 'single-source-of-truth',
    category: 'caching-state',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Sumber Kebenaran Tunggal',
      en: 'Single Source of Truth',
    },
  },
  {
    id: 40,
    slug: 'serialization-overhead',
    category: 'caching-state',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Overhead Serialisasi',
      en: 'Serialization Overhead',
    },
  },
  {
    id: 41,
    slug: 'rate-limiting',
    category: 'distributed-reliability',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Pembatasan Laju (Rate Limiting)',
      en: 'Rate Limiting',
    },
  },
  {
    id: 42,
    slug: 'backpressure',
    category: 'distributed-reliability',
    difficulty: 'hard',
    visualization: '2d',
    title: {
      id: 'Tekanan Balik (Backpressure)',
      en: 'Backpressure',
    },
  },
  {
    id: 43,
    slug: 'circuit-breaker',
    category: 'distributed-reliability',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Pemutus Arus (Circuit Breaker)',
      en: 'Circuit Breaker',
    },
  },
  {
    id: 44,
    slug: 'exponential-backoff-jitter',
    category: 'distributed-reliability',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Exponential Backoff dengan Jitter',
      en: 'Exponential Backoff with Jitter',
    },
  },
  {
    id: 45,
    slug: 'message-queue-dlq',
    category: 'distributed-reliability',
    difficulty: 'medium',
    visualization: '3d',
    title: {
      id: 'Antrean Pesan & Dead Letter Queue',
      en: 'Message Queue & Dead Letter Queue',
    },
  },
  {
    id: 46,
    slug: 'cap-theorem-eventual-consistency',
    category: 'distributed-reliability',
    difficulty: 'hard',
    visualization: '3d',
    title: {
      id: 'Teorema CAP & Konsistensi Akhir',
      en: 'CAP Theorem & Eventual Consistency',
    },
  },
  {
    id: 47,
    slug: 'saga-pattern',
    category: 'distributed-reliability',
    difficulty: 'hard',
    visualization: '2d',
    title: {
      id: 'Pola Saga',
      en: 'Saga Pattern',
    },
  },
  {
    id: 48,
    slug: 'cors-preflight-csrf',
    category: 'distributed-reliability',
    difficulty: 'hard',
    visualization: '2d',
    title: {
      id: 'Preflight CORS & CSRF',
      en: 'CORS Preflight & CSRF',
    },
  },
  {
    id: 49,
    slug: 'head-of-line-blocking',
    category: 'distributed-reliability',
    difficulty: 'hard',
    visualization: '2d',
    title: {
      id: 'Pemblokiran Head-of-Line',
      en: 'Head-of-Line Blocking',
    },
  },
  {
    id: 50,
    slug: 'graceful-shutdown',
    category: 'distributed-reliability',
    difficulty: 'medium',
    visualization: '2d',
    title: {
      id: 'Penghentian Anggun (Graceful Shutdown)',
      en: 'Graceful Shutdown',
    },
  },
  {
    id: 51,
    slug: 'load-balancer',
    category: 'distributed-reliability',
    difficulty: 'medium',
    visualization: '3d',
    title: {
      id: 'Penyeimbang Beban (Load Balancer)',
      en: 'Load Balancer',
    },
  },
];

export function getConcept(slug: string): ConceptMeta | undefined {
  return concepts.find((concept) => concept.slug === slug);
}

export function getConceptsByCategory(category: CategoryId): ConceptMeta[] {
  return concepts.filter((concept) => concept.category === category);
}

export interface ConceptNeighbors {
  previous?: ConceptMeta;
  next?: ConceptMeta;
}

export function getNeighbors(slug: string): ConceptNeighbors {
  const currentIndex = concepts.findIndex((concept) => concept.slug === slug);
  if (currentIndex === -1) {
    return {};
  }
  return {
    previous: concepts[currentIndex - 1],
    next: concepts[currentIndex + 1],
  };
}
