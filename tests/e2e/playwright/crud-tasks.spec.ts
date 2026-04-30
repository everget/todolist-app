import { test, expect } from '@playwright/test';
import {
    createListAndSelect,
    createTask,
    getFilterButton,
    resetApp,
    verifyTaskCheckboxes,
} from './helpers';

test.describe('Tasks', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await resetApp(page);
    });

    test('Creating', async ({ page }) => {
        await createListAndSelect(page, 'Daily Tasks');

        await createTask(page, 'Buy groceries');
        await expect(page.getByTestId('task-text')).toHaveText('Buy groceries');
        await expect(page.getByTestId('task-priority')).toHaveText('Priority: None');
    });

    test('Creating with various priorities', async ({ page }) => {
        await createListAndSelect(page, 'Daily Tasks');

        await createTask(page, 'Task 1', 'none');
        await createTask(page, 'Task 2', 'high');
        await createTask(page, 'Task 3', 'medium');
        await createTask(page, 'Task 4', 'low');
        await expect(page.getByTestId('task-text')).toHaveText([
            'Task 1',
            'Task 2',
            'Task 3',
            'Task 4',
        ]);
        await expect(page.getByTestId('task-priority')).toHaveText([
            'Priority: None',
            'Priority: High',
            'Priority: Medium',
            'Priority: Low',
        ]);
    });

    test('Editing', async ({ page }) => {
        await createListAndSelect(page, 'Daily Tasks');

        await createTask(page, 'Buy groceries');
        await expect(page.getByTestId('task-text')).toHaveText('Buy groceries');

        await page.getByTestId('tasks-panel').getByRole('button', { name: /^Edit/ }).click();
        await page.getByPlaceholder('New Task...').fill('Buy organic groceries');
        await page.getByTestId('tasks-panel').getByRole('button', { name: 'Update' }).click();
        await expect(page.getByTestId('task-text')).toHaveText('Buy organic groceries');
    });

    test('Removing', async ({ page }) => {
        await createListAndSelect(page, 'Daily Tasks');

        await createTask(page, 'Buy groceries');
        await expect(page.getByTestId('task-text')).toHaveText('Buy groceries');

        await page
            .getByTestId('tasks-panel')
            .getByRole('button', { name: /^Remove/ })
            .click();
        await expect(page.getByTestId('task-item')).toHaveCount(0);
    });

    test('Display all/active/completed task counts', async ({ page }) => {
        await createListAndSelect(page, 'Counting Tasks', ['Task 1', 'Task 2', 'Task 3']);

        await expect(getFilterButton(page, /^All/)).toHaveText('All (3)');
        await expect(getFilterButton(page, /^Active/)).toHaveText('Active (3)');
        await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (0)');

        await page
            .getByTestId('task-item')
            .filter({ hasText: 'Task 1' })
            .getByRole('checkbox')
            .click();

        await expect(getFilterButton(page, /^All/)).toHaveText('All (3)');
        await expect(getFilterButton(page, /^Active/)).toHaveText('Active (2)');
        await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (1)');
    });

    test('Toggle all tasks as completed', async ({ page }) => {
        await createListAndSelect(page, 'Bulk Complete Tasks', ['Task 1', 'Task 2', 'Task 3']);

        await page.getByRole('checkbox', { name: 'Complete all' }).click();

        await expect(getFilterButton(page, /^All/)).toHaveText('All (3)');
        await expect(getFilterButton(page, /^Active/)).toHaveText('Active (0)');
        await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (3)');

        await verifyTaskCheckboxes(page, true);
    });

    test('Toggle all tasks as active', async ({ page }) => {
        await createListAndSelect(page, 'Bulk Incomplete Tasks', ['Task 1', 'Task 2', 'Task 3']);

        await page.getByRole('checkbox', { name: 'Complete all' }).click();
        await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (3)');
        await page.getByRole('checkbox', { name: 'Complete all' }).click();

        await expect(getFilterButton(page, /^All/)).toHaveText('All (3)');
        await expect(getFilterButton(page, /^Active/)).toHaveText('Active (3)');
        await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (0)');

        await verifyTaskCheckboxes(page, false);
    });

    test('Mark all tasks as completed', async ({ page }) => {
        await createListAndSelect(page, 'Bulk Complete Tasks', ['Task 1', 'Task 2', 'Task 3']);

        await page.getByRole('button', { name: 'Complete all' }).click();

        await expect(getFilterButton(page, /^All/)).toHaveText('All (3)');
        await expect(getFilterButton(page, /^Active/)).toHaveText('Active (0)');
        await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (3)');

        await verifyTaskCheckboxes(page, true);
    });

    test('Clear completed tasks', async ({ page }) => {
        await createListAndSelect(page, 'Clear Completed Tasks', ['Task 1', 'Task 2', 'Task 3']);

        await expect(getFilterButton(page, /^All/)).toHaveText('All (3)');
        await expect(getFilterButton(page, /^Active/)).toHaveText('Active (3)');
        await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (0)');

        await page
            .getByTestId('task-item')
            .filter({ hasText: 'Task 1' })
            .getByRole('checkbox')
            .click();
        await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (1)');

        await page
            .getByTestId('tasks-panel')
            .getByRole('button', { name: 'Clear completed', exact: true })
            .click();

        await expect(getFilterButton(page, /^All/)).toHaveText('All (2)');
        await expect(getFilterButton(page, /^Active/)).toHaveText('Active (2)');
        await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (0)');
    });
});
