import { DataSelector, data } from '@/lib/dom';
import { TranslationService } from '@/services/translation-service';

export interface AddButtonViewProps {
	selector: DataSelector;
}

export function AddButtonView({ selector }: AddButtonViewProps) {
	return `
            <button ${data('selector', selector)}
                aria-label=${TranslationService.t('actions.add')}
                class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400"
            >${TranslationService.t('actions.add')}</button>
        `;
}
