import { DataSelector, data } from '@/lib/dom';

export interface TextInputProps {
	selector: DataSelector;
	placeholder?: string;
	ariaLabel?: string;
	customClass?: string;
	children?: string;
}

export function TextInputView({ selector, placeholder, ariaLabel, customClass }: TextInputProps) {
	return `
        <input
            ${data('selector', selector)}
            type="text"
            aria-label="${ariaLabel}"
            placeholder="${placeholder}"
            class="w-full p-2 bg-white dark:bg-gray-700 rounded-md border focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 ${customClass ?? ''}"
        />
    `;
}
