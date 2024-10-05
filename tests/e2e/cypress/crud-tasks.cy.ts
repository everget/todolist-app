/// <reference types="cypress" />

import { selector } from '../../../src/lib/dom';
import { createListAndSelect, createTask, verifyTaskCheckboxes } from './helpers';

describe('Tasks', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.clearLocalStorage();
	});

	it('Creating', () => {
		createListAndSelect('Daily Tasks');
		createTask('Buy groceries');
		cy.get(selector('task-text')).invoke('text').should('eq', 'Buy groceries');
		cy.get(selector('task-priority')).invoke('text').should((text) => {
            expect(text.trim().replace(/\s+/g, ' ')).to.eq('Priority: None')
          })
	});

	it('Creating with various priorities', () => {
		createListAndSelect('Daily Tasks');
		createTask('Task 1', 'none');
		createTask('Task 2', 'high');
		createTask('Task 3', 'medium');
		createTask('Task 4', 'low');

		const expectedTasks = ['Task 1', 'Task 2', 'Task 3', 'Task 4'];
		cy.get(selector('task-text')).each((item, index) => {
			cy.wrap(item).should('have.text', expectedTasks[index]);
		});

		const expectedPriorities = [
			'Priority: None',
			'Priority: High',
			'Priority: Medium',
			'Priority: Low',
		];
		cy.get(selector('task-priority')).each((item, index) => {
			cy.wrap(item)
				.invoke('text')
				.then((text) => {
					expect(text.trim().replace(/\s+/g, ' ')).to.equal(expectedPriorities[index]);
				});
		});
	});

	it('Editing', () => {
		createListAndSelect('Daily Tasks');
		createTask('Buy groceries');
		cy.get(selector('task-text')).should('have.text', 'Buy groceries');

		cy.get(selector('edit-task-button')).click();
		cy.get(selector('task-input')).clear().type('Buy organic groceries');
		cy.get(selector('add-task-button')).click();
		cy.get(selector('task-text')).should('have.text', 'Buy organic groceries');
	});

	it('Removing', () => {
		createListAndSelect('Daily Tasks');
		createTask('Buy groceries');
		cy.get(selector('task-text')).should('have.text', 'Buy groceries');

		cy.get(selector('remove-task-button')).click();
		cy.get(selector('task')).should('have.length', 0);
	});

	it('Display all/active/completed task counts', () => {
		createListAndSelect('Counting Tasks', ['Task 1', 'Task 2', 'Task 3']);
		cy.get(selector('task-filter-status-all')).should('have.text', 'All (3)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Active (3)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completed (0)');

		cy.get(
			`${selector('task')}:contains('Task 1') ${selector('complete-task-checkbox')}`
		).click();
		cy.get(selector('task-filter-status-all')).should('have.text', 'All (3)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Active (2)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completed (1)');
	});

	it('Toggle all tasks as completed', () => {
		createListAndSelect('Bulk Complete Tasks', ['Task 1', 'Task 2', 'Task 3']);
		cy.get(selector('toggle-all-completed-checkbox')).click();

		cy.get(selector('task-filter-status-all')).should('have.text', 'All (3)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Active (0)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completed (3)');
		verifyTaskCheckboxes(true);
	});

	it('Toggle all tasks as active', () => {
		createListAndSelect('Bulk Incomplete Tasks', ['Task 1', 'Task 2', 'Task 3']);
		cy.get(selector('toggle-all-completed-checkbox')).click();
		cy.get(selector('toggle-all-completed-checkbox')).click();

		cy.get(selector('task-filter-status-all')).should('have.text', 'All (3)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Active (3)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completed (0)');
		verifyTaskCheckboxes(false);
	});

	it('Mark all tasks as completed', () => {
		createListAndSelect('Bulk Complete Tasks', ['Task 1', 'Task 2', 'Task 3']);
		cy.get(selector('mark-all-as-completed-button')).click();

		cy.get(selector('task-filter-status-all')).should('have.text', 'All (3)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Active (0)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completed (3)');
		verifyTaskCheckboxes(true);
	});

	it('Clear completed tasks', () => {
		createListAndSelect('Clear Completed Tasks', ['Task 1', 'Task 2', 'Task 3']);
		cy.get(selector('task-filter-status-all')).should('have.text', 'All (3)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Active (3)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completed (0)');

		cy.get(
			`${selector('task')}:contains('Task 1') ${selector('complete-task-checkbox')}`
		).click();
		cy.get(selector('clear-completed-button')).click();

		cy.get(selector('task-filter-status-all')).should('have.text', 'All (2)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Active (2)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completed (0)');
	});
});
