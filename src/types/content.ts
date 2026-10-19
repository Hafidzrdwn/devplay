export type Lang = 'id' | 'en';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type CategoryId =
  | 'frontend-performance'
  | 'concurrency-locking'
  | 'database-integrity'
  | 'caching-state'
  | 'distributed-reliability';

export type VisualizationKind = '2d' | '3d';

export type CrewId =
  | 'dev'
  | 'pixel'
  | 'mutex'
  | 'query'
  | 'cache'
  | 'ping'
  | 'bug'
  | 'sec'
  | 'ops'
  | 'intern';

export type MascotMood =
  | 'idle'
  | 'happy'
  | 'thinking'
  | 'confused'
  | 'panic'
  | 'celebrate';

export interface ConceptMeta {
  id: number;
  slug: string;
  category: CategoryId;
  difficulty: Difficulty;
  visualization: VisualizationKind;
  title: Record<Lang, string>;
}

export interface CategoryMeta {
  id: CategoryId;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  icon: string;
  accentColor: string;
  lead: CrewId;
}
