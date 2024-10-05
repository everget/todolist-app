// import test, { expect } from '@playwright/test';
// import { selector } from '../../../src/lib/dom';
// import { createListAndSelect, createTask } from './helpers';

// test.describe('Sorting tasks', () => {
// 	test.beforeEach(async ({ page }) => {
// 		await page.goto('/');
// await page.evaluate(() => localStorage.clear());
// 	});

// 	test('Sort by priority', async () => {});

// 	test('Sort by date created', async ({ page }) => {
// 		await createListAndSelect(page, 'Sorted Tasks');

// 		await createTask(page, 'Task 1');
// 		await page.waitForTimeout(1000);
// 		await createTask(page, 'Task 2');
// 		await page.waitForTimeout(1000);
// 		await createTask(page, 'Task 3');
// 		await page.waitForTimeout(1000);

// 		await page.click(`[data-js-selector="sort-by-date"]`);

// 		await expect(page.locator(selector('task-text'))).toHaveText([
// 			'Task 1',
// 			'Task 2',
// 			'Task 3',
// 		]);

// 		await page.click(`[data-js-selector="sort-by-date"]`); // Click again to reverse order
// 		await expect(page.locator(selector('task-text'))).toHaveText([
// 			'Task 3',
// 			'Task 2',
// 			'Task 1',
// 		]);
// 	});

// 	test('Sort by date completed', async () => {});
// 	test('Sort by remaining time', async () => {});
// });
