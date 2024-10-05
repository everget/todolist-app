import test, { expect } from '@playwright/test';
import { selector } from '../../../src/lib/dom';
import { createListAndSelect, createTask, verifyTaskCheckboxes } from './helpers';

test.describe('Tasks', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
	});

	test('Creating', async ({ page }) => {
		await createListAndSelect(page, 'Daily Tasks');

		await createTask(page, 'Buy groceries');
		await expect(page.locator(selector('task-text'))).toHaveText('Buy groceries');
		await expect(page.locator(selector('task-priority'))).toHaveText('Priority: None');
	});

	test('Creating with various priorities', async ({ page }) => {
		await createListAndSelect(page, 'Daily Tasks');

		await createTask(page, 'Task 1', 'none');
		await createTask(page, 'Task 2', 'high');
		await createTask(page, 'Task 3', 'medium');
		await createTask(page, 'Task 4', 'low');
		await expect(page.locator(selector('task-text'))).toHaveText([
			'Task 1',
			'Task 2',
			'Task 3',
			'Task 4',
		]);
		await expect(page.locator(selector('task-priority'))).toHaveText([
			'Priority: None',
			'Priority: High',
			'Priority: Medium',
			'Priority: Low',
		]);
	});

	test('Editing', async ({ page }) => {
		await createListAndSelect(page, 'Daily Tasks');

		await createTask(page, 'Buy groceries');
		await expect(page.locator(selector('task-text'))).toHaveText('Buy groceries');

		await page.click(selector('edit-task-button'));
		await page.fill(selector('task-input'), 'Buy organic groceries');
		await page.click(selector('add-task-button'));
		await expect(page.locator(selector('task-text'))).toHaveText('Buy organic groceries');
	});

	test('Removing', async ({ page }) => {
		await createListAndSelect(page, 'Daily Tasks');

		await createTask(page, 'Buy groceries');
		await expect(page.locator(selector('task-text'))).toHaveText('Buy groceries');

		await page.click(selector('remove-task-button'));
		await expect(page.locator(selector('task'))).toHaveCount(0);
	});

	test('Display all/active/completed task counts', async ({ page }) => {
		await createListAndSelect(page, 'Counting Tasks', ['Task 1', 'Task 2', 'Task 3']);

		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('All (3)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Active (3)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completed (0)'
		);

		await page.click(
			`${selector('task')}:has-text('Task 1') ${selector('complete-task-checkbox')}`
		);

		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('All (3)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Active (2)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completed (1)'
		);
	});

	test('Toggle all tasks as completed', async ({ page }) => {
		await createListAndSelect(page, 'Bulk Complete Tasks', ['Task 1', 'Task 2', 'Task 3']);

		await page.click(selector('toggle-all-completed-checkbox'));

		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('All (3)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Active (0)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completed (3)'
		);

		await verifyTaskCheckboxes(page, true);
	});

	test('Toggle all tasks as active', async ({ page }) => {
		await createListAndSelect(page, 'Bulk Incomplete Tasks', ['Task 1', 'Task 2', 'Task 3']);

		await page.click(selector('toggle-all-completed-checkbox'));
		await page.click(selector('toggle-all-completed-checkbox'));

		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('All (3)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Active (3)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completed (0)'
		);

		await verifyTaskCheckboxes(page, false);
	});

	test('Mark all tasks as completed', async ({ page }) => {
		await createListAndSelect(page, 'Bulk Complete Tasks', ['Task 1', 'Task 2', 'Task 3']);

		await page.click(selector('mark-all-as-completed-button'));

		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('All (3)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Active (0)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completed (3)'
		);

		await verifyTaskCheckboxes(page, true);
	});

	test('Clear completed tasks', async ({ page }) => {
		await createListAndSelect(page, 'Clear Completed Tasks', ['Task 1', 'Task 2', 'Task 3']);

		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('All (3)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Active (3)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completed (0)'
		);

		await page.click(
			`${selector('task')}:has-text('Task 1') ${selector('complete-task-checkbox')}`
		);

		await page.click(selector('clear-completed-button'));

		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('All (2)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Active (2)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completed (0)'
		);
	});
});
