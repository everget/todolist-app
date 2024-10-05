import { Task } from '@/types';
import { store } from '..';

export const addTask = (task: Task) => store.dispatch({ type: 'ADD_TASK', payload: task });

export const editTask = (task: Partial<Task> & { id: string }) =>
	store.dispatch({ type: 'EDIT_TASK', payload: task });

export const removeTask = (id: string) => store.dispatch({ type: 'REMOVE_TASK', payload: id });

export const removeCompletedTasks = (listId: string) =>
	store.dispatch({ type: 'REMOVE_COMPLETED_TASKS', payload: listId });

export const markAllTasksAsCompleted = (listId: string) =>
	store.dispatch({ type: 'MARK_ALL_TASKS_AS_COMPLETED', payload: listId });

export const toggleAllTasksCompleted = (payload: { listId: string; checked: boolean }) =>
	store.dispatch({ type: 'TOGGLE_ALL_TASKS_AS_COMPLETED', payload });

// export const reorderTasks = (taskId: string, newOrder: number) =>
// 	store.dispatch({ type: 'REORDER_TASKS', payload: { taskId, newOrder } });
