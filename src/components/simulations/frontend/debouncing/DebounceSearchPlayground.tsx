import * as React from 'react';
import type { Lang } from '@/i18n/config';
import { cn } from '@/lib/cn';

interface DebounceSearchPlaygroundProps {
  lang: Lang;
  className?: string;
}

interface MockSearchResult {
  id: string;
  title: string;
  category: string;
}

const mockDatabase: MockSearchResult[] = [
  { id: '1', title: 'Debounce vs Throttle Guide', category: 'Performance' },
  { id: '2', title: 'Optimizing React Rendering', category: 'Frontend' },
  { id: '3', title: 'JavaScript Event Loop In-Depth', category: 'Runtime' },
  { id: '4', title: 'Search Input Auto-complete Best Practices', category: 'UI/UX' },
  { id: '5', title: 'Browser Critical Rendering Path', category: 'Performance' },
];

export function DebounceSearchPlayground({
  lang,
  className,
}: DebounceSearchPlaygroundProps): React.JSX.Element {
  const isId = lang === 'id';
  const [searchTerm, setSearchTerm] = React.useState('');
  const [delayMs, setDelayMs] = React.useState(350);
  const [keystrokeCount, setKeystrokeCount] = React.useState(0);
  const [requestCount, setRequestCount] = React.useState(0);
  const [status, setStatus] = React.useState<'idle' | 'waiting' | 'fetching' | 'done'>('idle');
  const [results, setResults] = React.useState<MockSearchResult[]>([]);
  const [logs, setLogs] = React.useState<string[]>([]);

  const timerRef = React.useRef<number | null>(null);

  const performMockFetch = React.useCallback(
    (query: string) => {
      setStatus('fetching');
      setRequestCount((prev) => prev + 1);

      const timestamp = new Date().toLocaleTimeString('en-US', {
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      setLogs((prev) => [
        `[${timestamp}] 🚀 API GET /search?q=${encodeURIComponent(query)} (200 OK)`,
        ...prev.slice(0, 5),
      ]);

      window.setTimeout(() => {
        if (!query.trim()) {
          setResults([]);
          setStatus('idle');
          return;
        }

        const filtered = mockDatabase.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setStatus('done');
      }, 150);
    },
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setKeystrokeCount((prev) => prev + 1);

    const timestamp = new Date().toLocaleTimeString('en-US', {
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      setLogs((prev) => [
        `[${timestamp}] ⏱️ Reset: input '${value}' (timer lama dibatalkan)`,
        ...prev.slice(0, 5),
      ]);
    } else {
      setLogs((prev) => [
        `[${timestamp}] ⏳ Mulai timer: input '${value}' (${delayMs}ms)`,
        ...prev.slice(0, 5),
      ]);
    }

    setStatus('waiting');

    timerRef.current = window.setTimeout(() => {
      performMockFetch(value);
      timerRef.current = null;
    }, delayMs);
  };

  const handleReset = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSearchTerm('');
    setKeystrokeCount(0);
    setRequestCount(0);
    setStatus('idle');
    setResults([]);
    setLogs([]);
  };

  const savedRequests = Math.max(0, keystrokeCount - requestCount);
  const efficiencyPercent =
    keystrokeCount > 0 ? Math.round((savedRequests / keystrokeCount) * 100) : 0;

  return (
    <div
      className={cn(
        'my-6 rounded-card border-2 border-ink bg-surface shadow-hard overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between border-b-2 border-ink bg-bg/50 px-4 py-3 select-none">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full border border-ink bg-accent shadow-[1px_1px_0_0_var(--ink)]" />
          <span className="font-heading font-bold text-sm sm:text-base text-ink">
            {isId ? 'Playground Dunia Nyata: Search Autocomplete' : 'Real-World Playground: Search Autocomplete'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 rounded border border-ink bg-surface px-2 py-1 text-xs font-mono font-bold text-ink shadow-[1px_1px_0_0_var(--ink)] hover:bg-bg transition-colors cursor-pointer"
        >
          <span>{isId ? 'Reset Form' : 'Reset Form'}</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 select-none">
          <div className="rounded-card border-2 border-ink bg-bg/40 p-3 shadow-[2px_2px_0_0_var(--ink)] text-center">
            <span className="block text-[11px] font-mono font-bold text-muted uppercase">
              {isId ? 'Event Input Mentah' : 'Raw Keystrokes'}
            </span>
            <span className="font-heading text-xl sm:text-2xl font-bold text-ink">
              {keystrokeCount}
            </span>
          </div>

          <div className="rounded-card border-2 border-ink bg-bg/40 p-3 shadow-[2px_2px_0_0_var(--ink)] text-center">
            <span className="block text-[11px] font-mono font-bold text-muted uppercase">
              {isId ? 'Request ke Server' : 'Dispatched Requests'}
            </span>
            <span className="font-heading text-xl sm:text-2xl font-bold text-danger">
              {requestCount}
            </span>
          </div>

          <div className="rounded-card border-2 border-ink bg-accent/25 p-3 shadow-[2px_2px_0_0_var(--ink)] text-center">
            <span className="block text-[11px] font-mono font-bold text-ink uppercase">
              {isId ? 'Beban Dihemat' : 'Network Saved'}
            </span>
            <span className="font-heading text-xl sm:text-2xl font-bold text-accent-ink">
              {efficiencyPercent}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="real-world-search-input"
            className="block text-xs font-mono font-bold text-ink"
          >
            {isId
              ? 'Ketik kata kunci pencarian (misal: "debounce", "react", "event"):'
              : 'Type a search term (e.g., "debounce", "react", "event"): '}
          </label>
          <div className="relative">
            <input
              id="real-world-search-input"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder={
                isId
                  ? 'Ketik cepat di sini untuk menguji penundaan...'
                  : 'Type rapidly here to test the debouncer...'
              }
              className="w-full rounded-card border-2 border-ink bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted shadow-[2px_2px_0_0_var(--ink)] focus:outline-none focus:ring-2 focus:ring-primary font-sans"
            />
            {status === 'waiting' && (
              <span className="absolute right-3 top-2.5 rounded border border-ink/40 bg-accent px-2 py-0.5 text-[10px] font-mono font-bold text-accent-ink animate-pulse shadow-[1px_1px_0_0_var(--ink)]">
                {isId ? `Menunggu (${delayMs}ms)...` : `Waiting (${delayMs}ms)...`}
              </span>
            )}
            {status === 'fetching' && (
              <span className="absolute right-3 top-2.5 rounded border border-ink/40 bg-info px-2 py-0.5 text-[10px] font-mono font-bold text-ink animate-pulse shadow-[1px_1px_0_0_var(--ink)]">
                {isId ? 'Mengirim request...' : 'Fetching...'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-muted">
              {isId ? 'Durasi Delay:' : 'Delay Duration:'}
            </span>
            <div className="flex items-center gap-1.5">
              {[200, 350, 500].map((ms) => (
                <button
                  key={ms}
                  type="button"
                  onClick={() => setDelayMs(ms)}
                  className={cn(
                    'rounded border border-ink px-2 py-0.5 text-xs font-mono font-bold transition-all cursor-pointer',
                    delayMs === ms
                      ? 'bg-accent text-accent-ink shadow-[1px_1px_0_0_var(--ink)] -translate-x-px -translate-y-px'
                      : 'bg-surface text-muted hover:text-ink'
                  )}
                >
                  {ms}ms
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="rounded-card border-2 border-ink bg-surface p-3 shadow-[2px_2px_0_0_var(--ink)] flex flex-col min-h-32">
            <span className="text-xs font-mono font-bold text-ink pb-2 border-b-2 border-ink/20">
              {isId ? 'Hasil Pencarian Live' : 'Live Search Results'}
            </span>
            <div className="pt-2 flex-1">
              {results.length > 0 ? (
                <ul className="space-y-1.5">
                  {results.map((item) => (
                    <li
                      key={item.id}
                      className="rounded border border-ink/20 bg-bg/40 px-2.5 py-1.5 text-xs text-ink flex items-center justify-between"
                    >
                      <span className="font-semibold">{item.title}</span>
                      <span className="text-[10px] font-mono text-muted uppercase">
                        {item.category}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : searchTerm ? (
                <div className="text-xs text-muted py-4 text-center">
                  {isId ? 'Tidak ada hasil yang cocok' : 'No matching items'}
                </div>
              ) : (
                <div className="text-xs text-muted py-4 text-center">
                  {isId ? 'Ketikkan teks untuk melihat hasil' : 'Type to view live results'}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-card border-2 border-ink bg-bg p-3 shadow-[2px_2px_0_0_var(--ink)] flex flex-col min-h-32">
            <span className="text-xs font-mono font-bold text-ink pb-2 border-b-2 border-ink/20">
              {isId ? 'Log Jaringan Simulasi' : 'Simulated Network Log'}
            </span>
            <div className="pt-2 flex-1 font-mono text-[11px] space-y-1 text-ink overflow-y-auto max-h-36 nb-scrollbar">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="truncate">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-muted text-center py-4">
                  {isId ? 'Belum ada event tercatat' : 'No activity logged yet'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebounceSearchPlayground;
