import test from '@playwright/test';
import { selector } from '../../../src/lib/dom';
import { checkThemeApplied } from './helpers';

test.describe('Theme', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
	});

	test('Toggles between light and dark themes', async ({ page }) => {
		checkThemeApplied(page, 'dark');

		await page.click(selector('theme-toggle-button'));
		checkThemeApplied(page, 'light');

		await page.click(selector('theme-toggle-button'));
		checkThemeApplied(page, 'dark');
	});

	test('Maintains theme preference across page reloads', async ({ page }) => {
		checkThemeApplied(page, 'dark');

		await page.click(selector('theme-toggle-button'));
		checkThemeApplied(page, 'light');

		await page.reload();
		checkThemeApplied(page, 'light');
	});
});
