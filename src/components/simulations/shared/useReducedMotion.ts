import * as React from 'react';

const mediaQuery = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(mediaQuery).matches;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(mediaQuery);
    setPrefersReducedMotion(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
