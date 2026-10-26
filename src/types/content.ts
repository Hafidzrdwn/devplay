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

export interface CrewPalette {
  shirt: string;
  accent: string;
  hat?: string;
}

export interface CrewMember {
  id: CrewId;
  name: string;
  role: Record<Lang, string>;
  catchphrase: Record<Lang, string>;
  leadOf?: CategoryId;
  palette: CrewPalette;
}

export interface MascotProps {
  crew: CrewId;
  mood?: MascotMood;
  size?: number;
  variant?: 'full' | 'head';
  flip?: boolean;
  animated?: boolean;
  label?: string;
  embed?: { x: number; y: number; scale: number };
  className?: string;
}

export interface SpeechBubbleProps {
  crew: CrewId;
  mood?: MascotMood;
  side?: 'left' | 'right';
  className?: string;
  children: import('react').ReactNode;
}

export interface SimulationSlider {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
}

export interface SimulationStepControls {
  stepIndex: number;
  stepCount: number;
  onNext: () => void;
  onPrevious?: () => void;
}

export interface SimulationContainerProps {
  lang: Lang;
  title: string;
  kind: VisualizationKind;
  caption: string;
  onReset: () => void;
  stepControls?: SimulationStepControls;
  sliders?: SimulationSlider[];
  minHeight?: number;
  children: import('react').ReactNode;
  narrator?: CrewId;
  mood?: MascotMood;
  className?: string;
}

export interface CodeSample {
  code: string;
  caption?: string;
}

export interface CodeCompareProps {
  lang: Lang;
  language: 'ts' | 'js' | 'sql' | 'json' | 'bash' | 'html';
  bad: CodeSample;
  good: CodeSample;
  className?: string;
}

export interface QuickCheckOption {
  id: string;
  text: string;
  explanation: string;
}

export interface QuickCheckProps {
  lang: Lang;
  question: string;
  options: QuickCheckOption[];
  correctOptionId: string;
  className?: string;
}

