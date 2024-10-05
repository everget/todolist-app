import { IView } from '@/components/iview';
import { clearInput, closestAncestor, data, DATA_JS_SELECTOR, qs, selector } from '@/lib/dom';
import { generateUniqueId } from '@/lib/generate-unique-id';
import { TranslationService } from '@/services/translation-service';
import { store } from '@/store';
import {
	addTask,
	editTask,
	markAllTasksAsCompleted,
	removeCompletedTasks,
	removeTask,
	setFilterStatus,
	toggleAllTasksCompleted,
} from '@/store/actions';
import { getActiveList, getFilteredTasks, getRemainingTasksCount } from '@/store/selectors';
import { Task, TaskFilters, TaskFilterStatus, TaskList, TaskPriority, TaskTime } from '@/types';
import { AddButtonView } from './add-button';
import { ClearCompletedButtonView } from './clear-completed-button';
import { EstimateTimeView } from './estimate-time-select';
import { ListHeaderView } from './list-header';
import { MarkAllAsCompletedButtonView } from './mark-all-as-completed-button';
import { TaskFiltersView } from './task-filters';
import { TaskItemView } from './task-item';
import { PrioritySelectView } from './task-priority-select';
import { TextInputView } from './text-input';

interface ListOfTasksViewState {
	activeList: TaskList | null;
	tasks: Task[];
	remainingTasksCount: number;
	filters: TaskFilters;
}

export class ListOfTasksView implements IView {
	private state: ListOfTasksViewState;
	private root: HTMLElement;
	private unsubscribe: () => void;
	private onClickBinded: (event: Event) => void;

	constructor(initialState: ListOfTasksViewState) {
		this.state = initialState;
		this.root = qs(selector('list-of-tasks-container'))!;

		this.onClickBinded = this.onClick.bind(this);
		this.root.addEventListener('click', this.onClickBinded);

		this.unsubscribe = store.subscribe(this.updateState.bind(this));
	}

	render() {
		this.root.innerHTML = `
			${ListHeaderView({
				selector: 'list-of-tasks-title',
				text: TranslationService.t('tasks.tasks'),
				textSecondPart: this.state.activeList
					? this.state.activeList.name
					: TranslationService.t('lists.noListSelected'),
			})}

            <div class="flex items-center gap-2 mb-4">
				${TextInputView({
					selector: 'task-input',
					ariaLabel: TranslationService.t('tasks.new'),
					placeholder: TranslationService.t('tasks.inputPlaceholder'),
				})}
                ${AddButtonView({ selector: 'add-task-button' })}
            </div>

            <div class="flex gap-2 mb-4">
                <div class="flex-1"> ${PrioritySelectView()}</div>
                <div class="flex-1">${EstimateTimeView()}</div>
            </div>


            <div class="flex flex-col sm:flex-row justify-between items-center mb-4 py-4 px-4 rounded-md bg-white dark:bg-gray-800 shadow-md text-sm">
                ${MarkAllAsCompletedButtonView({
					checked:
						this.state.tasks.filter((task) => task.completed).length ===
						this.state.tasks.length,
					disabled: this.state.tasks.filter((task) => !task.completed).length === 0,
				})}

                ${TaskFiltersView({
					remainingTasksCount: this.state.remainingTasksCount,
					completedTasksCount: this.state.tasks.filter((task) => task.completed).length,
					filters: this.state.filters,
				})}

                ${ClearCompletedButtonView({
					disabled: this.state.tasks.filter((task) => task.completed).length === 0,
				})}
            </div>

            <ul ${data('selector', 'task-list')} role="list" aria-label="${TranslationService.t(
				'tasks.tasks'
			)}" class="space-y-3">
                ${this.state.tasks.map((task) => TaskItemView(task)).join('')}
            </ul>
        `;
		return this.root.innerHTML;
	}

	destroy() {
		this.root.removeEventListener('click', this.onClickBinded);
		this.unsubscribe();
	}

	private updateState() {
		const globalState = store.getState();

		this.state = {
			...this.state,
			activeList: getActiveList(globalState),
			tasks: getFilteredTasks(globalState),
			remainingTasksCount: getRemainingTasksCount(globalState),
			filters: globalState.filters,
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

		if (jsSelector === 'add-task-button') {
			if (target.dataset.editTaskId) {
				// We're in edit mode
				this.onUpdateTaskClick(target.dataset.editTaskId);
			} else {
				this.onAddTaskClick();
			}
			return;
		}

		if (jsSelector === 'edit-task-button') {
			this.onEditTaskClick(closestAncestor(target, selector('task')));
			return;
		}

		if (jsSelector === 'remove-task-button') {
			this.onRemoveTaskClick(closestAncestor(target, selector('task')));
			return;
		}

		if (jsSelector === 'complete-task-checkbox') {
			const $taskItem = closestAncestor(target, selector('task'));
			const id = $taskItem?.dataset.jsTaskId;
			if (id) {
				editTask({ id, completed: (target as HTMLInputElement).checked });
			}
			return;
		}

		if (jsSelector?.startsWith('task-filter-status')) {
			target.classList.toggle('active');
			setFilterStatus((jsSelector.split('-').pop() as TaskFilterStatus) || 'all');
			return;
		}

		if (jsSelector === 'toggle-all-completed-checkbox' && this.state.activeList) {
			toggleAllTasksCompleted({
				listId: this.state.activeList.id,
				checked: (target as HTMLInputElement).checked,
			});
			return;
		}

		if (jsSelector === 'mark-all-as-completed-button' && this.state.activeList) {
			markAllTasksAsCompleted(this.state.activeList.id);
			return;
		}

		if (jsSelector === 'clear-completed-button') {
			if (this.state.activeList) {
				removeCompletedTasks(this.state.activeList.id);
			}
			return;
		}
	}

	private onUpdateTaskClick(id: string) {
		const $taskInput = qs<HTMLInputElement>(selector('task-input'))!;
		const $prioritySelect = qs<HTMLSelectElement>(selector('task-priority-select'))!;
		editTask({
			id,
			text: $taskInput.value.trim(),
			priority: $prioritySelect.value as TaskPriority,
		});

		// Reset the button
		const $addButton = qs<HTMLButtonElement>(selector('add-task-button'))!;
		$addButton.textContent = TranslationService.t('actions.add');
		delete $addButton.dataset.editTaskId;

		clearInput($taskInput);
	}

	private onAddTaskClick() {
		const $taskInput = qs<HTMLInputElement>(selector('task-input'))!;
		const text = $taskInput.value.trim();
		const priority = qs<HTMLSelectElement>(
			selector('task-priority-select')
		)!.value.trim() as TaskPriority;
		const estimateTime = qs<HTMLSelectElement>(
			selector('task-estimate-time-select')
		)!.value.trim() as TaskTime;

		if (text !== '' && this.state.activeList !== null) {
			addTask({
				id: generateUniqueId(),
				listId: this.state.activeList.id,
				text,
				completed: false,
				priority,
				createdAt: Date.now(),
				completedAt: null,
				estimateTime,
				remainingTime: null,
				timeSpent: 0,
			});

			clearInput($taskInput);
		}
	}

	private onEditTaskClick($taskItem: HTMLElement | null) {
		const id = $taskItem?.dataset.jsTaskId;
		if (id) {
			const task = this.state.tasks.find((task) => task.id === id);
			if (task) {
				const $taskInput = qs<HTMLInputElement>(selector('task-input'))!;
				const $prioritySelect = qs<HTMLSelectElement>(selector('task-priority-select'))!;

				$taskInput.focus();
				$taskInput.value = task.text;
				$prioritySelect.value = task.priority;

				const $addButton = qs<HTMLButtonElement>(selector('add-task-button'))!;
				$addButton.textContent = TranslationService.t('actions.update');
				$addButton.dataset.editTaskId = id;
			}
		}
	}

	private onRemoveTaskClick($taskItem: HTMLElement | null) {
		const id = $taskItem?.dataset.jsTaskId;
		if (id) {
			removeTask(id);
		}
	}
}
