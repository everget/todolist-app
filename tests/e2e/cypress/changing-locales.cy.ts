/// <reference types="cypress" />

import { selector } from '../../../src/lib/dom';
import { selectLocale } from './helpers';

describe('Locale', () => {
	beforeEach(() => {
		// Navigate to the homepage and clear localStorage before each test
		cy.visit('/');
		cy.clearLocalStorage();
	});

	it('English', () => {
		// selectLocale('en'); // Implement or mock the selectLocale function as needed
		cy.get(selector('add-list-button')).should('have.text', 'Add');
		cy.get(selector('add-task-button')).should('have.text', 'Add');
		cy.get(selector('task-filter-status-all')).should('have.text', 'All (0)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Active (0)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completed (0)');
	});

	it('Spanish', () => {
		selectLocale('es');
		cy.get(selector('add-list-button')).should('have.text', 'Añadir');
		cy.get(selector('add-task-button')).should('have.text', 'Añadir');
		cy.get(selector('task-filter-status-all')).should('have.text', 'Todas (0)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Activas (0)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completadas (0)');
	});

	it('Brazilian Portuguese', () => {
		selectLocale('pt-br');
		cy.get(selector('add-list-button')).should('have.text', 'Adicionar');
		cy.get(selector('add-task-button')).should('have.text', 'Adicionar');
		cy.get(selector('task-filter-status-all')).should('have.text', 'Todas (0)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Ativas (0)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Concluídas (0)');
	});

	it('Russian', () => {
		selectLocale('ru');
		cy.get(selector('add-list-button')).should('have.text', 'Добавить');
		cy.get(selector('add-task-button')).should('have.text', 'Добавить');
		cy.get(selector('task-filter-status-all')).should('have.text', 'Все (0)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Активные (0)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Выполненные (0)');
	});

	it('Ukrainian', () => {
		selectLocale('ua');
		cy.get(selector('add-list-button')).should('have.text', 'Додати');
		cy.get(selector('add-task-button')).should('have.text', 'Додати');
		cy.get(selector('task-filter-status-all')).should('have.text', 'Усі (0)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Активні (0)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Виконані (0)');
	});

	it('Switching between locales', () => {
		// Select Spanish
		selectLocale('es');
		cy.get(selector('add-list-button')).should('have.text', 'Añadir');
		cy.get(selector('add-task-button')).should('have.text', 'Añadir');
		cy.get(selector('task-filter-status-all')).should('have.text', 'Todas (0)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completadas (0)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Activas (0)');

		// Switch back to English and verify
		selectLocale('en');
		cy.get(selector('task-filter-status-all')).should('have.text', 'All (0)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completed (0)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Active (0)');
		cy.get(selector('add-list-button')).should('have.text', 'Add');
		cy.get(selector('add-task-button')).should('have.text', 'Add');
	});

	it('Maintains language preference across page reloads', () => {
		selectLocale('es');

		// Reload the page and check if the locale persists
		cy.reload();

		cy.get(selector('add-list-button')).should('have.text', 'Añadir');
		cy.get(selector('add-task-button')).should('have.text', 'Añadir');
		cy.get(selector('task-filter-status-all')).should('have.text', 'Todas (0)');
		cy.get(selector('task-filter-status-active')).should('have.text', 'Activas (0)');
		cy.get(selector('task-filter-status-completed')).should('have.text', 'Completadas (0)');
	});
});
