import { Action, AppState } from '@/types';

export function filterReducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		case 'SET_FILTER_STATUS':
			return {
				...state,
				filters: { ...state.filters, status: action.payload },
			};
		case 'SET_FILTER_PRIORITY':
			return {
				...state,
				filters: { ...state.filters, priority: action.payload },
			};
		default:
			return state;
	}
}
