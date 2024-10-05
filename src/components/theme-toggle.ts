import { IView } from '@/components/iview';
import { data, qs, selector } from '@/lib/dom';
import { TranslationService } from '@/services/translation-service';
import { store } from '@/store';
import { changeTheme } from '@/store/actions/themeActions';
import { Theme } from '@/types';

export interface ThemeToggleProps {
	theme: Theme;
}

export type ThemeToggleState = ThemeToggleProps;

export class ThemeToggleView implements IView {
	private state: ThemeToggleState;
	private sunIcon: HTMLSpanElement = document.createElement('span');
	private moonIcon: HTMLSpanElement = document.createElement('span');
	private unsubscribe: () => void;

	constructor(props: ThemeToggleProps) {
		this.state = props;
		this.unsubscribe = store.subscribe(this.updateState.bind(this));
	}

	private updateState() {
		const globalState = store.getState();
		if (this.state.theme !== globalState.theme) {
			this.state = {
				...this.state,
				theme: globalState.theme,
			};
			this.render();
		}
	}

	private setTheme() {
		// Check if user prefers dark mode or has set a theme before
		const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const userTheme = store.getState().theme;

		// Set theme on page load
		if (userTheme === 'dark' || (!userTheme && userPrefersDark)) {
			document.documentElement.classList.add('dark');
			changeTheme('dark');
			this.showDarkThemeIcon();
		} else {
			document.documentElement.classList.remove('dark');
			changeTheme('light');
			this.showLightThemeIcon();
		}

		// Toggle theme button logic
		const themeToggle = qs(selector('theme-toggle-button'))!;
		themeToggle.addEventListener('click', () => {
			document.documentElement.classList.toggle('dark');

			if (document.documentElement.classList.contains('dark')) {
				this.showDarkThemeIcon();
				changeTheme('dark');
			} else {
				this.showLightThemeIcon();
				changeTheme('light');
			}
		});
	}

	private showLightThemeIcon() {
		this.sunIcon.classList.remove('hidden');
		this.moonIcon.classList.add('hidden');
	}

	private showDarkThemeIcon() {
		this.sunIcon.classList.add('hidden');
		this.moonIcon.classList.remove('hidden');
	}

	private template() {
		return `
            <button
                ${data('selector', 'theme-toggle-button')}
                aria-label=${TranslationService.t('toggleTheme')}
                class="w-10 h-10 rounded-full shadow-md bg-gray-300 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-400"
            >
                <span
                    ${data('selector', 'light-theme-icon')}
                    class="text-lg"
                    role="img"
                    aria-label=${TranslationService.t('sun')}
                    >☀️</span
                >
                <span
                    ${data('selector', 'dark-theme-icon')}
                    class="text-lg"
                    role="img"
                    aria-label=${TranslationService.t('moon')}
                    >🌙</span
                >
            </button>
        `;
	}

	render() {
		const root = qs(selector('theme-toggle-container'))!;
		root.innerHTML = this.template();

		this.sunIcon = qs(selector('light-theme-icon'))!;
		this.moonIcon = qs(selector('dark-theme-icon'))!;
		this.setTheme();

		return root.innerHTML;
	}

	destroy() {
		this.unsubscribe();
	}
}
