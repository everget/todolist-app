import { data } from '@/lib/dom';
import { TranslationService } from '@/services/translation-service';
import { TaskFilters } from '@/types';
import { FilterButtonView } from './filter-button';

export interface TaskFiltersProps {
	remainingTasksCount: number;
	completedTasksCount: number;
	filters: TaskFilters;
}

export function TaskFiltersView({
	remainingTasksCount,
	completedTasksCount,
	filters,
}: TaskFiltersProps) {
	const allCountElement = ` (<span class="inline-block" ${data(
		'selector',
		'all-tasks-count'
	)}>${remainingTasksCount + completedTasksCount}</span>)`;

	const remainingCountElement = ` (<span class="inline-block" ${data(
		'selector',
		'remaining-tasks-count'
	)}>${remainingTasksCount}</span>)`;

	const completedCountElement = ` (<span class="inline-block" ${data(
		'selector',
		'completed-tasks-count'
	)}>${completedTasksCount}</span>)`;

	const activeFilterClass = 'bg-gray-200 dark:bg-gray-700';

	return `
            <div class="flex space-x-4 my-2 sm:my-0">
                ${FilterButtonView({
					selector: 'task-filter-status-all',
					label: TranslationService.t('tasks.filter.all'),
					customClass: filters.status === 'all' ? activeFilterClass : '',
					children: allCountElement,
				})}

                ${FilterButtonView({
					selector: 'task-filter-status-active',
					label: TranslationService.t('tasks.filter.active'),
					customClass: filters.status === 'active' ? activeFilterClass : '',
					children: remainingCountElement,
				})}

                ${FilterButtonView({
					selector: 'task-filter-status-completed',
					label: TranslationService.t('tasks.filter.completed'),
					customClass: filters.status === 'completed' ? activeFilterClass : '',
					children: completedCountElement,
				})}
            </div>
        `;
}
