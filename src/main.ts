import { ListOfListsView } from './components/list-of-lists';
import { ListOfTasksView } from './components/list-of-tasks';
import { LocaleSelectorView } from './components/locale-selector';
import { ThemeToggleView } from './components/theme-toggle';
import './index.css';
import { store } from './store';
import { getActiveList, getFilteredTasks, getRemainingTasksCount } from './store/selectors';

document.addEventListener('DOMContentLoaded', () => {
	const initialState = store.getState();

	new LocaleSelectorView({ locale: initialState.locale }).render();
	new ThemeToggleView({ theme: initialState.theme }).render();

	new ListOfListsView({
		lists: initialState.lists,
	}).render();

	new ListOfTasksView({
		activeList: getActiveList(initialState),
		tasks: getFilteredTasks(initialState),
		remainingTasksCount: getRemainingTasksCount(initialState),
		filters: initialState.filters,
	}).render();

	// TODO
	// setInterval(() => {
	// 	store.dispatch({ type: 'UPDATE_TASKS_REMAINING_TIME', payload: null });
	// }, 1000 * 60);
});
