import { describe, expect, it, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
    notificationsSlice,
    selectNotifications,
} from '@/modules/notifications/notifications-slice';
import { listsSlice } from '@/modules/todolist/lists/store/lists-slice';
import {
    addTask,
    editTask,
    markAllTasksAsCompleted,
    removeCompletedTasks,
    removeTask,
    selectActiveListTasks,
    selectFilteredTasks,
    selectRemainingTasksCount,
    tasksSlice,
    toggleAllTasksCompleted,
} from './tasks-slice';
import type { TasksState } from './tasks-slice';
import { removeList } from '@/modules/todolist/lists/store/lists-slice';
import type { Task, TaskFilters, TaskList } from '@/types';
import type { RootState } from '@/store/store';

function makeTask(overrides: Partial<Task> = {}): Task {
    return {
        id: 't1',
        listId: 'l1',
        text: 'Test task',
        completed: false,
        priority: 'none',
        createdAt: 1000,
        completedAt: null,
        estimateTime: null,
        ...overrides,
    };
}

const T1 = makeTask({ id: 't1', text: 'Task 1' });
const T2 = makeTask({
    id: 't2',
    text: 'Task 2',
    completed: true,
    completedAt: 2000,
    priority: 'high',
});
const T3 = makeTask({ id: 't3', listId: 'l2', text: 'Task 3' });

const L1: TaskList = { id: 'l1', name: 'List 1', isActive: true };
const L2: TaskList = { id: 'l2', name: 'List 2', isActive: false };

function makeRootState(
    tasks: Task[],
    lists: TaskList[] = [L1, L2],
    filters: TaskFilters = { status: 'all', priority: 'all' }
): RootState {
    return {
        app: { hydrationStatus: 'ready' },
        lists: {
            items: lists,
            activeListId: lists.find((l) => l.isActive)?.id ?? null,
            error: null,
        },
        tasks: { items: tasks, error: null },
        filters,
        theme: 'light',
        locale: 'en',
    } as unknown as RootState;
}

const empty: TasksState = { items: [] };

describe('Task store: adding, editing and removing tasks', () => {
    it('starts with empty items', () => {
        expect(tasksSlice.reducer(undefined, { type: '@@init' } as never).items).toEqual([]);
    });

    it('loading tasks replaces whatever was in the store', () => {
        const state = tasksSlice.reducer({ items: [T1] }, tasksSlice.actions.hydrate([T2]));
        expect(state.items).toEqual([T2]);
    });

    it('adding a task appends it to the store', () => {
        const state = tasksSlice.reducer(empty, addTask.fulfilled(T1, '', T1));
        expect(state.items).toEqual([T1]);
    });

    it('editing a task updates its fields', () => {
        const state = tasksSlice.reducer(
            { items: [T1] },
            editTask.fulfilled({ id: 't1', text: 'Updated', completed: true }, '', {
                id: 't1',
                text: 'Updated',
                completed: true,
            })
        );
        expect(state.items[0].text).toBe('Updated');
        expect(state.items[0].completed).toBe(true);
    });

    it('editing an unknown task changes nothing', () => {
        const state = tasksSlice.reducer(
            { items: [T1] },
            editTask.fulfilled({ id: 'unknown', text: 'X' }, '', { id: 'unknown', text: 'X' })
        );
        expect(state.items).toEqual([T1]);
    });

    it('removing a task deletes it from the store', () => {
        const state = tasksSlice.reducer({ items: [T1, T2] }, removeTask.fulfilled('t1', '', 't1'));
        expect(state.items).toEqual([T2]);
    });

    it('clearing completed tasks removes only the completed ones in that list', () => {
        const state = tasksSlice.reducer(
            { items: [T1, T2, T3] },
            removeCompletedTasks.fulfilled('l1', '', 'l1')
        );
        expect(state.items).toEqual([T1, T3]);
    });

    it('toggling all tasks marks every task in the list as completed', () => {
        const completedAt = 9999;
        const state = tasksSlice.reducer(
            { items: [T1, T3] },
            toggleAllTasksCompleted.fulfilled({ listId: 'l1', checked: true, completedAt }, '', {
                listId: 'l1',
                checked: true,
            })
        );
        expect(state.items[0].completed).toBe(true);
        expect(state.items[0].completedAt).toBe(completedAt);
        expect(state.items[1].completed).toBe(false); // T3 is in l2
    });

    it('marking all as completed only updates incomplete tasks', () => {
        const completedAt = 8888;
        const state = tasksSlice.reducer(
            { items: [T1, T2] },
            markAllTasksAsCompleted.fulfilled({ listId: 'l1', completedAt }, '', 'l1')
        );
        expect(state.items[0].completed).toBe(true);
        expect(state.items[0].completedAt).toBe(completedAt);
        expect(state.items[1].completedAt).toBe(2000); // already completed - unchanged
    });

    it('deleting a list also removes all its tasks', () => {
        const state = tasksSlice.reducer(
            { items: [T1, T2, T3] },
            removeList.fulfilled('l1', '', 'l1')
        );
        expect(state.items).toEqual([T3]);
    });
});

describe('Task store: reading task data', () => {
    it('returns only tasks belonging to the active list', () => {
        expect(selectActiveListTasks(makeRootState([T1, T2, T3]))).toEqual([T1, T2]);
    });

    it('returns nothing when no list is active', () => {
        expect(selectActiveListTasks(makeRootState([T1], [{ ...L1, isActive: false }]))).toEqual(
            []
        );
    });

    it('shows all tasks when no filter is applied', () => {
        expect(selectFilteredTasks(makeRootState([T1, T2, T3]))).toEqual([T1, T2]);
    });

    it('shows only completed tasks when filtering by completed status', () => {
        expect(
            selectFilteredTasks(
                makeRootState([T1, T2, T3], [L1, L2], { status: 'completed', priority: 'all' })
            )
        ).toEqual([T2]);
    });

    it('shows only active tasks when filtering by active status', () => {
        expect(
            selectFilteredTasks(
                makeRootState([T1, T2, T3], [L1, L2], { status: 'active', priority: 'all' })
            )
        ).toEqual([T1]);
    });

    it('shows only matching tasks when filtering by priority', () => {
        expect(
            selectFilteredTasks(
                makeRootState([T1, T2, T3], [L1, L2], { status: 'all', priority: 'high' })
            )
        ).toEqual([T2]);
    });

    it('counts incomplete tasks in the active list', () => {
        expect(selectRemainingTasksCount(makeRootState([T1, T2, T3]))).toBe(1);
    });

    it('returns zero when no list is active', () => {
        expect(selectRemainingTasksCount(makeRootState([T3]))).toBe(0);
    });
});

describe('Saving tasks: error handling', () => {
    const mockTaskRepo = {
        add: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        removeByListId: vi.fn(),
        removeCompleted: vi.fn(),
        updateAll: vi.fn(),
        updateIncomplete: vi.fn(),
    };
    const mockListRepo = {
        add: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        updateAll: vi.fn(),
    };
    let store: any;

    beforeEach(() => {
        vi.clearAllMocks();
        store = configureStore({
            reducer: {
                tasks: tasksSlice.reducer,
                lists: listsSlice.reducer,
                notifications: notificationsSlice.reducer,
            },
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    thunk: {
                        extraArgument: {
                            taskRepo: mockTaskRepo,
                            listRepo: mockListRepo,
                        },
                    },
                }),
        });
    });

    it('shows an error notification when saving a new task fails', async () => {
        const errorMsg = 'DB Write Failed';
        mockTaskRepo.add.mockRejectedValue(new Error(errorMsg));

        await store.dispatch(
            addTask({
                id: '1',
                listId: 'L1',
                text: 'Test',
                completed: false,
                priority: 'none',
                createdAt: Date.now(),
                completedAt: null,
                estimateTime: null,
            })
        );

        const notifications = selectNotifications(store.getState());
        expect(notifications).toHaveLength(1);
        expect(notifications[0].message).toBe(errorMsg);
        expect(notifications[0].type).toBe('error');
    });
});
