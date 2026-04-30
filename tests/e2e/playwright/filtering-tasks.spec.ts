import { test, expect } from '@playwright/test';
import { createListAndSelect, createTask, getFilterButton, resetApp } from './helpers';

test.describe('Filtering tasks', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await resetApp(page);
    });

    test('Filter tasks by completion status', async ({ page }) => {
        await createListAndSelect(page, 'Project Tasks');

        await createTask(page, 'Task 1');
        await createTask(page, 'Task 2');
        const checkbox = page.getByTestId('task-item').nth(0).getByRole('checkbox');
        await checkbox.click();
        await expect(checkbox).toBeChecked();

        await getFilterButton(page, /^All/).click();
        await expect(page.getByTestId('task-text')).toContainText(['Task 1', 'Task 2']);

        await getFilterButton(page, /^Active/).click();
        await expect(page.getByTestId('task-text')).toContainText('Task 2');

        await getFilterButton(page, /^Completed/).click();
        await expect(page.getByTestId('task-text')).toContainText('Task 1');

        await getFilterButton(page, /^All/).click();
        await expect(page.getByTestId('task-text')).toContainText(['Task 1', 'Task 2']);
    });
});
