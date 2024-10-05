import { DataSelector, data } from '@/lib/dom';
import { TranslationService } from '@/services/translation-service';

export interface RemoveButtonViewProps {
	selector: DataSelector;
}

export function RemoveButtonView({ selector }: RemoveButtonViewProps) {
	return `
            <button
              ${data('selector', selector)}
              aria-label=${TranslationService.t('actions.remove')}
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-700 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span class="ml-2 hidden 3xl:inline">${TranslationService.t('actions.remove')}</span>
            </button>
        `;
}
