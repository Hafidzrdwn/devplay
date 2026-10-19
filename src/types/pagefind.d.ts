export interface PagefindSearchData {
  url: string;
  content: string;
  excerpt: string;
  meta?: {
    title?: string;
    [key: string]: unknown;
  };
  filters?: {
    category?: string | string[];
    difficulty?: string | string[];
    visualization?: string | string[];
    [key: string]: unknown;
  };
}

export interface PagefindSearchResult {
  id: string;
  score: number;
  words: number[];
  data: () => Promise<PagefindSearchData>;
}

export interface PagefindSearchResponse {
  results: PagefindSearchResult[];
  unfilteredResultCount: number;
  timings: Record<string, number>;
}

export interface PagefindInstance {
  init: () => Promise<void>;
  search: (
    query: string,
    options?: Record<string, unknown>
  ) => Promise<PagefindSearchResponse>;
  preload: (term: string) => Promise<void>;
}
