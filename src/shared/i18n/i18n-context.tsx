import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { createTranslator, type Translator, type TranslationCatalog } from './translator';
import type { Locale } from '@/types';
import enMessages from './locales/en.json';

type TranslationCatalogPromise = Promise<{ default: TranslationCatalog }>;

// en.json is statically imported - it stays in the main bundle and serves as
// the initial catalog and the fallback for all other locales.
// The remaining locales use explicit dynamic imports so Vite/Rollup can emit
// each one as a separate chunk. The chunk is fetched once on the first locale
// switch and then served from the browser cache.
const localeLoaders: Record<Exclude<Locale, 'en'>, () => TranslationCatalogPromise> = {
    'pt-br': () => import('./locales/pt-br.json') as TranslationCatalogPromise,
    es: () => import('./locales/es.json') as TranslationCatalogPromise,
    ua: () => import('./locales/ua.json') as TranslationCatalogPromise,
    ru: () => import('./locales/ru.json') as TranslationCatalogPromise,
};

const I18nContext = createContext<Translator | null>(null);

export function I18nProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
    const [catalog, setCatalog] = useState<TranslationCatalog>(enMessages);

    useEffect(() => {
        if (locale === 'en') {
            setCatalog(enMessages);
            return;
        }
        // Load the locale chunk; keep the current catalog until it arrives so
        // there is no flash of untranslated content during the fetch.
        void localeLoaders[locale]().then((m) => setCatalog(m.default));
    }, [locale]);

    const t = useMemo(() => createTranslator(catalog), [catalog]);

    return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>;
}

// A version of I18nProvider that automatically connects to the Redux store
// to retrieve the current locale. Use this in the main app entry point.
export function ConnectedI18nProvider({ children }: { children: ReactNode }) {
    const locale = useAppSelector((state) => state.locale);
    return <I18nProvider locale={locale}>{children}</I18nProvider>;
}

export function useT(): Translator {
    const t = useContext(I18nContext);
    if (!t) throw new Error('useT() must be called inside <I18nProvider>');
    return t;
}
