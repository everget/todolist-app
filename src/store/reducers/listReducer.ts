import { Action, AppState } from '@/types';

export function listReducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		case 'ADD_LIST':
			return {
				...state,
				lists: [...state.lists, action.payload],
			};
		case 'EDIT_LIST':
			return {
				...state,
				lists: state.lists.map((list) =>
					list.id === action.payload.id ? { ...list, name: action.payload.name } : list
				),
			};
		case 'REMOVE_LIST':
			return {
				...state,
				lists: state.lists.filter((list) => list.id !== action.payload),
				tasks: state.tasks.filter((task) => task.listId !== action.payload),
			};
		case 'SET_ACTIVE_LIST':
			return {
				...state,
				lists: state.lists.map((list) =>
					list.id === action.payload
						? { ...list, isActive: true }
						: { ...list, isActive: false }
				),
			};
		default:
			return state;
	}
}
