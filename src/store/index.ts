export { store } from './store';
export type { RootState, AppDispatch } from './store';

export { bootstrapApp } from './app-slice';

export {
    addList,
    editList,
    removeList,
    setActiveList,
} from '@/modules/todolist/lists/store/lists-slice';

export {
    addTask,
    editTask,
    removeTask,
    removeCompletedTasks,
    toggleAllTasksCompleted,
    markAllTasksAsCompleted,
} from '@/modules/todolist/tasks/store/tasks-slice';

export { setFilterStatus, setFilterPriority } from '@/modules/todolist/tasks/store/filters-slice';

export { setTheme } from '@/modules/preferences/store/theme-slice';
export { setLocale } from '@/modules/preferences/store/locale-slice';
