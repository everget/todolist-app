import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { InMemoryListRepository } from '@/modules/todolist/lists/infrastructure/in-memory-list-repository';
import { InMemoryTaskRepository } from '@/modules/todolist/tasks/infrastructure/in-memory-task-repository';
import { InMemoryPreferencesRepository } from '@/modules/preferences/infrastructure/in-memory-preferences-repository';
import { appSlice, bootstrapApp } from '@/store/app-slice';
import { listsSlice, addList, removeList } from '@/modules/todolist/lists/store/lists-slice';
import {
    tasksSlice,
    addTask,
    selectFilteredTasks,
} from '@/modules/todolist/tasks/store/tasks-slice';
import {
    filtersSlice,
    setFilterStatus,
    setFilterPriority,
} from '@/modules/todolist/tasks/store/filters-slice';
import { themeSlice } from '@/modules/preferences/store/theme-slice';
import { localeSlice } from '@/modules/preferences/store/locale-slice';
import type { AppThunkExtra } from '@/store/thunk-extra';
import type { Task, TaskList } from '@/types';

function makeStore(extra?: Partial<AppThunkExtra>) {
    const listRepo = extra?.listRepo ?? new InMemoryListRepository();
    const taskRepo = extra?.taskRepo ?? new InMemoryTaskRepository();
    const preferencesRepo = extra?.preferencesRepo ?? new InMemoryPreferencesRepository();
    return configureStore({
        reducer: {
            app: appSlice.reducer,
            lists: listsSlice.reducer,
            tasks: tasksSlice.reducer,
            filters: filtersSlice.reducer,
            theme: themeSlice.reducer,
            locale: localeSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: { extraArgument: { listRepo, taskRepo, preferencesRepo } },
            }),
    });
}

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

describe('Cascade delete', () => {
    it('removing a list also removes all its tasks', async () => {
        const store = makeStore();
        const list: TaskList = { id: 'l1', name: 'Work', isActive: true };
        await store.dispatch(addList(list));
        await store.dispatch(addTask(makeTask({ id: 't1', text: 'Buy groceries' })));
        await store.dispatch(addTask(makeTask({ id: 't2', text: 'Call dentist' })));

        expect(store.getState().lists.items).toHaveLength(1);
        expect(store.getState().tasks.items).toHaveLength(2);

        await store.dispatch(removeList('l1'));

        expect(store.getState().lists.items).toHaveLength(0);
        expect(store.getState().tasks.items).toHaveLength(0);
    });

    it('removing a list does not affect tasks belonging to other lists', async () => {
        const store = makeStore();
        const l1: TaskList = { id: 'l1', name: 'Work', isActive: true };
        const l2: TaskList = { id: 'l2', name: 'Home', isActive: false };
        await store.dispatch(addList(l1));
        await store.dispatch(addList(l2));
        await store.dispatch(addTask(makeTask({ id: 't1', listId: 'l1', text: 'Work task' })));
        await store.dispatch(addTask(makeTask({ id: 't2', listId: 'l2', text: 'Home task' })));

        await store.dispatch(removeList('l1'));

        expect(store.getState().tasks.items).toHaveLength(1);
        expect(store.getState().tasks.items[0].id).toBe('t2');
    });

    it('removing an empty list leaves other lists and tasks intact', async () => {
        const store = makeStore();
        const l1: TaskList = { id: 'l1', name: 'Empty', isActive: true };
        const l2: TaskList = { id: 'l2', name: 'Keeper', isActive: false };
        await store.dispatch(addList(l1));
        await store.dispatch(addList(l2));
        await store.dispatch(addTask(makeTask({ id: 't1', listId: 'l2', text: 'Kept task' })));

        await store.dispatch(removeList('l1'));

        expect(store.getState().lists.items).toHaveLength(1);
        expect(store.getState().lists.items[0].id).toBe('l2');
        expect(store.getState().tasks.items).toHaveLength(1);
    });
});

describe('Task filtering', () => {
    const LIST: TaskList = { id: 'l1', name: 'My List', isActive: true };

    const ACTIVE_LOW = makeTask({
        id: 't1',
        text: 'Active low',
        priority: 'low',
        completed: false,
    });

    const DONE_HIGH = makeTask({
        id: 't2',
        text: 'Done high',
        priority: 'high',
        completed: true,
        completedAt: 9000,
    });

    const ACTIVE_HIGH = makeTask({
        id: 't3',
        text: 'Active high',
        priority: 'high',
        completed: false,
    });

    let store: ReturnType<typeof makeStore>;

    beforeEach(() => {
        store = makeStore();
        store.dispatch(listsSlice.actions.hydrate([LIST]));
        store.dispatch(tasksSlice.actions.hydrate([ACTIVE_LOW, DONE_HIGH, ACTIVE_HIGH]));
    });

    it('shows all tasks when no filter is active', () => {
        expect(selectFilteredTasks(store.getState())).toHaveLength(3);
    });

    it('hides completed tasks when filtering by active', () => {
        store.dispatch(setFilterStatus('active'));
        const result = selectFilteredTasks(store.getState());
        expect(result).toHaveLength(2);
        expect(result.every((t) => !t.completed)).toBe(true);
    });

    it('shows only completed tasks when filtering by completed', () => {
        store.dispatch(setFilterStatus('completed'));
        const result = selectFilteredTasks(store.getState());
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('t2');
    });

    it('shows only high-priority tasks when filtering by priority', () => {
        store.dispatch(setFilterPriority('high'));
        const result = selectFilteredTasks(store.getState());
        expect(result).toHaveLength(2);
        expect(result.every((t) => t.priority === 'high')).toBe(true);
    });

    it('combining active status and high priority narrows results to one task', () => {
        store.dispatch(setFilterStatus('active'));
        store.dispatch(setFilterPriority('high'));
        const result = selectFilteredTasks(store.getState());
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('t3');
    });

    it('combining completed status and low priority returns no results', () => {
        store.dispatch(setFilterStatus('completed'));
        store.dispatch(setFilterPriority('low'));
        expect(selectFilteredTasks(store.getState())).toHaveLength(0);
    });
});

describe('App startup: loading data into the store', () => {
    it('populates lists and tasks from the database on startup', async () => {
        const listRepo = new InMemoryListRepository();
        const taskRepo = new InMemoryTaskRepository();

        await listRepo.add({ id: 'l1', name: 'Shopping', isActive: true });
        await taskRepo.add(makeTask({ id: 't1', listId: 'l1', text: 'Buy milk' }));

        const store = makeStore({ listRepo, taskRepo });
        await store.dispatch(bootstrapApp());

        const { app, lists, tasks } = store.getState();
        expect(app.hydrationStatus).toBe('ready');
        expect(lists.items).toHaveLength(1);
        expect(lists.items[0].name).toBe('Shopping');
        expect(tasks.items).toHaveLength(1);
        expect(tasks.items[0].text).toBe('Buy milk');
    });

    it('loads multiple lists and tasks correctly', async () => {
        const listRepo = new InMemoryListRepository();
        const taskRepo = new InMemoryTaskRepository();

        await listRepo.add({ id: 'l1', name: 'Work', isActive: true });
        await listRepo.add({ id: 'l2', name: 'Home', isActive: false });
        await taskRepo.add(
            makeTask({ id: 't1', listId: 'l1', text: 'Sprint planning', priority: 'high' })
        );
        await taskRepo.add(
            makeTask({
                id: 't2',
                listId: 'l2',
                text: 'Buy groceries',
                completed: true,
                completedAt: 3000,
            })
        );

        const store = makeStore({ listRepo, taskRepo });
        await store.dispatch(bootstrapApp());

        expect(store.getState().lists.items).toHaveLength(2);
        expect(store.getState().tasks.items).toHaveLength(2);
        expect(store.getState().app.hydrationStatus).toBe('ready');
    });

    it('starts with an empty store when the database is empty', async () => {
        const store = makeStore();
        await store.dispatch(bootstrapApp());

        expect(store.getState().app.hydrationStatus).toBe('ready');
        expect(store.getState().lists.items).toHaveLength(0);
        expect(store.getState().tasks.items).toHaveLength(0);
    });

    it('marks startup as failed when the database throws', async () => {
        const listRepo = new InMemoryListRepository();
        // Simulate a repo failure
        listRepo.getAll = () => Promise.reject(new Error('storage failure'));

        const store = makeStore({ listRepo });
        await store.dispatch(bootstrapApp());

        expect(store.getState().app.hydrationStatus).toBe('error');
    });
});
