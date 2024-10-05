import { expect, test } from '@playwright/test';
import { selector } from '../../../src/lib/dom';

test.describe('Initial View', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
	});

	test('Page has title', async ({ page }) => {
		await expect(page).toHaveTitle('Vanilla TypeScript Non-Standard Todo App');
	});

	test.describe('Lists component', () => {
		test('Default title', async ({ page }) => {
			await expect(page.locator(selector('list-of-lists-title'))).toHaveText('Lists');
		});

		test('Default placeholder of the input', async ({ page }) => {
			await expect(page.locator(selector('list-input'))).toHaveAttribute(
				'placeholder',
				'New List...'
			);
		});

		test('Default text of the AD button', async ({ page }) => {
			await expect(page.locator(selector('add-list-button'))).toHaveText('Add');
		});

		test("Doesn't contain any lists by default", async ({ page }) => {
			await expect(page.locator(selector('list-of-lists-item'))).toHaveCount(0);
		});
	});

	test.describe('Tasks component', () => {
		test('Default title', async ({ page }) => {
			await expect(page.locator(selector('list-of-tasks-title'))).toHaveText(
				'Tasks - No list selected'
			);
		});

		test('Default placeholder of the input', async ({ page }) => {
			await expect(page.locator(selector('task-input'))).toHaveAttribute(
				'placeholder',
				'New Task...'
			);
		});

		test('Default text of the Add button', async ({ page }) => {
			await expect(page.locator(selector('add-task-button'))).toHaveText('Add');
		});

		test('Default filter option names', async ({ page }) => {
			await expect(page.locator(selector('task-filter-status-all'))).toHaveText('All (0)');
			await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
				'Completed (0)'
			);
			await expect(page.locator(selector('task-filter-status-active'))).toHaveText(
				'Active (0)'
			);
		});

		test("Doesn't contain any tasks by default", async ({ page }) => {
			await expect(page.locator(selector('task'))).toHaveCount(0);
		});
	});
});
