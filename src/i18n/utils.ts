import { isLang, type Lang } from '@/i18n/config';

export function switchLangPath(pathname: string, targetLang: Lang): string {
  if (!pathname || pathname === '/') {
    return `/${targetLang}/`;
  }

  const hasTrailingSlash = pathname.endsWith('/');
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length > 0 && isLang(pathSegments[0] ?? '')) {
    pathSegments[0] = targetLang;
  } else {
    pathSegments.unshift(targetLang);
  }

  const resolvedPath = `/${pathSegments.join('/')}`;
  return hasTrailingSlash ? `${resolvedPath}/` : `${resolvedPath}/`;
}
