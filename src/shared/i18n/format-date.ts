import { LOCALE_BCP47 } from '@/shared/i18n/locales';
import { Locale } from '@/types';

const FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
};

// Cache one `Intl.DateTimeFormat` instance per BCP-47 locale; construction is expensive.
const formatterCache = new Map<string, Intl.DateTimeFormat>();

export function formatDate(date: Date, locale: Locale = 'en'): string {
    const bcp47 = LOCALE_BCP47[locale];
    if (!formatterCache.has(bcp47)) {
        formatterCache.set(bcp47, new Intl.DateTimeFormat(bcp47, FORMAT_OPTIONS));
    }
    return formatterCache.get(bcp47)!.format(date);
}
