import { type Locale } from '@/types';

// Maps app locale codes to BCP-47 locale strings for use with Intl APIs (e.g. Intl.DateTimeFormat).
export const LOCALE_BCP47: Record<Locale, string> = {
    en: 'en-GB',
    'pt-br': 'pt-BR',
    es: 'es-ES',
    ua: 'uk-UA',
    ru: 'ru-RU',
};

// Maps BCP-47 primary language subtags reported by browsers to app locale codes.
// Browsers report Ukrainian as 'uk'/'uk-UA', not 'ua' - hence the explicit entry.
export const BROWSER_LANG_TO_LOCALE: Record<string, Locale> = {
    en: 'en',
    pt: 'pt-br',
    es: 'es',
    uk: 'ua',
    ru: 'ru',
};

export interface LocaleDescriptor {
    title: string;
    code: Locale;
    flagSrc: string;
    flagKey: 'flags.en' | 'flags.br' | 'flags.es' | 'flags.ua' | 'flags.ru';
}

// Vite dev server serves public/ at the root, so /en.svg resolves correctly.
// When deployed directly from the repo root (e.g. GitHub Pages), public/ files
// stay at their real path, so the prefix must be 'public/'.
const flagBase = import.meta.env.DEV ? '/' : 'public/';

export const LOCALES: Record<Locale, LocaleDescriptor> = {
    en: { title: 'English', code: 'en', flagSrc: `${flagBase}en.svg`, flagKey: 'flags.en' },
    'pt-br': { title: 'Português', code: 'pt-br', flagSrc: `${flagBase}br.svg`, flagKey: 'flags.br' },
    es: { title: 'Español', code: 'es', flagSrc: `${flagBase}es.svg`, flagKey: 'flags.es' },
    ua: { title: 'Українська', code: 'ua', flagSrc: `${flagBase}ua.svg`, flagKey: 'flags.ua' },
    ru: { title: 'Русский', code: 'ru', flagSrc: `${flagBase}ru.svg`, flagKey: 'flags.ru' },
};

export const SUPPORTED_LOCALES = Object.keys(LOCALES) as Locale[];

export function detectLocaleFromBrowserLanguage(
    browserLanguage: string,
    fallback: Locale = 'en'
): Locale {
    const primaryTag = browserLanguage.toLowerCase().split('-')[0];
    return BROWSER_LANG_TO_LOCALE[primaryTag] ?? fallback;
}
