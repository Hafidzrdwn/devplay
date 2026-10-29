# DevPlay — Technical Specification

Dokumen 1 dari 2. Pasangannya: **DevPlay — Code Execution Prompts**. Semua kode dan prompt mengikuti dua aturan keras di bagian 7.

## 0. Keputusan Arsitektur & Temuan atas PRD

1. **ConceptHeader dirender oleh layout**, bukan ditulis manual di tiap MDX. Ia membaca frontmatter, sehingga 100 file (50 konsep × 2 bahasa) tidak bisa menyimpang. Lima komponen lain dipakai langsung di MDX.
2. **SimulationContainer tidak ditulis di MDX.** Tiap simulasi membungkus dirinya sendiri dengan SimulationContainer dalam satu React island. Alasannya: kontrol Reset/Step/Slider harus berbagi state dengan simulasi, dan island Astro tidak berbagi React context.
3. **Slug identik di `id` dan `en`** (slug Inggris). Language switcher cukup mengganti segmen pertama URL, tanpa tabel pemetaan.
4. **PRD menyebut Load Balancer dan Network Topology sebagai contoh 3D, tetapi keduanya tidak ada di 50 konsep.** Matriks di bagian 5 memakai 10 konsep 3D dari daftar resmi (rasio 80/20 = 40 konsep 2D : 10 konsep 3D). Load Balancer bisa jadi konsep opsional ke-51.
5. **Rate-limit in-memory tidak andal di Vercel Serverless** (instance berumur pendek dan paralel). Spec memakai Upstash Redis; fallback in-memory hanya untuk dev. Tanpa Upstash, honeypot + waktu-isi-form + Discord webhook masih cukup untuk traffic kecil, tetapi tidak ada batas yang terjamin.
6. **Zero-JS hanya berlaku untuk body artikel.** Header (tema, search) dan TOC adalah island. Target JS awal halaman docs: ≤ 60 KB gzip. Syaratnya: ikon Lucide diimpor per-ikon, shadcn hanya Dialog, Command, Button, Select, Tabs, `motion` dipakai via `LazyMotion`.
7. **Pagefind hanya ada setelah build.** Di `astro dev`, dialog search menampilkan pesan 'jalankan build dulu'.
8. **Pindah bahasa = navigasi penuh** ke rute ekuivalen, jadi state simulasi ter-reset. Itu disengaja. Yang dipertahankan: hash heading dan preferensi bahasa di localStorage.
9. Paket `framer-motion` kini bernama `motion`; impor dari `motion/react`.

**Versi stack:** Astro 5, React 19, Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui, `three`, `@react-three/fiber` v9, `@react-three/drei` v10, `motion`, `nanostores` + `@nanostores/react`, `zod`, `astro-pagefind`, `@astrojs/mdx`, `@astrojs/react`, `@astrojs/vercel`, `@upstash/ratelimit` + `@upstash/redis`, `shiki`. Package manager: pnpm.

**DevPlay Crew:** web memakai 10 karakter blocky original (kepala kubus, aksesori per role) sebagai pemandu, narator simulasi, dan penanya kuis. Spesifikasinya ada di bagian 8. Stack tidak berubah: karakter berupa SVG statis tanpa aset raster dan tanpa dependency baru.

## 1. System Architecture & Folder Structure

### 1.1 Rute

| Rute | Isi |
| --- | --- |
| `/` | redirect ke `/id/` |
| `/[lang]/` | Landing |
| `/[lang]/docs/[category]/[slug]/` | Artikel (statis, dari Content Collection) |
| `/[lang]/feedback/` | Form masukan |
| `/api/feedback` | POST, serverless (`prerender = false`) |
| `/pagefind/*` | Index pencarian hasil build |

### 1.2 Strategi hidrasi

| Elemen | Mode |
| --- | --- |
| Header shell, LanguageSwitcher (tautan `<a>`), Sidebar (`<details>` per kategori), ConceptHeader, AnalogyBox, Callout, PrevNext | Astro statis, 0 JS |
| ThemeToggle | `client:load` |
| SearchDialog (Cmd/Ctrl+K) | `client:idle`; Pagefind di-import dinamis saat dialog pertama dibuka |
| SidebarDrawer (toggle mobile) | `client:media='(max-width: 1023px)'` |
| Toc (scroll-spy) | `client:idle` |
| Simulasi, CodeCompare, QuickCheck, FeedbackForm, DebounceThrottleDemo | `client:visible` |

Simulasi 3D mengimpor `Scene3D` lewat `React.lazy` + `Suspense` (skeleton). `three` dan `@react-three/*` dipisah ke chunk `three-vendor` via `manualChunks`; tidak boleh ada impor `three` di modul simulasi 2D.

Karakter (`MascotSvg`, `SpeechBubble`) dirender statis oleh Astro tanpa client directive (0 JS). Hanya `CrewLineup` di landing yang berupa island `client:idle`. Penempatan lengkap ada di 8.4.

### 1.3 Struktur direktori

```text
devplay/
├─ astro.config.ts
├─ components.json
├─ tsconfig.json
├─ package.json
├─ scripts/
│  ├─ check-comments.mjs
│  └─ validate-content.ts
├─ src/
│  ├─ content.config.ts
│  ├─ content/docs/
│  │  ├─ id/<category>/<slug>.mdx
│  │  └─ en/<category>/<slug>.mdx
│  ├─ data/
│  │  ├─ categories.ts
│  │  └─ concepts.ts
│  ├─ i18n/
│  │  ├─ config.ts
│  │  ├─ ui.ts
│  │  └─ utils.ts
│  ├─ stores/
│  │  ├─ theme.ts
│  │  └─ progress.ts
│  ├─ styles/global.css
│  ├─ layouts/
│  │  ├─ BaseLayout.astro
│  │  └─ DocsLayout.astro
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ api/feedback.ts
│  │  └─ [lang]/
│  │     ├─ index.astro
│  │     ├─ feedback.astro
│  │     └─ docs/[category]/[slug].astro
│  ├─ lib/
│  │  ├─ cn.ts
│  │  ├─ feedback-schema.ts
│  │  ├─ rate-limit.ts
│  │  └─ discord.ts
│  └─ components/
│     ├─ ui/                      (shadcn)
│     ├─ layout/
│     │  ├─ Header.astro
│     │  ├─ LanguageSwitcher.astro
│     │  ├─ ThemeToggle.tsx
│     │  ├─ SearchDialog.tsx
│     │  ├─ Sidebar.astro
│     │  ├─ SidebarDrawer.tsx
│     │  ├─ Toc.tsx
│     │  └─ PrevNext.astro
│     ├─ mdx/
│     │  ├─ ConceptHeader.astro
│     │  ├─ AnalogyBox.astro
│     │  ├─ Callout.astro
│     │  ├─ SimulationContainer.tsx
│     │  ├─ CodeCompare.tsx
│     │  └─ QuickCheck.tsx
│     ├─ landing/
│     │  ├─ Hero.astro
│     │  ├─ DebounceThrottleDemo.tsx
│     │  ├─ BentoGrid.astro
│     │  └─ FeaturedShowcase.astro
│     ├─ feedback/FeedbackForm.tsx
│     └─ simulations/
│        ├─ shared/
│        │  ├─ useThemeTokens.ts
│        │  ├─ useReducedMotion.ts
│        │  ├─ SimCanvas2D.tsx
│        │  ├─ Scene3D.tsx
│        │  ├─ BTreeScene.tsx
│        │  └─ NodeRingScene.tsx
│        ├─ frontend/<slug>/{Component.tsx, labels.ts}
│        ├─ concurrency/<slug>/...
│        ├─ database/<slug>/...
│        ├─ caching/<slug>/...
│        └─ distributed/<slug>/...
```

Slug kategori: `frontend-performance`, `concurrency-locking`, `database-integrity`, `caching-state`, `distributed-reliability`. Folder simulasi memakai nama pendek kategori (frontend, concurrency, database, caching, distributed).

Tambahan struktur untuk DevPlay Crew:

```text
src/
├─ data/crew.ts
├─ styles/mascot.css
└─ components/
   ├─ mascot/
   │  ├─ MascotSvg.tsx
   │  └─ SpeechBubble.tsx
   └─ landing/CrewLineup.tsx
```

## 2. Design Tokens & Theme Syncing

### 2.1 Token (Tailwind v4, CSS-first)

```css
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: #fff8ec;
  --surface: #ffffff;
  --ink: #1b1b1f;
  --muted: #6b6b76;
  --primary: #7c5cff;
  --accent: #ffc933;
  --success: #2fbf71;
  --danger: #ff5c5c;
  --info: #3ba7ff;
  --grid: #e7dfce;
  --radius: 14px;
  --shadow-hard: 4px 4px 0 0 var(--ink);
}

.dark {
  --bg: #14131a;
  --surface: #1e1c27;
  --ink: #f5f1e8;
  --muted: #a19fb0;
  --primary: #a48dff;
  --accent: #ffd65c;
  --success: #4ade94;
  --danger: #ff7a7a;
  --info: #6bbfff;
  --grid: #2e2b3b;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-primary: var(--primary);
  --color-accent: var(--accent);
  --color-success: var(--success);
  --color-danger: var(--danger);
  --color-info: var(--info);
  --color-grid: var(--grid);
  --radius-card: var(--radius);
  --shadow-hard: var(--shadow-hard);
}
```

Token shadcn dipetakan ke token di atas: `--background: var(--bg)`, `--foreground: var(--ink)`, `--card: var(--surface)`, `--border: var(--ink)`, `--ring: var(--primary)`, `--primary` dan `--accent` langsung.

Aturan gaya Soft Neobrutalism: border `2px solid var(--ink)`, sudut `var(--radius)`, bayangan keras `var(--shadow-hard)`. Hover: geser (-1px, -1px) dan bayangan 6px. Active: geser (4px, 4px) dan bayangan hilang. Font: Space Grotesk (judul), Inter (isi), JetBrains Mono (kode), semuanya via `@fontsource-variable/*`.

### 2.2 Mekanisme sinkronisasi tema

Penyebab flash dihindari dengan skrip inline di `<head>` sebelum paint:

```html
<script is:inline>
  (function () {
    var stored = localStorage.getItem('devplay-theme');
    var dark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  })();
</script>
```

Store bersama lintas island (`src/stores/theme.ts`):

```ts
import { atom } from 'nanostores';

export type ThemeMode = 'light' | 'dark';

export const themeMode = atom<ThemeMode>('light');

export function syncThemeFromDocument(): void {
  themeMode.set(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

export function applyTheme(mode: ThemeMode): void {
  document.documentElement.classList.toggle('dark', mode === 'dark');
  localStorage.setItem('devplay-theme', mode);
  themeMode.set(mode);
}
```

Hook yang dipakai semua simulasi (`useThemeTokens.ts`):

```ts
export const tokenNames = ['bg', 'surface', 'ink', 'muted', 'primary', 'accent', 'success', 'danger', 'info', 'grid'] as const;
export type TokenName = (typeof tokenNames)[number];
export type SimTokens = Record<TokenName, string> & { mode: ThemeMode };

export function useThemeTokens(): SimTokens;
```

Implementasi: `useStore(themeMode)`; `useEffect` saat mount memanggil `syncThemeFromDocument()`; `useLayoutEffect` bergantung pada `mode` membaca `getComputedStyle(document.documentElement).getPropertyValue('--<name>')` untuk tiap `tokenNames`. Hasilnya string warna siap pakai untuk Canvas dan Three.

**Canvas 2D** (`SimCanvas2D`): props `draw(ctx, size, tokens, timeMs)`, `running`. Mengatur DPR via ResizeObserver, loop `requestAnimationFrame` hanya saat `running`, dan memanggil `draw` sekali setiap `tokens` berubah agar kanvas yang sedang berhenti tetap ganti warna.

**Three.js** (`Scene3D`): `<Canvas dpr={[1, 1.5]} frameloop='demand'>`; `<color attach='background' args={[tokens.bg]} />`; material memakai `tokens.*` lewat `useMemo`; `invalidate()` dipanggil di `useEffect` bergantung `tokens`. Garis tepi gaya neobrutalism: `<Edges color={tokens.ink} />` dari drei. Context loss ditangani dengan state fallback gambar statis.

**SVG/HTML + motion**: cukup memakai kelas Tailwind (`fill-primary`, `stroke-ink`) karena mengikuti CSS variable otomatis.

## 3. i18n Architecture

### 3.1 Routing

```ts
export default defineConfig({
  site: 'https://devplay.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), mdx(), pagefind()],
  i18n: { defaultLocale: 'id', locales: ['id', 'en'], routing: { prefixDefaultLocale: true } },
  redirects: { '/': '/id/' },
  vite: { plugins: [tailwindcss()] },
});
```

Halaman ada di `src/pages/[lang]/...` dengan `getStaticPaths` memakai `languages`. Rute artikel diturunkan dari `entry.id` (`id/frontend-performance/debouncing`). `lang` tidak disimpan di frontmatter.

### 3.2 Kamus UI statis

```ts
const id = { 'nav.docs': 'Dokumentasi', 'sim.reset': 'Reset', 'sim.step': 'Langkah berikutnya' } as const;
export type UiKey = keyof typeof id;
const en: Record<UiKey, string> = { 'nav.docs': 'Docs', 'sim.reset': 'Reset', 'sim.step': 'Next step' };
export const ui: Record<Lang, Record<UiKey, string>> = { id, en };

export function useTranslations(lang: Lang): (key: UiKey) => string {
  return (key) => ui[lang][key];
}
```

Paritas kunci dijaga compiler: `en` bertipe `Record<UiKey, string>`.

### 3.3 Language switcher

`LanguageSwitcher.astro` menghitung `href` dengan `switchLangPath(pathname, target)` (mengganti segmen pertama), mempertahankan hash, dan menulis `devplay-lang` ke localStorage lewat skrip kecil saat diklik. Tidak ada island React.

### 3.4 Simulasi menerima bahasa

Island Astro tidak berbagi context, jadi `lang` dikirim sebagai prop eksplisit dari MDX:

```ts
export interface SimulationProps {
  lang: Lang;
}
```

Tiap simulasi punya `labels.ts` dengan pola paritas yang sama seperti `ui.ts`; nilai boleh fungsi untuk string berparameter:

```ts
const id = { title: 'Debouncing', fired: (count: number) => `${count} panggilan lolos` };
export type Labels = typeof id;
const en: Labels = { title: 'Debouncing', fired: (count) => `${count} calls fired` };
export const getLabels = (lang: Lang): Labels => (lang === 'id' ? id : en);
```

Label umum (Reset, Step, Play, Pause, Benar, Salah) ada di `ui.ts` dengan prefiks `sim.`, dipakai SimulationContainer lewat prop `lang`.

`scripts/validate-content.ts` gagal jika nilai `lang='...'` di sebuah MDX tidak sama dengan nama folder bahasanya.

## 4. MDX & Component Contracts

### 4.1 Tipe dasar & schema

```ts
export type Lang = 'id' | 'en';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type CategoryId = 'frontend-performance' | 'concurrency-locking' | 'database-integrity' | 'caching-state' | 'distributed-reliability';
export type VisualizationKind = '2d' | '3d';
```

```ts
const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    conceptId: z.number().int().min(1).max(50),
    category: z.enum(categoryIds),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    readingMinutes: z.number().int().positive(),
    tldr: z.string().max(180),
    keywords: z.array(z.string()).default([]),
    visualization: z.enum(['2d', '3d']),
  }),
});
```

`src/data/concepts.ts` adalah sumber kebenaran urutan, slug, kategori, kesulitan, dan mode (sesuai matriks bagian 5). Sidebar, PrevNext, dropdown feedback, dan validasi konten semuanya membaca file ini.

```ts
export interface ConceptMeta {
  id: number;
  slug: string;
  category: CategoryId;
  difficulty: Difficulty;
  visualization: VisualizationKind;
  title: Record<Lang, string>;
}
```

### 4.2 Kontrak komponen

```ts
export interface ConceptHeaderProps {
  lang: Lang;
  title: string;
  category: CategoryId;
  difficulty: Difficulty;
  readingMinutes: number;
  tldr: string;
}

export interface AnalogyBoxProps {
  title?: string;
  emoji?: string;
}

export type CalloutVariant = 'info' | 'tip' | 'warning' | 'tradeoff';

export interface CalloutProps {
  variant: CalloutVariant;
  title?: string;
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
  children: React.ReactNode;
}

export interface CodeSample {
  code: string;
  caption?: string;
}

export interface CodeCompareExample {
  id: string;
  label: string;
  language: 'ts' | 'js' | 'sql' | 'json' | 'bash' | 'html';
  bad: CodeSample;
  good: CodeSample;
}

export interface CodeCompareProps {
  lang: Lang;
  language?: 'ts' | 'js' | 'sql' | 'json' | 'bash' | 'html';
  bad?: CodeSample;
  good?: CodeSample;
  examples?: CodeCompareExample[];
  defaultExampleId?: string;
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
}
```

Kontrak di atas diperluas oleh bagian 8.3: prop `speaker` pada ConceptHeader dan AnalogyBox, serta `narrator` dan `mood` pada SimulationContainer.

Perilaku wajib:

- **SimulationContainer**: caption di `aria-live='polite'`; tombol Reset selalu ada; panel slider/step hanya muncul bila prop diberikan; menghormati `prefers-reduced-motion` (animasi otomatis berhenti, mode step tetap jalan); `minHeight` mencegah layout shift.
- **CodeCompare**: mendukung selector multi-bahasa/framework dinamis (`examples: [...]`) yang relevan dengan materi (misal TypeScript, Vanilla JS, React hook, Vue composable, dsb.); view mode Tab / Stack; Fullscreen Modal berdampingan satu layar penuh dengan tombol Tutup (Esc); highlight `shiki/core` fine-grained dengan engine JavaScript dinamis; high-contrast tokens di dark mode.
- **Real-World UI Playground**: selain simulasi alur teknis 2D/3D, sertakan mini-playground interaktif kasus nyata yang kontekstual (misal kotak live search autocomplete dengan log request API untuk debouncing) agar pembaca dapat mencoba langsung dari sudut pandang antarmuka pengguna.
- **QuickCheck**: pilihan ganda 3-4 opsi; setelah menjawab, tampilkan penjelasan untuk semua opsi; tombol Coba Lagi; hasil benar disimpan di `progress` store (localStorage `devplay-progress`).
- **Callout / AnalogyBox / ConceptHeader**: komponen Astro statis tanpa JS.

### 4.3 Kerangka MDX standar

```mdx
---
title: Debouncing
conceptId: 1
category: frontend-performance
difficulty: easy
readingMinutes: 5
tldr: Tunda eksekusi sampai pengguna berhenti memicu event.
keywords: [search lag, input, delay]
visualization: 2d
---
import AnalogyBox from '@/components/mdx/AnalogyBox.astro';
import Callout from '@/components/mdx/Callout.astro';
import CodeCompare from '@/components/mdx/CodeCompare';
import QuickCheck from '@/components/mdx/QuickCheck';
import DebouncingSim from '@/components/simulations/frontend/debouncing/Debouncing';

<AnalogyBox title='Lift yang menunggu'>...</AnalogyBox>

<DebouncingSim client:visible lang='id' />

## Cara Kerja

## Kapan Dipakai

## Trade-off

<Callout variant='tradeoff'>...</Callout>

## Praktik Buruk vs Baik

<CodeCompare client:visible lang='id' language='ts' bad={{ code: '...' }} good={{ code: '...' }} />

## Uji Pemahaman

<QuickCheck client:visible lang='id' question='...' options={[]} correctOptionId='b' />
```

Padanan h2 di `en`: How It Works, When to Use It, Trade-offs, Bad vs Good Practice, Quick Check. Hanya h2 dan h3 yang masuk TOC; h1 dibuat layout dari frontmatter.

## 5. Visualization Classification Matrix (2D vs 3D)

Total: **40 konsep 2D** (Framer Motion + SVG/Canvas) dan **10 konsep 3D** (React Three Fiber). Scene dipakai ulang: `BTreeScene` (#25, #26) dan `NodeRingScene` (#16, #46).

### Frontend, UI & Browser Performance — `frontend-performance`

| # | Slug | Level | Mode | Interaksi pengguna |
| --- | --- | --- | --- | --- |
| 1 | `debouncing` | Easy | 2D | Slider delay (100–1000 ms); tombol/ketik cepat; timeline membandingkan event mentah dengan panggilan yang lolos |
| 2 | `throttling` | Easy | 2D | Slider interval; tahan tombol 'scroll'; bar timeline eksekusi per interval |
| 3 | `ui-virtualization` | Medium | 2D | Slider jumlah item (1k–1M); scroll viewport; counter node DOM vs item ter-render |
| 4 | `layout-thrashing` | Medium | 2D | Toggle baca/tulis berselang-seling vs dibatch; counter reflow dan bar waktu frame |
| 5 | `critical-rendering-path-hydration` | Hard | 2D | Step pipeline HTML→DOM→CSSOM→Render Tree→Layout→Paint; toggle SSR/CSR/Islands; slider kecepatan jaringan |
| 6 | `event-delegation` | Easy | 2D | Tombol tambah item; toggle listener per-item vs delegasi; counter listener; panah bubbling |
| 7 | `web-workers` | Medium | 2D | Tombol 'hitung berat'; toggle main thread vs worker; spinner membeku atau lancar |
| 8 | `intersection-observer` | Easy | 2D | Scroll viewport; slider threshold dan rootMargin; elemen aktif saat masuk layar |
| 9 | `optimistic-ui-update` | Medium | 2D | Tombol like; slider latensi server dan peluang gagal; animasi rollback |
| 10 | `request-cancellation` | Medium | 2D | Ketik cepat di kolom cari; toggle AbortController; timeline response tidak berurutan |

### Concurrency, Async & Locking — `concurrency-locking`

| # | Slug | Level | Mode | Interaksi pengguna |
| --- | --- | --- | --- | --- |
| 11 | `race-condition` | Medium | 2D | Dua thread update saldo; step per interleaving; toggle lock on/off; hasil akhir |
| 12 | `deadlock` | Medium | 2D | Dua thread, dua resource; step; toggle lock ordering; graf resource menandai siklus |
| 13 | `pessimistic-locking` | Medium | 2D | Dua transaksi pada satu row; tombol SELECT FOR UPDATE; antrean blocked |
| 14 | `optimistic-locking` | Medium | 2D | Dua editor dengan kolom version; simpan bentrok; tombol retry |
| 15 | `mutex-semaphore` | Medium | 2D | Slider jumlah permit (1–5); N worker; slot terisi/antre |
| 16 | `distributed-lock-redlock` | Hard | 3D | Cincin 5 node Redis; client A/B acquire; toggle node mati; slider TTL dan clock drift; kuorum 3/5 |
| 17 | `idempotency` | Medium | 2D | Tombol Bayar; toggle timeout+retry; Idempotency-Key on/off; counter charge ganda |
| 18 | `starvation-livelock` | Hard | 2D | Slider prioritas dan jitter; antrean thread; toggle fair queue vs backoff acak |
| 19 | `thread-pool-exhaustion` | Medium | 2D | Slider ukuran pool, laju request, durasi blocking; antrean membengkak |
| 20 | `event-loop-blocking` | Medium | 2D | Tombol loop sinkron vs dipecah; call stack, queue, dan lag timer |

### Database & Data Integrity — `database-integrity`

| # | Slug | Level | Mode | Interaksi pengguna |
| --- | --- | --- | --- | --- |
| 21 | `n-plus-one-query` | Easy | 2D | Slider jumlah post; toggle lazy vs JOIN/eager; log query dan counter |
| 22 | `acid-transactions` | Medium | 2D | Transfer saldo; tombol crash di langkah tertentu; toggle transaksi on/off; rollback atomik |
| 23 | `transaction-isolation-levels` | Hard | 2D | Dropdown level isolasi; dua sesi di timeline; nilai yang terbaca |
| 24 | `read-anomalies` | Hard | 2D | Pilih Dirty/Non-Repeatable/Phantom; step skenario; toggle isolasi |
| 25 | `database-indexing-cardinality` | Hard | 3D | B-Tree 3D; insert key; slider cardinality; orbit kamera; jalur lookup menyala |
| 26 | `full-table-scan-vs-index-seek` | Medium | 3D | Pilih query; toggle index; sinar scanner; counter row diperiksa (memakai BTreeScene) |
| 27 | `connection-pooling` | Medium | 3D | Tabung koneksi antara app server dan DB; slider ukuran pool dan laju request; toggle pooling off menampilkan biaya handshake |
| 28 | `cursor-vs-offset-pagination` | Medium | 2D | Slider nomor halaman; toggle sisip row saat browsing; baris duplikat/terlewat disorot |
| 29 | `read-replica-replication-lag` | Hard | 3D | Primary + 3 replica; tombol write; slider lag; toggle read-your-writes routing |
| 30 | `partitioning-sharding` | Hard | 3D | Kubus shard; tombol tambah data; toggle hash vs range; tambah shard memicu rebalancing; hotspot disorot |

### Caching, Memory & State — `caching-state`

| # | Slug | Level | Mode | Interaksi pengguna |
| --- | --- | --- | --- | --- |
| 31 | `cache-invalidation-stale-data` | Medium | 2D | Slider TTL; tombol update sumber; indikator stale; toggle invalidate-on-write |
| 32 | `cache-stampede` | Hard | 3D | Partikel request menuju cache lalu DB; tombol expire key; toggle lock/jitter/stale-while-revalidate; meter beban DB |
| 33 | `cache-penetration` | Medium | 2D | Request key yang tidak ada; toggle null caching / Bloom filter; counter hit DB |
| 34 | `caching-patterns` | Medium | 2D | Pilih Write-Through/Around/Back; tombol read/write; panah alur; toggle crash cache untuk melihat data hilang pada write-back |
| 35 | `memory-leak-gc-pause` | Hard | 3D | Graf objek heap; tombol alokasi dan tambah referensi bocor; tombol GC; bar jeda |
| 36 | `shallow-vs-deep-copy` | Easy | 2D | Edit properti bersarang; toggle spread vs structuredClone; diagram referensi |
| 37 | `memoization` | Easy | 2D | Slider n Fibonacci; toggle memo; pohon panggilan dan counter |
| 38 | `stream-buffer-processing` | Medium | 2D | Slider ukuran file, chunk, batas memori; toggle baca-semua vs stream; meter memori dan OOM |
| 39 | `single-source-of-truth` | Medium | 2D | Dua komponen; toggle state ganda vs store tunggal; edit dan indikator desync |
| 40 | `serialization-overhead` | Medium | 2D | Slider ukuran payload; dropdown format (JSON/MessagePack/Protobuf); bar ukuran dan waktu CPU (nilai ilustratif, diberi disclaimer) |

### Distributed Systems, Network & Reliability — `distributed-reliability`

| # | Slug | Level | Mode | Interaksi pengguna |
| --- | --- | --- | --- | --- |
| 41 | `rate-limiting` | Medium | 2D | Dropdown Token Bucket/Sliding Window; slider laju dan kapasitas; tombol burst; diterima/ditolak |
| 42 | `backpressure` | Hard | 2D | Producer/consumer; slider kecepatan; toggle unbounded vs bounded+pause; meter memori antrean |
| 43 | `circuit-breaker` | Medium | 2D | Toggle service up/down; slider threshold dan timeout; state machine Closed/Open/Half-Open |
| 44 | `exponential-backoff-jitter` | Medium | 2D | Slider jumlah client; toggle none/exponential/exponential+jitter; timeline retry |
| 45 | `message-queue-dlq` | Medium | 3D | Producer, ban berjalan, consumer; toggle consumer gagal; slider max retry; pesan masuk bin DLQ |
| 46 | `cap-theorem-eventual-consistency` | Hard | 3D | Tiga node; tombol partisi jaringan; tulis di node A; toggle CP vs AP; baca dari node B (memakai NodeRingScene) |
| 47 | `saga-pattern` | Hard | 2D | Order→Payment→Inventory→Shipping; tombol gagal di langkah N; kompensasi berjalan mundur |
| 48 | `cors-preflight-csrf` | Hard | 2D | Pilih origin, method, header; toggle preflight dan konfigurasi header CORS; skenario CSRF dengan toggle SameSite/token |
| 49 | `head-of-line-blocking` | Hard | 2D | Toggle HTTP/1.1 vs HTTP/2 vs HTTP/3; slider packet loss; lane request |
| 50 | `graceful-shutdown` | Medium | 2D | Tombol SIGTERM; toggle graceful vs hard kill; request in-flight; slider drain timeout |

## 6. Search & Feedback API Spec

### 6.1 Pagefind

- Integrasi `astro-pagefind`; index dibuat setelah `astro build` terhadap output statis.
- Pagefind membuat index per `<html lang>`, jadi hasil pencarian otomatis sesuai bahasa halaman.
- Markup di `DocsLayout`:
  - `<main data-pagefind-body>` membungkus artikel.
  - `<h1 data-pagefind-meta='title'>`.
  - Header, Sidebar, Toc, PrevNext diberi `data-pagefind-ignore`.
  - Filter: `<meta data-pagefind-filter='category[content]' content='{category}'>`, plus filter `difficulty` dan `visualization`.
  - Kata kunci masalah dari `keywords` dirender di `<span hidden data-pagefind-weight='8'>`.
- Teks di dalam kanvas tidak ter-index, jadi tiap MDX wajib memuat penjelasan prosa yang cukup.

```ts
export interface SearchHit {
  url: string;
  title: string;
  excerpt: string;
  category: CategoryId;
  difficulty: Difficulty;
}
```

`SearchDialog`: shadcn `Command` dalam `Dialog`; `Cmd/Ctrl + K` membuka; input di-debounce 150 ms; pagefind di-import dinamis dari `/pagefind/pagefind.js`; hasil dikelompokkan per kategori; di dev menampilkan pesan khusus.

### 6.2 Endpoint `/api/feedback`

```ts
export const prerender = false;

export const feedbackTypes = ['concept-correction', 'new-topic', 'visualization-bug', 'other'] as const;

export const feedbackSchema = z.object({
  name: z.string().trim().max(60).optional(),
  type: z.enum(feedbackTypes),
  conceptSlug: z.enum(conceptSlugs).optional(),
  message: z.string().trim().min(10).max(2000),
  lang: z.enum(['id', 'en']),
  website: z.string().default(''),
  elapsedMs: z.number().int().nonnegative(),
});

export type FeedbackPayload = z.infer<typeof feedbackSchema>;

export type FeedbackResponse =
  | { ok: true }
  | { ok: false; code: 'bad_request' | 'validation' | 'rate_limited' | 'upstream'; fieldErrors?: Record<string, string[]>; retryAfterSeconds?: number };
```

Urutan pemrosesan:

1. Tolak jika `Content-Type` bukan JSON atau body > 8 KB → `400 bad_request`.
2. Tolak jika header `Origin` tidak sama dengan host situs → `400 bad_request`.
3. Parse dengan `feedbackSchema` → `400 validation` dengan `fieldErrors`.
4. Honeypot: jika `website !== ''` atau `elapsedMs < 2500`, balas `200 { ok: true }` tanpa mengirim apa pun (bot tidak diberi sinyal).
5. Rate-limit: Upstash sliding window 3 request per 10 menit, kunci `sha256(ip + FEEDBACK_IP_SALT)` → `429 rate_limited` dengan `Retry-After`.
6. Kirim ke Discord webhook: satu embed (title = tipe, field = konsep, bahasa, pengirim, pesan dipotong 1000 karakter) dan `allowed_mentions: { parse: [] }` agar `@everyone` tidak aktif. Gagal → `502 upstream`.
7. Sukses → `200 { ok: true }`.

Variabel lingkungan: `DISCORD_WEBHOOK_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `FEEDBACK_IP_SALT`. Bila kredensial Upstash kosong, `rate-limit.ts` memakai Map in-memory dan menulis peringatan ke log (hanya layak untuk dev).

Opsi Supabase: tabel `feedback(id, created_at, type, concept_slug, lang, name, message)`; insert dilakukan setelah langkah 5 lewat client service-role di server saja. Tidak dipakai pada versi awal.

FeedbackForm (React): validasi sisi klien dengan skema yang sama, field honeypot `website` disembunyikan via CSS (bukan `type='hidden'`), `elapsedMs` dihitung dari waktu mount, state loading/sukses/error/429 dengan teks dari `ui.ts`.

## 7. Aturan Keras & Penegakan

### 7.1 Minimal Code Comments Policy

- Dilarang komentar satu baris yang mengulang nama variabel atau fungsi.
- Dilarang blok JSDoc/docstring panjang.
- Kode self-documenting lewat penamaan deskriptif dan tipe TypeScript ketat (tanpa `any`).
- Satu-satunya pengecualian: rumus matematika/WebGL yang sangat tidak biasa, maksimal 1 baris singkat.
- Penegakan: `scripts/check-comments.mjs` memindai `src/**/*.{ts,tsx,astro}` dan gagal bila menemukan `//` atau `/*` di luar string dan URL, kecuali `// @ts-expect-error`; dijalankan lewat `pnpm check:comments`.

### 7.2 One-Line Git Commit per Execution Step

Akhir setiap step di Dokumen 2 memuat tepat satu baris `git commit -m '...'` berformat Conventional Commits, misalnya `feat(ui): add interactive code compare component`.

### 7.3 Quality gates sebelum commit

`pnpm astro check` (tanpa error TS), `pnpm check:comments`, `pnpm build` (khusus step yang menyentuh rute, konten, atau API). Target performa halaman artikel tanpa simulasi 3D: Lighthouse Performance ≥ 95, JS awal ≤ 60 KB gzip.

## 8. DevPlay Crew — Maskot & Karakter

Web diisi 10 karakter blocky (kepala kubus, badan sederhana, aksesori sesuai role) yang menemani pembaca: memandu di landing, menjadi narator simulasi, bertanya di kuis, dan muncul di state kosong atau error. Arah visualnya terinspirasi tim karakter voxel dari referensi yang kamu kirim, tetapi semua desain dibuat original, bukan menyalin karakter siapa pun.

### 8.1 Prinsip

- SVG komposit dari data, tanpa gambar raster dan tanpa dependency baru; sekitar 2 KB markup per karakter.
- Dirender statis oleh Astro (komponen React murni tanpa hooks dan tanpa client directive, 0 JS). Satu-satunya island baru adalah `CrewLineup` (`client:idle`).
- Animasi idle murni CSS (bobbing, kedip, loncat, goyang). `prefers-reduced-motion` mematikan semuanya. Mood berubah lewat props pada island, lalu menjadi kelas CSS.
- Identitas visual: semua karakter berkepala kubus oranye (`--mascot-skin`, sedikit lebih gelap di dark mode), outline 2px `var(--ink)`, bayangan keras seperti komponen lain.
- Hex warna karakter hanya boleh ada di `crew.ts` dan `MascotSvg.tsx`; di tempat lain tetap memakai token.
- Dekoratif secara default (`aria-hidden`). Informasi tidak boleh hanya lewat karakter: caption, penjelasan, dan hasil kuis tetap lengkap dalam teks.

### 8.2 Roster (10 karakter)

| `id` | Nama & role | Ciri visual | Dipakai untuk |
| --- | --- | --- | --- |
| `dev` | Dev — host & pemandu | topi bowler cokelat, lanyard | Pemandu landing, 404, Callout info, sisi ✅ CodeCompare |
| `pixel` | Pixel — Frontend Engineer | topi oranye, headphone | Lead kategori `frontend-performance`; Callout tip |
| `mutex` | Mutex — Concurrency Engineer | rompi oranye bergaris, peluit | Lead kategori `concurrency-locking` |
| `query` | Query — Database Admin | kemeja putih, dasi merah, kacamata hitam | Lead kategori `database-integrity` |
| `cache` | Cache — Caching Courier | hoodie hijau, tas kurir | Lead kategori `caching-state` |
| `ping` | Ping — Distributed Systems Engineer | helm kuning, headset | Lead kategori `distributed-reliability` |
| `bug` | Bug — QA Tester | antena serangga, kaca pembesar | Callout warning, sisi ❌ CodeCompare, jawaban salah, error form |
| `sec` | Sec — Security | hoodie biru, perisai | Rate limiting, CORS/CSRF |
| `ops` | Ops — DevOps/SRE | kemeja biru, kunci inggris | Callout tradeoff, circuit breaker, graceful shutdown, error server |
| `intern` | Intern — si penanya | lanyard kebesaran, wajah penasaran | Pembaca soal di QuickCheck, state kosong pencarian, header form feedback |

Setiap karakter punya `catchphrase` dua bahasa (maksimal 60 karakter, nada santai), misalnya Dev: 'Santai, kita bedah pelan-pelan.' / 'Easy, we'll take it apart slowly.'

### 8.3 Data & kontrak

```ts
export type CrewId = 'dev' | 'pixel' | 'mutex' | 'query' | 'cache' | 'ping' | 'bug' | 'sec' | 'ops' | 'intern';
export type MascotMood = 'idle' | 'happy' | 'thinking' | 'confused' | 'panic' | 'celebrate';

export interface CrewMember {
  id: CrewId;
  name: string;
  role: Record<Lang, string>;
  catchphrase: Record<Lang, string>;
  leadOf?: CategoryId;
  palette: { shirt: string; accent: string; hat?: string };
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
}

export interface SpeechBubbleProps {
  crew: CrewId;
  mood?: MascotMood;
  side?: 'left' | 'right';
  children: React.ReactNode;
}
```

- `embed` dipakai di dalam SVG simulasi: komponen mengembalikan `<g transform>` alih-alih `<svg>`.
- `categories.ts` mendapat field `lead: CrewId` (pixel, mutex, query, cache, ping sesuai urutan kategori).
- Schema frontmatter mendapat `speaker: z.enum(crewIds).optional()`; bila kosong, pembicara adalah lead kategori konsep itu.
- Tambahan pada kontrak 4.2: `ConceptHeaderProps.speaker: CrewId`, `AnalogyBoxProps.speaker?: CrewId`, `SimulationContainerProps.narrator?: CrewId` (default `dev`) dan `SimulationContainerProps.mood?: MascotMood` (default `idle`).

Perilaku per komponen:

- **ConceptHeader:** avatar `speaker` 72px di samping judul.
- **AnalogyBox:** berbentuk speech bubble berekor; `speaker` 'mengucapkan' analogi.
- **Callout:** avatar 40px per varian: info → `dev`, tip → `pixel`, warning → `bug`, tradeoff → `ops`.
- **SimulationContainer:** caption dirender sebagai speech bubble dari `narrator` (56px; 40px di bawah 400px lebar); `aria-live` tetap pada teks caption. `mood` mengikuti state simulasi.
- **Simulasi 2D:** aktor di dalam SVG memakai `MascotSvg` dengan `embed` (misalnya dua thread = dua karakter); mood berganti sesuai state, misalnya race condition terjadi → `panic`, berhasil → `celebrate`.
- **Simulasi 3D:** tidak ada karakter 3D; karakter hanya hadir sebagai narator bubble agar budget mesh tetap terjaga.
- **CodeCompare:** panel ❌ diberi `bug` (confused), panel ✅ diberi `dev` (happy), masing-masing 32px.
- **QuickCheck:** `intern` (thinking) 'membacakan' soal; jawaban benar → lead kategori `celebrate` dengan konfeti CSS ringan; jawaban salah → `intern` `confused`.
- **Progres kategori:** bila 10/10 selesai di Bento Grid, lead kategori `celebrate` permanen dan mendapat lencana.

### 8.4 Penempatan di halaman

| Lokasi | Karakter | Mekanisme |
| --- | --- | --- |
| Hero landing | Seluruh crew berjajar, Dev di tengah | `CrewLineup` (`client:idle`): bobbing CSS; klik karakter → `celebrate` + bubble catchphrase |
| Bento Grid | Lead tiap kategori (96px) | Statis; bobbing berjenjang dengan delay berbeda |
| Featured Showcase | Narator konsep | Statis |
| ConceptHeader, AnalogyBox | `speaker` | Statis |
| SimulationContainer, QuickCheck, SearchDialog (kosong) | narator, `intern`, `intern` confused | Island yang sudah ada, tanpa JS tambahan |
| Sidebar | Kepala lead (`variant='head'`, 24px) di summary kategori | Statis |
| 404 | `bug` tersesat + `dev` menunjuk beranda | Statis |
| Feedback | `intern` di header; sukses → `dev` celebrate; 429 → `ops`; 502 → `bug` | Island form yang sudah ada |
| Fallback simulasi 3D (Suspense) | `ping` idle dengan teks memuat | Statis |

### 8.5 Aktor pendukung per konsep

Default: narator = lead kategori (atau `speaker` di frontmatter). Daftar berikut hanya untuk konsep yang punya aktor jelas; sisanya memakai lead dan, bila perlu, `dev`.

| # | Konsep | Narator / aktor |
| --- | --- | --- |
| 5 | `critical-rendering-path-hydration` | `pixel` + `ops` (sisi server) |
| 11 | `race-condition` | `mutex` + `bug` |
| 12 | `deadlock` | `mutex` + `intern` |
| 17 | `idempotency` | `mutex` + `bug` |
| 21 | `n-plus-one-query` | `query` + `intern` |
| 22 | `acid-transactions` | `query` + `ops` |
| 34 | `caching-patterns` | `cache` + `query` |
| 35 | `memory-leak-gc-pause` | `cache` + `bug` |
| 41 | `rate-limiting` | `sec` + `ping` |
| 43 | `circuit-breaker` | `ops` + `ping` |
| 48 | `cors-preflight-csrf` | `sec` + `bug` |
| 50 | `graceful-shutdown` | `ops` + `ping` |

### 8.6 Anatomi MascotSvg & file

- `viewBox` 0 0 120 160. Lapisan dari belakang: bayangan, kaki, badan (warna `shirt`), lengan, kepala kubus (muka depan, sisi atas lebih terang, sisi kanan lebih gelap), mata, mulut, aksesori. Outline 2px `var(--ink)`.
- Mood: `idle` mata persegi dan mulut datar; `happy` mata ^ ^ dan senyum; `thinking` satu alis naik dan kepala miring; `confused` mata beda ukuran dan mulut bergelombang; `panic` mata lebar, keringat, mulut 'o', goyang cepat; `celebrate` mata ^ ^, mulut terbuka, melompat.
- Aksesori digambar oleh fungsi `renderAccessory(crew)` dari data palette, bukan satu SVG per karakter, agar markup tetap kecil.
- `variant='head'` memotong tampilan ke kepala saja.
- File: `src/data/crew.ts`, `src/components/mascot/MascotSvg.tsx`, `src/components/mascot/SpeechBubble.tsx`, `src/components/landing/CrewLineup.tsx`, `src/styles/mascot.css` (keyframes `mascot-bob`, `mascot-blink`, `mascot-jump`, `mascot-shake` dan kelas per mood).
- Penegakan: `validate-content` memeriksa bahwa `speaker` (bila ada) adalah `CrewId` valid; budget HTML 10 karakter di landing ≤ 20 KB dan `CrewLineup` ≤ 3 KB gzip.
