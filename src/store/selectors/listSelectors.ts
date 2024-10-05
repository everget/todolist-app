import { AppState, TaskList } from '@/types';

export const getListById = (state: AppState, id: string | null): TaskList | null => {
	return state.lists.find((list) => list.id === id) || null;
};

export const getActiveList = (state: AppState): TaskList | null => {
	return state.lists.find((list) => list.isActive) || null;
};
