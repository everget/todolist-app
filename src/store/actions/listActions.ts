import { TaskList } from '@/types';
import { store } from '..';

export const addList = (list: TaskList) => store.dispatch({ type: 'ADD_LIST', payload: list });

export const editList = (list: TaskList) => store.dispatch({ type: 'EDIT_LIST', payload: list });

export const removeList = (id: string) => store.dispatch({ type: 'REMOVE_LIST', payload: id });

export const setActiveList = (id: string) =>
	store.dispatch({ type: 'SET_ACTIVE_LIST', payload: id });
