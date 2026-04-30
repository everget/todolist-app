import { configureStore } from '@reduxjs/toolkit';
import { filtersSlice } from '@/modules/todolist/tasks/store/filters-slice';
import { listsSlice } from '@/modules/todolist/lists/store/lists-slice';
import { localeSlice } from '@/modules/preferences/store/locale-slice';
import { tasksSlice } from '@/modules/todolist/tasks/store/tasks-slice';
import { themeSlice } from '@/modules/preferences/store/theme-slice';
import { createLocalStorageRepositories } from '@/infrastructure/repository-factory';
import { notificationsSlice } from '@/modules/notifications/notifications-slice';
import { appSlice } from './app-slice';

const repositories = createLocalStorageRepositories();

// Synchronous preferences load - must complete before the store is created to
// prevent a flash of the default theme or locale on first render.
const preloadedPrefs = repositories.preferencesRepo.load();

export const store = configureStore({
    reducer: {
        app: appSlice.reducer,
        lists: listsSlice.reducer,
        tasks: tasksSlice.reducer,
        filters: filtersSlice.reducer,
        theme: themeSlice.reducer,
        locale: localeSlice.reducer,
        notifications: notificationsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: { extraArgument: repositories },
        }),
    // Cast as unknown first: RTK v2 requires reducers to accept `undefined` as
    // preloaded state, but createSlice types them as `Reducer<S>` (no undefined).
    // The runtime shape IS correct; this cast bypasses the inference mismatch.
    preloadedState: preloadedPrefs as unknown as undefined,
});

store.subscribe(() => {
    const s = store.getState();
    repositories.preferencesRepo.save({
        theme: s.theme,
        locale: s.locale,
        filters: s.filters,
    });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
