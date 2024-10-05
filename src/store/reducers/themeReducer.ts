import { Action, AppState } from '@/types';

export function themeReducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		case 'SET_THEME':
			return {
				...state,
				theme: action.payload,
			};
		default:
			return state;
	}
}
