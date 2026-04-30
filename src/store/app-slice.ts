import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { listsSlice } from '@/modules/todolist/lists/store/lists-slice';
import { tasksSlice } from '@/modules/todolist/tasks/store/tasks-slice';
import type { Task, TaskList, HydrationStatus } from '@/types';
import type { RootState } from './store';
import type { AppThunkConfig } from './thunk-extra';

// Load all lists and tasks from the repository into Redux.
export const bootstrapApp = createAsyncThunk<void, void, AppThunkConfig>(
    'app/bootstrap',
    async (_, { dispatch, extra }) => {
        const { listRepo, taskRepo } = extra;
        const [lists, tasks] = await Promise.all([listRepo.getAll(), taskRepo.getAll()]);
        dispatch(listsSlice.actions.hydrate(lists as TaskList[]));
        dispatch(tasksSlice.actions.hydrate(tasks as Task[]));
    }
);

export const appSlice = createSlice({
    name: 'app',
    // Start in 'loading' so the UI shows a spinner before data is ready.
    initialState: { hydrationStatus: 'loading' } as { hydrationStatus: HydrationStatus },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(bootstrapApp.fulfilled, (state) => {
                state.hydrationStatus = 'ready';
            })
            .addCase(bootstrapApp.rejected, (state) => {
                state.hydrationStatus = 'error';
            });
    },
});

export const selectHydrationStatus = (state: RootState) => state.app.hydrationStatus;
