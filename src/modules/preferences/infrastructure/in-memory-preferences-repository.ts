import { config } from '@/config/config';
import type { Preferences } from '@/types';
import type { PreferencesRepository } from '@/modules/preferences/domain/preferences-repository';

export class InMemoryPreferencesRepository implements PreferencesRepository {
    #prefs: Preferences = config.preferences.defaults;

    load(): Preferences {
        return { ...this.#prefs, filters: { ...this.#prefs.filters } };
    }

    save(prefs: Preferences): void {
        this.#prefs = { ...prefs, filters: { ...prefs.filters } };
    }
}
