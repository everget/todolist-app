import { isPlainObject } from '@/lib/is-plain-object';
import { Action, AppState, Reducer, StoreListener } from '@/types';
import { rootReducer } from './reducers';

export const LOCALE_STORAGE_KEY = 'todolistapp++';

class Store {
	private state: AppState;
	private reducer: Reducer;
	private listeners: Set<StoreListener> = new Set();
	private storage: Storage | null = null;

	constructor(rootReducer: Reducer, initialState: AppState) {
		this.state = initialState;
		this.initStorage();
		if (this.storage !== null) {
			this.loadFromStorage();
		}
		this.reducer = rootReducer;
	}

	getState(): Readonly<AppState> {
		return this.state;
	}

	dispatch(action: Action): void {
		this.state = this.reducer(this.state, action);
		this.saveToStorage();
		this.notifyListeners();
	}

	subscribe(listener: StoreListener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private initStorage(): void {
		if (typeof window !== 'undefined' && window.localStorage) {
			this.storage = window.localStorage;
		} else {
			// Fallback for non-browser environments
			this.storage = null;
			console.warn('localStorage is not available in this environment');
		}
	}

	private notifyListeners(): void {
		this.listeners.forEach((listener) => listener());
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private parseJSON(value: any) {
		try {
			return JSON.parse(value);
		} catch {
			return null;
		}
	}

	private loadFromStorage(): AppState | null {
		if (!this.storage) {
			return null;
		}

		const savedState = this.parseJSON(this.storage.getItem(LOCALE_STORAGE_KEY));
		if (isPlainObject(savedState)) {
			const {
				theme = this.state.theme,
				locale = this.state.locale,
				lists,
				tasks,
				filters,
			} = savedState;
			const newState: AppState = {
				theme,
				locale,
				lists: Array.isArray(lists) ? lists : this.state.lists,
				tasks: Array.isArray(tasks) ? tasks : this.state.tasks,
				filters: isPlainObject(filters) ? filters : this.state.filters,
			};

			this.state = {
				...this.state,
				...newState,
			};
		}

		return savedState;
	}

	private saveToStorage() {
		if (this.storage) {
			this.storage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(this.state));
		}
	}
}

export const initialState: AppState = {
	theme: 'dark',
	locale: 'en',
	lists: [],
	tasks: [],
	filters: {
		status: 'all',
		priority: 'all',
	},
};

export const store = new Store(rootReducer, initialState);
