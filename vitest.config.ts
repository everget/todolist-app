import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const scriptExtensions = '{,m,c}{j,t}s{,x}';

// https://vitest.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        maxWorkers: process.env.CI ? 2 : '75%',
        setupFiles: ['./tests/unit/setup.ts'],
        include: [
            `src/**/*.{test,spec}.${scriptExtensions}`,
            `tests/unit/**/*.{test,spec}.${scriptExtensions}`,
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
});
