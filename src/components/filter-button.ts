import { DataSelector, data } from '@/lib/dom';

export interface FilterButtonProps {
	selector: DataSelector;
	label: string;
	disabled?: boolean;
	customClass?: string;
	children?: string;
}

export function FilterButtonView({
	selector,
	label,
	disabled,
	customClass,
	children,
}: FilterButtonProps) {
	return `
        <button ${data(
			'selector',
			selector
		)} class="px-4 py-1 rounded-md border border-transparent hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 active:text-white active:bg-blue-500 dark:active:bg-blue-600 active:border-blue-500 ${customClass ?? ''}" ${
			disabled && 'disabled'
		}>${label}${children ? children : ''}</button>
    `;
}
