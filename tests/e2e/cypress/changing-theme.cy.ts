/// <reference types="cypress" />

import { selector } from '../../../src/lib/dom';
import { checkThemeApplied } from './helpers';

describe('Theme', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.clearLocalStorage();
	});

	it('Toggles between light and dark themes', () => {
		checkThemeApplied('dark');

		cy.get(selector('theme-toggle-button')).click();
		checkThemeApplied('light');

		cy.get(selector('theme-toggle-button')).click();
		checkThemeApplied('dark');
	});

	it('Maintains theme preference across page reloads', () => {
		checkThemeApplied('dark');

		cy.get(selector('theme-toggle-button')).click();
		checkThemeApplied('light');

		cy.reload();
		checkThemeApplied('light');
	});
});
