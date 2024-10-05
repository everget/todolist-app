import { data, DataSelector } from '@/lib/dom';
import { TranslationService } from '@/services/translation-service';

export interface EditButtonViewProps {
	selector: DataSelector;
}

export function EditButtonView({ selector }: EditButtonViewProps) {
	return `
			<button ${data('selector', selector)}
			  aria-label=${TranslationService.t('actions.edit')}
			  class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
			>
			  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
			  </svg>
			  <span class="ml-2 hidden 3xl:inline">${TranslationService.t('actions.edit')}</span>
			</button>
		`;
}
