import {
    createAsyncThunk,
    createSelector,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit';
import { sanitize } from '@/shared/utils/sanitize';
import { truncate } from '@/shared/utils/truncate';
import { addNotification } from '@/modules/notifications/notifications-slice';
import { type TaskList } from '@/types';
import { config } from '@/config/config';
import type { RootState } from '@/store/store';
import type { AppThunkConfig } from '@/store/thunk-extra';

// Async thunks - DB write first (via repo), then Redux state updates via extraReducers.
export const addList = createAsyncThunk<TaskList, TaskList, AppThunkConfig>(
    'lists/add',
    async (list, { extra, dispatch }) => {
        try {
            const sanitizedList = {
                ...list,
                name: truncate(sanitize(list.name), config.validation.listNameMaxLength),
            };
            await extra.listRepo.add(sanitizedList);
            return sanitizedList;
        } catch (e: any) {
            dispatch(addNotification({ message: e.message, type: 'error' }));
            throw e;
        }
    }
);

type ListEditData = Partial<TaskList> & { id: string };

export const editList = createAsyncThunk<ListEditData, ListEditData, AppThunkConfig>(
    'lists/edit',
    async (payload, { extra, dispatch }) => {
        try {
            const { id, ...updates } = payload;
            const sanitizedUpdates: ListEditData = { id };
            if (updates.name !== undefined) {
                sanitizedUpdates.name = truncate(
                    sanitize(updates.name),
                    config.validation.listNameMaxLength
                );
                await extra.listRepo.update(id, { name: sanitizedUpdates.name });
            }
            return sanitizedUpdates;
        } catch (e: any) {
            dispatch(addNotification({ message: e.message, type: 'error' }));
            throw e;
        }
    }
);

export const removeList = createAsyncThunk<string, string, AppThunkConfig>(
    'lists/remove',
    async (id, { extra, dispatch }) => {
        try {
            await extra.listRepo.remove(id);
            // Explicit cascade for in-memory adapter; safe no-op for PGlite (FK cascade).
            await extra.taskRepo.removeByListId(id);
            return id;
        } catch (e: any) {
            dispatch(addNotification({ message: e.message, type: 'error' }));
            throw e;
        }
    }
);

export const setActiveList = createAsyncThunk<string | null, string | null, AppThunkConfig>(
    'lists/setActive',
    async (listId, { extra, getState, dispatch }) => {
        try {
            const state = getState() as RootState;
            const currentActive = state.lists.items.find((l) => l.isActive);

            // Optimization: only update the previous and new active lists
            // instead of a global updateAll({ isActive: false }).
            if (currentActive && currentActive.id !== listId) {
                await extra.listRepo.update(currentActive.id, { isActive: false });
            }

            if (listId && currentActive?.id !== listId) {
                await extra.listRepo.update(listId, { isActive: true });
            }
            return listId;
        } catch (e: any) {
            dispatch(addNotification({ message: e.message, type: 'error' }));
            throw e;
        }
    }
);

export interface ListsState {
    items: TaskList[];
    activeListId: string | null;
    error: string | null;
}

const initialState: ListsState = {
    items: [],
    activeListId: null,
    error: null,
};

export const listsSlice = createSlice({
    name: 'lists',
    initialState,
    reducers: {
        hydrate(state, action: PayloadAction<TaskList[]>) {
            state.items = action.payload;
            state.activeListId = action.payload.find((l) => l.isActive)?.id ?? null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addList.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(editList.fulfilled, (state, action) => {
                const list = state.items.find((l) => l.id === action.payload.id);
                if (list && action.payload.name !== undefined) {
                    list.name = action.payload.name;
                }
            })
            .addCase(removeList.fulfilled, (state, action) => {
                state.items = state.items.filter((l) => l.id !== action.payload);
            })
            .addCase(setActiveList.fulfilled, (state, action) => {
                const listId = action.payload;
                state.activeListId = listId;
                state.items.forEach((l) => {
                    l.isActive = l.id === listId;
                });
                state.error = null;
            })
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action: any) => {
                    state.error = action.error?.message || 'Unknown error';
                }
            );
    },
});

// Selectors

const selectItems = (state: RootState) => state.lists.items;

export const selectAllLists = selectItems;

export const selectActiveListId = (state: RootState) => state.lists.activeListId;

export const selectActiveList = createSelector(
    [selectItems, selectActiveListId],
    (items, activeId) => items.find((l) => l.id === activeId) ?? null
);

export const selectListById = createSelector(
    [selectItems, (_: RootState, id: string | null) => id],
    (items, id) => items.find((l) => l.id === id) ?? null
);
