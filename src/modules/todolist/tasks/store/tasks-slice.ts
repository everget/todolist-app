import {
    createAsyncThunk,
    createSelector,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit';
import { sanitize } from '@/shared/utils/sanitize';
import { truncate } from '@/shared/utils/truncate';
import { addNotification } from '@/modules/notifications/notifications-slice';
import { type Task } from '@/types';
import { removeList, selectActiveListId } from '@/modules/todolist/lists/store/lists-slice';
import { config } from '@/config/config';
import type { RootState } from '@/store/store';
import type { AppThunkConfig } from '@/store/thunk-extra';

// Async thunks - DB write first (via repo), then Redux state updates via extraReducers.
export const addTask = createAsyncThunk<Task, Task, AppThunkConfig>(
    'tasks/add',
    async (task, { extra, dispatch }) => {
        try {
            const sanitizedTask = {
                ...task,
                text: truncate(sanitize(task.text), config.validation.taskTextMaxLength),
            };
            await extra.taskRepo.add(sanitizedTask);
            return sanitizedTask;
        } catch (e: any) {
            dispatch(addNotification({ message: e.message, type: 'error' }));
            throw e;
        }
    }
);

type TaskEditData = Partial<Task> & { id: string };

export const editTask = createAsyncThunk<TaskEditData, TaskEditData, AppThunkConfig>(
    'tasks/edit',
    async (payload, { extra, dispatch }) => {
        try {
            const { id, ...updates } = payload;
            const sanitizedUpdates: TaskEditData = { id };
            if (updates.text !== undefined) {
                sanitizedUpdates.text = truncate(
                    sanitize(updates.text),
                    config.validation.taskTextMaxLength
                );
            }

            Object.assign(sanitizedUpdates, updates);

            const { id: _, ...repoUpdates } = sanitizedUpdates;
            await extra.taskRepo.update(id, repoUpdates);
            return sanitizedUpdates;
        } catch (e: any) {
            dispatch(addNotification({ message: e.message, type: 'error' }));
            throw e;
        }
    }
);

export const removeTask = createAsyncThunk<string, string, AppThunkConfig>(
    'tasks/remove',
    async (id, { extra, dispatch }) => {
        try {
            await extra.taskRepo.remove(id);
            return id;
        } catch (e: any) {
            dispatch(addNotification({ message: e.message, type: 'error' }));
            throw e;
        }
    }
);

export const removeCompletedTasks = createAsyncThunk<string, string, AppThunkConfig>(
    'tasks/removeCompleted',
    async (listId, { extra, dispatch }) => {
        try {
            await extra.taskRepo.removeCompleted(listId);
            return listId;
        } catch (e: any) {
            dispatch(addNotification({ message: e.message, type: 'error' }));
            throw e;
        }
    }
);

export const toggleAllTasksCompleted = createAsyncThunk<
    { listId: string; checked: boolean; completedAt: number | null },
    { listId: string; checked: boolean },
    AppThunkConfig
>('tasks/toggleAll', async ({ listId, checked }, { extra, dispatch }) => {
    try {
        const now = Date.now();
        const completedAt = checked ? now : null;
        await extra.taskRepo.updateAll(listId, { completed: checked, completedAt });
        return { listId, checked, completedAt };
    } catch (e: any) {
        dispatch(addNotification({ message: e.message, type: 'error' }));
        throw e;
    }
});

export const markAllTasksAsCompleted = createAsyncThunk<
    { listId: string; completedAt: number },
    string,
    AppThunkConfig
>('tasks/markAllCompleted', async (listId, { extra, dispatch }) => {
    try {
        const now = Date.now();
        await extra.taskRepo.updateIncomplete(listId, { completed: true, completedAt: now });
        return { listId, completedAt: now };
    } catch (e: any) {
        dispatch(addNotification({ message: e.message, type: 'error' }));
        throw e;
    }
});

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: { items: [], error: null } as { items: Task[]; error: string | null },
    reducers: {
        hydrate(state, action: PayloadAction<Task[]>) {
            state.items = action.payload;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTask.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(editTask.fulfilled, (state, action) => {
                const task = state.items.find((t) => t.id === action.payload.id);
                if (task) Object.assign(task, action.payload);
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                state.items = state.items.filter((t) => t.id !== action.payload);
            })
            .addCase(removeCompletedTasks.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    (t) => !(t.listId === action.payload && t.completed)
                );
            })
            .addCase(toggleAllTasksCompleted.fulfilled, (state, action) => {
                const { listId, checked, completedAt } = action.payload;
                state.items.forEach((t) => {
                    if (t.listId === listId) {
                        t.completed = checked;
                        t.completedAt = completedAt;
                    }
                });
            })
            .addCase(markAllTasksAsCompleted.fulfilled, (state, action) => {
                const { listId, completedAt } = action.payload;
                state.items.forEach((t) => {
                    if (t.listId === listId && !t.completed) {
                        t.completed = true;
                        t.completedAt = completedAt;
                    }
                });
            })
            // Cascade delete when a list is removed.
            .addCase(removeList.fulfilled, (state, action) => {
                state.items = state.items.filter((t) => t.listId !== action.payload);
            })
            .addMatcher(
                (action) => action.type.startsWith('tasks/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('tasks/') && action.type.endsWith('/rejected'),
                (state, action: any) => {
                    state.error = action.error?.message || 'Unknown error';
                }
            );
    },
});

// Selectors

const selectTaskItems = (state: RootState) => state.tasks.items;
const selectFilters = (state: RootState) => state.filters;

export const selectActiveListTasks = createSelector(
    [selectTaskItems, selectActiveListId],
    (items, listId) => (listId ? items.filter((t) => t.listId === listId) : [])
);

export const selectFilteredTasks = createSelector(
    [selectActiveListTasks, selectFilters],
    (tasks, filters) =>
        tasks.filter((task) => {
            const statusMatch =
                filters.status === 'all' ||
                (filters.status === 'completed' && task.completed) ||
                (filters.status === 'active' && !task.completed);
            const priorityMatch = filters.priority === 'all' || task.priority === filters.priority;
            return statusMatch && priorityMatch;
        })
);

export const selectRemainingTasksCount = createSelector(
    selectActiveListTasks,
    (tasks) => tasks.filter((t) => !t.completed).length
);

export const selectCompletedTasksCount = createSelector(
    selectActiveListTasks,
    (tasks) => tasks.filter((t) => t.completed).length
);

export const selectActiveTasksCount = createSelector(
    selectActiveListTasks,
    (tasks) => tasks.length
);

export const selectTaskById = createSelector(
    [selectTaskItems, (_: RootState, id: string) => id],
    (items, id) => items.find((t) => t.id === id) ?? null
);
