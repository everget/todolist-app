/// <reference types="cypress" />

import { selector } from '../../../src/lib/dom';
import { type Locale, type Theme } from '../../../src/types';

export function createList(name: string, tasks?: string[]) {
	cy.get(selector('list-input')).type(name);
	cy.get(selector('add-list-button')).click();

	if (Array.isArray(tasks)) {
		tasks.forEach((task) => {
			createTask(task);
		});
	}
}

export function createListAndSelect(name: string, tasks?: string[]) {
	createList(name, tasks);
	cy.get(selector('list-of-lists-item-name')).click();
}

export function createTask(name, priority = 'none', estimateTime = 'none') {
	cy.get(selector('task-input')).type(name);
	cy.get(selector('task-priority-select')).select(priority);
	cy.get(selector('task-estimate-time-select')).select(estimateTime);
	cy.get(selector('add-task-button')).click();
}

export function verifyTaskCheckboxes(checked) {
	cy.get(selector('complete-task-checkbox')).each(($el) => {
		cy.wrap($el).should(checked ? 'be.checked' : 'not.be.checked');
	});
}

export function selectLocale(locale: Locale) {
	cy.get(`${selector('locale-selector-button')}`).click();
	cy.get(`${selector('locale-option')}[data-js-locale=${locale}]`).click();
}

export function checkThemeApplied(expectedTheme: Theme) {
	if (expectedTheme === 'light') {
		cy.get('html').should('not.have.attr', 'class', 'dark');
	} else {
		cy.get('html').should('have.attr', 'class', 'dark');
	}
}
