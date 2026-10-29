import { createHighlighterCore, type HighlighterCore, type LanguageRegistration } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

export type HighlightLanguage =
  | 'ts'
  | 'js'
  | 'python'
  | 'go'
  | 'rust'
  | 'java'
  | 'cpp'
  | 'sql'
  | 'json'
  | 'bash'
  | 'html'
  | 'css'
  | 'yaml'
  | (string & {});

const loadedLanguages = new Set<string>();

const languageLoaders: Record<string, () => Promise<{ default: LanguageRegistration[] }>> = {
  ts: () => import('shiki/langs/typescript.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  js: () => import('shiki/langs/javascript.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  py: () => import('shiki/langs/python.mjs'),
  go: () => import('shiki/langs/go.mjs'),
  rust: () => import('shiki/langs/rust.mjs'),
  rs: () => import('shiki/langs/rust.mjs'),
  java: () => import('shiki/langs/java.mjs'),
  cpp: () => import('shiki/langs/cpp.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  sh: () => import('shiki/langs/bash.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  yml: () => import('shiki/langs/yaml.mjs'),
};

function normalizeLanguage(lang: string): string {
  const lower = lang.toLowerCase();
  if (lower === 'react' || lower === 'vue' || lower === 'svelte' || lower === 'tsx') {
    return 'ts';
  }
  if (lower === 'jsx') {
    return 'js';
  }
  return languageLoaders[lower] ? lower : 'ts';
}

let highlighterPromise: Promise<HighlighterCore | null> | null = null;

export function getHighlighter(): Promise<HighlighterCore | null> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      try {
        const [lightTheme, darkTheme] = await Promise.all([
          import('shiki/themes/github-light.mjs'),
          import('shiki/themes/github-dark.mjs'),
        ]);

        return await createHighlighterCore({
          themes: [lightTheme, darkTheme],
          engine: createJavaScriptRegexEngine(),
        });
      } catch {
        return null;
      }
    })();
  }
  return highlighterPromise;
}

export async function highlightCode(code: string, language: HighlightLanguage): Promise<string | null> {
  try {
    const highlighter = await getHighlighter();
    if (!highlighter) {
      return null;
    }

    const resolvedLang = normalizeLanguage(language);

    if (!loadedLanguages.has(resolvedLang)) {
      const loader = languageLoaders[resolvedLang];
      if (loader) {
        const langModule = await loader();
        await highlighter.loadLanguage(langModule);
        loadedLanguages.add(resolvedLang);
      }
    }

    return highlighter.codeToHtml(code, {
      lang: resolvedLang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    });
  } catch {
    return null;
  }
}
