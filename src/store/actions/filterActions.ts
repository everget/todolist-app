import { AppState } from '@/types';
import { store } from '..';

export const setFilterStatus = (status: AppState['filters']['status']) =>
	store.dispatch({ type: 'SET_FILTER_STATUS', payload: status });

export const setFilterPriority = (priority: AppState['filters']['priority']) =>
	store.dispatch({ type: 'SET_FILTER_PRIORITY', payload: priority });

// export const setFilterSortByDate = (sort: AppState['filters']['sort']) =>
// 	store.dispatch({ type: 'SET_FILTER_SORT_BY_DATE', payload: { sort });
