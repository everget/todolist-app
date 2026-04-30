import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { I18nProvider } from '@/shared/i18n/i18n-context';
import { localeSlice } from '../store/locale-slice';
import { LocaleSelectorDropdown } from './locale-selector-dropdown';
import type { Locale } from '@/types';

function renderDropdown(locale: Locale = 'en') {
    const store = configureStore({
        reducer: { locale: localeSlice.reducer },
        preloadedState: { locale },
    });
    render(
        <Provider store={store}>
            <I18nProvider locale="en">
                <LocaleSelectorDropdown />
            </I18nProvider>
        </Provider>
    );
    return store;
}

describe('LocaleSelectorDropdown', () => {
    it('renders the trigger button', () => {
        renderDropdown();
        expect(screen.getByTestId('locale-selector')).toBeInTheDocument();
    });

    it('shows the current locale code on the trigger', () => {
        renderDropdown('es');
        expect(screen.getByTestId('locale-selector')).toHaveTextContent('ES');
    });

    it('opens the locale list on trigger click', () => {
        renderDropdown();
        expect(screen.queryByTestId('locale-en')).not.toBeInTheDocument();
        fireEvent.click(screen.getByTestId('locale-selector'));
        expect(screen.getByTestId('locale-en')).toBeInTheDocument();
    });

    it('closes the locale list on a second trigger click', () => {
        renderDropdown();
        fireEvent.click(screen.getByTestId('locale-selector'));
        fireEvent.click(screen.getByTestId('locale-selector'));
        expect(screen.queryByTestId('locale-en')).not.toBeInTheDocument();
    });

    it('closes the locale list on Escape', () => {
        renderDropdown();
        fireEvent.click(screen.getByTestId('locale-selector'));
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByTestId('locale-en')).not.toBeInTheDocument();
    });

    it('closes the locale list on an outside click', () => {
        renderDropdown();
        fireEvent.click(screen.getByTestId('locale-selector'));
        fireEvent.mouseDown(document.body);
        expect(screen.queryByTestId('locale-en')).not.toBeInTheDocument();
    });

    it('renders all five locale options when open', () => {
        renderDropdown();
        fireEvent.click(screen.getByTestId('locale-selector'));
        for (const code of ['en', 'es', 'pt-br', 'ua', 'ru']) {
            expect(screen.getByTestId(`locale-${code}`)).toBeInTheDocument();
        }
    });

    it('updates the store and closes the list when a locale is selected', () => {
        const store = renderDropdown();
        fireEvent.click(screen.getByTestId('locale-selector'));
        fireEvent.click(screen.getByTestId('locale-es'));
        expect(store.getState().locale).toBe('es');
        expect(screen.queryByTestId('locale-es')).not.toBeInTheDocument();
    });
});
