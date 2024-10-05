import { data, DataSelector } from '@/lib/dom';

export interface CheckboxViewProps {
	selector: DataSelector;
	checked: boolean;
}

export function CheckboxView({ selector, checked }: CheckboxViewProps) {
	return `
        <input ${data('selector', selector)} type="checkbox" ${checked ? 'checked' : ''}
            class="form-checkbox h-6 w-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
        />
    `;
}
