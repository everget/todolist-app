import { describe, expect, it, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
    notificationsSlice,
    selectNotifications,
} from '@/modules/notifications/notifications-slice';
import { tasksSlice } from '@/modules/todolist/tasks/store/tasks-slice';
import {
    addList,
    editList,
    listsSlice,
    removeList,
    selectActiveList,
    selectAllLists,
    selectListById,
    setActiveList,
} from './lists-slice';
import type { ListsState } from './lists-slice';
import type { TaskList } from '@/types';
import type { RootState } from '@/store/store';

const L1: TaskList = { id: 'l1', name: 'List 1', isActive: false };
const L2: TaskList = { id: 'l2', name: 'List 2', isActive: false };

function makeState(lists: TaskList[], tasks: any[] = []): RootState {
    return {
        app: { hydrationStatus: 'ready' },
        lists: {
            items: lists,
            activeListId: lists.find((l) => l.isActive)?.id ?? null,
            error: null,
        },
        tasks: { items: tasks },
        filters: { status: 'all', priority: 'all' },
        theme: 'light',
        locale: 'en',
    } as unknown as RootState;
}

const empty: ListsState = { items: [] };

describe('List store: adding, editing and removing lists', () => {
    it('starts with empty items', () => {
        expect(listsSlice.reducer(undefined, { type: '@@init' } as never).items).toEqual([]);
    });

    it('loading lists replaces whatever was in the store', () => {
        const state = listsSlice.reducer({ items: [L1] }, listsSlice.actions.hydrate([L2]));
        expect(state.items).toEqual([L2]);
    });

    it('loading an empty set of lists clears the store', () => {
        const state = listsSlice.reducer({ items: [L1] }, listsSlice.actions.hydrate([]));
        expect(state.items).toEqual([]);
    });

    it('adding a list appends it to the store', () => {
        const state = listsSlice.reducer({ items: [L1] }, addList.fulfilled(L2, '', L2));
        expect(state.items).toEqual([L1, L2]);
    });

    it('adding the first list puts it in the store', () => {
        const state = listsSlice.reducer(empty, addList.fulfilled(L1, '', L1));
        expect(state.items).toEqual([L1]);
    });

    it('editing a list updates its name', () => {
        const state = listsSlice.reducer(
            { items: [L1, L2] },
            editList.fulfilled({ id: 'l1', name: 'Renamed' }, '', { id: 'l1', name: 'Renamed' })
        );
        expect(state.items[0].name).toBe('Renamed');
        expect(state.items[1].name).toBe('List 2');
    });

    it('editing an unknown list changes nothing', () => {
        const state = listsSlice.reducer(
            { items: [L1] },
            editList.fulfilled({ id: 'unknown', name: 'X' }, '', { id: 'unknown', name: 'X' })
        );
        expect(state.items).toEqual([L1]);
    });

    it('removing a list deletes it from the store', () => {
        const state = listsSlice.reducer({ items: [L1, L2] }, removeList.fulfilled('l1', '', 'l1'));
        expect(state.items).toEqual([L2]);
    });

    it('activating a list marks it active and deactivates the others', () => {
        const state = listsSlice.reducer(
            { items: [{ ...L1, isActive: true }, L2] },
            setActiveList.fulfilled('l2', '', 'l2')
        );
        expect(state.items[0].isActive).toBe(false);
        expect(state.items[1].isActive).toBe(true);
    });

    it('activating nothing deactivates all lists', () => {
        const state = listsSlice.reducer(
            { items: [{ ...L1, isActive: true }] },
            setActiveList.fulfilled(null, '', null)
        );
        expect(state.items[0].isActive).toBe(false);
    });
});

describe('List store: reading list data', () => {
    it('returns all lists', () => {
        expect(selectAllLists(makeState([L1, L2]))).toEqual([L1, L2]);
    });

    it('returns an empty array when there are no lists', () => {
        expect(selectAllLists(makeState([]))).toEqual([]);
    });

    it('returns the active list', () => {
        const active = { ...L1, isActive: true };
        expect(selectActiveList(makeState([active, L2]))).toEqual(active);
    });

    it('returns null when no list is active', () => {
        expect(selectActiveList(makeState([L1, L2]))).toBeNull();
    });

    it('returns the list matching a given id', () => {
        expect(selectListById(makeState([L1, L2]), 'l2')).toEqual(L2);
    });

    it('returns null for an unknown id', () => {
        expect(selectListById(makeState([L1]), 'unknown')).toBeNull();
    });

    it('returns null when no id is given', () => {
        expect(selectListById(makeState([L1]), null)).toBeNull();
    });
});

describe('Saving lists: error handling', () => {
    const mockListRepo = {
        add: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        updateAll: vi.fn(),
    };
    const mockTaskRepo = {
        add: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        removeByListId: vi.fn(),
        removeCompleted: vi.fn(),
        updateAll: vi.fn(),
        updateIncomplete: vi.fn(),
    };
    let store: any;

    beforeEach(() => {
        vi.clearAllMocks();
        store = configureStore({
            reducer: {
                lists: listsSlice.reducer,
                tasks: tasksSlice.reducer,
                notifications: notificationsSlice.reducer,
            },
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    thunk: {
                        extraArgument: {
                            listRepo: mockListRepo,
                            taskRepo: mockTaskRepo,
                        },
                    },
                }),
        });
    });

    it('shows an error notification when saving a new list fails', async () => {
        const errorMsg = 'List DB Error';
        mockListRepo.add.mockRejectedValue(new Error(errorMsg));

        await store.dispatch(addList({ id: 'L1', name: 'New List', isActive: false }));

        const notifications = selectNotifications(store.getState());
        expect(notifications).toHaveLength(1);
        expect(notifications[0].message).toBe(errorMsg);
    });
});
