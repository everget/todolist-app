import { data, type DataSelector } from '@/lib/dom';
import { formatDateShort } from '@/lib/format-date';
import { parseRemainingTime } from '@/lib/parse-remaining-time';
import { TranslationService } from '@/services/translation-service';
import { store } from '@/store';
import { Task, TaskPriority } from '@/types';
import { CheckboxView } from './checkbox';
import { EditButtonView } from './edit-button';
import { RemoveButtonView } from './remove-button';

interface TaskAttributeProps {
	selector: DataSelector;
	title: string;
	value: string | null;
	customClassName?: string;
	titleClassName?: string;
	valueClassName?: string;
}

function TaskAttributeView({
	selector,
	title,
	value,
	customClassName,
	titleClassName,
	valueClassName,
}: TaskAttributeProps) {
	return `
        <div ${data(
			'selector',
			selector
		)} class="text-sm text-gray-600 dark:text-gray-400 ${customClassName ?? ''}">
            <span class="${titleClassName ?? ''}">${title}:</span>
            <span class="${valueClassName ?? ''}">${value}</span>
        </div>
    `;
}

function getPriorityColor(priority: TaskPriority) {
	switch (priority) {
		case 'high':
			return 'text-red-500 dark:text-red-400';
		case 'medium':
			return 'text-yellow-500 dark:text-yellow-400';
		case 'low':
			return 'text-green-500 dark:text-green-400';
		default:
			return 'text-gray-500 dark:text-gray-400';
	}
}

export type TaskItemViewProps = Task;

export function TaskItemView({
	id,
	text,
	completed,
	priority,
	createdAt,
	estimateTime,
}: TaskItemViewProps) {
	const completedAt = null;
	const remainingTime = '1h';
	const isOverdue = remainingTime && parseRemainingTime(remainingTime) <= 0;
	const isUrgent =
		remainingTime &&
		parseRemainingTime(remainingTime) > 0 &&
		parseRemainingTime(remainingTime) < 60;
	const checkboxElement = CheckboxView({
		selector: 'complete-task-checkbox',
		checked: completed,
	});

	return `
        <li
            ${data('selector', 'task')} ${data('task-id', id as 'id')} draggable="true"
            class="group flex flex-row md:flex-row justify-between items-center md:items-center p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out ${
				isUrgent ? 'border-l-4 border-red-500' : ''
			}"
        >
          <div class="flex items-center gap-4">
            <div class="flex content-center items-center">
                ${checkboxElement}
            </div>

            <div>
                <p ${data('selector', 'task-text')} class="font-medium truncate">${text}</p>
                <div class="hidden md:flex justify-between md:space-x-10 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    ${TaskAttributeView({
						selector: 'task-priority',
						title: TranslationService.t('tasks.priority.label'),
						value: TranslationService.t(`tasks.priority.${priority}`),
						valueClassName: getPriorityColor(priority),
					})}

                        ${TaskAttributeView({
							selector: 'task-created-at',
							title: TranslationService.t('tasks.createdAt'),
							value: formatDateShort(new Date(createdAt), store.getState().locale),
						})}

                        ${
							completedAt
								? TaskAttributeView({
										selector: 'task-completed-at',
										title: TranslationService.t('tasks.completedAt'),
										value: formatDateShort(
											new Date(completedAt),
											store.getState().locale
										),
									})
								: ''
						}

                        ${TaskAttributeView({
							selector: 'task-estimate-time',
							title: TranslationService.t('tasks.estimateTime'),
							value:
								estimateTime === 'none'
									? TranslationService.t(estimateTime)
									: estimateTime,
						})}

                        ${
							remainingTime
								? TaskAttributeView({
										selector: 'task-remaining-time',
										title: TranslationService.t('tasks.remainingTime'),
										value: remainingTime,
										valueClassName: isOverdue
											? 'text-red-600 font-semibold'
											: isUrgent
												? 'text-orange-600 font-semibold'
												: '',
									})
								: ''
						}
                </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            ${EditButtonView({ selector: 'edit-task-button' })}
            ${RemoveButtonView({ selector: 'remove-task-button' })}
          </div>
        </li>
      `;
}
