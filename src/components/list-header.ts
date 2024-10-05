import { DataSelector, data } from '@/lib/dom';

export interface ListHeaderViewProps {
	selector: DataSelector;
	text: string;
	textSecondPart?: string;
}

export function ListHeaderView({ selector, text, textSecondPart }: ListHeaderViewProps) {
	return `
        <h2 ${data(
			'selector',
			selector
		)} class="text-xl font-semibold mb-4"><span>${text}</span>${textSecondPart ? ' - <span>' + textSecondPart + '</span>' : ''}</h2>
     `;
}
