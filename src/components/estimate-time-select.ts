import { TranslationService } from '@/services/translation-service';
import { TaskTime } from '@/types';
import { SelectOption, SelectView } from './select';

export interface EstimatedTimeOption extends SelectOption {
	title: TaskTime | string;
	value: TaskTime | 'none';
}

const options: EstimatedTimeOption[] = [
	{
		title: TranslationService.t('none'),
		value: 'none',
		selected: true,
	},
	...Array.from(
		{ length: 8 },
		(_, i) =>
			({ title: `${i + 1}h`, value: `${i + 1}h`, selected: false }) as EstimatedTimeOption
	),
	{
		title: '1d',
		value: '1d',
		selected: false,
	},
	{
		title: '1w',
		value: '1w',
		selected: false,
	},
	{
		title: '1m',
		value: '1m',
		selected: false,
	},
];

export function EstimateTimeView() {
	return `${SelectView({
		id: 'estimated-time',
		selector: 'task-estimate-time-select',
		label: TranslationService.t('tasks.estimateTime'),
		options,
	})}`;
}
