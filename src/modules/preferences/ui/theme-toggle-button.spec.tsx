import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { I18nProvider } from '@/shared/i18n/i18n-context';
import { themeSlice } from '../store/theme-slice';
import { ThemeToggleButton } from './theme-toggle-button';
import type { Theme } from '@/types';

function renderButton(theme: Theme = 'dark') {
    const store = configureStore({
        reducer: { theme: themeSlice.reducer },
        preloadedState: { theme },
    });
    render(
        <Provider store={store}>
            <I18nProvider locale="en">
                <ThemeToggleButton />
            </I18nProvider>
        </Provider>
    );
    return store;
}

describe('ThemeToggleButton', () => {
    it('renders a button', () => {
        renderButton();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('labels the button as "switch to light" when dark theme is active', () => {
        renderButton('dark');
        expect(screen.getByRole('button')).toHaveAccessibleName('Switch to light theme');
    });

    it('labels the button as "switch to dark" when light theme is active', () => {
        renderButton('light');
        expect(screen.getByRole('button')).toHaveAccessibleName('Switch to dark theme');
    });

    it('switches to light when clicked in dark mode', () => {
        const store = renderButton('dark');
        fireEvent.click(screen.getByRole('button'));
        expect(store.getState().theme).toBe('light');
    });

    it('switches to dark when clicked in light mode', () => {
        const store = renderButton('light');
        fireEvent.click(screen.getByRole('button'));
        expect(store.getState().theme).toBe('dark');
    });
});
