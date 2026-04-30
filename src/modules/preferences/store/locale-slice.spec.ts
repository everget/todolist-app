import { describe, expect, it } from 'vitest';
import { localeSlice, setLocale } from './locale-slice';

const { reducer } = localeSlice;

describe('Locale slice', () => {
    it("starts with 'en' as the default locale", () => {
        expect(reducer(undefined, { type: '@@INIT' })).toBe('en');
    });

    it('setLocale updates the locale', () => {
        expect(reducer('en', setLocale('es'))).toBe('es');
    });

    it('setLocale replaces the previous value', () => {
        let state = reducer('en', setLocale('ru'));
        state = reducer(state, setLocale('pt-br'));
        expect(state).toBe('pt-br');
    });

    it('setLocale to the same locale is a no-op', () => {
        expect(reducer('ua', setLocale('ua'))).toBe('ua');
    });
});
