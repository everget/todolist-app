export type DataSelector =
	| 'locale-selector-container'
	| 'locale-selector'
	| 'locale-selector-button'
	| 'locale-dropdown'
	| 'locale-list'
	| 'locale-option'
	| 'theme-toggle-container'
	| 'theme-toggle-button'
	| 'light-theme-icon'
	| 'dark-theme-icon'
	| 'list-of-lists-container'
	| 'list-of-lists-title'
	| 'list-of-lists'
	| 'list-of-lists-item'
	| 'list-of-lists-item-name'
	| 'list-input'
	| 'add-list-button'
	| 'edit-list-button'
	| 'remove-list-button'
	| 'list-of-tasks-container'
	| 'list-of-tasks-title'
	| 'list-of-tasks'
	| 'task-list'
	| 'task-input'
	| 'task'
	| 'complete-task-checkbox'
	| 'task-text'
	| 'task-created-at'
	| 'task-completed-at'
	| 'task-estimate-time'
	| 'task-remaining-time'
	| 'add-task-button'
	| 'edit-task-button'
	| 'remove-task-button'
	| 'task-filter-status-all'
	| 'task-filter-status-active'
	| 'task-filter-status-completed'
	| 'task-priority-select'
	| 'task-priority'
	| 'task-estimate-time-select'
	| 'all-tasks-count'
	| 'remaining-tasks-count'
	| 'completed-tasks-count'
	| 'toggle-all-completed-checkbox'
	| 'mark-all-as-completed-button'
	| 'clear-completed-button';

export const DATA_JS_SELECTOR = 'data-js-selector';

export function selector(name: DataSelector) {
	return `[${DATA_JS_SELECTOR}="${name}"]`;
}

export function data(name: string, value?: DataSelector | 'id' | 'code') {
	if (typeof value === 'undefined') {
		return `data-js-${name}`;
	}
	return `data-js-${name}="${value}"`;
}

export function qs<T extends Element>(selector: string, scope?: HTMLElement): T | null {
	return (scope || document).querySelector<T>(selector);
}

export function qsa<T extends Element>(selector: string, scope?: HTMLElement): NodeListOf<T> {
	return (scope || document).querySelectorAll<T>(selector);
}

export function qsData<T extends Element>(
	dataSelector: DataSelector,
	scope?: HTMLElement
): T | null {
	return (scope || document).querySelector<T>(selector(dataSelector));
}

export function addEventListener<K extends keyof HTMLElementEventMap>(
	target: HTMLElement,
	type: K,
	callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
	useCapture?: boolean
) {
	target.addEventListener(type, callback, !!useCapture);
}

export function insertAfter(newNode: Node, existingNode: Node) {
	existingNode.parentNode?.insertBefore(newNode, existingNode.nextSibling);
}

export function closestAncestor(element: HTMLElement | null, selector: string): HTMLElement | null {
	if (!element || element.parentNode === null) {
		return null;
	}

	while (element && !element.matches(selector)) {
		element = element.parentElement;
	}
	return element;
}

export function clearInput(inputElement: HTMLInputElement) {
	inputElement.value = '';
	inputElement.focus();
}
