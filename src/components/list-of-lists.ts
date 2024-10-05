import { IView } from '@/components/iview';
import { clearInput, closestAncestor, data, DATA_JS_SELECTOR, qs, selector } from '@/lib/dom';
import { generateUniqueId } from '@/lib/generate-unique-id';
import { TranslationService } from '@/services/translation-service';
import { store } from '@/store';
import { addList, editList, removeList, setActiveList } from '@/store/actions';
import { TaskList } from '@/types';
import { AddButtonView } from './add-button';
import { ListHeaderView } from './list-header';
import { ListOfListsItemView } from './list-of-lists-item';
import { TextInputView } from './text-input';

interface ListOfListsViewState {
	lists: TaskList[];
}

export class ListOfListsView implements IView {
	private state: ListOfListsViewState;
	private root: HTMLElement;
	private unsubscribe: () => void;
	private onClickBinded: (event: Event) => void;

	constructor(initialState: ListOfListsViewState) {
		this.state = initialState;
		this.root = qs(selector('list-of-lists-container'))!;

		this.onClickBinded = this.onClick.bind(this);
		this.root.addEventListener('click', this.onClick.bind(this));

		this.unsubscribe = store.subscribe(this.updateState.bind(this));
	}

	render() {
		this.root.innerHTML = `
			${ListHeaderView({
				selector: 'list-of-lists-title',
				text: TranslationService.t('lists.lists'),
			})}

            <div class="flex items-center gap-2 mb-4">
                ${TextInputView({
					selector: 'list-input',
					ariaLabel: TranslationService.t('lists.new'),
					placeholder: TranslationService.t('lists.inputPlaceholder'),
				})}
                ${AddButtonView({ selector: 'add-list-button' })}
            </div>

            <ul
                ${data('selector', 'list-of-lists')}
                role="list"
                aria-label=${TranslationService.t('lists.lists')}
                class="space-y-2"
            >
                ${this.state.lists.map((list) => ListOfListsItemView(list)).join('')}
            </ul>
        `;
		return this.root.innerHTML;
	}

	destroy() {
		this.root.removeEventListener('click', this.onClickBinded);
		this.unsubscribe();
	}

	private updateState() {
		const { lists } = store.getState();

		this.state = {
			...this.state,
			lists,
		};

		this.render();
	}

	private onClick(event: Event) {
		let target: HTMLElement | null = event.target as HTMLElement;
		if (target && !target.dataset.jsSelector) {
			target = target.closest(`[${DATA_JS_SELECTOR}]`);
		}

		if (!target) {
			return;
		}

		const jsSelector = target.dataset.jsSelector;
		if (jsSelector === 'add-list-button') {
			if (target.dataset.editListId) {
				// We're in edit mode
				this.onUpdateListClick(target.dataset.editListId);
			} else {
				this.onAddListClick();
			}

			return;
		}

		if (jsSelector === 'list-of-lists-item-name') {
			this.onItemClick(closestAncestor(target, selector('list-of-lists-item')));
			return;
		}

		if (jsSelector === 'list-of-lists-item') {
			this.onItemClick(target);
			return;
		}

		if (jsSelector === 'edit-list-button') {
			this.onEditListClick(closestAncestor(target, selector('list-of-lists-item')));
			return;
		}

		if (jsSelector === 'remove-list-button') {
			this.onRemoveListClick(closestAncestor(target, selector('list-of-lists-item')));
			return;
		}
	}

	private onAddListClick() {
		const $listInput = qs<HTMLInputElement>(selector('list-input'))!;
		const name = $listInput.value.trim();

		if (name !== '') {
			addList({ id: generateUniqueId(), name, isActive: true });
			clearInput($listInput);
		}
	}

	private onEditListClick($listItem: HTMLElement | null) {
		const id = $listItem?.dataset.jsListId;
		if (id) {
			const list = this.state.lists.find((list) => list.id === id);
			if (list) {
				const $listInput = qs<HTMLInputElement>(selector('list-input'))!;
				$listInput.focus();
				$listInput.value = list.name;

				const $addButton = qs<HTMLButtonElement>(selector('add-list-button'))!;
				$addButton.textContent = TranslationService.t('actions.update');
				$addButton.dataset.editListId = id;
			}
		}
	}

	private onUpdateListClick(id: string) {
		const $listInput = qs<HTMLInputElement>(selector('list-input'))!;
		editList({ id, name: $listInput.value.trim(), isActive: true });

		// Reset the button
		const $addButton = qs<HTMLButtonElement>(selector('add-list-button'))!;
		$addButton.textContent = TranslationService.t('actions.add');
		delete $addButton.dataset.editListId;

		clearInput($listInput);
	}

	private onRemoveListClick($listItem: HTMLElement | null) {
		const id = $listItem?.dataset.jsListId;
		if (id) {
			removeList(id);
		}
	}

	private onItemClick($listItem: HTMLElement | null) {
		const id = $listItem?.dataset.jsListId;
		if (id) {
			setActiveList(id);
		}
	}
}
