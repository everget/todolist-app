import { test, expect } from '@playwright/test';
import { getFilterButton, resetApp } from './helpers';

test.describe('Initial View', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await resetApp(page);
    });

    test('Page has title', async ({ page }) => {
        await expect(page).toHaveTitle('TodoList App');
    });

    test.describe('Lists component', () => {
        test('Default title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Lists' })).toBeVisible();
        });

        test('Default placeholder of the input', async ({ page }) => {
            await expect(page.getByPlaceholder('New List...')).toBeVisible();
        });

        test('Default text of the Add button', async ({ page }) => {
            await expect(
                page.getByTestId('lists-panel').getByRole('button', { name: 'Add' })
            ).toBeVisible();
        });

        test("Doesn't contain any lists by default", async ({ page }) => {
            await expect(page.getByTestId('list-item')).toHaveCount(0);
        });
    });

    test.describe('Tasks component', () => {
        test('Default title', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: /Tasks.*No list selected/ })
            ).toBeVisible();
        });

        test('Default placeholder of the input', async ({ page }) => {
            await expect(page.getByPlaceholder('New Task...')).toBeVisible();
        });

        test('Default text of the Add button', async ({ page }) => {
            await expect(
                page.getByTestId('tasks-panel').getByRole('button', { name: 'Add' })
            ).toBeVisible();
        });

        test('Default filter option names', async ({ page }) => {
            await expect(getFilterButton(page, /^All/)).toHaveText('All (0)');
            await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (0)');
            await expect(getFilterButton(page, /^Active/)).toHaveText('Active (0)');
        });

        test("Doesn't contain any tasks by default", async ({ page }) => {
            await expect(page.getByTestId('task-item')).toHaveCount(0);
        });
    });
});
