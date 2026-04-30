import { test, expect } from '@playwright/test';
import { getFilterButton, resetApp, selectLocale } from './helpers';

test.describe('Locale', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await resetApp(page);
    });

    test('English', async ({ page }) => {
        await expect(
            page.getByTestId('lists-panel').getByRole('button', { name: 'Add' })
        ).toBeVisible();
        await expect(
            page.getByTestId('tasks-panel').getByRole('button', { name: 'Add' })
        ).toBeVisible();
        await expect(getFilterButton(page, /^All/)).toHaveText('All (0)');
        await expect(getFilterButton(page, /^Active/)).toHaveText('Active (0)');
        await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (0)');
    });

    test('Spanish', async ({ page }) => {
        await selectLocale(page, 'es');
        await expect(
            page.getByTestId('lists-panel').getByRole('button', { name: 'Añadir' })
        ).toBeVisible();
        await expect(
            page.getByTestId('tasks-panel').getByRole('button', { name: 'Añadir' })
        ).toBeVisible();
        await expect(getFilterButton(page, /^Todas/)).toHaveText('Todas (0)');
        await expect(getFilterButton(page, /^Activas/)).toHaveText('Activas (0)');
        await expect(getFilterButton(page, /^Completadas/)).toHaveText('Completadas (0)');
    });

    test('Brazilian Portuguese', async ({ page }) => {
        await selectLocale(page, 'pt-br');
        await expect(
            page.getByTestId('lists-panel').getByRole('button', { name: 'Adicionar' })
        ).toBeVisible();
        await expect(
            page.getByTestId('tasks-panel').getByRole('button', { name: 'Adicionar' })
        ).toBeVisible();
        await expect(getFilterButton(page, /^Todas/)).toHaveText('Todas (0)');
        await expect(getFilterButton(page, /^Ativas/)).toHaveText('Ativas (0)');
        await expect(getFilterButton(page, /^Concluídas/)).toHaveText('Concluídas (0)');
    });

    test('Russian', async ({ page }) => {
        await selectLocale(page, 'ru');
        await expect(
            page.getByTestId('lists-panel').getByRole('button', { name: 'Добавить' })
        ).toBeVisible();
        await expect(
            page.getByTestId('tasks-panel').getByRole('button', { name: 'Добавить' })
        ).toBeVisible();
        await expect(getFilterButton(page, /^Все/)).toHaveText('Все (0)');
        await expect(getFilterButton(page, /^Активные/)).toHaveText('Активные (0)');
        await expect(getFilterButton(page, /^Завершенные/)).toHaveText('Завершенные (0)');
    });

    test('Ukrainian', async ({ page }) => {
        await selectLocale(page, 'ua');
        await expect(
            page.getByTestId('lists-panel').getByRole('button', { name: 'Додати' })
        ).toBeVisible();
        await expect(
            page.getByTestId('tasks-panel').getByRole('button', { name: 'Додати' })
        ).toBeVisible();
        await expect(getFilterButton(page, /^Всі/)).toHaveText('Всі (0)');
        await expect(getFilterButton(page, /^Активні/)).toHaveText('Активні (0)');
        await expect(getFilterButton(page, /^Завершені/)).toHaveText('Завершені (0)');
    });

    test('Switching between locales', async ({ page }) => {
        await selectLocale(page, 'es');

        await expect(
            page.getByTestId('lists-panel').getByRole('button', { name: 'Añadir' })
        ).toBeVisible();
        await expect(
            page.getByTestId('tasks-panel').getByRole('button', { name: 'Añadir' })
        ).toBeVisible();
        await expect(getFilterButton(page, /^Todas/)).toHaveText('Todas (0)');
        await expect(getFilterButton(page, /^Completadas/)).toHaveText('Completadas (0)');
        await expect(getFilterButton(page, /^Activas/)).toHaveText('Activas (0)');

        await selectLocale(page, 'en');

        await expect(getFilterButton(page, /^All/)).toHaveText('All (0)');
        await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (0)');
        await expect(getFilterButton(page, /^Active/)).toHaveText('Active (0)');
        await expect(
            page.getByTestId('lists-panel').getByRole('button', { name: 'Add' })
        ).toBeVisible();
        await expect(
            page.getByTestId('tasks-panel').getByRole('button', { name: 'Add' })
        ).toBeVisible();
    });

    test('Maintains language preference across page reloads', async ({ page }) => {
        await selectLocale(page, 'es');
        await page.reload();
        await page.waitForSelector('[data-testid="lists-panel"]');

        await expect(
            page.getByTestId('lists-panel').getByRole('button', { name: 'Añadir' })
        ).toBeVisible();
        await expect(
            page.getByTestId('tasks-panel').getByRole('button', { name: 'Añadir' })
        ).toBeVisible();
        await expect(getFilterButton(page, /^Todas/)).toHaveText('Todas (0)');
        await expect(getFilterButton(page, /^Activas/)).toHaveText('Activas (0)');
        await expect(getFilterButton(page, /^Completadas/)).toHaveText('Completadas (0)');
    });
});
