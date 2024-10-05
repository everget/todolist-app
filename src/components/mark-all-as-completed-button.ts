import { TranslationService } from '@/services/translation-service';
import { CheckboxView } from './checkbox';
import { FilterButtonView } from './filter-button';

export interface MarkAllAsCompletedButtonViewProps {
	checked: boolean;
	disabled: boolean;
	customClass?: string;
}

export function MarkAllAsCompletedButtonView({
	checked,
	disabled,
}: MarkAllAsCompletedButtonViewProps) {
	const checkboxElement = CheckboxView({
		selector: 'toggle-all-completed-checkbox',
		checked,
	});
	const buttonElement = FilterButtonView({
		selector: 'mark-all-as-completed-button',
		label: TranslationService.t('tasks.completeAll'),
		disabled,
	});

	return `
        <div class="flex items-center gap-2">
            ${checkboxElement}
            ${buttonElement}
        </div>
    `;
}
