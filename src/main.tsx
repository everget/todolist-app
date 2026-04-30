import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './app';
import { store } from './store/store';
import { bootstrapApp } from './store/app-slice';
import { ConnectedI18nProvider } from '@/shared/i18n/i18n-context';

import './index.css';

const rootEl = document.getElementById('app');
if (!rootEl) {
    throw new Error('Root element #app not found');
}

createRoot(rootEl).render(
    <StrictMode>
        <Provider store={store}>
            <ConnectedI18nProvider>
                <App />
            </ConnectedI18nProvider>
        </Provider>
    </StrictMode>
);

void store.dispatch(bootstrapApp());
