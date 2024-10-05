import { expect, type Page } from '@playwright/test';
import { selector } from '../../../src/lib/dom';
import { LOCALE_STORAGE_KEY } from '../../../src/store/index';
import { type Locale, type TaskPriority, type TaskTime, type Theme } from '../../../src/types';

export async function verifyTaskCheckboxes(page: Page, checked: boolean) {
	for (let i = 0; i < 3; i++) {
		if (checked) {
			await expect(page.locator(selector('complete-task-checkbox')).nth(i)).toBeChecked();
		} else {
			await expect(page.locator(selector('complete-task-checkbox')).nth(i)).not.toBeChecked();
		}
	}
}

export function getLocale(page: Page) {
	return page.evaluate(() => {
		const data = window.localStorage.getItem(LOCALE_STORAGE_KEY);
		return data ? JSON.parse(data)['locale'] : 'en';
	});
}

export async function checkLocaleApplied(page: Page, expectedLocale: Locale) {
	const currentLocale = await getLocale(page);
	await expect(currentLocale).toBe(expectedLocale);
	await expect(page.locator('html')).toHaveAttribute('class', expectedLocale);
}

export function getTheme(page: Page) {
	return page.evaluate(() => {
		const data = window.localStorage.getItem(LOCALE_STORAGE_KEY);
		return data ? JSON.parse(data)['theme'] : 'light';
	});
}

export async function checkThemeApplied(page: Page, expectedTheme: Theme) {
	// const currentTheme = await getTheme(page);
	// await expect(currentTheme).toBe(expectedTheme);
	if (expectedTheme === 'light') {
		await expect(page.locator('html')).not.toHaveAttribute('class', 'dark');
	} else {
		await expect(page.locator('html')).toHaveAttribute('class', 'dark');
	}
}

export async function createList(page: Page, name: string, tasks?: string[]) {
	await page.fill(selector('list-input'), name);
	await page.click(selector('add-list-button'));

	if (Array.isArray(tasks)) {
		for (const task of tasks) {
			await createTask(page, task);
		}
	}
}

export async function createListAndSelect(page: Page, name: string, tasks?: string[]) {
	await createList(page, name, tasks);
	await page.click(selector('list-of-lists-item-name'));
}

export async function createTask(
	page: Page,
	name: string,
	priority: TaskPriority = 'none',
	estimateTime: TaskTime | 'none' = 'none'
) {
	await page.click(selector('task-input'));
	await page.fill(selector('task-input'), name);
	await page.selectOption(selector('task-priority-select'), { value: priority });
	await page.selectOption(selector('task-estimate-time-select'), {
		value: estimateTime as string,
	});
	await page.click(selector('add-task-button'));
}

export async function selectLocale(page: Page, locale: Locale) {
	await page.click(`${selector('locale-selector-button')}`);
	await page.click(`${selector('locale-option')}[data-js-locale=${locale}]`);
}
