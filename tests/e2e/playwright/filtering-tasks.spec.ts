import test, { expect } from '@playwright/test';
import { selector } from '../../../src/lib/dom';
import { createListAndSelect, createTask } from './helpers';

test.describe('Filtering tasks', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
	});

	test('Filter tasks by completion status', async ({ page }) => {
		await createListAndSelect(page, 'Project Tasks');

		await createTask(page, 'Task 1');
		await createTask(page, 'Task 2');
		await page.locator(selector('task')).nth(0).getByRole('checkbox').check();

		await page.click(selector('task-filter-status-all'));
		await expect(page.locator(selector('task-text'))).toContainText(['Task 1', 'Task 2']);

		await page.click(selector('task-filter-status-active'));
		await expect(page.locator(selector('task-text'))).toContainText('Task 2');

		await page.click(selector('task-filter-status-completed'));
		await expect(page.locator(selector('task-text'))).toContainText('Task 1');

		await page.click(selector('task-filter-status-all'));
		await expect(page.locator(selector('task-text'))).toContainText(['Task 1', 'Task 2']);
	});

	// test('Filter tasks by priority', async ({ page }) => {
	// 	await createListAndSelect(page, 'Priority Tasks');

	// 	await createTask(page, 'High Priority Task #1', 'high');
	// 	await createTask(page, 'Medium Priority Task #1', 'medium');
	// 	await createTask(page, 'Low Priority Task #1', 'low');

	// 	await createTask(page, 'High Priority Task #2', 'high');
	// 	await createTask(page, 'Medium Priority Task #2', 'medium');
	// 	await createTask(page, 'Low Priority Task #2', 'low');

	// 	// await page.selectOption(selector('task-priority-filter', 'high'));
	// 	// await expect(page.locator(selector('task-text'))).toHaveCount(2);
	// 	// await expect(page.locator(selector('task-text'))).toHaveText(['High Priority Task #1', 'High Priority Task #2']);

	// 	// await page.selectOption(selector('task-priority-filter', 'medium'));
	// 	// await expect(page.locator(selector('task-text'))).toHaveCount(2);
	// 	// await expect(page.locator(selector('task-text'))).toHaveText(['Medium Priority Task #1', 'Medium Priority Task #2']);

	// 	// await page.selectOption(selector('task-priority-filter', 'low'));
	// 	// await expect(page.locator(selector('task-text'))).toHaveCount(2);
	// 	// await expect(page.locator(selector('task-text'))).toHaveText(['Low Priority Task #1', 'Low Priority Task #2']);
	// });
});
