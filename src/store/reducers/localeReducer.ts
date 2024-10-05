import { Action, AppState } from '@/types';

export function localeReducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		case 'SET_LOCALE':
			return {
				...state,
				locale: action.payload,
			};
		default:
			return state;
	}
}
