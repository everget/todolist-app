import test, { expect } from '@playwright/test';
import { selector } from '../../../src/lib/dom';
import { selectLocale } from './helpers';

test.describe('Locale', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
	});

	test('English', async ({ page }) => {
		// selectLocale(page, 'en');
		await expect(page.locator(selector('add-list-button'))).toHaveText('Add');
		await expect(page.locator(selector('add-task-button'))).toHaveText('Add');
		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('All (0)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Active (0)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completed (0)'
		);
	});

	test('Spanish', async ({ page }) => {
		selectLocale(page, 'es');
		await expect(page.locator(selector('add-list-button'))).toHaveText('Añadir');
		await expect(page.locator(selector('add-task-button'))).toHaveText('Añadir');
		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('Todas (0)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Activas (0)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completadas (0)'
		);
	});

	test('Brazilian Portuguese', async ({ page }) => {
		selectLocale(page, 'pt-br');
		await expect(page.locator(selector('add-list-button'))).toHaveText('Adicionar');
		await expect(page.locator(selector('add-task-button'))).toHaveText('Adicionar');
		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('Todas (0)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Ativas (0)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Concluídas (0)'
		);
	});

	test('Russian', async ({ page }) => {
		selectLocale(page, 'ru');
		await expect(page.locator(selector('add-list-button'))).toHaveText('Добавить');
		await expect(page.locator(selector('add-task-button'))).toHaveText('Добавить');
		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('Все (0)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText(
			'Активные (0)'
		);
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Выполненные (0)'
		);
	});

	test('Ukrainian', async ({ page }) => {
		selectLocale(page, 'ua');
		await expect(page.locator(selector('add-list-button'))).toHaveText('Додати');
		await expect(page.locator(selector('add-task-button'))).toHaveText('Додати');
		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('Усі (0)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Активні (0)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Виконані (0)'
		);
	});

	test('Switching between locales', async ({ page }) => {
		// Select Spanish
		selectLocale(page, 'es');

		await expect(page.locator(selector('add-list-button'))).toHaveText('Añadir');
		await expect(page.locator(selector('add-task-button'))).toHaveText('Añadir');

		// Verify filters are in Spanish
		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('Todas (0)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completadas (0)'
		);
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Activas (0)');

		// Switch back to English and verify
		selectLocale(page, 'en');

		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('All (0)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completed (0)'
		);
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Active (0)');
		await expect(page.locator(selector('add-list-button'))).toHaveText('Add');
		await expect(page.locator(selector('add-task-button'))).toHaveText('Add');
	});

	test('Maintains language preference across page reloads', async ({ page }) => {
		selectLocale(page, 'es');

		await page.reload();

		await expect(page.locator(selector('add-list-button'))).toHaveText('Añadir');
		await expect(page.locator(selector('add-task-button'))).toHaveText('Añadir');
		await expect(page.locator(selector('task-filter-status-all'))).toHaveText('Todas (0)');
		await expect(page.locator(selector('task-filter-status-active'))).toHaveText('Activas (0)');
		await expect(page.locator(selector('task-filter-status-completed'))).toHaveText(
			'Completadas (0)'
		);
	});
});
