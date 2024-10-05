import { TimeUnit } from '@/lib/ms';
export * from '@/components/locale-selector';
export * from '@/components/theme-toggle';

export type Locale = 'en' | 'pt-br' | 'es' | 'ua' | 'ru';

export type Theme = 'light' | 'dark';

export type TaskPriority = 'high' | 'medium' | 'low' | 'none'; // | 'urgent'
export type TaskFilterPriority = 'all' | TaskPriority;

export type TaskStatus = 'active' | 'completed';
export type TaskFilterStatus = 'all' | TaskStatus;

export type TaskFilters = {
	status: TaskFilterStatus;
	priority: TaskFilterPriority;
};

export type SortingOrder = 'asc' | 'desc';
export type TaskTime = `${number}${TimeUnit}` | null;

export interface Task {
	id: string;
	listId: string;
	text: string;
	completed: boolean;
	priority: TaskPriority;
	createdAt: number;
	completedAt: number | null;
	estimateTime: TaskTime | 'none';
	remainingTime: TaskTime | null;
	timeSpent: number;
	// order: number;
}

export interface TaskList {
	id: string;
	name: string;
	isActive: boolean;
}

export interface AppState {
	theme: Theme;
	locale: Locale;
	lists: TaskList[];
	tasks: Task[];
	filters: TaskFilters;
	// sort: {
	//     date: SortingOrder,
	//     priority: SortingOrder
	//     // completed: SortingOrder
	// }
}

export type StoreListener = () => void;

export type Reducer = (state: AppState, action: Action) => AppState;

export type ListAction =
	| { type: 'ADD_LIST'; payload: TaskList }
	| { type: 'EDIT_LIST'; payload: TaskList }
	| { type: 'REMOVE_LIST'; payload: string }
	| { type: 'SET_ACTIVE_LIST'; payload: string | null };

export type TaskAction =
	| { type: 'ADD_TASK'; payload: Task }
	| { type: 'EDIT_TASK'; payload: Partial<Task> & { id: string } }
	| { type: 'REMOVE_TASK'; payload: string }
	| { type: 'REMOVE_COMPLETED_TASKS'; payload: string }
	| { type: 'UPDATE_TASKS_REMAINING_TIME'; payload: null }
	| { type: 'MARK_ALL_TASKS_AS_COMPLETED'; payload: string }
	| { type: 'TOGGLE_ALL_TASKS_AS_COMPLETED'; payload: { listId: string; checked: boolean } };
// | { type: 'REORDER_TASKS'; payload: { taskId: string; newOrder: number } }

export type FilterAction =
	| { type: 'SET_FILTER_STATUS'; payload: AppState['filters']['status'] }
	| { type: 'SET_FILTER_PRIORITY'; payload: AppState['filters']['priority'] };

export type ThemeAction = { type: 'SET_THEME'; payload: Theme };

export type LocaleAction = { type: 'SET_LOCALE'; payload: Locale };

export type Action = ListAction | TaskAction | FilterAction | ThemeAction | LocaleAction;
