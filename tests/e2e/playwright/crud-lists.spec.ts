import { test, expect } from '@playwright/test';
import { createListAndSelect, resetApp } from './helpers';

test.describe('Lists', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await resetApp(page);
    });

    test('Creating', async ({ page }) => {
        await createListAndSelect(page, 'New List');
        await expect(page.getByTestId('list-item')).toHaveCount(1);
        await expect(page.getByRole('heading', { name: /Tasks.*New List/ })).toBeVisible();
    });

    test('Editing', async ({ page }) => {
        await createListAndSelect(page, 'List for Editing');
        await expect(page.getByTestId('list-item')).toHaveCount(1);
        await expect(page.getByRole('heading', { name: /Tasks.*List for Editing/ })).toBeVisible();

        await page.getByTestId('lists-panel').getByRole('button', { name: /^Edit/ }).click();
        await page.getByPlaceholder('New List...').fill('Updated List for Editing');
        await page.getByTestId('lists-panel').getByRole('button', { name: 'Update' }).click();
        await expect(page.getByTestId('list-item-name')).toHaveText('Updated List for Editing');
    });

    test('Removing', async ({ page }) => {
        await createListAndSelect(page, 'List for Removing');
        await expect(page.getByTestId('list-item')).toHaveCount(1);
        await expect(page.getByRole('heading', { name: /Tasks.*List for Removing/ })).toBeVisible();

        await page
            .getByTestId('lists-panel')
            .getByRole('button', { name: /^Remove/ })
            .click();
        await expect(page.getByTestId('list-item')).toHaveCount(0);
        await expect(page.getByRole('heading', { name: /Tasks.*No list selected/ })).toBeVisible();
        await expect(page.getByTestId('task-item')).toHaveCount(0);
    });
});
