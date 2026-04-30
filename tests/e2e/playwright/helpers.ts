import { expect, type Page } from '@playwright/test';
import { config } from '@/config/config';
import { type Locale, type TaskPriority, type Theme } from '@/types';

export async function resetApp(page: Page): Promise<void> {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByTestId('lists-panel').waitFor({ state: 'visible' });
}

export async function verifyTaskCheckboxes(page: Page, checked: boolean) {
    const items = page.getByTestId('task-item');
    const count = await items.count();
    for (let i = 0; i < count; i++) {
        const checkbox = items.nth(i).getByRole('checkbox');
        if (checked) {
            await expect(checkbox).toBeChecked();
        } else {
            await expect(checkbox).not.toBeChecked();
        }
    }
}

export function getLocale(page: Page) {
    return page.evaluate((key) => {
        const raw = localStorage.getItem(key);
        return raw ? ((JSON.parse(raw) as { locale?: string }).locale ?? 'en') : 'en';
    }, config.preferences.localStorageKey);
}

export async function checkLocaleApplied(page: Page, expectedLocale: Locale) {
    const currentLocale = await getLocale(page);
    await expect(currentLocale).toBe(expectedLocale);
    await expect(page.locator('html')).toHaveAttribute('lang', expectedLocale);
}

export function getTheme(page: Page) {
    return page.evaluate((key) => {
        const raw = localStorage.getItem(key);
        return raw ? ((JSON.parse(raw) as { theme?: string }).theme ?? 'light') : 'light';
    }, config.preferences.localStorageKey);
}

export async function checkThemeApplied(page: Page, expectedTheme: Theme) {
    if (expectedTheme === 'light') {
        await expect(page.locator('html')).not.toHaveAttribute('class', 'dark');
    } else {
        await expect(page.locator('html')).toHaveAttribute('class', 'dark');
    }
}

export async function createList(page: Page, name: string, tasks?: string[]) {
    await page.getByTestId('new-list-input').fill(name);
    await page.getByTestId('lists-panel').getByRole('button', { name: 'Add' }).click();

    // The newly created list is automatically selected; wait for the UI to reflect this.
    await expect(page.getByRole('heading', { name: new RegExp(`Tasks - ${name}`) })).toBeVisible();

    if (Array.isArray(tasks)) {
        for (const task of tasks) {
            await createTask(page, task);
        }
    }
}

export async function createListAndSelect(page: Page, name: string, tasks?: string[]) {
    await createList(page, name, tasks);
    // The new list is auto-selected, but click the name to ensure it's active.
    await page.getByTestId('list-item-name').first().click();
}

// Click a list item by name to make it the active list.
export async function selectList(page: Page, name: string) {
    await page.getByTestId('list-item').filter({ hasText: name }).click();
    // Wait for the task list header to update to ensure the switch is processed by React/Redux.
    await expect(page.getByRole('heading', { name: new RegExp(`Tasks - ${name}`) })).toBeVisible();
}

export async function createTask(
    page: Page,
    name: string,
    priority: TaskPriority = 'none',
    estimateTime: string = 'none'
) {
    await page.getByTestId('new-task-input').fill(name);
    await page.getByTestId('priority-select').selectOption(priority);

    if (estimateTime === 'none') {
        await page.getByTestId('estimated-time-amount').fill('');
    } else {
        const match = estimateTime.match(/^(\d+)([mhdw])$/);
        if (match) {
            await page.getByTestId('estimated-time-amount').fill(match[1]);
            await page.getByTestId('estimated-time-unit').selectOption(match[2]);
        } else {
            // Fallback for simple numeric values if passed
            await page.getByTestId('estimated-time-amount').fill(estimateTime);
        }
    }

    await page.getByTestId('tasks-panel').getByRole('button', { name: 'Add' }).click();

    // Wait for the input to clear, which guarantees React has processed the addition.
    // This avoids failing when the task is created but immediately filtered out.
    await expect(page.getByTestId('new-task-input')).toHaveValue('');
}

// Scope filter button lookups to the filters bar to avoid matching task items,
// which also carry role="button" with aria-labels that start with status words
// like "Active: Task 1" or "Completed: Task 1".
export function getFilterButton(page: Page, name: string | RegExp) {
    return page.getByTestId('task-filters').getByRole('button', { name });
}

export async function selectLocale(page: Page, locale: Locale) {
    await page.getByTestId('locale-selector').click();
    await page.getByTestId(`locale-${locale}`).click();
}
