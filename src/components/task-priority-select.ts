import { TranslationService } from '@/services/translation-service';
import { TaskPriority } from '@/types';
import { SelectOption, SelectView } from './select';

export interface PriorityOption extends SelectOption {
	title: Capitalize<TaskPriority>;
	value: TaskPriority;
}

const options: PriorityOption[] = [
	{
		title: 'None',
		value: 'none',
		selected: true,
	},
	{
		title: 'High',
		value: 'high',
		selected: false,
	},
	{
		title: 'Medium',
		value: 'medium',
		selected: false,
	},
	{
		title: 'Low',
		value: 'low',
		selected: false,
	},
];

export function PrioritySelectView() {
	return `${SelectView({
		id: 'priority',
		selector: 'task-priority-select',
		label: TranslationService.t('tasks.priority.label'),
		options: options.map((option) => ({
			...option,
			title: TranslationService.t(`tasks.priority.${option.value}`),
		})),
	})}`;
}
