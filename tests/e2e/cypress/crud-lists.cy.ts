/// <reference types="cypress" />

import { selector } from '../../../src/lib/dom';
import { createListAndSelect } from './helpers';

describe('Lists', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.clearLocalStorage();
	});

	it('Creating', () => {
		createListAndSelect('New List');
		cy.get(selector('list-of-lists-item')).should('have.length', 1);
		cy.get(selector('list-of-tasks-title')).should('have.text', 'Tasks - New List');
	});

	it('Editing', () => {
		createListAndSelect('List for Editing');
		cy.get(selector('list-of-lists-item')).should('have.length', 1);
		cy.get(selector('list-of-tasks-title')).should('have.text', 'Tasks - List for Editing');

		cy.get(selector('edit-list-button')).click();
		cy.get(selector('list-input')).clear().type('Updated List for Editing');
		cy.get(selector('add-list-button')).click();
		cy.get(selector('list-of-lists-item-name')).should('have.text', 'Updated List for Editing');
	});

	it('Removing', () => {
		createListAndSelect('List for Removing');
		cy.get(selector('list-of-lists-item')).should('have.length', 1);
		cy.get(selector('list-of-tasks-title')).should('have.text', 'Tasks - List for Removing');

		cy.get(selector('remove-list-button')).click();
		cy.get(selector('list-of-lists-item')).should('have.length', 0);
		cy.get(selector('list-of-tasks-title')).should('have.text', 'Tasks - No list selected');
		cy.get(selector('task')).should('have.length', 0);
	});
});
