import test, { expect } from '@playwright/test';
import { selector } from '../../../src/lib/dom';
import { createListAndSelect } from './helpers';

test.describe('Lists', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
	});

	test('Creating', async ({ page }) => {
		await createListAndSelect(page, 'New List');
		await expect(page.locator(selector('list-of-lists-item'))).toHaveCount(1);

		await expect(page.locator(selector('list-of-tasks-title'))).toHaveText('Tasks - New List');
	});

	test('Editing', async ({ page }) => {
		await createListAndSelect(page, 'List for Editing');
		await expect(page.locator(selector('list-of-lists-item'))).toHaveCount(1);

		await expect(page.locator(selector('list-of-tasks-title'))).toHaveText(
			'Tasks - List for Editing'
		);

		await page.click(selector('edit-list-button'));
		await page.fill(selector('list-input'), 'Updated List for Editing');
		await page.click(selector('add-list-button'));
		await expect(page.locator(selector('list-of-lists-item-name'))).toHaveText(
			'Updated List for Editing'
		);
	});

	test('Removing', async ({ page }) => {
		await createListAndSelect(page, 'List for Removing');
		await expect(page.locator(selector('list-of-lists-item'))).toHaveCount(1);

		await expect(page.locator(selector('list-of-tasks-title'))).toHaveText(
			'Tasks - List for Removing'
		);

		await page.click(selector('remove-list-button'));
		await expect(page.locator(selector('list-of-lists-item'))).toHaveCount(0);

		await expect(page.locator(selector('list-of-tasks-title'))).toHaveText(
			'Tasks - No list selected'
		);
		await expect(page.locator(selector('task'))).toHaveCount(0);
	});
});
