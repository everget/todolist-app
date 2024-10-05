import { data, DataSelector } from '@/lib/dom';

export interface SelectOption {
	title: string | null;
	value: string | null;
	selected: boolean;
}

const optionTemplate = (option: SelectOption) => {
	return `<option value="${option.value}" ${option.selected && 'selected'}>${
		option.title
	}</option>`;
};

export interface SelectViewProps {
	id: string;
	label?: string;
	selector: DataSelector;
	options: SelectOption[];
}

export function SelectView({ id, label, selector, options }: SelectViewProps) {
	// <div class="inline-block border-b-black dark:border-b-white border-r-2 border-b-2 p-[3px] rotate-[-135deg]"></div>
	const labelElement = label ? `<label for="${id}" class="block mb-2">${label}:</label>` : '';
	//option disabled selected 'Choose value'
	return `
        <div>
            ${labelElement}
            <div class="relative">
                <select
                    ${data('selector', selector)}
                    id="priority"
                    class="appearance-none w-full p-2 bg-white dark:bg-gray-700 rounded-md border dark:border-gray-600"
                >
                    ${options.map((option) => optionTemplate(option)).join('')}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                    <div class="inline-block border-b-black dark:border-b-white border-r-2 border-b-2 p-[3px] rotate-45"></div>
                </div>
            </div>
        </div>
    `;
}
