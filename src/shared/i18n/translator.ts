import enMessages from './locales/en.json';

// All locale catalog files share the same shape as the English catalog.
export type TranslationCatalog = typeof enMessages;

// Recursively derives every dot-separated path to a leaf string value.
// Adding a key to en.json automatically makes it a valid TranslationKey.
type DotPaths<T, P extends string = ''> = {
    [K in keyof T & string]: T[K] extends object
        ? DotPaths<T[K], P extends '' ? K : `${P}.${K}`>
        : P extends ''
          ? K
          : `${P}.${K}`;
}[keyof T & string];

export type TranslationKey = DotPaths<TranslationCatalog>;
export type Translator = (key: TranslationKey) => string;

// Traverse a nested catalog object using a dot-separated key path.
function getPath(catalog: TranslationCatalog, path: string): string | undefined {
    const parts = path.split('.');
    let node: unknown = catalog;
    for (const part of parts) {
        if (typeof node !== 'object' || node === null) return undefined;
        node = (node as Record<string, unknown>)[part];
    }
    return typeof node === 'string' ? node : undefined;
}

const missingKeys = new Set<string>();

export function createTranslator(catalog: TranslationCatalog): Translator {
    return function t(key: TranslationKey): string {
        // Fallback chain: active catalog → English → key string
        const value = getPath(catalog, key) ?? getPath(enMessages, key);
        if (value === undefined) {
            if (import.meta.env.DEV && !missingKeys.has(key)) {
                missingKeys.add(key);
                console.warn(`[i18n] Missing translation key: "${key}"`);
            }
            return key;
        }
        return value;
    };
}
