import { createHighlighterCore, type HighlighterCore, type LanguageRegistration } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

export type HighlightLanguage = 'ts' | 'js' | 'sql' | 'json' | 'bash' | 'html';

const loadedLanguages = new Set<HighlightLanguage>();

const languageLoaders: Record<HighlightLanguage, () => Promise<{ default: LanguageRegistration[] }>> = {
  ts: () => import('shiki/langs/typescript.mjs'),
  js: () => import('shiki/langs/javascript.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  html: () => import('shiki/langs/html.mjs'),
};

let highlighterPromise: Promise<HighlighterCore> | null = null;

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [lightTheme, darkTheme] = await Promise.all([
        import('shiki/themes/github-light.mjs'),
        import('shiki/themes/github-dark.mjs'),
      ]);

      return createHighlighterCore({
        themes: [lightTheme, darkTheme],
        engine: createJavaScriptRegexEngine(),
      });
    })();
  }
  return highlighterPromise;
}

export async function highlightCode(code: string, language: HighlightLanguage): Promise<string> {
  const highlighter = await getHighlighter();

  if (!loadedLanguages.has(language)) {
    const loader = languageLoaders[language];
    if (loader) {
      const langModule = await loader();
      await highlighter.loadLanguage(langModule);
      loadedLanguages.add(language);
    }
  }

  return highlighter.codeToHtml(code, {
    lang: language,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: false,
  });
}
