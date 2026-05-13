import ja from './ja.json';
import zh from './zh.json';
import en from './en.json';
import zhHant from './zh-Hant.json';
import ko from './ko.json';
import th from './th.json';
import hi from './hi.json';
import fr from './fr.json';
import de from './de.json';
import es from './es.json';

export type Lang =
  | 'ja' | 'zh' | 'en'
  | 'zh-Hant' | 'ko' | 'th' | 'hi' | 'fr' | 'de' | 'es';

const dictionaries: Record<Lang, Record<string, string>> = {
  ja, zh, en,
  'zh-Hant': zhHant, ko, th, hi, fr, de, es,
};

// Astro injects BASE_URL like "/fuji-garden/" (with trailing slash) or "/" if no base.
// Normalize to no trailing slash for predictable concatenation.
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export function withBase(path: string): string {
  if (!path) return BASE + '/';
  if (/^([a-z]+:)?\/\//i.test(path)) return path;
  if (!path.startsWith('/')) path = '/' + path;
  return BASE + path;
}

function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) {
    const rest = pathname.slice(BASE.length);
    return rest.startsWith('/') ? rest : '/' + rest;
  }
  return pathname;
}

const NON_DEFAULT_PREFIXES = ['zh-Hant', 'zh', 'en', 'ko', 'th', 'hi', 'fr', 'de', 'es'] as const;
const PREFIX_STRIP_RE = /^\/(zh-Hant|zh|en|ko|th|hi|fr|de|es)(\/|$)/;

export function getLangFromPath(pathname: string): Lang {
  const p = stripBase(pathname);
  // Order matters: zh-Hant must be checked before zh
  for (const prefix of NON_DEFAULT_PREFIXES) {
    if (p === `/${prefix}` || p.startsWith(`/${prefix}/`)) return prefix as Lang;
  }
  return 'ja';
}

export function useT(lang: Lang) {
  return (key: string): string => {
    return dictionaries[lang]?.[key] ?? dictionaries.ja[key] ?? key;
  };
}

export function localizedPath(path: string, lang: Lang): string {
  const stripped = stripBase(path).replace(PREFIX_STRIP_RE, '/');
  const localized = lang === 'ja'
    ? stripped
    : `/${lang}${stripped === '/' ? '/' : stripped}`;
  return withBase(localized);
}

export const LANGS: { code: Lang; label: string; native: string; htmlLang: string }[] = [
  { code: 'ja',      label: 'Japanese',              native: '日本語',     htmlLang: 'ja' },
  { code: 'en',      label: 'English',               native: 'English',    htmlLang: 'en' },
  { code: 'zh',      label: 'Chinese (Simplified)',  native: '简体中文',   htmlLang: 'zh-Hans' },
  { code: 'zh-Hant', label: 'Chinese (Traditional)', native: '繁體中文',   htmlLang: 'zh-Hant' },
  { code: 'ko',      label: 'Korean',                native: '한국어',     htmlLang: 'ko' },
  { code: 'th',      label: 'Thai',                  native: 'ไทย',        htmlLang: 'th' },
  { code: 'hi',      label: 'Hindi',                 native: 'हिन्दी',       htmlLang: 'hi' },
  { code: 'fr',      label: 'French',                native: 'Français',   htmlLang: 'fr' },
  { code: 'de',      label: 'German',                native: 'Deutsch',    htmlLang: 'de' },
  { code: 'es',      label: 'Spanish',               native: 'Español',    htmlLang: 'es' },
];

// Subset of pages mirrored across all 10 locales (rest stays 3-lang)
export const TEN_LANG_PATHS = ['/', '/booking/'] as const;

// Beds24 integration constants for VILLA VIEW
export const BEDS24_PROPERTY_ID = 322452;
export const BEDS24_ROOM_ID = 674526;
export const API_PROXY_BASE = 'https://smartinn-api-proxy.leoroy225.workers.dev';

export function htmlLangFor(lang: Lang): string {
  return LANGS.find(l => l.code === lang)?.htmlLang ?? lang;
}
