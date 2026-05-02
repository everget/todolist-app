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

function makeLocaleDescriptor<F extends string>(title: string, code: Locale, flag: F) {
    return {
        title,
        code,
        flagSrc: `./flags/${flag}.svg`,
        flagKey: `flags.${flag}` as `flags.${F}`,
    };
}

export const LOCALES = {
    en: makeLocaleDescriptor('English', 'en', 'en'),
    'pt-br': makeLocaleDescriptor('Português', 'pt-br', 'br'),
    es: makeLocaleDescriptor('Español', 'es', 'es'),
    ua: makeLocaleDescriptor('Українська', 'ua', 'ua'),
    ru: makeLocaleDescriptor('Русский', 'ru', 'ru'),
} satisfies Record<
    Locale,
    { title: string; code: Locale; flagSrc: string; flagKey: `flags.${string}` }
>;

export type LocaleDescriptor = (typeof LOCALES)[Locale];
export type FlagKey = LocaleDescriptor['flagKey'];

export const SUPPORTED_LOCALES = Object.keys(LOCALES) as Locale[];

export function detectLocaleFromBrowserLanguage(
    browserLanguage: string,
    fallback: Locale = 'en'
): Locale {
    const primaryTag = browserLanguage.toLowerCase().split('-')[0];
    return BROWSER_LANG_TO_LOCALE[primaryTag] ?? fallback;
}
