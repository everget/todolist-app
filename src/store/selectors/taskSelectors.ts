import { AppState } from '@/types';
import { getActiveList } from './listSelectors';

export const getCompletedTasks = (state: AppState) => {
	const activeList = getActiveList(state);
	if (activeList === null) {
		return [];
	}

	return getTasksByListId(state, activeList.id).filter((task) => task.completed);
};

export const getActiveTasks = (state: AppState) => {
	const activeList = getActiveList(state);
	if (activeList === null) {
		return [];
	}

	return getTasksByListId(state, activeList.id).filter((task) => !task.completed);
};

export const getFilteredTasks = (state: AppState) => {
	const activeList = getActiveList(state);
	if (activeList === null) {
		return [];
	}

	const { filters } = state;
	return getTasksByListId(state, activeList.id).filter((task) => {
		const statusMatch =
			filters.status === 'all' ||
			(filters.status === 'completed' && task.completed) ||
			(filters.status === 'active' && !task.completed);
		const priorityMatch = filters.priority === 'all' || task.priority === filters.priority;
		return statusMatch && priorityMatch;
	});
};

export const getTaskById = (state: AppState, id: string) => {
	return state.tasks.find((task) => task.id === id) || null;
};

export const getRemainingTasksCount = (state: AppState) => {
	const activeList = getActiveList(state);
	if (activeList === null) {
		return 0;
	}

	return getActiveTasks(state).length;
};

export const getTasksByListId = (state: AppState, listId: string | null) => {
	if (listId === null) {
		return [];
	}
	return state.tasks.filter((task) => task.listId === listId);
};
