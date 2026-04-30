import { describe, expect, it } from 'vitest';
import { themeSlice, setTheme } from './theme-slice';

const { reducer } = themeSlice;

describe('Theme slice', () => {
    it("starts with 'dark' as the default theme", () => {
        expect(reducer(undefined, { type: '@@INIT' })).toBe('dark');
    });

    it("setTheme switches to 'light'", () => {
        expect(reducer('dark', setTheme('light'))).toBe('light');
    });

    it("setTheme switches back to 'dark'", () => {
        expect(reducer('light', setTheme('dark'))).toBe('dark');
    });
});
