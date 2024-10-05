import { TranslationService } from '@/services/translation-service';
import { FilterButtonView } from './filter-button';

export interface ClearCompletedButtonViewProps {
	disabled: boolean;
	customClass?: string;
}

export function ClearCompletedButtonView({ disabled }: ClearCompletedButtonViewProps) {
	return `${FilterButtonView({
		selector: 'clear-completed-button',
		label: TranslationService.t('tasks.clearCompleted'),
		disabled,
	})}`;
}
