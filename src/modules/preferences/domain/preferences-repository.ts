import type { Preferences } from '@/types';

export interface PreferencesRepository {
    load(): Preferences;
    save(prefs: Preferences): void;
}
