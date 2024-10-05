import { Action, AppState } from '@/types';
import { filterReducer } from './filterReducer';
import { listReducer } from './listReducer';
import { localeReducer } from './localeReducer';
import { taskReducer } from './taskReducer';
import { themeReducer } from './themeReducer';

export function rootReducer(state: AppState, action: Action): AppState {
	// TODO: optimize
	switch (action.type) {
		case 'SET_THEME':
			return themeReducer(state, action);
		case 'SET_LOCALE':
			return localeReducer(state, action);
		case 'ADD_LIST':
		case 'EDIT_LIST':
		case 'REMOVE_LIST':
		case 'SET_ACTIVE_LIST':
			return listReducer(state, action);
		case 'ADD_TASK':
		case 'EDIT_TASK':
		case 'REMOVE_TASK':
		case 'REMOVE_COMPLETED_TASKS':
		case 'MARK_ALL_TASKS_AS_COMPLETED':
		case 'TOGGLE_ALL_TASKS_AS_COMPLETED':
		case 'UPDATE_TASKS_REMAINING_TIME':
			// case 'REORDER_TASKS':
			return taskReducer(state, action);
		case 'SET_FILTER_STATUS':
		case 'SET_FILTER_PRIORITY':
			return filterReducer(state, action);
		default:
			console.error('Unknown action', action);
			return state;
	}
}
