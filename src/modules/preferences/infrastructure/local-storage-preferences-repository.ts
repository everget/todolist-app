import { z } from 'zod';
import { config } from '@/config/config';
import type { Preferences } from '@/types';
import type { PreferencesRepository } from '@/modules/preferences/domain/preferences-repository';
import { isPlainObject } from '@/shared/utils/is-plain-object';
import { detectLocaleFromBrowserLanguage } from '@/shared/i18n/locales';

// Zod schema for the persisted preferences shape.
// Using .catch() on each field means a corrupt / outdated value gracefully falls back
// to the application default rather than throwing.
const preferencesSchema = z.object({
    theme: z.enum(config.preferences.validThemes).catch(config.preferences.defaults.theme),
    locale: z.enum(config.preferences.validLocales).catch(config.preferences.defaults.locale),
    filters: z
        .object({
            status: z
                .enum(config.preferences.validFilterStatuses)
                .catch(config.preferences.defaults.filters.status),
            priority: z
                .enum(config.preferences.validFilterPriorities)
                .catch(config.preferences.defaults.filters.priority),
        })
        .catch(config.preferences.defaults.filters),
});

export class LocalStoragePreferencesRepository implements PreferencesRepository {
    constructor() {}

    load(): Preferences {
        try {
            const raw = localStorage.getItem(config.storage.preferencesKey);
            if (!raw) {
                // No preferences saved yet - use browser language as the initial locale
                // so first-time users see the UI in their own language automatically.
                return {
                    ...config.preferences.defaults,
                    locale: detectLocaleFromBrowserLanguage(navigator.language),
                };
            }

            const parsed: unknown = JSON.parse(raw);
            if (!isPlainObject(parsed)) return config.preferences.defaults;

            return preferencesSchema.parse(parsed);
        } catch {
            return config.preferences.defaults;
        }
    }

    save(prefs: Preferences): void {
        try {
            localStorage.setItem(config.storage.preferencesKey, JSON.stringify(prefs));
        } catch {
            // Ignore storage quota errors.
        }
    }
}
