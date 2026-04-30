import { test, expect } from '@playwright/test';
import {
    createList,
    createListAndSelect,
    createTask,
    getFilterButton,
    resetApp,
    selectList,
} from './helpers';

test.describe('Data integrity', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await resetApp(page);
    });

    test.describe('Persistence across page reload', () => {
        test('lists and tasks survive a reload', async ({ page }) => {
            await createListAndSelect(page, 'Persistent List');
            await createTask(page, 'Remember me');
            await expect(page.getByTestId('task-text')).toHaveText('Remember me');

            await page.reload();
            await page.waitForSelector('[data-testid="lists-panel"]', {});

            await expect(page.getByTestId('list-item')).toHaveCount(1);
            await expect(page.getByTestId('list-item-name')).toHaveText('Persistent List');
            await expect(page.getByTestId('task-item')).toHaveCount(1);
            await expect(page.getByTestId('task-text')).toHaveText('Remember me');
        });

        test('completed task state persists across reload', async ({ page }) => {
            await createListAndSelect(page, 'Completion Test');
            await createTask(page, 'Complete me');
            await expect(page.getByTestId('task-text')).toHaveText('Complete me');

            await page.getByTestId('task-item').getByRole('checkbox').click();
            await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (1)');

            await page.reload();
            await page.waitForSelector('[data-testid="lists-panel"]', {});

            await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (1)');
            await expect(getFilterButton(page, /^Active/)).toHaveText('Active (0)');
            await expect(page.getByTestId('task-item').getByRole('checkbox')).toBeChecked();
        });

        test('multiple lists persist after reload', async ({ page }) => {
            await createListAndSelect(page, 'Alpha');
            await createTask(page, 'Alpha task');

            await createList(page, 'Beta');
            await createTask(page, 'Beta task');

            await page.reload();
            await page.waitForSelector('[data-testid="lists-panel"]', {});

            await expect(page.getByTestId('list-item')).toHaveCount(2);
        });

        test('edited list name persists across reload', async ({ page }) => {
            await createListAndSelect(page, 'Old Name');
            await page.getByTestId('lists-panel').getByRole('button', { name: 'Edit' }).click();
            await page.getByPlaceholder('New List...').fill('New Name');
            await page.getByTestId('lists-panel').getByRole('button', { name: 'Update' }).click();
            await expect(page.getByTestId('list-item-name')).toHaveText('New Name');

            await page.reload();
            await page.waitForSelector('[data-testid="lists-panel"]', {});

            await expect(page.getByTestId('list-item-name')).toHaveText('New Name');
        });
    });

    test.describe('Multiple lists', () => {
        test('tasks are isolated to their list', async ({ page }) => {
            await createListAndSelect(page, 'Work');
            await createTask(page, 'Finish report');

            await createList(page, 'Personal');
            await createTask(page, 'Buy groceries');

            await selectList(page, 'Work');
            await expect(page.getByTestId('task-item')).toHaveCount(1);
            await expect(page.getByTestId('task-text')).toHaveText('Finish report');

            await selectList(page, 'Personal');
            await expect(page.getByTestId('task-item')).toHaveCount(1);
            await expect(page.getByTestId('task-text')).toHaveText('Buy groceries');
        });

        test('tasks panel heading updates when switching lists', async ({ page }) => {
            await createListAndSelect(page, 'List A');
            await createTask(page, 'Task for A');

            await createList(page, 'List B');

            await expect(page.getByRole('heading', { name: /Tasks.*List B/ })).toBeVisible();
            await expect(page.getByTestId('task-item')).toHaveCount(0);

            await selectList(page, 'List A');
            await expect(page.getByRole('heading', { name: /Tasks.*List A/ })).toBeVisible();
            await expect(page.getByTestId('task-item')).toHaveCount(1);
        });

        test('deleting a list removes its tasks but leaves other lists intact', async ({
            page,
        }) => {
            await createListAndSelect(page, 'Work');
            await createTask(page, 'Work task 1');
            await createTask(page, 'Work task 2');

            await createList(page, 'Home');
            await createTask(page, 'Home task');

            await expect(page.getByTestId('list-item')).toHaveCount(2);

            // Remove Work list via its own Remove button
            await page
                .getByTestId('list-item')
                .filter({ hasText: 'Work' })
                .getByRole('button', { name: 'Remove' })
                .click();

            await expect(page.getByTestId('list-item')).toHaveCount(1);
            await expect(page.getByTestId('list-item-name')).toHaveText('Home');

            await selectList(page, 'Home');
            await expect(page.getByTestId('task-item')).toHaveCount(1);
            await expect(page.getByTestId('task-text')).toHaveText('Home task');
        });

        test('removing the last list shows "No list selected"', async ({ page }) => {
            await createListAndSelect(page, 'Solo List');
            await createTask(page, 'A task');

            await page.getByTestId('lists-panel').getByRole('button', { name: 'Remove' }).click();

            await expect(
                page.getByRole('heading', { name: /Tasks.*No list selected/ })
            ).toBeVisible();
            await expect(page.getByTestId('list-item')).toHaveCount(0);
            await expect(page.getByTestId('task-item')).toHaveCount(0);
        });
    });

    test.describe('Filter edge cases', () => {
        test('active filter hides tasks completed in real time', async ({ page }) => {
            await createListAndSelect(page, 'Filter Test');
            await createTask(page, 'Task 1');
            await createTask(page, 'Task 2');

            await getFilterButton(page, /^Active/).click();
            await expect(page.getByTestId('task-item')).toHaveCount(2);

            await page.getByTestId('task-item').nth(0).getByRole('checkbox').click();

            // Completed task should disappear from the "Active" view
            await expect(page.getByTestId('task-item')).toHaveCount(1);
            await expect(page.getByTestId('task-text')).toHaveText('Task 2');
        });

        test('completed filter shows tasks in reverse: active ones hidden', async ({ page }) => {
            await createListAndSelect(page, 'Filter Test');
            await createTask(page, 'Task A');
            await createTask(page, 'Task B');

            await page.getByTestId('task-item').nth(0).getByRole('checkbox').click();
            await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (1)');

            await getFilterButton(page, /^Completed/).click();
            await expect(page.getByTestId('task-item')).toHaveCount(1);
            await expect(page.getByTestId('task-text')).toHaveText('Task A');

            // Uncompleting a task while "Completed" filter is active removes it
            await page.getByTestId('task-item').nth(0).getByRole('checkbox').click();
            await expect(page.getByTestId('task-item')).toHaveCount(0);
        });

        test('filter state is global — persists when switching lists', async ({ page }) => {
            await createListAndSelect(page, 'List X');
            await createTask(page, 'X task');
            await page.getByTestId('task-item').getByRole('checkbox').click();
            await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (1)');

            // Enable Completed filter on List X
            await getFilterButton(page, /^Completed/).click();
            await expect(page.getByTestId('task-item')).toHaveCount(1);

            // Create a second list with only an active task
            await createList(page, 'List Y');
            await createTask(page, 'Y task');

            // Switching to List Y keeps the Completed filter — but Y has no completed tasks
            await expect(getFilterButton(page, /^Completed/)).toHaveText('Completed (0)');
            await expect(page.getByTestId('task-item')).toHaveCount(0);
        });
    });
});
