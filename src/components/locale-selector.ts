import { IView } from '@/components/iview';
import { closestAncestor, data, qs, selector } from '@/lib/dom';
import { TranslationService } from '@/services/translation-service';
import { store } from '@/store';
import { changeLocale } from '@/store/actions/localeActions';
import { Locale } from '@/types';

export interface LocaleDescriptor {
	title: string;
	code: Locale;
	flagSrc: string;
	flagAlt: string | null;
}

export const LOCALES: Record<Locale, LocaleDescriptor> = {
	en: {
		title: 'English',
		code: 'en',
		flagSrc: 'public/en.svg',
		flagAlt: TranslationService.t('flags.en'),
	},
	'pt-br': {
		title: 'Português',
		code: 'pt-br',
		flagSrc: 'public/br.svg',
		flagAlt: TranslationService.t('flags.br'),
	},
	es: {
		title: 'Español',
		code: 'es',
		flagSrc: 'public/es.svg',
		flagAlt: TranslationService.t('flags.es'),
	},
	ua: {
		title: 'Українська',
		code: 'ua',
		flagSrc: 'public/ua.svg',
		flagAlt: TranslationService.t('flags.ua'),
	},
	ru: {
		title: 'Русский',
		code: 'ru',
		flagSrc: 'public/ru.svg',
		flagAlt: TranslationService.t('flags.ru'),
	},
};

export const SUPPORTED_LOCALES: Locale[] = Object.keys(LOCALES) as Locale[];

export interface LocaleSelectorProps {
	locale: Locale;
}

export type LocaleSelectorState = LocaleSelectorProps;

export class LocaleSelectorView implements IView {
	private state: LocaleSelectorState;
	private root: HTMLElement;
	private unsubscribe: () => void;
	private onToggleButtonClickBinded = this.onToggleButtonClick.bind(this);
	private onListClickBinded = this.onListClick.bind(this);

	constructor(props: LocaleSelectorProps) {
		this.state = props;
		this.root = qs(selector('locale-selector-container'))!;
		this.unsubscribe = store.subscribe(this.updateState.bind(this));
		if (!props.locale) {
			this.detectUserLocale();
		}
	}

	private updateState() {
		this.state = {
			locale: store.getState().locale,
		};
		this.render();
	}

	private addListeners() {
		const localeList = qs(selector('locale-list'))!;
		if (localeList) {
			localeList.addEventListener('click', this.onListClickBinded);
		}

		const LocaleSelectorButton = qs(selector('locale-selector-button'))!;
		if (LocaleSelectorButton) {
			LocaleSelectorButton.addEventListener('click', this.onToggleButtonClickBinded);
		}
	}

	private removeListeners() {
		const localeList = qs(selector('locale-list'));
		if (localeList) {
			localeList.removeEventListener('click', this.onListClickBinded);
		}

		const LocaleSelectorButton = qs(selector('locale-selector-button'));
		if (LocaleSelectorButton) {
			LocaleSelectorButton.removeEventListener('click', this.onToggleButtonClickBinded);
		}
	}

	private onListClick(event: Event) {
		const localeDropdown = qs(selector('locale-dropdown'))!;
		const selectedLocale = closestAncestor(
			event.target as HTMLElement,
			selector('locale-option')
		)!.getAttribute(data('locale')) as Locale;

		this.setLocale(selectedLocale);
		localeDropdown.classList.add('hidden');
	}

	private onToggleButtonClick() {
		const localeDropdown = qs(selector('locale-dropdown'))!;
		localeDropdown.classList.toggle('hidden');
	}

	private detectUserLocale() {
		const browserLocale = navigator.language.toLowerCase(); // Get the browser language
		let selectedLocale = this.state.locale;

		for (const locale of SUPPORTED_LOCALES) {
			if (browserLocale.startsWith(locale)) {
				selectedLocale = locale;
				break;
			}
		}

		this.setLocale(selectedLocale);
	}

	private setLocale(locale: Locale) {
		this.state.locale = locale;
		document.documentElement.setAttribute('lang', locale);
		changeLocale(locale);
		this.render();
	}

	render() {
		this.removeListeners();
		this.root.innerHTML = this.template();
		this.addListeners();
		return this.root.innerHTML;
	}

	private listItemTemplate({ title, code, flagSrc, flagAlt }: LocaleDescriptor) {
		return `
            <li
                ${data('selector', 'locale-option')}
                ${data('locale', code as 'code')}
                class="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            >
                <img
                    src="${flagSrc}"
                    alt="${flagAlt}"
                    class="w-6 h-6 mr-2"
                />
                <span>${title}</span>
            </li>
        `;
	}

	private template() {
		return `
            <div ${data('selector', 'locale-selector')} class="relative inline-block">
                <button
                    ${data('selector', 'locale-selector-button')}
                    class="flex items-center mr-4 px-4 py-1 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none"
                >
                    <span class="mr-2">${this.state.locale.toUpperCase()}</span>
                    <img
                        src="${LOCALES[this.state.locale].flagSrc}"
                        alt="${LOCALES[this.state.locale].flagAlt}"
                        class="w-8 h-8"
                    />
                    <svg
                        class="ml-2 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                        ></path>
                    </svg>
                </button>

                <div
                    ${data('selector', 'locale-dropdown')}
                    class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10"
                >
                    <ul ${data('selector', 'locale-list')} class="py-1 text-sm">
                        ${Object.values(LOCALES)
							.map((locale) => this.listItemTemplate(locale))
							.join('\n')}
                    </ul>
                </div>
            </div>
        `;
	}

	destroy() {
		this.unsubscribe();
	}
}
